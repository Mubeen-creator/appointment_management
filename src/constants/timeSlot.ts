import {
  FiUser,
  FiPenTool,
  FiLink,
  FiLock,
  FiSettings,
  FiCalendar,
} from "react-icons/fi";

export const timeSlots = [
  "9:00am",
  "9:30am",
  "10:00am",
  "10:30am",
  "11:00am",
  "11:30am",
  "12:00pm",
  "12:30pm",
  "1:00pm",
];

export const datePickerStyles = `
        .react-datepicker-wrapper {
          display: block;
        }
        .react-datepicker__input-container input {
          background-color: white;
          cursor: pointer;
          width: 100%;
          outline: none;
        }
        .react-datepicker__input-container input:hover {
          border-color: #2563eb;
        }
        .react-datepicker {
          font-family: Arial, sans-serif;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          background-color: #ffffff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .react-datepicker__month-container {
          max-height: 300px; /* Fixed height less than screen */
          overflow-y: auto; /* Scrollable */
        }
        .react-datepicker__header {
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        .react-datepicker__day-name, .react-datepicker__day {
          width: 2rem;
          line-height: 2rem;
          text-align: center;
        }
        .react-datepicker__day--selected, .react-datepicker__day--in-range {
          background-color: #2563eb;
          color: white;
        }
        .react-datepicker__day--outside-month {
          color: #9ca3af;
        }
      `;

export const links = [
  { href: "/profile", icon: FiUser, label: "Profile", active: true },
  { href: "", icon: FiPenTool, label: "Branding" },
  { href: "/links", icon: FiLink, label: "My Link" },
  { href: "", icon: FiLock, label: "Login preferences" },
  { href: "", icon: FiSettings, label: "Cookie settings" },
  { href: "", icon: FiCalendar, label: "Calendar sync" },
];

export const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
