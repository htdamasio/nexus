import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { AuthOptions } from "next-auth"

export const authOptions: AuthOptions = {
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
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if(trigger === 'update') {
        if(session.image) token.picture = session.image
        if(session.gender) token.gender = session.gender
        if(session.birthday) token.birthday = session.birthday
      }
      
      if (user) {
        token.role = user.role;
        token.birthday = user.birthday;
        token.gender = user.gender
      }
      return token;
    },
    session({session, token}) {
      if (session.user) {
        session.user.role = token.role;
        session.user.birthday = token.birthday;
        session.user.gender = token.gender;
      }

      return session;
    }
  }
}

export default NextAuth(authOptions);