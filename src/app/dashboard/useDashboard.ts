"use client";

import { useState, useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";
import {
  setAppointmentsHistory,
  setHostAppointments,
  updateAppointmentStatus,
} from "@/store/slices/appointmentSlice";
import { useRouter } from "next/navigation";
import { saveAs } from "file-saver";
import { parse, format } from "date-fns";
import { Appointment } from "@/store/slices/appointmentSlice";
import { FiGrid, FiPieChart, FiClock, FiSettings } from "react-icons/fi";

const useDashboard = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSidebarOption, setActiveSidebarOption] =
    useState("Scheduled events");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state?.user);
  const appointmentsHistory = useAppSelector(
    (state: RootState) => state?.appointment?.appointmentsHistory
  );
  const hostAppointments = useAppSelector(
    (state: RootState) => state?.appointment?.hostAppointments
  );
  const router = useRouter();
  const profileRoute = "/profile";

  const handleNavigation = () => {
    router.push(profileRoute);
  };

  const sidebarOptions = [
    { name: "Scheduled events", icon: FiGrid },
    { name: "Analytics", icon: FiPieChart },
  ];

  const bottomOptions = [
    { name: "Availability", icon: FiClock, route: "/editAvailability" },
    { name: "Admin center", icon: FiSettings, action: "handleNavigation" },
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`/api/appointments?email=${user?.email}`);
        const data = await response?.json();
        dispatch(setAppointmentsHistory(data));

        const hostResponse = await fetch(
          `/api/appointments?hostEmail=${user.email}`
        );
        const hostData = await hostResponse.json();
        dispatch(setHostAppointments(hostData));
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    if (user.email) {
      fetchAppointments();
    }
  }, [user.email, dispatch]);

  const handleUpdateStatus = async (
    appointmentId: string,
    newStatus: string
  ) => {
    try {
      if (!selectedAppointment) return;

      const response = await fetch("/api/update-appointment-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId,
          status: newStatus,
          requesterEmail: selectedAppointment.requesterEmail,
        }),
      });

      if (response.ok) {
        const updatedAppointment = await response.json();
        const [updatedAppointments, updatedHostAppointments] =
          await Promise.all([
            fetch(`/api/appointments?email=${user?.email}`).then((res) =>
              res.json()
            ),
            fetch(`/api/appointments?hostEmail=${user?.email}`).then((res) =>
              res.json()
            ),
          ]);

        dispatch(setAppointmentsHistory(updatedAppointments));
        dispatch(setHostAppointments(updatedHostAppointments));
        dispatch(
          updateAppointmentStatus({
            id: appointmentId,
            status: newStatus as "pending" | "accepted" | "rejected",
            meetLink: updatedAppointment?.meetLink,
          })
        );
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const openModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const generateBarGraphData = () => {
    const appointmentsPerMonth = Array(12).fill(0);
    const allAppointments = [...appointmentsHistory, ...hostAppointments];

    allAppointments.forEach((appointment) => {
      const month = new Date(appointment.date).getMonth();
      appointmentsPerMonth[month]++;
    });

    return {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "Appointments",
          data: appointmentsPerMonth,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const data = generateBarGraphData();
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Appointment Analytics" },
    },
  };

  const allAppointments = [...appointmentsHistory, ...hostAppointments];

  const filteredAppointments = allAppointments.filter((appointment) => {
    const today = new Date("2025-03-26");
    const appointmentDate = new Date(appointment.date);

    switch (activeTab) {
      case "Upcoming":
        return appointmentDate >= today;
      case "Pending":
        return appointment?.status === "pending";
      case "Past":
        return appointmentDate < today;
      case "DateRange":
        if (!startDate || !endDate) return true;
        return appointmentDate >= startDate && appointmentDate <= endDate;
      default:
        return true;
    }
  });

  const exportToICS = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//xAI//Grok 3//EN",
      ...filteredAppointments.map((appointment) => {
        const startDateTime = parse(
          `${appointment?.date} ${appointment?.time}`,
          "yyyy-MM-dd h:mma",
          new Date()
        );
        const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000);

        const formatICSDate = (date: Date) =>
          format(date, "yyyyMMdd'T'HHmmss'Z'");

        return [
          "BEGIN:VEVENT",
          `UID:${appointment._id}`,
          `DTSTART:${formatICSDate(startDateTime)}`,
          `DTEND:${formatICSDate(endDateTime)}`,
          `SUMMARY:Meeting with ${
            appointment?.tag === "Sent"
              ? appointment?.hostEmail
              : appointment?.requesterEmail
          }`,
          `DESCRIPTION:${appointment?.message || "No message"}`,
          `ORGANIZER;CN=${appointment?.hostEmail}:mailto:${appointment?.hostEmail}`,
          `ATTENDEE;CN=${appointment?.requesterEmail}:mailto:${appointment?.requesterEmail}`,
          "STATUS:CONFIRMED",
          "END:VEVENT",
        ].join("\r\n");
      }),
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    saveAs(blob, "appointments.ics");
  };

  return {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    activeSidebarOption,
    setActiveSidebarOption,
    selectedAppointment,
    setSelectedAppointment,
    isModalOpen,
    setIsModalOpen,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    dispatch,
    user,
    appointmentsHistory,
    hostAppointments,
    router,
    profileRoute,
    handleNavigation,
    useEffect,
    handleUpdateStatus,
    openModal,
    generateBarGraphData,
    data,
    options,
    allAppointments,
    filteredAppointments,
    exportToICS,
    sidebarOptions,
    bottomOptions,
  };
};

export default useDashboard;
