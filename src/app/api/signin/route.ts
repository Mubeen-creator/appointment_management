import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const client = await clientPromise;
    const db = client.db("appointmentManagement");

    // Check if user exists
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if password matches
    if (user.password !== password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Return user data (excluding password)
    const { password: _, ...userData } = user;
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error during sign-in:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
