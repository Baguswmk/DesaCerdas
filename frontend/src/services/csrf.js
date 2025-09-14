import axiosInstance from './api';

export const fetchCsrfToken = async () => {
  try {
    const res = await axiosInstance.get('/csrf-token');
    const token = res.data.csrfToken;
    
    if (token) {
      localStorage.setItem('csrfToken', token);
    }
    
    return token;
  } catch (err) {
    console.error('❌ Failed to fetch CSRF token:', err);
    return null;
  }
};
