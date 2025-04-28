import axios from "axios";
const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Simplified request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.message === 'Network Error') {
      console.error('CORS/Network Error - Check backend connection');
      if (error.config) {
        console.error('Error config:', error.config);
      }
      if (error.response) {
        console.error('Error response:', error.response);
      }
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
