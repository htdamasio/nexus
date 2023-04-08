import { Gender, Role } from "@prisma/client";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    role?: Role;
    birthday?: string;
    gender?: Gender
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the
   * `SessionProvider` React Context and trpc context
   */
  interface Session {
    user?: {
      role?: Role;
      birthday?: string;
      gender?: Gender
    } & DefaultSession["user"];
  }

  /** Passed as a parameter to the `jwt` callback */
  interface User {
    role?: Role;
    birthday?: string;
    gender?: Gender
  }
}