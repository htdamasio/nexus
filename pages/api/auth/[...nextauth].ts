import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      async authorize(credentials) {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({where: { email }});

        if(!user) {
          throw new Error('Invalid Email or Password');
        }

        const isValidPassword = bcrypt.compare(user.password, password);
        
        if(!isValidPassword) {
          throw new Error('Invalid Email or Password'); 
        }
        return user;
      },
    }),
  ],
  callbacks: {
    session({session, token}) {
      return session;
    }
  }
})