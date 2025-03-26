// src/app/api/update-appointment-status/route.ts
import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  console.log(
    "[API] POST /api/update-appointment-status triggered at",
    new Date().toISOString()
  );

  try {
    const payload = await request.json();
    console.log("[API] Received payload:", payload);

    const { appointmentId, status, requesterEmail } = payload;

    if (!appointmentId || !status) {
      console.log("[API] Missing required fields:", { appointmentId, status });
      return NextResponse.json(
        { message: "Missing required fields: appointmentId and status" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      console.log("[API] Invalid status value:", status);
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    console.log("[API] Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("appointmentManagement");

    console.log("[API] Database connected. Using database:", db.databaseName);
    console.log(
      "[API] Available collections:",
      await db.collections().then((cols) => cols.map((c) => c.collectionName))
    );

    let objectId;
    try {
      objectId = new ObjectId(appointmentId);
      console.log("[API] Converted appointmentId to ObjectId:", objectId);
    } catch (error) {
      console.log("[API] Invalid ObjectId format:", appointmentId);
      return NextResponse.json(
        { message: "Invalid appointment ID format" },
        { status: 400 }
      );
    }

    const existingDoc = await db
      .collection("appointments")
      .findOne({ _id: objectId });
    console.log("[API] Existing document check:", existingDoc);

    if (!existingDoc) {
      console.log("[API] No document found for ID:", appointmentId);
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    console.log("[API] Updating appointment with ID:", appointmentId);
    const result = await db.collection("appointments").findOneAndUpdate(
      { _id: objectId },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    console.log("[API] Update result:", result);

    // Check if the update operation failed
    if (!result || !result.value) {
      console.log("[API] Update operation failed for ID:", appointmentId);
      return NextResponse.json(
        { message: "Failed to update appointment" },
        { status: 500 }
      );
    }

    const updatedDoc = result.value;
    console.log("[API] Appointment updated successfully:", updatedDoc);

    // Send email notification if status changed
    if (status !== "pending" && requesterEmail) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const subject = `Appointment ${status}`;
      const emailContent = `
        Hi,

        Your appointment request has been ${status}.

        Date: ${updatedDoc.date}
        Time: ${updatedDoc.time}
        Host: ${updatedDoc.hostEmail}
        Message: ${updatedDoc.message || "No message provided"}
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: requesterEmail,
        subject,
        text: emailContent,
      };

      console.log("[API] Sending email notification to:", requesterEmail);
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("[API] Email sent successfully:", info.response);
      } catch (emailError) {
        console.error("[API] Email sending failed:", emailError);
      }
    }

    return NextResponse.json(updatedDoc, { status: 200 });
  } catch (error) {
    console.error("[API] Appointment status update failed:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
