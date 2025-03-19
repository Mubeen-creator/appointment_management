// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import availabilityReducer from "./slices/availabilitySlice";
import appointmentReducer from "./slices/appointmentSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    availability: availabilityReducer,
    appointment: appointmentReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
