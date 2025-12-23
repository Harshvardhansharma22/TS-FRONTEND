import axios from 'axios';

const rawBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const base = String(rawBase).replace(/\/$/, '');
const api = axios.create({
  baseURL: `${base}/api`,
});

// Interceptor to add the token to every request if the user is logged in
api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export default api;