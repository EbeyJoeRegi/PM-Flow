import BASE_URL from "../config"
import axios from 'axios';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data || { message: "Login failed" };
  }
};
