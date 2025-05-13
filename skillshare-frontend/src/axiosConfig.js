// src/axiosConfig.js
import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8081', // Your backend base URL
});

// Request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(response => response, error => {
  if (error.response && error.response.status === 401) {
    // Handle unauthorized errors (e.g., redirect to login)
    localStorage.removeItem('token');
    window.location.href = '/auth';
  }
  return Promise.reject(error);
});

export default api;