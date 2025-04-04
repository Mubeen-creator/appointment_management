import { getServerSession } from "next-auth/next";
import { authOptions } from "./authOptions";
import { AuthOptions } from "next-auth";

export async function getSession() {
  return await getServerSession(authOptions as AuthOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}
