// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      fullName?: string;
      userName?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    fullName?: string;
    userName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    fullName?: string;
    userName?: string;
  }
}
