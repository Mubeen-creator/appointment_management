import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AvailabilityState {
  startTime: string;
  endTime: string;
  availableDays: string[];
}

const initialState: AvailabilityState = {
  startTime: "",
  endTime: "",
  availableDays: [],
};

const availabilitySlice = createSlice({
  name: "availability",
  initialState,
  reducers: {
    setAvailability: (
      state,
      action: PayloadAction<{
        startTime: string;
        endTime: string;
        availableDays: string[];
      }>
    ) => {
      state.startTime = action?.payload?.startTime;
      state.endTime = action?.payload?.endTime;
      state.availableDays = action?.payload?.availableDays;
    },
  },
});

export const { setAvailability } = availabilitySlice.actions;
export default availabilitySlice.reducer;
