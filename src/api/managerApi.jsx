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

export const getTasksByProjectId = async (projectId, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/tasks/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch tasks" };
  }
};

export const createTask = async (taskData, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/tasks`, 
            {
        ...taskData,
        dueDate: `${taskData.dueDate}T00:00:00`, 
      },
      {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create task' };
  }
};

export const getTaskById = async (taskId,token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/tasks/${taskId}`, {
       headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch task details' };
  }
};

export const updateTaskById = async (taskID, TaskData, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/tasks/${taskID}`,
      {
        ...TaskData,
        dueDate: `${TaskData.dueDate}T00:00:00`, 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update task';
  }
};