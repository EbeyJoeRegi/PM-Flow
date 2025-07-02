import BASE_URL from "../config"
import axios from 'axios';

export const getManagerProjects = async (managerId, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/projects/manager/${managerId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch manager projects" };
  }
};

export const getManagerProjectByName = async (managerId, projectName, token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/projects/manager/${managerId}/by_name`,
      {
        params: { name: projectName },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Project details fetch failed" };
  }
};