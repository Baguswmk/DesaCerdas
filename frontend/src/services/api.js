import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const csrf = localStorage.getItem("csrfToken");
    
    if (csrf) {
      config.headers["x-csrf-token"] = csrf; 
    }

    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data);
    
    
    if (error.response?.status === 401) {
      localStorage.removeItem("csrfToken");
      if (!window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
    }
    
    
    if (error.response?.status === 403 && 
        error.response?.data?.code === 'INVALID_CSRF_TOKEN') {
      console.log('🔄 CSRF token invalid, refreshing...');
      
      localStorage.removeItem("csrfToken");
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;