import axios from 'axios';
import BASE_URL from '../config';

const getAuthHeader = () => {
  const userString = localStorage.getItem('user');
  if (!userString) return {};
  try {
    const user = JSON.parse(userString);
    return {
      Authorization: `Bearer ${user.token || ''}`
    };
  } catch {
    return {};
  }
};
export const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/tasks`, taskData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create task:', error.response?.status, error.message);
    throw error;
  }
};

export const getTasksByUserId = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/tasks/user/${userId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch tasks for user ${userId}:`, error.response?.status, error.message);
    throw error;
  }
};

export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/tasks/${taskId}/status`, null, {
      headers: getAuthHeader(),
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update status for task ${taskId}:`, error.response?.status, error.message);
    throw error;
  }
};

export const getTaskDetailsById = async (taskId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/tasks/${taskId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to get task ${taskId}:`, error.response?.status, error.message);
    throw error;
  }
};