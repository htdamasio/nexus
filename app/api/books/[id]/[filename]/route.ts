import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt"
import { PerformDeletionOnS3Bucket, GenerateNewPutSignedUrl } from "@/utils/backend/presignedURL";
import prisma from "@/lib/prisma";


const secret = process.env.NEXTAUTH_SECRET
export async function GET(req: NextRequest,  { params }: { params: { id: string, filename: string }}) {
  const token = await getToken({ req, secret })
  
  if (token && params.filename) {    
    
    if(!params.filename) {
      return new Response(JSON.stringify({ message: 'incorrect information', success: false }), { status: 422})  
    }

    /**
     * Get Book
     */
    const book = await prisma.book.findUnique({
      where: {
        id: params.id
      },
      select: {
        author: {
          select: {
            email: true
          }
        }
      },
    })

    /**
     * Validations
     */
    if (!book) {
      return new Response(JSON.stringify({ message: "book not found", success: false }), { status: 404 })
    }

    if (book.author.email !== token.email) {
      return new Response(JSON.stringify({ message: 'unauthorized', success: false }), { status: 401})    
    }

    // put signed url
    const {url, filename} = await GenerateNewPutSignedUrl(params.filename);

    return new Response(JSON.stringify({ url, filename, success: true }), { status: 200})
  } else {
    // Not Signed in
    return new Response(JSON.stringify({ message: 'unauthenticated', success: false }), { status: 401}) 
  }
}