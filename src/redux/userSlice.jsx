import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  name: '',
  role: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      const { id, name, role } = action.payload;
      state.id = id;
      state.name = name;
      state.role = role;
    },
    clearUser(state) {
      state.id = null;
      state.name = '';
      state.role = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
