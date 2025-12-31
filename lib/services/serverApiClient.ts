import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiResponse<T> {
  message: string;
  status: number;
  success: boolean;
  data: T;
}

/**
 * Server-side API client for making authenticated requests
 * Uses cookies for authentication (token should be stored in httpOnly cookie)
 * Falls back gracefully if no token is available
 */
export const serverApiClient = {
  async get<T>(endpoint: string): Promise<ApiResponse<T> | null> {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('auth_token')?.value || cookieStore.get('token')?.value;

      console.log('[serverApiClient] GET request:', {
        endpoint,
        hasToken: !!token,
        url: `${API_BASE_URL}${endpoint}`
      });

      // If no token, return null (user is not authenticated)
      if (!token) {
        console.log('[serverApiClient] No token found, skipping request');
        return null;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store', // Ensure fresh data
      });

      if (!response.ok) {
        console.error('[serverApiClient] Request failed:', {
          status: response.status,
          statusText: response.statusText,
        });
        return null;
      }

      const data = await response.json();
      console.log('[serverApiClient] Response received:', {
        endpoint,
        status: response.status,
        success: data.success
      });

      return data;
    } catch (error) {
      console.error('[serverApiClient] Request error:', error);
      return null;
    }
  },
};

/**
 * Server-side users service
 */
export const serverUsersService = {
  getMe: async () => {
    try {
      return await serverApiClient.get('/users/me');
    } catch (error) {
      console.error('[serverUsersService] Failed to fetch user profile:', error);
      return null;
    }
  },
};
