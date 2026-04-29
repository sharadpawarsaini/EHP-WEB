import api from '../services/api';

export const getFullPhotoUrl = (url: string | null | undefined) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  
  const baseURL = api.defaults.baseURL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const base = baseURL.replace('/api', '');
  
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${base}${cleanUrl}`;
};
