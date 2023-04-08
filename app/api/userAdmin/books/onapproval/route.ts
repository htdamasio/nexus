import prisma from '@/lib/prisma'
import { GenerateNewGetSignedUrl } from '@/utils/backend/presignedURL'
import { BookStatus, Role } from '@prisma/client'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

const secret = process.env.NEXTAUTH_SECRET

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret })
  if (token && token.email) {
    // validate if user is ADMIN
    if (token.role !== Role.ADMIN) {
      return new Response(JSON.stringify({ message: 'You do not have permission', success: false }), { status: 403})   
    }

    const books = await prisma.book.findMany({
      orderBy: {
        status: 'asc'
      },
      where: {
        status: {
          in: [ BookStatus.ONAPPROVAL, BookStatus.REJECTED, BookStatus.NEEDADJUST ]
        }
      },
      include: {
        author: {
          select: {
            name: true
          }
        },
        chapters: {
          orderBy: {
            order: 'asc'
          },
          select: {
            id: true
          }
        },
        genres: {
          select: {
            name: true
          }
        },
        tags: {
          select: {
            name: true
          }
        }
      }
    })

    if(books) {
      for (const book of books) {
        book.cover = (await GenerateNewGetSignedUrl(book.cover)).url
      }
    }

    return new Response(JSON.stringify({ books, success: true }), { status: 200}) 

  } else {
    // Not Signed in
    return new Response(JSON.stringify({ message: 'unauthenticated', success: false }), { status: 401}) 
  }
}