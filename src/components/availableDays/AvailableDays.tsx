import React from "react";
import { days } from "@/constants/timeSlot";
import { AvailableDaysProps } from "@/constants/interfaces";

const AvailableDays: React.FC<AvailableDaysProps> = ({
  selectedDays,
  setSelectedDays,
}) => {
  const toggleDay = (day: string) => {
    if (selectedDays?.includes(day)) {
      setSelectedDays(selectedDays?.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <div className="mt-6 md:mt-10 px-3 md:px-5">
      <h1 className="font-bold text-black mb-2">Available Days</h1>
      <div className="border border-gray-300 w-full rounded-sm overflow-hidden">
        <div className="flex flex-col md:hidden">
          {days?.map((day, index) => (
            <div
              key={day}
              className={`flex items-center justify-between px-4 py-3 ${
                index !== days?.length - 1 ? "border-b border-gray-300" : ""
              }`}
            >
              <label
                htmlFor={`mobile-${day?.toLowerCase()}`}
                className="text-sm"
              >
                {day}
              </label>
              <input
                type="checkbox"
                id={`mobile-${day?.toLowerCase()}`}
                name={day?.toLowerCase()}
                checked={selectedDays?.includes(day)}
                onChange={() => toggleDay(day)}
                className="form-checkbox h-4 w-4"
              />
            </div>
          ))}
        </div>
        <div className="hidden md:flex justify-between items-center">
          {days.map((day, index) => (
            <div
              key={day}
              className={`flex flex-col items-center px-2 lg:px-5 py-4 ${
                index !== days?.length - 1 ? "border-r border-gray-300" : ""
              }`}
            >
              <input
                type="checkbox"
                id={day?.toLowerCase()}
                name={day?.toLowerCase()}
                checked={selectedDays?.includes(day)}
                onChange={() => toggleDay(day)}
                className="form-checkbox h-4 w-4"
              />
              <label
                htmlFor={day?.toLowerCase()}
                className="text-xs lg:text-sm mt-1 text-center"
              >
                {day}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableDays;
