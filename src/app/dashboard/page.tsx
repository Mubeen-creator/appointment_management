"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
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
import {
  setAppointmentsHistory,
  setHostAppointments,
} from "@/store/slices/appointmentSlice";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import { saveAs } from "file-saver";
import { parse, format } from "date-fns";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Appointment {
  _id?: string;
  date: string;
  time: string;
  status: "pending" | "accepted" | "rejected";
  requesterEmail: string;
  hostEmail: string;
  message?: string;
  timeZone?: string;
  tag: "Sent" | "Received";
  createdAt?: string;
  updatedAt?: string;
}

export default function ScheduledEvents() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSidebarOption, setActiveSidebarOption] =
    useState("Scheduled events");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const appointmentsHistory = useSelector(
    (state: RootState) => state.appointment.appointmentsHistory
  );
  const hostAppointments = useSelector(
    (state: RootState) => state.appointment.hostAppointments
  );
  const router = useRouter();
  const profileRoute = "/profile";

  const handleNavigation = () => {
    router.push(profileRoute);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`/api/appointments?email=${user.email}`);
        const data = await response.json();
        dispatch(setAppointmentsHistory(data));

        const hostResponse = await fetch(
          `/api/appointments?hostEmail=${user.email}`
        );
        const hostData = await hostResponse.json();
        dispatch(setHostAppointments(hostData));
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    if (user.email) {
      fetchAppointments();
    }
  }, [user.email, dispatch]);

  const handleUpdateStatus = async (
    appointmentId: string,
    newStatus: string
  ) => {
    try {
      if (!selectedAppointment) return;

      const response = await fetch("/api/update-appointment-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId,
          status: newStatus,
          requesterEmail: selectedAppointment.requesterEmail,
        }),
      });

      if (response.ok) {
        const [updatedAppointments, updatedHostAppointments] =
          await Promise.all([
            fetch(`/api/appointments?email=${user.email}`).then((res) =>
              res.json()
            ),
            fetch(`/api/appointments?hostEmail=${user.email}`).then((res) =>
              res.json()
            ),
          ]);

        dispatch(setAppointmentsHistory(updatedAppointments));
        dispatch(setHostAppointments(updatedHostAppointments));
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const openModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const generateBarGraphData = () => {
    const appointmentsPerMonth = Array(12).fill(0);
    const allAppointments = [...appointmentsHistory, ...hostAppointments];

    allAppointments.forEach((appointment) => {
      const month = new Date(appointment.date).getMonth();
      appointmentsPerMonth[month]++;
    });

    return {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "Appointments",
          data: appointmentsPerMonth,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const data = generateBarGraphData();
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Appointment Analytics" },
    },
  };

  const allAppointments = [...appointmentsHistory, ...hostAppointments];

  const filteredAppointments = allAppointments.filter((appointment) => {
    const today = new Date("2025-03-26"); // Replace with new Date() in production
    const appointmentDate = new Date(appointment.date);

    switch (activeTab) {
      case "Upcoming":
        return appointmentDate >= today;
      case "Pending":
        return appointment.status === "pending";
      case "Past":
        return appointmentDate < today;
      case "DateRange":
        if (!startDate || !endDate) return true;
        return appointmentDate >= startDate && appointmentDate <= endDate;
      default:
        return true;
    }
  });

  const exportToICS = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//xAI//Grok 3//EN",
      ...filteredAppointments.map((appointment) => {
        const startDateTime = parse(
          `${appointment.date} ${appointment.time}`,
          "yyyy-MM-dd h:mma",
          new Date()
        );
        const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000);

        const formatICSDate = (date: Date) =>
          format(date, "yyyyMMdd'T'HHmmss'Z'");

        return [
          "BEGIN:VEVENT",
          `UID:${appointment._id}`,
          `DTSTART:${formatICSDate(startDateTime)}`,
          `DTEND:${formatICSDate(endDateTime)}`,
          `SUMMARY:Meeting with ${
            appointment.tag === "Sent"
              ? appointment.hostEmail
              : appointment.requesterEmail
          }`,
          `DESCRIPTION:${appointment.message || "No message"}`,
          `ORGANIZER;CN=${appointment.hostEmail}:mailto:${appointment.hostEmail}`,
          `ATTENDEE;CN=${appointment.requesterEmail}:mailto:${appointment.requesterEmail}`,
          "STATUS:CONFIRMED",
          "END:VEVENT",
        ].join("\r\n");
      }),
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    saveAs(blob, "appointments.ics");
  };

  const datePickerStyles = `
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

  return (
    <div className="flex h-screen relative">
      <style>{datePickerStyles}</style>
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
          <div
            className={`flex items-center px-4 py-3 rounded-md cursor-pointer ${
              activeSidebarOption === "Scheduled events"
                ? "bg-blue-50 border-l-4 border-blue-600 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveSidebarOption("Scheduled events")}
          >
            <FiGrid size={18} className="mr-3" />
            <span className="text-sm font-medium">Scheduled events</span>
          </div>
          <div
            className={`flex items-center px-4 py-3 rounded-md cursor-pointer mt-1 ${
              activeSidebarOption === "Analytics"
                ? "bg-blue-50 border-l-4 border-blue-600 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveSidebarOption("Analytics")}
          >
            <FiPieChart size={18} className="mr-3" />
            <span className="text-sm font-medium">Analytics</span>
          </div>
        </div>
        <div className="mt-auto px-2 mb-4">
          <div className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
            <FiClock size={18} className="mr-3" />
            <span className="text-sm font-medium">Availability</span>
          </div>
          <div
            className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-md mt-1 cursor-pointer"
            onClick={handleNavigation}
          >
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

          {activeSidebarOption === "Analytics" && (
            <div className="bg-white rounded-md shadow-sm p-4 mb-4">
              <Bar data={data} options={options} />
            </div>
          )}

          {activeSidebarOption === "Scheduled events" && (
            <>
              <div className="bg-white rounded-md shadow-sm p-4 mb-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                  <div className="text-sm font-medium text-gray-700">
                    My Calendly's
                  </div>
                  <div className="text-sm text-gray-500">
                    Displaying {filteredAppointments.length} of{" "}
                    {allAppointments.length} Events
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
                          ? "border-b-2 border-blue-600 cursor-pointer text-blue-600"
                          : "text-gray-500"
                      }`}
                      onClick={() => setActiveTab("DateRange")}
                    >
                      Date Range
                    </button>
                  </div>
                  <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto justify-end">
                    <button
                      onClick={exportToICS}
                      className="mr-2 px-4 py-1 text-sm border border-gray-300 rounded-md flex items-center hover:bg-gray-50"
                    >
                      <FiDownload size={16} className="mr-2" />
                      Export
                    </button>
                    <button className="px-4 py-1 text-sm border border-gray-300 rounded-md flex items-center hover:bg-gray-50">
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
                              {appointment.time}
                            </div>
                            <div className="font-medium">
                              Meeting with{" "}
                              {appointment.tag === "Sent"
                                ? appointment.hostEmail
                                : appointment.requesterEmail}
                              <span
                                className={`ml-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                  appointment.tag === "Sent"
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
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredAppointments.length === 0 && (
                    <div className="text-center text-sm text-gray-500 py-4">
                      No appointments found for this category
                    </div>
                  )}

                  {filteredAppointments.length > 0 && (
                    <div className="text-center text-sm text-gray-500 py-4">
                      You've reached the end of the list
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Modal */}
          {isModalOpen && selectedAppointment && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-lg font-semibold mb-4">
                  Appointment Details
                </h2>
                <p>
                  <strong>Date:</strong> {selectedAppointment.date}
                </p>
                <p>
                  <strong>Time:</strong> {selectedAppointment.time}
                </p>
                <p>
                  <strong>Status:</strong> {selectedAppointment.status}
                </p>
                <p>
                  <strong>Requester:</strong>{" "}
                  {selectedAppointment.requesterEmail}
                </p>
                <p>
                  <strong>Host:</strong> {selectedAppointment.hostEmail}
                </p>
                <p>
                  <strong>Type:</strong> {selectedAppointment.tag}
                </p>
                {selectedAppointment.message && (
                  <p>
                    <strong>Message:</strong> {selectedAppointment.message}
                  </p>
                )}
                {selectedAppointment.timeZone && (
                  <p>
                    <strong>Time Zone:</strong> {selectedAppointment.timeZone}
                  </p>
                )}

                {selectedAppointment.tag === "Received" && (
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() =>
                        handleUpdateStatus(selectedAppointment._id!, "accepted")
                      }
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(selectedAppointment._id!, "rejected")
                      }
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(selectedAppointment._id!, "pending")
                      }
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Mark as Pending
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
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
