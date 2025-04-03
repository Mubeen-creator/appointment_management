"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RootState, useAppSelector } from "@/store/store";
import { Appointment } from "@/store/slices/appointmentSlice";
import {
  Copy,
  Link as LinkIcon,
  Calendar,
  Clock,
  ArrowLeft,
} from "lucide-react";

const useLinks = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [acceptedAppointments, setAcceptedAppointments] = useState<
    Appointment[]
  >([]);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const appointmentsHistory = useAppSelector(
    (state: RootState) => state?.appointment?.appointmentsHistory
  );
  const hostAppointments = useAppSelector(
    (state: RootState) => state?.appointment?.hostAppointments
  );

  useEffect(() => {
    const allAppointments = [...appointmentsHistory, ...hostAppointments];
    const filtered = allAppointments.filter(
      (appt) => appt?.status === "accepted" && appt?.meetLink
    );
    setAcceptedAppointments(filtered);
  }, [appointmentsHistory, hostAppointments]);

  const copyToClipboard = (link: string, appointmentId: string) => {
    navigator?.clipboard?.writeText(link);

    setCopiedStates((prev) => ({
      ...prev,
      [appointmentId]: true,
    }));

    setTimeout(() => {
      setCopiedStates((prev) => ({
        ...prev,
        [appointmentId]: false,
      }));
    }, 3000);
  };

  const handleGoBack = () => {
    router.push("/profile");
  };

  return {
    router,
    isHovered,
    setIsHovered,
    acceptedAppointments,
    setAcceptedAppointments,
    copiedStates,
    setCopiedStates,
    appointmentsHistory,
    hostAppointments,
    useEffect,
    copyToClipboard,
    handleGoBack,
  };
};

export default useLinks;
