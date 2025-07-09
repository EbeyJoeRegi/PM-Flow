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
        params: { name: projectName,
          detailed: true
         },
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

export const getTeamMembersByProjectId = async (managerId, projectId, token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/projects/manager/${managerId}/team_members/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch team members' };
  }
};

export const updateProjectStatusAndEndDate = async (managerId, projectId, status, endDate, token) => {
  const dateObj = new Date(endDate);
  const pad = (n) => (n < 10 ? '0' + n : n); // ensures 2-digit format
  const formattedDate = `${pad(dateObj.getMonth() + 1)}/${pad(dateObj.getDate())}/${dateObj.getFullYear()}`; 

  try {
    const response = await axios.put(
      `${BASE_URL}/api/projects/manager/${managerId}/update_status_enddate/${projectId}`,
      {},
      {
        params: {
          status: status,
          endDate: formattedDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update project info' };
  }
};

export const fetchPrivateMessages = async (senderId, receiverId, projectId, taskId, token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/chat/private/sender/${senderId}/receiver/${receiverId}/project/${projectId}/task/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error fetching private messages:', error);
    throw error;
  }
};

export const sendPrivateMessage = async (senderId, receiverId, projectId, taskId, content, token) => {
  try {
    await axios.post(
      `${BASE_URL}/api/chat/private/sender/${senderId}/receiver/${receiverId}/project/${projectId}/task/${taskId}`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};