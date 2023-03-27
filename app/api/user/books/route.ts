import prisma from "@/lib/prisma";
import { Book } from "@prisma/client";
import { RequestHandler } from "express";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getToken } from "next-auth/jwt"

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY ?? ''
const secretAccessKey = process.env.SECRET_ACCESS_KEY ?? ''

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion
})

const secret = process.env.NEXTAUTH_SECRET

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret })
  const email = token?.email
  try {
    let books: Book[] = Array();
    if (email && email?.length > 0) {
      const userBooks  = await prisma.user.findUnique({
        select: {
          books: {
            select: {
              id: true,
              authorid: true,
              cover: true,
              status: true,
              synopsis: true,
              title: true,
              chapters: {
                select: {
                  _count: {
                    select: {
                      comments: true
                    }
                  }
                }
              },
              _count: {
                select: {
                  reviews: true,
                  chapters: true
                }
              }
            }
          }
        },
        where: {
          email: email
        }
        
      })

      // console.log(JSON.stringify({userBooks}))

      if (userBooks && userBooks.books) {
        for (const book of userBooks.books) {
          const newBook: Book = book
          if (newBook.cover.length > 0) {
            const getObjectParams = {
              Bucket: bucketName,
              Key: book.cover
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            newBook.cover = url;
          }
  
          books.push(newBook)
        }
      }
      // books = userBooks?.books ?? []
    }
    return new Response(JSON.stringify({ books, success: true }), {
    // // return new Response(JSON.stringify({success: true }), {
      status: 201,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'unexpected error', success: false }), {
      status: 500,
    })
  }
}