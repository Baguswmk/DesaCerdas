import axiosInstance from './api';

export const loginAPI = async ({ email, password }) => {
  const res = await axiosInstance.post('/auth/login', { email, password });
  
  
  if (res.data.success) {
    return { user: res.data.data };
  }
  
  throw new Error(res.data.message || 'Login failed');
};

export const registerAPI = async ({ name, email, password }) => {
  const res = await axiosInstance.post('/auth/register', { name, email, password });
  
  if (res.data.success) {
    return res.data;
  }
  
  throw new Error(res.data.message || 'Register failed');
};


export const getMeAPI = async () => {
  const res = await axiosInstance.get('/auth/me');
  
  if (res.data.success) {
    return { user: res.data.data };
  }
  
  throw new Error('Not authenticated');
};


export const logoutAPI = async () => {
  const res = await axiosInstance.post('/auth/logout');
  return res.data;
};