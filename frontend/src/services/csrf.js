import axiosInstance from './api';

export const fetchCsrfToken = async () => {
  try {
    const res = await axiosInstance.get('/csrf-token', { skipAuth: true });
    const token = res.data.csrfToken;
    localStorage.setItem('csrfToken', token);
    return token;
  } catch (err) {
    console.error('Gagal mengambil CSRF token', err);
    return null;
  }
};
