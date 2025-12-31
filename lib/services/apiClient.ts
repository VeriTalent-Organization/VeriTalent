import axios from 'axios';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — safely get token
apiClient.interceptors.request.use(
  (config) => {
    const user = useCreateUserStore.getState().user;
    const token = user?.token; // ← safe optional chaining

    console.log('[apiClient] Request interceptor:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (logout)
apiClient.interceptors.response.use(
  (response) => {
    console.log('[apiClient] Response received:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('[apiClient] Request failed:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      errorData: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      // Clear the user (logout)
      useCreateUserStore.getState().logout?.(); // ← use logout() if you have it
      // OR if you don't have logout(), use setUser(null)
      // useCreateUserStore.getState().setUser(null);

      // Optional: redirect to home/login
      if (typeof window !== 'undefined') {
        window.location.href = '/'; // or '/login'
      }
    }
    return Promise.reject(error);
  }
);