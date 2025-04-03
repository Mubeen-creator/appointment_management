"use client";

import React, { useState, useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";
import { setAvailability } from "@/store/slices/availabilitySlice";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Dropdown from "@/components/dropdown/Dropdown";
import AvailableDays from "@/components/availableDays/AvailableDays";
import Button from "@/components/button/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useEditAvailability = () => {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const availability = useAppSelector(
    (state: RootState) => state?.availability
  );
  const user = useAppSelector((state: RootState) => state?.user);

  const [startTime, setStartTime] = useState(availability?.startTime || "");
  const [endTime, setEndTime] = useState(availability?.endTime || "");
  const [selectedDays, setSelectedDays] = useState<string[]>(
    availability?.availableDays || []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated" && !user?.email) {
      router?.push("/availibilityHours");
    }
  }, [status, user, router]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!user.email || availability?.startTime) return;
      try {
        const response = await fetch(`/api/get-user?email=${user.email}`);
        const data = await response.json();
        if (response.ok && data?.availability) {
          setStartTime(data?.availability?.startTime);
          setEndTime(data?.availability?.endTime);
          setSelectedDays(data?.availability?.availableDays);
          dispatch(setAvailability(data?.availability));
        }
      } catch (error) {
        console.error("Fetch availability error:", error);
      }
    };
    fetchAvailability();
  }, [user.email, dispatch]);

  const handleSave = async () => {
    if (!startTime || !endTime || selectedDays?.length === 0) {
      toast.error("Please fill all availability fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
          startTime,
          endTime,
          availableDays: selectedDays,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        dispatch(
          setAvailability({ startTime, endTime, availableDays: selectedDays })
        );
        toast.success("Availability updated successfully!");
        router.push("/dashboard");
      } else {
        toast.error(result?.message || "Failed to update availability");
      }
    } catch (error) {
      console.error("Update availability error:", error);
      toast.error("Connection error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dispatch,
    router,
    availability,
    user,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    selectedDays,
    setSelectedDays,
    isLoading,
    setIsLoading,
    handleSave,
    useEffect,
    status,
  };
};

export default useEditAvailability;
