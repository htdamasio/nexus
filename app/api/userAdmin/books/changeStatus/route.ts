import prisma from "@/lib/prisma";
import { BookStatus, Role } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET

export async function PATCH(req: NextRequest) {
  const token = await getToken({ req, secret }) 

  if(token) {
    const updateData = await req.json()
    
    if (token.role !== Role.ADMIN) {
      return new Response(JSON.stringify({ message: 'You do not have permission', success: false }), { status: 403})   
    }
    console.log(updateData)
    try {
      const markAsPublished = updateData.newStatus === BookStatus.ONGOING
      const publisedDate = updateData.newStatus === BookStatus.ONGOING ? new Date().toISOString() : null
      await prisma.book.update({
        where: {
          id: updateData.id
        },
        data: {
          status: updateData.newStatus,
          adminNotes: updateData.notes,
          published: markAsPublished,
          publisedAt: publisedDate
        }
      })

      return new Response(JSON.stringify({ message: 'book modified', success: true }), { status: 200})
    } catch (err) {
      return new Response(JSON.stringify({ message: 'could not modify', success: false }), { status: 304})   
    }

  } else {
    // Not Signed in
    return new Response(JSON.stringify({ message: 'unauthenticated', success: false }), { status: 401}) 
  } 
}