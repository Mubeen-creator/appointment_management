"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FiPlus,
  FiChevronLeft,
  FiDownload,
  FiFilter,
  FiChevronRight,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import useDashboard from "./useDashboard";
import { FiChevronDown } from "react-icons/fi";
import { datePickerStyles } from "../../constants/timeSlot";
import Loader from "@/components/loader/Loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ScheduledEvents() {
  const {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    activeSidebarOption,
    setActiveSidebarOption,
    selectedAppointment,
    setSelectedAppointment,
    isModalOpen,
    setIsModalOpen,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isLoading,
    dispatch,
    user,
    appointmentsHistory,
    hostAppointments,
    router,
    profileRoute,
    handleNavigation,
    useEffect,
    handleUpdateStatus,
    openModal,
    generateBarGraphData,
    data,
    options,
    allAppointments,
    filteredAppointments,
    exportToICS,
    sidebarOptions,
    bottomOptions,
  } = useDashboard();

  return (
    <div className="flex h-screen relative">
      <style>{datePickerStyles}</style>
      {isLoading && <Loader />}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-300 bg-opacity-50 z-20 md:hidden opacity-25"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
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
            disabled={isLoading}
          >
            <FiChevronLeft size={20} />
          </button>
        </div>
        <div className="p-4" onClick={() => router.push("schedule")}>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-2 px-4 flex items-center justify-center cursor-pointer"
            disabled={isLoading}
          >
            <FiPlus size={16} className="mr-2" /> Create
          </button>
        </div>
        <div className="mt-4 px-2">
          {sidebarOptions?.map(({ name, icon: Icon }) => (
            <div
              key={name}
              className={`flex items-center px-4 py-3 rounded-md cursor-pointer ${
                activeSidebarOption === name
                  ? "bg-blue-50 font-semibold text-blue-600"
                  : "text-gray-600 font-semibold hover:bg-gray-100"
              }`}
              onClick={() => setActiveSidebarOption(name)}
            >
              <Icon size={18} className="mr-3" />
              <span className="text-sm font-medium">{name}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto px-2 mb-4">
          {bottomOptions?.map(({ name, icon: Icon, route, action }) => (
            <button
              key={name}
              className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer mt-1 w-full text-left"
              onClick={() =>
                route
                  ? router.push(route)
                  : action === "handleNavigation" && handleNavigation()
              }
              disabled={isLoading}
            >
              <Icon size={18} className="mr-3" />
              <span className="text-sm font-medium">{name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-gray-50 overflow-auto md:pt-20 p-8">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="mr-3 md:hidden text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                <FiChevronRight size={20} />
              </button>
              <h1 className="text-2xl font-bold">Scheduled events</h1>
            </div>
          </div>

          {activeSidebarOption === "Analytics" && (
            <div className="bg-white rounded-md shadow-sm p-4 mb-4">
              <Bar data={data} options={options} />
            </div>
          )}

          {activeSidebarOption === "Scheduled events" && (
            <>
              <div className="p-4 mb-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                  <div className="text-sm font-medium text-gray-700 bg-white px-4 py-2 border border-gray-300 rounded-md flex items-center justify-between">
                    My Calendly's
                    <FiChevronDown size={16} className="ml-2" />
                  </div>
                  <div className="text-sm text-gray-500">
                    Displaying {filteredAppointments?.length} of{" "}
                    {allAppointments?.length} Events
                  </div>
                </div>
              </div>

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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                    >
                      Past
                    </button>
                    <button
                      className={`py-2 px-4 text-sm whitespace-nowrap ${
                        activeTab === "DateRange"
                          ? "border-b-2 border-blue-600 cursor-pointer text-blue-600"
                          : "text-gray-500"
                      }`}
                      onClick={() => setActiveTab("DateRange")}
                      disabled={isLoading}
                    >
                      Date Range
                    </button>
                  </div>
                  <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto justify-end">
                    <button
                      onClick={exportToICS}
                      className="mr-2 px-4 py-1 text-sm border border-gray-800 rounded-full flex items-center hover:bg-gray-50"
                      disabled={isLoading}
                    >
                      <FiDownload size={16} className="mr-2" />
                      Export
                    </button>
                    <button
                      className="px-4 py-1 text-sm border border-gray-800 rounded-full flex items-center hover:bg-gray-50"
                      disabled={isLoading}
                    >
                      <FiFilter size={16} className="mr-2" />
                      Filter
                    </button>
                  </div>
                </div>

                {activeTab === "DateRange" && (
                  <div className="p-4 flex space-x-4">
                    <div>
                      <label className="text-sm text-gray-600">
                        Start Date:
                      </label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date: Date | null) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                        placeholderText="Select start date"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">End Date:</label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date: Date | null) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate || undefined}
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                        placeholderText="Select end date"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <div className="text-sm font-medium text-gray-600 mb-4">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  {filteredAppointments.map((appointment, index) => (
                    <div
                      key={index}
                      className="flex items-center mb-4 border border-gray-200 rounded-md p-3 hover:bg-gray-50"
                    >
                      <div className="w-6 h-6 rounded-full bg-purple-500 mr-4 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:justify-between">
                          <div>
                            <div className="text-sm text-gray-600">
                              {appointment?.time}
                            </div>
                            <div className="font-medium">
                              Meeting with{" "}
                              {appointment.tag === "Sent"
                                ? appointment?.hostEmail
                                : appointment?.requesterEmail}
                              <span
                                className={`ml-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                  appointment?.tag === "Sent"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {appointment.tag}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Event type: 30 Minute Meeting
                            </div>
                          </div>
                          <div className="text-left md:text-right mt-2 md:mt-0">
                            <div className="text-sm text-gray-600">
                              1 host | 0 non-hosts
                            </div>
                            <button
                              onClick={() => openModal(appointment)}
                              className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                              disabled={isLoading}
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredAppointments?.length === 0 && (
                    <div className="text-center text-sm text-gray-500 py-4">
                      No appointments found for this category
                    </div>
                  )}

                  {filteredAppointments?.length > 0 && (
                    <div className="text-center text-sm text-gray-500 py-4">
                      You've reached the end of the list
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {isModalOpen && selectedAppointment && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-lg font-semibold mb-4">
                  Appointment Details
                </h2>
                <p>
                  <strong>Date:</strong> {selectedAppointment?.date}
                </p>
                <p>
                  <strong>Time:</strong> {selectedAppointment?.time}
                </p>
                <p>
                  <strong>Status:</strong> {selectedAppointment?.status}
                </p>
                <p>
                  <strong>Requester:</strong>{" "}
                  {selectedAppointment?.requesterEmail}
                </p>
                <p>
                  <strong>Host:</strong> {selectedAppointment?.hostEmail}
                </p>
                <p>
                  <strong>Type:</strong> {selectedAppointment?.tag}
                </p>
                {selectedAppointment.message && (
                  <p>
                    <strong>Message:</strong> {selectedAppointment?.message}
                  </p>
                )}
                {selectedAppointment?.timeZone && (
                  <p>
                    <strong>Time Zone:</strong> {selectedAppointment?.timeZone}
                  </p>
                )}
                {selectedAppointment?.meetLink && (
                  <p>
                    <strong>Google Meet Link:</strong>{" "}
                    <a
                      href={selectedAppointment?.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedAppointment?.meetLink}
                    </a>
                  </p>
                )}

                {selectedAppointment?.tag === "Received" && (
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          selectedAppointment?._id!,
                          "accepted"
                        )
                      }
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      disabled={isLoading}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          selectedAppointment?._id!,
                          "rejected"
                        )
                      }
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      disabled={isLoading}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(selectedAppointment?._id!, "pending")
                      }
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      disabled={isLoading}
                    >
                      Mark as Pending
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  disabled={isLoading}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
