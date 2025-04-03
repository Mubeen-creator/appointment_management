"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import TimezoneSelect from "react-timezone-select";
import { FiTool } from "react-icons/fi";
import { HiOutlineClock } from "react-icons/hi";
import Header from "@/components/header/Header";
import Button from "@/components/button/Button";
import useSchedule from "./useSchedule";
import { weekdays } from "@/constants/timeSlot";

export default function MeetingScheduler() {
  const {
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
  } = useSchedule();

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full flex flex-col md:flex-row p-4 md:p-6">
          <div className="w-full md:w-1/3 flex flex-col md:pr-6 mb-4 md:mb-0">
            <h1 className="font-semibold text-gray-500">{user?.userName}</h1>
            <span className="text-black font-bold text-xl md:text-2xl">
              30 Minute Meeting
            </span>
            <div className="flex items-center gap-x-3 mt-3 md:mt-5">
              <div>
                <HiOutlineClock size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-gray-600">30 min</p>
              </div>
            </div>
          </div>
          <div className="hidden md:block w-[1px] bg-gray-300"></div>
          <hr className="border-t border-gray-300 w-full my-4 md:hidden" />
          <div className="w-full md:w-2/3 flex flex-col md:flex-row md:pl-5">
            <div className="w-full md:w-2/3 md:pr-6 flex flex-col mb-6 md:mb-0">
              <h2 className="text-lg font-semibold text-gray-700">
                Select a Date & Time
              </h2>
              <div className="flex items-center justify-between md:justify-evenly mt-4">
                <button
                  onClick={handlePrevMonth}
                  className="focus:outline-none"
                >
                  <ChevronLeftIcon className="h-8 w-8 text-blue-500 bg-blue-200 p-2 rounded-full cursor-pointer" />
                </button>
                <span className="text-gray-700">{monthName}</span>
                <button
                  onClick={handleNextMonth}
                  className="focus:outline-none"
                >
                  <ChevronRightIcon className="h-8 w-8 text-blue-500 bg-blue-200 p-2 rounded-full cursor-pointer" />
                </button>
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-7 gap-1 text-center text-xs md:text-sm text-gray-500">
                  {weekdays?.map((day, index) => (
                    <div key={index}>{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 mt-2 text-center">
                  {Array?.from({ length: firstDayOfMonth })?.map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {daysInMonth.map((day) => {
                    const isSelected =
                      selectedDate?.getDate() === day &&
                      selectedDate?.getMonth() === currentMonth?.getMonth() &&
                      selectedDate?.getFullYear() ===
                        currentMonth?.getFullYear();
                    return (
                      <button
                        key={day}
                        onClick={() => handleDateSelect(day)}
                        className={`p-1 md:p-2 rounded-full text-sm ${
                          isSelected
                            ? "bg-blue-500 text-white"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4 md:mt-6 flex flex-col">
                <p className="text-sm text-gray-600">Time zone:</p>
                <div className="mt-2">
                  <TimezoneSelect
                    value={selectedTimezone}
                    onChange={setSelectedTimezone}
                    className="text-sm text-gray-600"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center border border-gray-600 rounded-full gap-x-2 py-2 md:py-3 w-[150px] cursor-pointer mt-6 md:mt-10 mx-auto md:mx-0">
                <div>
                  <FiTool size={18} color="black" />
                </div>
                <div>
                  <p className="text-sm">Troubleshoot</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-4 cursor-pointer">
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="space-y-2 w-full cursor-pointer">
                {timeSlots?.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`w-full py-2 border rounded text-sm ${
                      selectedTime === time
                        ? "bg-blue-800 text-white border-blue-800"
                        : "border-blue-500 text-blue-500 hover:bg-blue-50 cursor-pointer"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <Button
                text="Continue"
                className="mt-6 w-[130px]"
                onClick={handleSchedule}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
