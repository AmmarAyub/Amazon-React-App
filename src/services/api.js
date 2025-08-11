// src/services/api.js
import axios from 'axios';
import authService from './authService';

const api = axios.create({
  baseURL: 'https://localhost:7224/api/'
});

api.interceptors.request.use(config => {
  const user = authService.getCurrentUser();
  
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;