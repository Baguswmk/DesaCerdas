import axiosInstance from './api';

export const fetchCsrfToken = async () => {
  try {
    console.log('🔑 Fetching CSRF token...');
    const res = await axiosInstance.get('/csrf-token');
    const token = res.data.csrfToken;
    
    if (token) {
      localStorage.setItem('csrfToken', token);
      console.log('✅ CSRF token saved');
    }
    
    return token;
  } catch (err) {
    console.error('❌ Failed to fetch CSRF token:', err);
    return null;
  }
};
