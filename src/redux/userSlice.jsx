import { createSlice } from '@reduxjs/toolkit';

const savedUser = localStorage.getItem("user");

const initialState = savedUser
  ? JSON.parse(savedUser)
  : {
      id: null,
      name: "",
      role: "",
    };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...action.payload };
    },
    logoutUser: () => {
      localStorage.removeItem("user");
      return { id: null, name: "", role: "" };
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;

