// app/profile/page.tsx
"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Profile() {
  const user = useSelector((state: RootState) => state.user);
  const appointmentsHistory = useSelector(
    (state: RootState) => state.appointment.appointmentsHistory
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-8">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">User Information</h2>
          <p>Name: {user.fullName}</p>
          <p>Email: {user.email}</p>
          <p>Username: {user.userName}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Meeting History</h2>
          {appointmentsHistory.map((appointment, index) => (
            <div
              key={index}
              className="mt-4 p-4 border border-gray-300 rounded-lg"
            >
              <p>Date: {appointment.date}</p>
              <p>Time: {appointment.time}</p>
              <p>Status: {appointment.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
