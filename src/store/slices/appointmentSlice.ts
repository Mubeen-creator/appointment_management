import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Appointment {
  _id?: string; // Add _id as an optional field to match MongoDB
  date: string;
  time: string;
  requesterEmail: string;
  hostEmail: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  tag?: "Sent" | "Received"; // Add tag as an optional field
  timeZone?: "string";
  createdAt?: string;
  updatedAt?: string;
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
    tag: undefined, // Initialize tag as undefined
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
        tag: undefined, // Tag is not set here, as it's not part of the initial creation
      };
    },
    addAppointmentToHistory: (state) => {
      state.appointmentsHistory.push(state.currentAppointment);
      state.currentAppointment = initialState.currentAppointment;
    },
    updateAppointmentStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: "pending" | "accepted" | "rejected";
      }>
    ) => {
      const { id, status } = action.payload;
      // Update in appointmentsHistory
      const historyIndex = state.appointmentsHistory.findIndex(
        (appt) => appt._id === id
      );
      if (historyIndex !== -1) {
        state.appointmentsHistory[historyIndex].status = status;
      }
      // Update in hostAppointments
      const hostIndex = state.hostAppointments.findIndex(
        (appt) => appt._id === id
      );
      if (hostIndex !== -1) {
        state.hostAppointments[hostIndex].status = status;
      }
    },
    setAppointmentsHistory: (state, action: PayloadAction<Appointment[]>) => {
      state.appointmentsHistory = action.payload.map((appt) => ({
        ...appt,
        tag: "Sent", // Default tag for appointmentsHistory
      }));
    },
    setHostAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.hostAppointments = action.payload.map((appt) => ({
        ...appt,
        tag: "Received", // Default tag for hostAppointments
      }));
    },
  },
});

export const {
  setAppointment,
  addAppointmentToHistory,
  updateAppointmentStatus,
  setAppointmentsHistory,
  setHostAppointments,
} = appointmentSlice.actions;
export default appointmentSlice.reducer;
