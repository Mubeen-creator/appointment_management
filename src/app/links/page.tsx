"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RootState, useAppSelector } from "@/store/store";
import { Appointment } from "@/store/slices/appointmentSlice";
import {
  Copy,
  Link as LinkIcon,
  Calendar,
  Clock,
  ArrowLeft,
} from "lucide-react";

const LinksPage = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [acceptedAppointments, setAcceptedAppointments] = useState<
    Appointment[]
  >([]);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const appointmentsHistory = useAppSelector(
    (state: RootState) => state.appointment.appointmentsHistory
  );
  const hostAppointments = useAppSelector(
    (state: RootState) => state.appointment.hostAppointments
  );

  useEffect(() => {
    const allAppointments = [...appointmentsHistory, ...hostAppointments];
    const filtered = allAppointments.filter(
      (appt) => appt.status === "accepted" && appt.meetLink
    );
    setAcceptedAppointments(filtered);
  }, [appointmentsHistory, hostAppointments]);

  const copyToClipboard = (link: string, appointmentId: string) => {
    navigator.clipboard.writeText(link);

    setCopiedStates((prev) => ({
      ...prev,
      [appointmentId]: true,
    }));

    setTimeout(() => {
      setCopiedStates((prev) => ({
        ...prev,
        [appointmentId]: false,
      }));
    }, 3000);
  };

  const handleGoBack = () => {
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleGoBack}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group flex items-center 
              bg-white border border-gray-200 
              rounded-full 
              shadow-md hover:shadow-lg 
              transition-all duration-300 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              overflow-hidden
              h-12
              w-12 hover:w-36 cursor-pointer"
          >
            <div className="flex items-center justify-center w-12 flex-shrink-0">
              <ArrowLeft
                className="w-6 h-6 text-gray-700 
                  group-hover:text-blue-600 
                  transition-colors duration-300"
              />
            </div>
            <span
              className={`
                text-gray-700 whitespace-nowrap 
                pl-0 opacity-0 
                group-hover:pl-2 group-hover:opacity-100 
                transition-all duration-300 
                ${isHovered ? "visible" : "invisible"}
              `}
            >
              Go Back
            </span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900 text-center flex-grow">
            Meeting Links
          </h1>
          {/* Placeholder div to center the title */}
          <div className="w-12"></div>
        </div>

        {acceptedAppointments.length === 0 ? (
          <div className="bg-white shadow-sm rounded-2xl p-8 text-center border border-gray-200">
            <p className="text-gray-500 text-lg">
              No accepted appointments with links found.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {acceptedAppointments.map((appointment: any) => (
              <div
                key={appointment._id}
                className="bg-white rounded-2xl shadow-[0_10px_25px_-10px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.15)]"
              >
                <div className="p-6 border-b border-gray-100">
                  <div className="mb-2">
                    <h2 className="text-xl font-semibold text-gray-800 break-words">
                      Meeting with{" "}
                      {appointment.tag === "Sent"
                        ? appointment.hostEmail
                        : appointment.requesterEmail}
                    </h2>
                  </div>

                  <div className="flex items-center text-gray-600 space-x-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{appointment.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{appointment.time}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 w-full">
                      <LinkIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <a
                        href={appointment.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm break-words w-full"
                      >
                        {appointment.meetLink}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      copyToClipboard(appointment.meetLink!, appointment._id)
                    }
                    className="w-full flex items-center justify-center px-4 py-2.5 
                      bg-gradient-to-r from-blue-500 to-blue-600 
                      text-white rounded-lg 
                      hover:from-blue-600 hover:to-blue-700 
                      transition-all duration-300 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {copiedStates[appointment._id] ? (
                      <span className="font-medium">Copied to Clipboard</span>
                    ) : (
                      <>
                        <Copy className="mr-2 w-4 h-4" />
                        <span className="font-medium">Copy Meeting Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LinksPage;
