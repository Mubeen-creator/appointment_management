"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";
import { addAppointmentToHistory } from "@/store/slices/appointmentSlice";
import axios from "axios";
const useConfirm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const user = useAppSelector((state: RootState) => state.user);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const { date, time } = useAppSelector(
    (state: RootState) => state?.appointment?.currentAppointment
  );

  const handleConfirm = async () => {
    event?.preventDefault();
    try {
      if (!user?.email || !email || !date || !time || !name) {
        alert("Please fill all required fields");
        return;
      }

      const appointmentResponse = await axios.post("/api/appointments", {
        requesterEmail: user?.email,
        hostEmail: email,
        date,
        time,
        message: notes,
      });

      if (appointmentResponse?.status !== 201) {
        alert(`Appointment failed: ${appointmentResponse.data.message}`);
        return;
      }

      const emailPayload = {
        to: email,
        subject: `New Appointment Request from ${name}`,
        text: `Hi there,\n\n${name} has requested an appointment on ${date} at ${time}.\n\nMessage: ${notes}`,
        appointmentData: {
          requesterEmail: user?.email,
          hostEmail: email,
          date,
          time,
          message: notes,
        },
      };

      console.log("[Frontend] Sending email request:", emailPayload);
      const emailResponse = await axios.post("/api/send-email", emailPayload);

      if (emailResponse.status !== 200) {
        alert(`Email failed: ${emailResponse?.data?.message}`);
        return;
      }

      dispatch(addAppointmentToHistory());
      router.push("/meeting-confirmation");
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    notes,
    setNotes,
    user,
    router,
    dispatch,
    date,
    time,
    handleConfirm,
  };
};

export default useConfirm;
