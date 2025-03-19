// store/slices/appointmentSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Appointment {
  date: string;
  time: string;
  name: string;
  email: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
}

interface AppointmentState {
  currentAppointment: Appointment; // Single appointment (for scheduling)
  appointmentsHistory: Appointment[]; // Array of past appointments (for profile)
}

const initialState: AppointmentState = {
  currentAppointment: {
    date: "",
    time: "",
    name: "",
    email: "",
    message: "",
    status: "pending",
  },
  appointmentsHistory: [], // Initialize as empty array
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setAppointment: (
      state,
      action: PayloadAction<{
        date: string;
        time: string;
        name: string;
        email: string;
        message: string;
      }>
    ) => {
      // Update the current appointment
      state.currentAppointment = {
        ...action.payload,
        status: "pending",
      };
    },
    addAppointmentToHistory: (state) => {
      // Add the current appointment to the history
      state.appointmentsHistory.push(state.currentAppointment);
      // Reset the current appointment
      state.currentAppointment = initialState.currentAppointment;
    },
    updateAppointmentStatus: (
      state,
      action: PayloadAction<"accepted" | "rejected">
    ) => {
      // Update the status of the current appointment
      state.currentAppointment.status = action.payload;
    },
  },
});

export const {
  setAppointment,
  addAppointmentToHistory,
  updateAppointmentStatus,
} = appointmentSlice.actions;
export default appointmentSlice.reducer;
