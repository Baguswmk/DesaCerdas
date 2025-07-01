import axiosInstance from './api';

export const loginAPI = async ({ email, password }) => {
  const res = await axiosInstance.post('/auth/login', { email, password }, { skipAuth: true });
  return res.data;
};

export const registerAPI = async ({ name, email, password }) => {
  const res = await axiosInstance.post('/auth/register', { name, email, password }, { skipAuth: true });
  return res.data;
};
