// app/api/appointments/route.ts
import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

// POST: Create a new appointment
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

// GET: Fetch appointments for a specific user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email"); // Get the user's email from query params
    const hostEmail = searchParams.get("hostEmail"); // Get the host's email from query params

    if (!email && !hostEmail) {
      return NextResponse.json(
        { message: "Email or hostEmail is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("appointmentManagement");

    let query = {};
    if (email) {
      query = { requesterEmail: email }; // Fetch appointments where the user is the requester
    } else if (hostEmail) {
      query = { hostEmail: hostEmail }; // Fetch appointments where the user is the host
    }

    const appointments = await db
      .collection("appointments")
      .find(query)
      .toArray();

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("[API] Error fetching appointments:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
