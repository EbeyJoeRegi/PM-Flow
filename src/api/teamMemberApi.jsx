import axios from 'axios';
import BASE_URL from '../config';

const getAuthHeader = () => {
  const userString = localStorage.getItem('user');
  if (!userString) return {};
  try {
    const user = JSON.parse(userString);
    const token = user.token || '';
    return {
      Authorization: `Bearer ${token}`
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

    const tasksWithManager = response.data.map(task => ({
      ...task,
      managerName: `${task.assigneeFirstName || ''} ${task.assigneeLastName || ''}`.trim()
    }));

    return tasksWithManager;
  } catch (error) {
    console.error(`Failed to fetch tasks for user ${userId}:`, error.response?.status, error.message);
    throw error;
  }
};

export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/tasks/${taskId}/status`,
      null,
      {
        headers: getAuthHeader(),
        params: { status }
      }
    );
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

export const sendPrivateMessage = async (senderId, receiverId, projectId, taskId, content) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/chat/private/sender/${senderId}/receiver/${receiverId}/project/${projectId}/task/${taskId}`,
      { content },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to send private message:', error.response?.status, error.message);
    throw error;
  }
};

export const sendGroupMessage = async (senderId, projectId, content) => {
  const headers = getAuthHeader();
  console.log('🧾 Sending token with request:', headers); // Debug line

  try {
    const response = await axios.post(
      `${BASE_URL}/api/chat/group/sender/${senderId}/project/${projectId}`,
      { content },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to send group message:', error.response?.status, error.message);
    console.log('Response:', error.response);
    throw error;
  }
};


export const getPrivateChatSummary = async (senderId, receiverId, projectId, taskId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/chat/private/sender/${senderId}/receiver/${receiverId}/project/${projectId}/task/${taskId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to get private chat summary:', error.response?.status, error.message);
    throw error;
  }
};

export const getGroupChatSummary = async (projectId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/chat/group/project/${projectId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get group chat summary:', error.response?.status, error.message);
    throw error;
  }
};

export const getAssignedProjects = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/chat/assigned_projects`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch assigned projects:', error.response?.status, error.message);
    throw error;
  }
};
