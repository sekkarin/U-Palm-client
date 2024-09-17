import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  email: string | null;
  accessToken: string | null;
  id: string | null;
  roles: number[] | null;
  photo: string | null;
}

const initialState: UserState = {
  email: "",
  accessToken: "",
  id: "",
  roles: [],
  photo: "",
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
      state.photo = payload.photo;
    },
    logout: (state) => {
      state.accessToken = null;
      state.email = null;
      state.id = null;
      state.roles = null;
      state.photo = null;
    },
  },
});

export const { setCredential, logout } = authSlice.actions;
export default authSlice.reducer;
