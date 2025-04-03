import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { email, fullName, userName, password } = await request.json();

    const client = await clientPromise;
    const db = client?.db("appointmentManagement");

    const existingUser = await db?.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db?.collection("users")?.insertOne({
      email,
      fullName,
      userName,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during sign-up:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
