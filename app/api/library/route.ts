import prisma from "@/lib/prisma";
import { GetLibraryResponse, LibraryBook } from "@/validations/backend/library";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret })
  if(token && token.email) {
    
    const libraryData = await prisma.selectedBooks.findMany({
      where: {
        user: {
          email: token.email
        }
      },
      select: {
        user: false,
        book: {
          select: {
            id: true,
            cover: true,
            title: true,
            synopsis: true,
            author: {
              select: {
                name: true
              }
            },
            reviews: {
              select: {
                overralRate: true
              }
            },
            _count: {
              select: {
                reviews: true,
                chapters: true
              }
            }
          }
        },
        status: true,
        currentChapter: {
          select: {
            order: true
          }
        }
      }
    })

    if(!libraryData) return new NextResponse(JSON.stringify({ message: 'internal server error', success: false }), { status: 500})

    // separate items by status
    const response: GetLibraryResponse = {
      toRead: [],
      reading: [],
      read: [],
      dropped: [],
      reviews: [],
    }

    try {
      const userData = await prisma.user.findUnique({
        where: {
          email: token.email
        },
        select: {
          reviews: true
        }
      })

      if(userData) {
        response.reviews = userData.reviews
      }

      const data = libraryData.reduce((acc, el) => {
        const elementStatus = el.status.toLowerCase()
        const bookScore = el.book.reviews.reduce((score, review) => {
          score = score + review.overralRate
          return score
        }, 0)
        
        const libraryBook: LibraryBook = {
          author: el.book.author.name ?? '',
          cover: el.book.cover,
          id: el.book.id,
          synopsis: el.book.synopsis,
          title: el.book.title,
          status: el.status,
          totalChapters: el.book._count.chapters,
          totalReviews: el.book._count.reviews,
          score: el.book._count.reviews > 0 ? bookScore/el.book._count.reviews : 0
        } 

        acc[elementStatus as keyof typeof acc].push(libraryBook)
        return acc;
      }, {
        read: [] as LibraryBook[],
        reading: [] as LibraryBook[],
        toread: [] as LibraryBook[],
        dropped: [] as LibraryBook[],
        rereading: [] as LibraryBook[]
      })

      response.read = data.read
      response.reading = data.reading.concat(data.rereading)
      response.toRead = data.toread
      response.dropped = data.dropped
      
      return new NextResponse(JSON.stringify({ response, success: true }), { status: 200}) 
    } catch (err) {
      return new NextResponse(JSON.stringify({ message: 'internal server error', success: false }), { status: 500})
    }
  } else {
    return new NextResponse(JSON.stringify({ message: 'unauthenticated', success: false }), { status: 401}) 
  }
}

export async function PATCH(req: NextRequest) {
  const token = await getToken({ req, secret })
  if(token && token.sub) {
    const data = await req.json()

    try {
      await prisma.selectedBooks.update({
        where: {
          userid_bookid: {
            bookid: data.bookId,
            userid: token.sub
          }
        },
        data: {
          status: data.status,
        }
      })
  
      return new NextResponse(JSON.stringify({ message: 'record updated', success: true }), { status: 200})
    } catch (err) {
      return new NextResponse(JSON.stringify({ message: 'internal server error', success: true }), { status: 500})
    }
  } else {
    return new NextResponse(JSON.stringify({ message: 'unauthenticated', success: false }), { status: 401}) 
  }
}

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret })
  if(token && token.sub) {
    const data = await req.json()

    try {
      await prisma.selectedBooks.delete({
        where: {
          userid_bookid: {
            bookid: data.bookId,
            userid: token.sub
          }
        }
      })
  
      return new NextResponse(JSON.stringify({ message: 'record deleted', success: true }), { status: 200})
    } catch (err) {
      return new NextResponse(JSON.stringify({ message: 'internal server error', success: true }), { status: 500})
    }
  } else {
    return new NextResponse(JSON.stringify({ message: 'unauthenticated', success: false }), { status: 401}) 
  }
}