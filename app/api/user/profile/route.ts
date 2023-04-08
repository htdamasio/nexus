import prisma from "@/lib/prisma";
import { GenerateAvatarNewPutSignedUrl } from "@/utils/backend/presignedURL";
import { EditProfile, EditProfileSchema } from "@/validations/profile";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"

const secret = process.env.NEXTAUTH_SECRET
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret })
  if(token && token.email) {
    
    const user = await prisma.user.findUnique({
      where: {
        email: token.email
      },
      select: {
        s3Image: true
      }
    })

    if(!user) return new NextResponse(JSON.stringify({message: 'internal server error', success: false}), { status: 500})

    let responseUrl = ''
    let responseFilename = ''
    if(user.s3Image && user.s3Image?.length > 0) {
      const { url, filename } = await GenerateAvatarNewPutSignedUrl(user.s3Image)
      responseUrl = url;
      responseFilename = filename
    } else {
      const { url, filename } = await GenerateAvatarNewPutSignedUrl()
      responseUrl = url;
      responseFilename = filename

      await prisma.user.update({
        where: {
          email: token.email
        },
        data: {
          s3Image: filename,
          image: process.env.AVATAR_BUCKET_URL + filename,
          updatedAt: new Date().toISOString()
        }
      })
    }

    return new NextResponse(JSON.stringify({ url: responseUrl, filename: responseFilename, success: true}), { status: 200})
  } else {
    return new NextResponse(JSON.stringify({message: 'unauthorized', success: false}), { status: 401})
  }
}

export async function PATCH(req: NextRequest) {
  const token = await getToken({ req, secret })
  if(token && token.email) {
    const updateData: EditProfile = await req.json();

    const isValid = EditProfileSchema.safeParse(updateData);
    
    try{
      if(!isValid.success) return new NextResponse(JSON.stringify({ message: 'incorrect information', success: false, errors: isValid.error }), { status: 422})

      const updateFields: EditProfile = {}
      if(updateData.gender) {
        updateFields.gender = updateData.gender
      }
      if(updateData.birthday) {
        updateFields.birthday = updateData.birthday
      }
      if(updateData.password) {
        updateFields.password = await bcrypt.hash(updateData.password, 10)
      }

      await prisma.user.update({
        where: {
          email: token.email,
        },
        data: {
          ...updateFields,
          updatedAt: new Date().toISOString()
        }
      })
      return new NextResponse(JSON.stringify({ message: 'profile updated', success: true}), { status: 200})
    } catch(err) {
      return new NextResponse(JSON.stringify({message: 'internal server error', success: false}), { status: 500})
    }
  } else {
    return new NextResponse(JSON.stringify({message: 'unauthorized', success: false}), { status: 401})
  }
}