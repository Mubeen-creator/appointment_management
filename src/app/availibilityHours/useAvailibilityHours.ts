"use client";

import AvailableDays from "@/components/availableDays/AvailableDays";
import Button from "@/components/button/Button";
import Dropdown from "@/components/dropdown/Dropdown";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { GrAnnounce } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { setAvailability } from "@/store/slices/availabilitySlice";
import { setUser } from "@/store/slices/userSlice"; // Import setUser
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { useSession } from "next-auth/react";
const useAvailibilityHours = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession(); // Get session from NextAuth

  // Sync Redux store with NextAuth session on page load
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      dispatch(
        setUser({
          email: session.user.email ?? "",
          fullName: session.user.fullName ?? "",
          userName: session.user.userName ?? "",
          password: "", // Password not stored in session
        })
      );
    }
  }, [session, status, dispatch]);

  const handleContinue = async () => {
    if (!startTime || !endTime || selectedDays.length === 0) {
      alert("Please fill all availability fields");
      return;
    }

    console.log("User from Redux store:", user);

    if (!user.email) {
      alert("User email is missing. Please sign in again.");
      router.push("/"); // Redirect to sign-in page
      return;
    }

    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
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
        router.push("/schedule");
      } else {
        alert(result.message || "Failed to save availability");
      }
    } catch (error) {
      console.error("Availability error:", error);
      alert("Connection error");
    }
  };

  return {
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    selectedDays,
    setSelectedDays,
    user,
    dispatch,
    router,
    containerRef,
    useEffect,
    session,
    status,
    handleContinue,
  };
};

export default useAvailibilityHours;
