"use client";

import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAppointment } from "@/store/slices/appointmentSlice";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
const useSchedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState<any>({
    value: "Asia/Karachi",
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  const timeSlots = [
    "9:00am",
    "9:30am",
    "10:00am",
    "10:30am",
    "11:00am",
    "11:30am",
    "12:00pm",
    "12:30pm",
    "1:00pm",
  ];

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }, [currentMonth]);

  const firstDayOfMonth = useMemo(() => {
    return new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();
  }, [currentMonth]);

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    );
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      const dateString = selectedDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      dispatch(
        setAppointment({
          date: dateString,
          time: selectedTime,
          requesterEmail: user.email,
          hostEmail: "",
          message: "",
        })
      );

      router.push("/confirm");
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
    selectedTime,
    setSelectedTime,
    selectedTimezone,
    setSelectedTimezone,
    dispatch,
    router,
    user,
    timeSlots,
    daysInMonth,
    firstDayOfMonth,
    monthName,
    handlePrevMonth,
    handleNextMonth,
    handleDateSelect,
    handleTimeSelect,
    handleSchedule,
  };
};

export default useSchedule;
