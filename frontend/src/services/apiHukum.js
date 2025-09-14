import axiosInstance from './api';

// ========== GUEST API FUNCTIONS ==========
export const askGuestQuestion = async (question) => {
  const res = await axiosInstance.post('/legal/guest/ask', { question });
  return res.data;
};

export const getGuestUsage = async () => {
  const res = await axiosInstance.get('/legal/guest/usage');
  return res.data;
};

// ========== AUTHENTICATED USER API FUNCTIONS ==========
export const fetchThreads = async () => {
  const res = await axiosInstance.get('/legal');
  return res.data;
};

export const createThread = async (title) => {
  const res = await axiosInstance.post('/legal', { title });
  return res.data;
};

export const sendMessage = async (threadId, message) => {
  const res = await axiosInstance.post(`/legal/${threadId}/messages`, { message });
  return res.data;
};

export const getMessages = async (threadId) => {
  const res = await axiosInstance.get(`/legal/${threadId}/messages`);
  return res.data;
};

export const getThreadHistory = async () => {
  const res = await axiosInstance.get('/legal/history');
  return res.data;
};

export const updateThreadTitle = async (id, newTitle) => {
  const res = await axiosInstance.patch(`/legal/${id}`, { title: newTitle });
  return res.data;
};

export const deleteThread = async (id) => {
  const res = await axiosInstance.delete(`/legal/${id}`);
  return res.data;
};

export const getTodayQuestionCount = async () => {
  const res = await axiosInstance.get('/legal/daily-limit');
  return res.data;
};