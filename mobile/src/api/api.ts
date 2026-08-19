import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ─── Change this to your deployed backend URL ─────────────────────────────────
const BASE_URL = 'https://ehp-web.onrender.com/api';
// For local dev: const BASE_URL = 'http://192.168.x.x:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // React Native uses token auth, not cookies
  timeout: 15000,
});

// Request interceptor: attach JWT token from SecureStore
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    const managedMemberId = await SecureStore.getItemAsync('managedMemberId');
    if (managedMemberId) {
      config.headers['x-managed-member-id'] = managedMemberId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 503 maintenance
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 503 && error.response.data?.isMaintenance) {
      // Could navigate to a lockdown screen here
      console.warn('System is in maintenance/lockdown mode.');
    }
    return Promise.reject(error);
  }
);

export default api;
