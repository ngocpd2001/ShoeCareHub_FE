// axiosInstance.js
import axios from 'axios';
import { checkAndRefreshToken } from '../services/authService';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(async (config) => {
  const token = await checkAndRefreshToken();
  localStorage.setItem('token', token);
  // config.headers['Authorization'] = `Bearer ${token}`;
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
