"use client";

import React from "react";
import Dropdown from "@/components/dropdown/Dropdown";
import AvailableDays from "@/components/availableDays/AvailableDays";
import Button from "@/components/button/Button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useEditAvailability from "./useEditAvailability";

const EditAvailabilityPage = () => {
  const {
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
  } = useEditAvailability();
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
              onChange={(e) => setStartTime(e?.target?.value)}
              className="w-full sm:w-1/2"
            />
            <Dropdown
              end
              value={endTime}
              onChange={(e) => setEndTime(e?.target?.value)}
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
            disabled={isLoading}
          />
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditAvailabilityPage;
