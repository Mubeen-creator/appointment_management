// store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  email: string;
  fullName: string;
  userName: string;
  password: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  email: "",
  fullName: "",
  userName: "",
  password: "",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        email: string;
        fullName: string;
        userName: string;
        password: string;
      }>
    ) => {
      state.email = action.payload.email;
      state.fullName = action.payload.fullName;
      state.userName = action.payload.userName;
      state.password = action.payload.password;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.email = "";
      state.fullName = "";
      state.userName = "";
      state.password = "";
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
