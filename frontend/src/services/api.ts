import axios from 'axios';

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return url.endsWith('/api') ? url : `${url}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

// Add a request interceptor to include managed member ID
api.interceptors.request.use((config) => {
  const managedMemberId = localStorage.getItem('managedMemberId');
  if (managedMemberId) {
    config.headers['x-managed-member-id'] = managedMemberId;
  }
  return config;
});

export default api;
