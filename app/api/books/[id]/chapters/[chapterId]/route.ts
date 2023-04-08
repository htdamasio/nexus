import prisma from '@/lib/prisma'
import { GenerateNewGetSignedUrl } from '@/utils/backend/presignedURL'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest,  { params }: { params: { id: string, chapterId: string }}) {
  if(params.id && params.chapterId) {
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: params.chapterId
      },
    })

    let url = ''
    if(chapter) {
      chapter.url = (await GenerateNewGetSignedUrl(chapter.content)).url
    }

    return new Response(JSON.stringify({ chapter, success: true }), { status: 200})
  
  }  else {
    return new Response(JSON.stringify({ message: 'internal server error', success: false }), { status: 500}) 
  } 
}