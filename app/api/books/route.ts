import prisma from "@/lib/prisma";
import { Book } from "@prisma/client";
import { RequestHandler } from "express";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getToken } from "next-auth/jwt"
import { CreateBook, CreateBookSchema,  } from "@/validations/backend/books";

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.S3_ACCESS_KEY ?? ''
const secretAccessKey = process.env.SECRET_S3_ACCESS_KEY ?? ''

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion
})

const secret = process.env.NEXTAUTH_SECRET

export async function GET(req: NextRequest, {params}: {params?:{ bookId: string }}) {
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
              adminNotes: true,
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

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret })
  const email = token?.email
  if(token && email) {
    // add book
    const bookData: CreateBook = await req.json();
    const isValid = CreateBookSchema.safeParse(bookData);

    if (!isValid.success) {
      // TODO: delete from s3 (maybe use a job like bull ????) 
      return new Response(JSON.stringify({ message: 'incorrect information', success: false, errors: isValid.error }), { status: 422})  
    }
    // validate using zod 

    await prisma.book.create({
      data: {
        cover: bookData.cover,
        synopsis: bookData.synopsis,
        title: bookData.title,
        author: {
          connect: {
            email: email
          }
        }, 
        genres: {
          connect: bookData.genres,
        },
        tags: {
          connect: bookData.tags
        },
        chapters: {
          create: bookData.chapters 
        },
      } 
    })
    return new Response(JSON.stringify({ message: 'book created', success: true }), { status: 201}) 
  } else {
    return new Response(JSON.stringify({ message: 'unauthenticated', success: false }), { status: 401}) 
  }
}