// store/slices/appointmentSlice.ts
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
  currentAppointment: Appointment;
  appointmentsHistory: Appointment[];
  hostAppointments: Appointment[]; // New state for host appointments
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
  appointmentsHistory: [],
  hostAppointments: [], // Initialize host appointments
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
    setAppointmentsHistory: (state, action: PayloadAction<Appointment[]>) => {
      state.appointmentsHistory = action.payload;
    },
    setHostAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.hostAppointments = action.payload; // Set host appointments
    },
  },
});

export const {
  setAppointment,
  addAppointmentToHistory,
  updateAppointmentStatus,
  setAppointmentsHistory,
  setHostAppointments, // Export the new action
} = appointmentSlice.actions;
export default appointmentSlice.reducer;
