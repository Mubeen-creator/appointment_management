import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not defined in the environment variables.");
}

const client = new MongoClient(uri);

export async function DELETE(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db("appointmentManagement");
    const usersCollection = db?.collection("users");

    const result = await usersCollection?.deleteOne({ email });

    if (result.deletedCount === 1) {
      return NextResponse.json(
        { message: "Account deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
