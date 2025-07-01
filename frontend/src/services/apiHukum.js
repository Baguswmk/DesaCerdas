import axiosInstance from './api';

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
  console.log("Response from sendMessage:", res.data);
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
  const res = await axiosInstance.patch(`/legal/thread/${id}`, { title: newTitle });
  return res.data;
};

export const deleteThread = async (id) => {
  const res = await axiosInstance.delete(`/legal/thread/${id}`);
  return res.data;
};
