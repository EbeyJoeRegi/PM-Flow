import { createSlice } from '@reduxjs/toolkit';

const savedUser = localStorage.getItem("user");

const initialState = savedUser
  ? JSON.parse(savedUser)
  : {
      id: null,
      name: "",
      role: "",
      token: ""
    };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
    const newUser = { ...action.payload };
      localStorage.setItem("user", JSON.stringify(newUser)); 
      return newUser;
    },
    logoutUser: () => {
      localStorage.removeItem("user");
      return { id: null, name: "", role: "", token: "" };
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;

