import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

  try {
    const payload = await request.json();
    const requiredFields = ["requesterEmail", "hostEmail", "date", "time"];
    const missingFields = requiredFields?.filter((field) => !payload[field]);

    if (missingFields.length > 0) {
      console.error("[API] Missing fields:", missingFields);
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields?.join(", ")}` },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client?.db("appointmentManagement");

    const appointment = {
      ...payload,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("appointments").insertOne(appointment);

    return NextResponse.json(
      {
        id: result?.insertedId?.toString(),
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams?.get("email");
    const hostEmail = searchParams?.get("hostEmail");

    if (!email && !hostEmail) {
      return NextResponse.json(
        { message: "Email or hostEmail is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client?.db("appointmentManagement");

    let query = {};
    if (email) {
      query = { requesterEmail: email };
    } else if (hostEmail) {
      query = { hostEmail: hostEmail };
    }

    const appointments = await db
      ?.collection("appointments")
      ?.find(query)
      ?.toArray();

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("[API] Error fetching appointments:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
