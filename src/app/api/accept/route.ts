// app/api/accept/route.ts
import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("appointmentId");

    const client = await clientPromise;
    const db = client.db("appointmentManagement");

    const result = await db
      .collection("appointments")
      .updateOne(
        { _id: new Object(appointmentId) },
        { $set: { status: "accepted", updatedAt: new Date() } }
      );

    if (result.modifiedCount === 0) return NextResponse.redirect("/error");

    return NextResponse.redirect("/confirmation/accepted");
  } catch (error) {
    console.error("Accept error:", error);
    return NextResponse.redirect("/error");
  }
}
