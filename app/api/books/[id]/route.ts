import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand, DeleteObjectCommand, DeleteObjectCommandInput } from "@aws-sdk/client-s3";
import { Genre, Tag } from "@prisma/client";
import { getToken } from "next-auth/jwt"

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY ?? ''
const secretAccessKey = process.env.SECRET_ACCESS_KEY ?? ''
const secret = process.env.NEXTAUTH_SECRET

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion
})

export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
  const bookId = params.id;
    
  const data: string[] = []

  const book = await prisma.book.findUnique({
    where: {
      id: bookId
    },
    include: {
      chapters: true,
      genres: true,
      tags: true,
    }
  }) 
  
  book.genres = book.genres.reduce((acc: number[], genre: Genre) => {
    acc.push(genre.id);
    return acc;
  }, [])

  book.tags = book.tags.reduce((acc: number[], tag: Tag) => {
    acc.push(tag.id);
    return acc;
  }, [])
  
  if (book?.cover.length) {
    const getObjectParams = {
      Bucket: bucketName,
      Key: book.cover
    }
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    book.cover = url;
  }
  
  if (book?.chapters) {
    for (const chapter of book.chapters) {
      const getObjectParams = {
        Bucket: bucketName,
        Key: chapter.content
      }
      const command = new GetObjectCommand(getObjectParams);
      const data = await s3.send(command)
      chapter.content = await data.Body.transformToString()
      
      //await data.Body.transformToString();
      
      // getObject(command)
    }
  }
  

  // console.log(book)
  
  return new Response(JSON.stringify({ book, success: true }), {
    // // return new Response(JSON.stringify({success: true }), {
      status: 201,
    })
  // return new Response('Hello, Next.js!', {status: 200})
}

export async function DELETE(req: NextRequest,  { params }: { params: { id: string }}) {
  const token = await getToken({ req, secret })
  const email = token?.email
    
  const bookId = params.id;
  try {
    // Validate if this book is from this user
    const bookToDelete = await prisma.book.findUnique({
      where: {
        id: bookId
      },
      include: {
        author: {
          select: {
            email: true
          }
        },
        chapters: {
          select: {
            content: true
          }
        }
      }
    })
    if (!bookToDelete) {
      return new Response(JSON.stringify({ message: "book not found", success: false }), {
        status: 404,
      })
    }
    if (bookToDelete?.author.email !== email) {
      return new Response(JSON.stringify({ message: "you cannot delete this book", success: false }), {
        status: 405,
      })
    }

    if(bookToDelete.cover && bookToDelete.cover.length > 0) {
      const params: DeleteObjectCommandInput = {
        Bucket: bucketName,
        Key: bookToDelete.cover
      }
      const command = new DeleteObjectCommand(params)
      await s3.send(command)
    }

    for (const chapter of bookToDelete.chapters) {
      if (chapter.content && chapter.content.length > 0) {
        const params: DeleteObjectCommandInput = {
          Bucket: bucketName,
          Key: chapter.content
        }
        const command = new DeleteObjectCommand(params)
        await s3.send(command)
      }
    }

    await prisma.book.delete({
      where: {
        id: bookId
      } 
    })
    return new Response(JSON.stringify({ message: "book deleted", success: true }), {
      status: 200,
    })
  } catch (err) {
    console.log(err)
    return new Response(JSON.stringify({ message: "unexpected error", success: false }), {
        status: 500,
      })
  }
}