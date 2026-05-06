import axios from 'axios';

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return url.endsWith('/api') ? url : `${url}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

// Add a request interceptor to include managed member ID and Auth token
api.interceptors.request.use((config) => {
  const managedMemberId = localStorage.getItem('managedMemberId');
  if (managedMemberId) {
    config.headers['x-managed-member-id'] = managedMemberId;
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});

// Add a response interceptor to handle 503 maintenance mode
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 503 && error.response.data?.isMaintenance) {
      const is_admin = localStorage.getItem('role') === 'admin';
      const is_admin_route = window.location.pathname.startsWith('/admin');
      
      // If system is in lockdown, redirect non-admins to lockdown page
      if (!is_admin && !is_admin_route && window.location.pathname !== '/lockdown') {
        window.location.href = '/lockdown';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
