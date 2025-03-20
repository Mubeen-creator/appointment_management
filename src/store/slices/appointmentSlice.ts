import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Appointment {
  date: string;
  time: string;
  requesterEmail: string;
  hostEmail: string;
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
    requesterEmail: "",
    hostEmail: "",
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
        requesterEmail: string;
        hostEmail: string;
        message: string;
      }>
    ) => {
      state.currentAppointment = {
        date: action.payload.date,
        time: action.payload.time,
        requesterEmail: action.payload.requesterEmail,
        hostEmail: action.payload.hostEmail,
        message: action.payload.message,
        status: "pending",
      };
    },
    addAppointmentToHistory: (state) => {
      state.appointmentsHistory.push(state.currentAppointment);
      state.currentAppointment = initialState.currentAppointment;
    },
    updateAppointmentStatus: (
      state,
      action: PayloadAction<"accepted" | "rejected">
    ) => {
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
