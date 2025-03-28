import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";

// Simulated Google Meet link generator (replace with actual Google API integration)
const generateGoogleMeetLink = () => {
  return `https://meet.google.com/abc-${Math.random()
    .toString(36)
    .substring(2, 10)}`;
};

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

    const client = await clientPromise;
    const db = client?.db("appointmentManagement");

    let objectId;
    try {
      objectId = new ObjectId(appointmentId);
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
    if (!existingDoc) {
      console.log("[API] No document found for ID:", appointmentId);
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    // Generate Google Meet link if status is "accepted"
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };
    let meetLink = existingDoc?.meetLink;
    if (status === "accepted" && !meetLink) {
      meetLink = generateGoogleMeetLink();
      updateData.meetLink = meetLink;
    }

    const result = await db
      .collection("appointments")
      .findOneAndUpdate(
        { _id: objectId },
        { $set: updateData },
        { returnDocument: "after" }
      );

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
          user: process.env?.EMAIL_USER,
          pass: process.env?.EMAIL_PASS,
        },
      });

      const subject = `Appointment ${status}`;
      const emailContent = `
        Hi,

        Your appointment request has been ${status}.

        Date: ${updatedDoc?.date}
        Time: ${updatedDoc?.time}
        Host: ${updatedDoc?.hostEmail}
        Message: ${updatedDoc?.message || "No message provided"}
        ${
          status === "accepted" && meetLink
            ? `Google Meet Link: ${meetLink}`
            : ""
        }
      `;

      const mailOptions = {
        from: process.env?.EMAIL_USER,
        to: requesterEmail,
        subject,
        text: emailContent,
      };

      // Send email to host as well if accepted
      if (status === "accepted" && meetLink) {
        const hostMailOptions = {
          ...mailOptions,
          to: updatedDoc?.hostEmail,
          text: `
            Hi,

            You have accepted an appointment.

            Date: ${updatedDoc?.date}
            Time: ${updatedDoc?.time}
            Requester: ${updatedDoc?.requesterEmail}
            Message: ${updatedDoc?.message || "No message provided"}
            Google Meet Link: ${meetLink}
          `,
        };
        await transporter?.sendMail(hostMailOptions);
      }

      console.log("[API] Sending email notification to:", requesterEmail);
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("[API] Email sent successfully:", info?.response);
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
