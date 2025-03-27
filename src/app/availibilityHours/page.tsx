"use client";

import AvailableDays from "@/components/availableDays/AvailableDays";
import Button from "@/components/button/Button";
import Dropdown from "@/components/dropdown/Dropdown";
import Image from "next/image";
import React from "react";
import { GrAnnounce } from "react-icons/gr";
import useAvailibilityHours from "./useAvailibilityHours";

const Page = () => {
  const {
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
  } = useAvailibilityHours();

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
          <button
            className="pr-4 cursor-pointer text-sm md:text-base"
            onClick={() => router.push("/schedule")}
          >
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
