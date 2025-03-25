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

const Page = () => {
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

  return (
    <div className="flex flex-col items-center justify-center my-5 px-4">
      <div>
        <Image
          src="/logo.png"
          alt="logo"
          width={184}
          height={44}
          className="object-contain"
        />
      </div>

      <div
        ref={containerRef}
        className="border border-gray-300 py-5 mt-5 flex flex-col w-full max-w-3xl"
      >
        <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-5">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="font-bold text-black">Set your availability</h1>
            <p className="pt-2">
              Let Calendly know when you're typically available to{" "}
              <br className="hidden md:block" /> accept meetings.
            </p>
          </div>
          <div>
            <Image
              src="/hours.png"
              alt="image"
              width={150}
              height={150}
              className="object-contain pl-0 md:pl-5"
            />
          </div>
        </div>

        <hr className="border-t border-gray-300 w-full mt-4" />

        <h1 className="font-bold text-black mt-6 md:mt-8 mb-2 px-4 md:px-5">
          Available hours
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3 md:gap-5 px-4 md:px-5">
          <Dropdown
            start
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full md:w-auto"
          />
          <Dropdown
            end
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full md:w-auto mt-3 md:mt-0"
          />
        </div>

        <AvailableDays
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
        />

        <div className="mt-5 flex flex-col md:flex-row items-center justify-center gap-y-2 md:gap-y-0 md:gap-x-3 px-4 text-center md:text-left">
          <GrAnnounce size={20} color="black" />
          <p className="text-sm md:text-base">
            Don't worry! You'll be able to further customize your availability
            later on.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col md:flex-row items-center justify-center md:justify-evenly w-full gap-4 md:gap-0">
        <Image
          src="/Progressbar.png"
          alt="progress"
          width={150}
          height={150}
          className="object-contain"
        />
        <div className="flex items-center mt-4 md:mt-0">
          <button className="pr-4 cursor-pointer text-sm md:text-base">
            Set up later
          </button>
          <Button
            text="Continue"
            className="w-[130px]"
            onClick={handleContinue}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
