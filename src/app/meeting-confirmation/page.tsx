"use client";

import Header from "@/components/header/Header";
import React from "react";
import { TiTick } from "react-icons/ti";
import { MdOutlineOpenInNew } from "react-icons/md";
import { CiUser, CiCalendar } from "react-icons/ci";
import { BiBaseball } from "react-icons/bi";
import useConfirmation from "./useMeeting-confirmation";

const Page = () => {
  const { appointment, router, countdown, setCountdown, useEffect } =
    useConfirmation();

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />
      {/* contents */}
      <div className="flex flex-col items-center justify-start w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] shadow-sm shadow-gray-400 rounded-sm bg-white mx-auto my-6 md:my-auto p-4 md:p-6">
        <div className="flex gap-x-3 items-center justify-center mt-6 md:mt-10">
          <div className="bg-green-700 p-2 rounded-full flex items-center justify-center">
            <TiTick size={15} color="white" />
          </div>
          <div>
            <h1 className="font-bold text-black tracking-wide">
              You are Scheduled
            </h1>
          </div>
        </div>
        {/* description */}
        <div className="text-center px-4">
          <p className="text-sm mt-4 md:mt-5 text-gray-600">
            A calendar invitation has been sent to your email address.
          </p>
        </div>
        {/* Countdown Timer */}
        <p className="mt-4 text-gray-500 text-sm md:text-base">
          Redirecting to dashboard in{" "}
          <span className="font-bold">{countdown}</span> seconds...
        </p>
        {/* Open invitation button */}
        <div className="flex items-center justify-center border border-gray-600 rounded-full gap-x-2 py-2 mt-4 md:mt-5 w-[170px] cursor-pointer hover:bg-gray-50 transition-colors">
          <p className="text-sm md:text-base">Open Invitation</p>
          <MdOutlineOpenInNew size={20} className="text-black" />
        </div>
        {/* Detail box */}
        <div className="w-full md:w-auto h-auto border border-gray-300 p-4 mt-6 md:mt-10 rounded-md">
          <h1 className="font-bold text-lg md:text-xl">30 Minutes Meeting</h1>
          {/* username and icon */}
          <div className="mt-2 flex items-center justify-start">
            <CiUser size={20} className="text-gray-600 flex-shrink-0" />
            <p className="ml-2 font-semibold text-gray-500 text-sm md:text-base">
              Muhammad Talha
            </p>
          </div>

          {/* date and time */}
          <div className="mt-2 flex items-center justify-start">
            <CiCalendar size={20} className="text-gray-600 flex-shrink-0" />
            <p className="ml-2 font-semibold text-gray-500 text-sm md:text-base break-words">
              {appointment?.currentAppointment?.time},{" "}
              {appointment?.currentAppointment?.date}
            </p>
          </div>
          {/* country time */}
          <div className="mt-2 flex items-center justify-start">
            <BiBaseball size={20} className="text-gray-400 flex-shrink-0" />
            <p className="ml-2 font-semibold text-gray-500 text-sm md:text-base">
              Pakistan, Maldives Time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
