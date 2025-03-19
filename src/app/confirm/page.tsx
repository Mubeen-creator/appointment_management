"use client";

import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Input from "@/components/input/Input";
import Button from "@/components/button/Button";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { addAppointmentToHistory } from "@/store/slices/appointmentSlice";
import { BiBaseball } from "react-icons/bi";
import { CiCalendar } from "react-icons/ci";
import { HiOutlineClock } from "react-icons/hi";

export default function ConfirmMeeting() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const user = useSelector((state: RootState) => state.user);

  const router = useRouter();
  const dispatch = useDispatch();

  // Get the current appointment details from Redux
  const { date, time } = useSelector(
    (state: RootState) => state.appointment.currentAppointment
  );

  const handleConfirm = async () => {
    console.log("handleConfirm triggered"); // Add this
    try {
      // Save appointment to database
      const appointmentResponse = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterEmail: user.email,
          hostEmail: email,
          date,
          time,
          message: notes,
        }),
      });

      const appointmentData = await appointmentResponse.json();
      console.log("Appointment Data:", appointmentData);

      if (!appointmentResponse.ok) {
        alert(`Failed to save appointment: ${appointmentData.message}`);
        return;
      }

      // Send email with appointment ID
      console.log("Sending email to:", email);
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: "Appointment Request",
          text: `New appointment request from ${name}`,
          appointmentData, // Ensure this contains valid data
        }),
      });

      console.log("Email Response Status:", emailResponse.status);
      console.log("Email Response OK?", emailResponse.ok);

      if (emailResponse.ok) {
        console.log("Email sent successfully");
        dispatch(addAppointmentToHistory());
        router.push("/meeting-confirmation");
      } else {
        const emailError = await emailResponse.json();
        console.error("Email Error:", emailError);
        alert(`Failed to send email: ${emailError.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Confirmation error:", error);
      alert("Error scheduling appointment");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-4 md:p-8 relative">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row">
          {/* Left Section: User Details and Back Arrow */}
          <div className="w-full md:w-1/3 md:pr-6 mb-6 md:mb-0">
            {/* Back Arrow */}
            <button className="mb-4 text-blue-500 border p-2 border-gray-300 rounded-full cursor-pointer">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>

            {/* Meeting Details */}
            <div>
              <h1 className="font-medium text-gray-600">Muhammad Talha</h1>
              <p className="text-lg md:text-xl font-bold text-black mt-1">
                30 Minute Meeting
              </p>
              <div className="flex items-center gap-x-3 mt-3">
                <div>
                  <HiOutlineClock size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-500">30 min</p>
                </div>
              </div>
              <div className="flex items-center gap-x-3 mt-3">
                <div>
                  <CiCalendar size={20} className="text-gray-800" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {time}, {date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-x-3 mt-3">
                <div>
                  <BiBaseball size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Pakistan, Maldives Time
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Separator - Hide on mobile */}
          <div className="hidden md:block w-px bg-gray-200 mx-6"></div>

          {/* Horizontal Separator - Show only on mobile */}
          <hr className="border-t border-gray-200 my-6 md:hidden" />

          {/* Right Section: Form Inputs */}
          <div className="w-full md:w-2/3">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Enter Details
            </h2>
            <form className="space-y-4 md:space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block font-semibold text-black"
                >
                  Name *
                </label>
                <Input
                  type="text"
                  placeholder=""
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block font-semibold text-black"
                >
                  Email *
                </label>
                <Input
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Notes Field */}
              <div>
                <label
                  htmlFor="notes"
                  className="block font-semibold text-black"
                >
                  Please share anything that will help prepare for our meeting.
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="border border-gray-400 px-3 py-3 rounded-md w-full md:w-[88%] focus:outline-none focus:ring-2 focus:ring-gray-700 mt-2"
                />
              </div>

              {/* Terms and Button */}
              <div className="text-xs md:text-sm text-gray-500">
                By proceeding, you confirm that you have read and agree to{" "}
                <br className="hidden md:block" />
                <a
                  href="#"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Calendly's Terms of Use
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Privacy Notice
                </a>
                .
              </div>
              <div className="flex justify-start">
                <Button
                  text="Schedule Event"
                  className="w-full md:w-[170px]"
                  onClick={handleConfirm}
                />
              </div>
            </form>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 md:mt-2 text-xs text-gray-500 flex justify-start gap-x-6 md:gap-x-10">
          <a href="#">Cookie Settings</a>
          <a href="#">Report abuse</a>
        </div>
      </div>
    </div>
  );
}
