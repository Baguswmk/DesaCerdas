// src/services/legalApi.js
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const fetchThreads = async (token) => {
  const res = await axios.get(`${API}/legal`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createThread = async (title, token) => {
  const res = await axios.post(`${API}/legal`, { title }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const sendMessage = async (threadId, message, token) => {
  const res = await axios.post(`${API}/legal/${threadId}`, { message }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getMessages = async (threadId, token) => {
  const res = await axios.get(`${API}/legal/${threadId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
