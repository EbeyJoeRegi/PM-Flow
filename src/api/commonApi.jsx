import BASE_URL from "../config"
import axios from 'axios';
import { logoutUser } from "../redux/userSlice";

export const loginUser = async (usernameOrEmail, password) => {
  try {
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, { usernameOrEmail, password });
    const token = loginResponse.data.token;
    const userResponse = await axios.get(`${BASE_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return {
      token,
      user: userResponse.data
    };
  } catch (error) {
    throw error.response.data || { message: "Login failed" };
  }
};

export const registerUser = async ({ username, email, password, firstName, lastName }) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, {
      username,
      email,
      password,
      firstName,
      lastName
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const handleLogout = async (dispatch, navigate, token) => {
  try {
    await axios.post(`${BASE_URL}/api/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.warn('Logout failed on server. Proceeding with client logout. '+error);
  } finally {
    dispatch(logoutUser()); 
    navigate('/'); 
  }
};