import React from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  start?: boolean;
  end?: boolean;
  className?: string;
}

const generateTimeOptions = (start: boolean, end: boolean) => {
  let times = [];

  if (start) {
    for (let i = 6; i <= 11; i++) {
      times.push(`${i}:00 AM`);
    }
    times.push(`12:00 PM`);
  }

  if (end) {
    for (let i = 1; i <= 11; i++) {
      times.push(`${i}:00 PM`);
    }
    times.push(`12:00 AM`);
  }

  return times;
};

const Dropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  start = false,
  end = false,
  className = "",
}) => {
  const options = generateTimeOptions(start, end);
  const defaultOption = start
    ? "Select Time (From)"
    : end
    ? "Select Time (To)"
    : "Select Time";

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none z-10">
        <ChevronDown className="h-4 w-4 text-blue-500" />
      </div>
      <select
        value={value}
        onChange={onChange}
        className={`appearance-none w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base relative z-0 ${className}`}
      >
        <option value="">{defaultOption}</option>
        {options?.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
