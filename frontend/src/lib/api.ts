import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import { getAuthStorage } from './storage';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true,
});

// Interceptor de request: agrega el token a cada request automáticamente
api.interceptors.request.use(
  (config) => {
    const auth = getAuthStorage();
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
      console.log('Token añadido a headers:', auth.token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response: si el token expiró o no es válido, redirige a login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const store = useAuthStore.getState();
      store.clearAuth();
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export default api;
