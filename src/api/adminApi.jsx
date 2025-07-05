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

export const getAllProjects = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/projects/all`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get projects:', error.response?.status, error.message);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/projects/create`, projectData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create project:', error.response?.status, error.message);
    throw error;
  }
};

export const updateProjectById = async (id, updatedFields) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/projects/${id}`, updatedFields, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update project:', error.response?.status, error.message);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/users`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get users:', error.response?.status, error.message);
    throw error;
  }
};

export const getProjectById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/projects/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to get project ${id}:`, error.response?.status, error.message);
    throw error;
  }
};

export const deleteProjectById = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/projects/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to delete project ${id}:`, error.response?.status, error.message);
    throw error;
  }
};

export const updateUserByAdmin = async (id, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/users/admin/${id}`, updatedData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update user ${id}:`, error.response?.status, error.message);
    throw error;
  }
};
