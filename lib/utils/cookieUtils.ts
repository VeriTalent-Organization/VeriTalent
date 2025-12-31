"use client";

/**
 * Cookie utilities for managing authentication token
 * These functions work on the client side to sync token between localStorage and cookies
 */

/**
 * Sets the auth token in a cookie
 * This allows server-side layouts to access the token
 */
export function setAuthTokenCookie(token: string, maxAge: number = 30 * 24 * 60 * 60) {
  // Set cookie with SameSite=Lax for security
  document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
  console.log('[cookieUtils] Auth token cookie set');
}

/**
 * Gets the auth token from cookie
 */
export function getAuthTokenCookie(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      return value;
    }
  }
  return null;
}

/**
 * Removes the auth token cookie
 */
export function removeAuthTokenCookie() {
  document.cookie = 'auth_token=; path=/; max-age=0';
  console.log('[cookieUtils] Auth token cookie removed');
}

/**
 * Syncs token from localStorage to cookie
 * Call this after login/registration
 */
export function syncTokenToCookie(token: string) {
  if (typeof window !== 'undefined') {
    setAuthTokenCookie(token);
  }
}

/**
 * Clears token from both localStorage and cookie
 * Call this on logout
 */
export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    removeAuthTokenCookie();
    // Also clear from localStorage if using Zustand persist
    localStorage.removeItem('veritalent-user-storage');
  }
}
