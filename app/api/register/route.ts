import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs"
import { registerSchema } from "@/forms/registerForm";

export async function POST(req: NextRequest) {
  const userData = await req.json();
  try {
      // verify data with zod schema     
      const isValidData = registerSchema.safeParse(userData);
      if (!isValidData.success) {
        throw new Error(JSON.stringify({message: 'Invalid Data', errors: isValidData.error}))
      }

      const existentUsers = await prisma.user.findMany({
        where: {
          OR: [
            {
              email: userData.email
            },
            {
              name: userData.username
            }
          ]
        }
      });

      if (existentUsers.some(u => u.name === userData.username)) {
        return new Response(JSON.stringify({ error: 'username already in use', success: false }), {
          status: 409,
        })
      }

      if (existentUsers.some(u => u.email === userData.email)) {
        return new Response(JSON.stringify({ error: 'email address already in use', success: false }), {
          status: 409,
        })
      }

      const newUser = await prisma.user.create({
      data: {
        name: userData.username,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
        birthday: userData.birthday,
        gender: userData.gender
      }
    });

    return new Response(JSON.stringify({newUser, success: true }), {
      status: 201,
    })
  } catch (err) {
    // console.log(err)
    return new Response(JSON.stringify({ error: 'unexpected error', success: false }), {
      status: 500,
    })
  }

}