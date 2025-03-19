import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { requesterEmail, hostEmail, date, time, message } =
      await request.json();

    const client = await clientPromise;
    const db = client.db("appointmentManagement");

    const appointment = {
      requesterEmail,
      hostEmail,
      date,
      time,
      message,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("appointments").insertOne(appointment);

    return NextResponse.json(
      {
        id: result.insertedId,
        ...appointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Appointment creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
