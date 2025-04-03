import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const {
      email,
      fullName,
      welcomeMessage,
      language,
      dateFormat,
      timeFormat,
      country,
      timeZone,
      profilePicture,
    } = await request.json();

    const client = await clientPromise;
    const db = client.db("appointmentManagement");

    const existingUser = await db?.collection("users").findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          fullName,
          welcomeMessage,
          language,
          dateFormat,
          timeFormat,
          country,
          timeZone,
          profilePicture,
        },
      }
    );

    return NextResponse.json(
      { message: "User profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during update profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
