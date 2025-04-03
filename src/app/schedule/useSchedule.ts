"use client";

import { useState, useMemo } from "react";
import { setAppointment } from "@/store/slices/appointmentSlice";
import { useRouter } from "next/navigation";
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";
import { timeSlots } from "@/constants/timeSlot";
const useSchedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState<any>({
    value: "Asia/Karachi",
  });

  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state: RootState) => state?.user);

  const daysInMonth = useMemo(() => {
    const year = currentMonth?.getFullYear();
    const month = currentMonth?.getMonth();
    const days = new Date(year, month + 1, 0)?.getDate();
    return Array?.from({ length: days }, (_, i) => i + 1);
  }, [currentMonth]);

  const firstDayOfMonth = useMemo(() => {
    return new Date(
      currentMonth?.getFullYear(),
      currentMonth?.getMonth(),
      1
    ).getDay();
  }, [currentMonth]);

  const monthName = currentMonth?.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth?.getFullYear(), currentMonth?.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth?.getFullYear(), currentMonth?.getMonth() + 1, 1)
    );
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(
      new Date(currentMonth?.getFullYear(), currentMonth?.getMonth(), day)
    );
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      const dateString = selectedDate?.toISOString()?.split("T")[0];
      dispatch(
        setAppointment({
          date: dateString,
          time: selectedTime,
          requesterEmail: user?.email,
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
