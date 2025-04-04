import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  email: string;
  fullName: string;
  userName: string;
  password: string;
  isAuthenticated: boolean;
  welcomeMessage?: string;
  profilePicture?: string | null;
}

const initialState: UserState = {
  email: "",
  fullName: "",
  userName: "",
  password: "",
  isAuthenticated: false,
  welcomeMessage: "",
  profilePicture: null,
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
        welcomeMessage?: string;
        profilePicture?: string | null;
      }>
    ) => {
      state.email = action?.payload?.email;
      state.fullName = action?.payload?.fullName;
      state.userName = action?.payload?.userName;
      state.password = action?.payload?.password;
      state.isAuthenticated = true;
      state.welcomeMessage = action?.payload?.welcomeMessage;
      state.profilePicture = action?.payload?.profilePicture || null;
    },
    logout: (state) => {
      state.email = "";
      state.fullName = "";
      state.userName = "";
      state.password = "";
      state.isAuthenticated = false;
      state.welcomeMessage = "";
      state.profilePicture = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
