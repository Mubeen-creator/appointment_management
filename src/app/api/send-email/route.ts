import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const { to, subject, text, appointmentData } = body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env?.EMAIL_USER,
        pass: process.env?.EMAIL_PASS,
      },
    });

    const emailContent = `
  Hi ${appointmentData.hostName},

  You have a new appointment request from ${appointmentData.requesterEmail}.

  Date: ${appointmentData?.date}
  Time: ${appointmentData?.time}
  Time Zone: ${appointmentData?.timeZone}

  Message: ${appointmentData?.message}
`;

    const mailOptions = {
      from: process.env?.EMAIL_USER,
      to,
      subject,
      text: emailContent,
    };

    const info = await transporter.sendMail(mailOptions);

    return new NextResponse(
      JSON.stringify({ message: "Email sent successfully!" }),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("[Backend] Error sending email:", error);
    return new NextResponse(
      JSON.stringify({ message: "Failed to send email", error }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
