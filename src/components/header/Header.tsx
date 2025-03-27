"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { GrLink } from "react-icons/gr";
import { MdKeyboardArrowDown } from "react-icons/md";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full bg-white shadow-gray-600 shadow-sm h-auto flex items-center justify-between md:justify-end py-2 px-4 md:px-6 relative">
      {/* Dropdown Section */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-x-1 cursor-pointer"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span>Menu</span>
          <MdKeyboardArrowDown
            size={20}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2 z-10">
            <ul className="text-gray-700">
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </li>
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                onClick={() => router.push("/profile")}
              >
                Profile
              </li>
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                onClick={() => router.push("/availibilityHours")}
              >
                Availability
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Copy Link Button */}
      <div
        className="flex items-center justify-center border border-gray-600 rounded-full gap-x-2 py-2 md:py-3 w-[130px] md:w-[150px] cursor-pointer ml-4 md:ml-10 mr-0 md:mr-10 lg:mr-20 xl:mr-40 2xl:mr-[300px]"
        onClick={() => router.push("/links")}
      >
        <GrLink size={18} className="text-black" />
        <p className="text-sm md:text-base">Copy link</p>
      </div>
    </div>
  );
}

export default Header;
