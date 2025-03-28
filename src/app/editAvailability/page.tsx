"use client";

import React, { useState, useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";
import { setAvailability } from "@/store/slices/availabilitySlice";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Dropdown from "@/components/dropdown/Dropdown";
import AvailableDays from "@/components/availableDays/AvailableDays";
import Button from "@/components/button/Button";
import { toast, ToastContainer } from "react-toastify"; // Correct import
import "react-toastify/dist/ReactToastify.css";

const EditAvailabilityPage = () => {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const availability = useAppSelector((state: RootState) => state.availability);
  const user = useAppSelector((state: RootState) => state.user);

  const [startTime, setStartTime] = useState(availability.startTime || "");
  const [endTime, setEndTime] = useState(availability.endTime || "");
  const [selectedDays, setSelectedDays] = useState<string[]>(
    availability.availableDays || []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated" && !user.email) {
      router.push("/availibilityHours");
    }
  }, [status, user, router]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!user.email || availability.startTime) return;
      try {
        const response = await fetch(`/api/get-user?email=${user.email}`);
        const data = await response.json();
        if (response.ok && data.availability) {
          setStartTime(data.availability.startTime);
          setEndTime(data.availability.endTime);
          setSelectedDays(data.availability.availableDays);
          dispatch(setAvailability(data.availability));
        }
      } catch (error) {
        console.error("Fetch availability error:", error);
      }
    };
    fetchAvailability();
  }, [user.email, dispatch]);

  const handleSave = async () => {
    if (!startTime || !endTime || selectedDays.length === 0) {
      toast.error("Please fill all availability fields");
      return;
    }

    setIsLoading(true);
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
        toast.success("Availability updated successfully!");
        router.push("/dashboard");
      } else {
        toast.error(result.message || "Failed to update availability");
      }
    } catch (error) {
      console.error("Update availability error:", error);
      toast.error("Connection error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Edit Your Availability
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Adjust your available hours and days for meetings.
        </p>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Available Hours
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Dropdown
              start
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full sm:w-1/2"
            />
            <Dropdown
              end
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full sm:w-1/2"
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Available Days
          </h2>
          <AvailableDays
            selectedDays={selectedDays}
            setSelectedDays={setSelectedDays}
          />
        </div>

        <div className="flex justify-center">
          <Button
            text={isLoading ? "Saving..." : "Save Changes"}
            onClick={handleSave}
            className={`w-full sm:w-auto px-6 py-2 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white rounded-md transition`}
            disabled={isLoading} // Now supported
          />
        </div>
      </div>

      {/* Correct ToastContainer usage */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditAvailabilityPage;
