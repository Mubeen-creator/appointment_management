// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
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

// Custom hooks for dispatch and selector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
