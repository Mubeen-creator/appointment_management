import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, startTime, endTime, availableDays } = await request.json();

    // Detailed validation
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!startTime) missingFields.push("startTime");
    if (!endTime) missingFields.push("endTime");
    if (!availableDays?.length) missingFields.push("availableDays");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: "Missing required fields",
          missingFields, // Include which fields are missing
        },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db("appointmentManagement");

    const result = await db.collection("users").updateOne(
      { email },
      {
        $set: {
          availability: {
            startTime,
            endTime,
            availableDays,
            updatedAt: new Date(),
          },
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "User not found. Complete signup first" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Availability saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Availability save error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
