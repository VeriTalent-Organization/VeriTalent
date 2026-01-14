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
    // Improved error logging: print raw error plus a safe, serializable summary.
    try {
      console.error('[apiClient] Raw error:', error);
    } catch (e) {
      console.error('[apiClient] Raw error (failed to print):', String(error));
    }

    const safeSummary: Record<string, unknown> = {
      url: error?.config?.url ?? null,
      method: error?.config?.method ?? null,
      status: error?.response?.status ?? null,
      statusText: error?.response?.statusText ?? null,
      // Axios may include non-serializable objects; capture common fields safely
      errorData: (() => {
        try {
          return error?.response?.data ?? null;
        } catch (e) {
          return String(error?.response);
        }
      })(),
      message: error?.message ?? null,
      stack: error?.stack ?? null,
    };

    console.error('[apiClient] Request failed (summary):', safeSummary);

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