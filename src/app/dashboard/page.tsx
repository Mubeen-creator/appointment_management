// app/profile/page.tsx
"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  FiPlus,
  FiGrid,
  FiPieChart,
  FiClock,
  FiSettings,
  FiMoreVertical,
  FiChevronLeft,
  FiDownload,
  FiFilter,
  FiChevronRight,
} from "react-icons/fi";

export default function ScheduledEvents() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const appointmentsHistory = useSelector(
    (state: RootState) => state.appointment.appointmentsHistory
  );

  return (
    <div className="flex h-screen relative">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-300 bg-opacity-50 z-20 md:hidden opacity-25"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Left Sidebar */}
      <div
        className={`fixed md:relative z-30 h-full transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg md:shadow-none`}
      >
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <img src="/logo.png" alt="Calendly" className="h-10" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiChevronLeft size={20} />
          </button>
        </div>
        <div className="p-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 px-4 flex items-center justify-center">
            <FiPlus size={16} className="mr-2" /> Create
          </button>
        </div>
        <div className="mt-4 px-2">
          <div className="flex items-center px-4 py-3 text-blue-600 border-l-4 border-blue-600 bg-blue-50 rounded-md">
            <FiGrid size={18} className="mr-3" />
            <span className="text-sm font-medium">Scheduled events</span>
          </div>
          <div className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-md mt-1">
            <FiPieChart size={18} className="mr-3" />
            <span className="text-sm font-medium">Analytics</span>
          </div>
        </div>
        <div className="mt-auto px-2 mb-4">
          <div className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-md">
            <FiClock size={18} className="mr-3" />
            <span className="text-sm font-medium">Availability</span>
          </div>
          <div className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-md mt-1">
            <FiSettings size={18} className="mr-3" />
            <span className="text-sm font-medium">Admin center</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="mr-3 text-gray-500 hover:text-gray-700"
              >
                <FiChevronRight size={20} />
              </button>
              <h1 className="text-xl font-semibold">Scheduled events</h1>
            </div>
            <div className="flex items-center">
              <button className="bg-white shadow-sm rounded-md p-1">
                <FiMoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Calendar Selection */}
          <div className="bg-white rounded-md shadow-sm p-4 mb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
              <div className="relative">
                <select className="appearance-none bg-transparent pr-8 pl-2 py-1 border border-gray-300 rounded-md text-sm">
                  <option>My Calendly</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiChevronRight size={14} className="transform rotate-90" />
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Displaying 1 of 1 Events
              </div>
            </div>
          </div>

          {/* Tabs and Actions */}
          <div className="bg-white rounded-t-md shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 pt-4">
              <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 w-full">
                <button
                  className={`py-2 px-4 text-sm whitespace-nowrap ${
                    activeTab === "Upcoming"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("Upcoming")}
                >
                  Upcoming
                </button>
                <button
                  className={`py-2 px-4 text-sm whitespace-nowrap ${
                    activeTab === "Pending"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("Pending")}
                >
                  Pending
                </button>
                <button
                  className={`py-2 px-4 text-sm whitespace-nowrap ${
                    activeTab === "Past"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("Past")}
                >
                  Past
                </button>
                <button
                  className={`py-2 px-4 text-sm whitespace-nowrap ${
                    activeTab === "DateRange"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("DateRange")}
                >
                  Date Range
                </button>
              </div>
              <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto justify-end">
                <button className="mr-2 px-4 py-1 text-sm border border-gray-300 rounded-md flex items-center hover:bg-gray-50">
                  <FiDownload size={16} className="mr-2" />
                  Export
                </button>
                <button className="px-4 py-1 text-sm border border-gray-300 rounded-md flex items-center hover:bg-gray-50">
                  <FiFilter size={16} className="mr-2" />
                  Filter
                </button>
              </div>
            </div>

            {/* Event List */}
            <div className="p-4">
              <div className="text-sm font-medium text-gray-600 mb-4">
                Wednesday, 27 March 2024
              </div>

              <div className="flex items-center mb-4 border border-gray-200 rounded-md p-3 hover:bg-gray-50">
                <div className="w-6 h-6 rounded-full bg-purple-500 mr-4 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div>
                      <div className="text-sm text-gray-600">
                        11:00am - 11:30am
                      </div>
                      <div className="font-medium">test</div>
                      <div className="text-sm text-gray-600">
                        Event type: 30 Minute Meeting
                      </div>
                    </div>
                    <div className="text-left md:text-right mt-2 md:mt-0">
                      <div className="text-sm text-gray-600">
                        1 host | 0 non-hosts
                      </div>
                    </div>
                  </div>
                </div>
                <button className="ml-2 md:ml-4 text-gray-500 hover:text-gray-800 flex-shrink-0">
                  <span className="hidden md:inline">Details</span>
                  <FiChevronRight size={20} />
                </button>
              </div>

              <div className="text-center text-sm text-gray-500 py-4">
                You've reached the end of the list
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
