import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string | null;
  accessToken: string | null;
  id: string | null;
  roles: number[] | null;
}

const initialState: UserState = {
  email: "",
  accessToken: "",
  id: "",
  roles: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredential: (state, { payload }) => {
      state.accessToken = payload.access_token;
      state.email = payload.email;
      state.id = payload.user_id;
      state.roles = payload.roles;
    },
    logout: (state) => {
      state.accessToken = null;
      state.email = null;
      state.id = null;
    },
  },
});

export const { setCredential, logout } = authSlice.actions;
export default authSlice.reducer;
