import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { to, subject, text, appointmentData } = await request.json();
    console.log("Email Payload:", { to, subject, text, appointmentData });

    // Configure Brevo SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_SMTP_KEY,
      },
    });

    console.log("Brevo Email Config:", {
      user: process.env.BREVO_EMAIL,
      pass: "Hidden for security",
    });

    // HTML email template
    const htmlContent = `
      <h3>Appointment Request</h3>
      <p>${text.replace(/\n/g, "<br>")}</p>
      <div>
        <a href="${process.env.BASE_URL}/api/accept?appointmentId=${
      appointmentData?.id
    }">Accept</a>
        <a href="${process.env.BASE_URL}/api/reject?appointmentData=${
      appointmentData?.id
    }">Reject</a>
        <a href="${process.env.BASE_URL}/api/pending?appointmentData=${
      appointmentData?.id
    }">Mark as Pending</a>
      </div>
    `;

    const mailOptions = {
      from: `Appointment Management <${process.env.BREVO_EMAIL}>`,
      to,
      subject,
      text,
      html: htmlContent,
    };

    console.log("Sending email with options:", mailOptions);

    // Send email and log result
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in /api/send-email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
