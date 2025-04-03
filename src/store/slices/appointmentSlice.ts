import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Appointment {
  _id?: string;
  date: string;
  time: string;
  requesterEmail: string;
  hostEmail: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  tag?: "Sent" | "Received";
  timeZone?: string;
  createdAt?: string;
  updatedAt?: string;
  meetLink?: string;
}

interface AppointmentState {
  currentAppointment: Appointment;
  appointmentsHistory: Appointment[];
  hostAppointments: Appointment[];
}

const initialState: AppointmentState = {
  currentAppointment: {
    date: "",
    time: "",
    requesterEmail: "",
    hostEmail: "",
    message: "",
    status: "pending",
    tag: undefined,
    meetLink: undefined,
  },
  appointmentsHistory: [],
  hostAppointments: [],
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
        date: action?.payload?.date,
        time: action?.payload?.time,
        requesterEmail: action?.payload?.requesterEmail,
        hostEmail: action?.payload?.hostEmail,
        message: action?.payload?.message,
        status: "pending",
        tag: undefined,
        meetLink: undefined,
      };
    },
    addAppointmentToHistory: (state) => {
      state.appointmentsHistory.push(state?.currentAppointment);
      state.currentAppointment = initialState?.currentAppointment;
    },
    updateAppointmentStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: "pending" | "accepted" | "rejected";
        meetLink?: string;
      }>
    ) => {
      const { id, status, meetLink } = action?.payload;
      const historyIndex = state?.appointmentsHistory?.findIndex(
        (appt) => appt?._id === id
      );
      if (historyIndex !== -1) {
        state.appointmentsHistory[historyIndex].status = status;
        if (meetLink)
          state.appointmentsHistory[historyIndex].meetLink = meetLink;
      }
      const hostIndex = state?.hostAppointments?.findIndex(
        (appt) => appt?._id === id
      );
      if (hostIndex !== -1) {
        state.hostAppointments[hostIndex].status = status;
        if (meetLink) state.hostAppointments[hostIndex].meetLink = meetLink;
      }
    },
    setAppointmentsHistory: (state, action: PayloadAction<Appointment[]>) => {
      state.appointmentsHistory = action?.payload?.map((appt) => ({
        ...appt,
        tag: "Sent",
      }));
    },
    setHostAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.hostAppointments = action?.payload?.map((appt) => ({
        ...appt,
        tag: "Received",
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
