import { GenerateNewPutSignedUrl } from "@/utils/backend/presignedURL";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret })
  if (token) {
    try {
      const { url, filename } = await GenerateNewPutSignedUrl();
      return new Response(JSON.stringify({ url,filename , success: true }), { status: 200})
    } catch (err) {
      return new Response(JSON.stringify({ message: 'Unexpected error', success: false }), { status: 500})
    }
  } else {
    // Not Signed in
    return new Response(JSON.stringify({ message: 'unauthenticated', success: false }), { status: 401}) 
  }
}