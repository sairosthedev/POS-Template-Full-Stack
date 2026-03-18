import axios from 'axios';

// Ensure all axios usage across the dashboard includes:
// - baseURL
// - Authorization header from localStorage (if present)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

