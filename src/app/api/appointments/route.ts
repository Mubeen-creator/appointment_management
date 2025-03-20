import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log(
    "\n\n[API] /api/appointments triggered at",
    new Date().toISOString()
  );

  try {
    const payload = await request.json();
    console.log("[API] Appointment payload:", payload);

    // Validate required fields
    const requiredFields = ["requesterEmail", "hostEmail", "date", "time"];
    const missingFields = requiredFields.filter((field) => !payload[field]);

    if (missingFields.length > 0) {
      console.error("[API] Missing fields:", missingFields);
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("appointmentManagement");

    const appointment = {
      ...payload,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("[API] Inserting appointment:", appointment);

    const result = await db.collection("appointments").insertOne(appointment);
    console.log("[API] Insert result:", result);

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        ...appointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] Appointment creation failed:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
