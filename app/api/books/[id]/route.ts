import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand, DeleteObjectCommand, DeleteObjectCommandInput } from "@aws-sdk/client-s3";
import { Genre, Tag } from "@prisma/client";
import { getToken } from "next-auth/jwt"
import { GetBookResponse, UpdateBook, UpdateBookSchema } from "@/validations/backend/books";
import { PerformDeletionOnS3Bucket } from "@/utils/backend/presignedURL";

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
  const token = await getToken({ req, secret })
  const email = token?.email
  const bookId = params.id;
    
  try {
    const book = await prisma.book.findUnique({
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
          orderBy: {
            order: 'desc'
          }
        },
        genres: true,
        tags: true,
      }
    }) 
    if (!book) {
      return new Response(JSON.stringify({ message: "book not found", success: false }), {
        status: 404,
      })
    }
    if (book?.author.email !== email) {
      return new Response(JSON.stringify({ message: "access denied", success: false }), {
        status: 405,
      })
    }
    
    const responseData: GetBookResponse = {
      chapters: [],
      cover: '',
      originalCoverName: '',
      genres: [],
      id: '',
      tags: [],
      synopsis: '',
      title: ''
    }
    responseData.title = book.title
    responseData.id = book.id
    responseData.synopsis = book.synopsis
    responseData.originalCoverName = book.cover;

    responseData.genres = book.genres.reduce((acc: number[], genre: Genre) => {
      acc.push(genre.id);
      return acc;
    }, [])

    responseData.tags = book.tags.reduce((acc: number[], tag: Tag) => {
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
      responseData.cover = url;
    }

    if (book?.chapters) {
      for (const chapter of book.chapters) {
        const getObjectParams = {
          Bucket: bucketName,
          Key: chapter.content
        }
        const command = new GetObjectCommand(getObjectParams);
        const data = await s3.send(command)

        responseData.chapters.push({
          id: chapter.id,
          notes: chapter.notes,
          order: chapter.order,
          title: chapter.title,
          content: await data?.Body?.transformToString() ?? '', 
          originalContentName: chapter.content
        })
      }
    }  
    return new Response(JSON.stringify({ book: responseData, success: true }), {
      status: 200,
    })
  } catch (err) {
    return new Response(JSON.stringify({ message: "unexpected error", success: false }), {
      status: 500,
    })
  }

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
    return new Response(JSON.stringify({ message: "unexpected error", success: false }), {
      status: 500,
    })
  }
}

export async function PUT(req: NextRequest,  { params }: { params: { id: string }}) {
  const token = await getToken({ req, secret })
  if (token) {

    const bookData: UpdateBook = await req.json();

    // validate 
    const isValid = UpdateBookSchema.safeParse(bookData);
    if (!isValid.success) {
      throw new Error(JSON.stringify({message: 'Invalid Data', errors: isValid.error}))
    }

    // delete chapter content from s3
    if (bookData.chapters.delete.length > 0) {
      const chaptersToDelete = await prisma.book.findUnique({
        where: {
          id: params.id
        },
        select: {
          chapters: {
            select: {
              id: true,
              content: true
            }
          }
        }
      })
  
      if (chaptersToDelete) {
        for (const chapter of chaptersToDelete.chapters) {
          if (bookData.chapters.delete.find(chapterToDelete => chapterToDelete.id === chapter.id)) {
            await PerformDeletionOnS3Bucket(chapter.content)
          }
        }
      }
    }

    await prisma.book.update({
      where: {
        id: params.id
      },
      data: {
        cover: bookData.cover,
        synopsis: bookData.synopsis,
        title: bookData.title,
        genres: {
          disconnect: bookData.genres.disconnect, //bookToUpdate.genres.map(g => {return {id: g.id}}),
          connect: bookData.genres.connect
        },
        tags: {
          disconnect: bookData.tags.disconnect, // bookToUpdate.tags.map(t => {return {id: t.id}}),
          connect: bookData.tags.connect
        },
        chapters: {
          delete: bookData.chapters.delete,
          create: bookData.chapters.create,
          update: bookData.chapters.update
        }
      }
    })

    return new Response(JSON.stringify({ message: 'book updated', success: true }), { status: 200})
  } else {
    return new Response(JSON.stringify({ message: 'unauthenticated', success: false }), { status: 401}) 
  }
}