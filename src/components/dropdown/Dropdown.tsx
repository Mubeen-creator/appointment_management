import React from "react";

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
      <select
        value={value}
        onChange={onChange}
        className={`appearance-none w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base ${className}`}
      >
        <option value="">{defaultOption}</option>
        {options.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};

export default Dropdown;
