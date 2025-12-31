'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/services/authService';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/reuseables/text';

export const dynamic = 'force-dynamic';

/**
 * Google OAuth Callback Handler
 * 
 * This page handles the redirect from the backend after Google OAuth.
 * Expected flow:
 * 1. User clicks "Login with Google"
 * 2. Frontend redirects to backend: /auth/google
 * 3. Backend handles OAuth with Google
 * 4. Backend redirects back to: /auth/google/callback?token=xxx&user=xxx
 * 5. This page extracts token and user data, stores in Zustand, redirects to dashboard
 */
function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract token from multiple possible locations
        let token = searchParams.get('token') || 
                    searchParams.get('access_token') || 
                    searchParams.get('accessToken');
        
        const code = searchParams.get('code');
        const error = searchParams.get('error') || searchParams.get('error_description');

        // Also check URL hash for token (some OAuth flows use hash fragments)
        if (!token && typeof window !== 'undefined') {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          token = hashParams.get('token') || 
                  hashParams.get('access_token') || 
                  hashParams.get('accessToken');
        }

        // Log all parameters for debugging
        console.log('Google OAuth Callback - URL Search Params:', {
          token: token ? '***exists***' : 'missing',
          code: code ? '***exists***' : 'missing',
          allParams: Object.fromEntries(searchParams.entries()),
          hash: window.location.hash,
          fullUrl: window.location.href,
        });

        if (error) {
          setError(decodeURIComponent(error));
          setIsProcessing(false);
          return;
        }

        // If we received a code instead of a token, exchange it with the backend
        if (code && !token) {
          console.log('Received authorization code, exchanging with backend...');
          try {
            // Try multiple approaches to exchange the code
            let response;
            
            // Approach 1: Send code as query parameter (GET request)
            try {
              response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/callback?code=${encodeURIComponent(code)}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              console.log('GET /auth/google/callback response:', response.status, response.statusText);
            } catch {
              console.log('GET request failed, trying POST...');
            }

            // Approach 2: If GET fails, try POST with code in body
            if (!response || !response.ok) {
              response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/callback`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
              });
              console.log('POST /auth/google/callback response:', response.status, response.statusText);
            }

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              console.error('Backend error response:', errorData);
              throw new Error(errorData.message || `Backend returned ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Backend response:', data);

            // Extract token from backend response
            token = data.data?.access_token || data.access_token || data.token || data.data?.token;

            if (!token) {
              console.error('No token in backend response. Full response:', data);
              throw new Error('Backend did not return a token. The backend may not be properly configured for Google OAuth.');
            }
          } catch (err) {
            console.error('Failed to exchange code for token:', err);
            setError(`Failed to complete authentication: ${err instanceof Error ? err.message : 'Unknown error'}. Check console for details.`);
            setIsProcessing(false);
            return;
          }
        }

        if (!token) {
          // More detailed error message for debugging
          const allParams = Array.from(searchParams.entries());
          const hasCode = searchParams.get('code');
          
          let debugInfo = '';
          if (hasCode) {
            debugInfo = 'Received authorization code from Google, but backend failed to exchange it for a token. ';
          } else if (allParams.length > 0) {
            debugInfo = `Received parameters: ${allParams.map(([k]) => k).join(', ')}. `;
          } else {
            debugInfo = 'No URL parameters received. ';
          }
          
          setError(`${debugInfo}Backend configuration issue: The Google OAuth callback URL in your Google Cloud Console should point to the BACKEND (${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/callback), not the frontend. The backend should then redirect to the frontend with a token.`);
          setIsProcessing(false);
          return;
        }

        // Handle the Google authentication callback
        await authService.handleGoogleCallback(token);

        // Redirect to dashboard
        router.replace('/dashboard');
      } catch (err) {
        console.error('Google OAuth callback error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to complete Google authentication. Please try again.';
        setError(errorMessage);
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <Text variant="Heading" as="h2" className="mb-3 text-xl">
              Authentication Failed
            </Text>
            <Text variant="SubText" className="mb-6 text-gray-600">
              {error}
            </Text>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner className="mx-auto mb-4 h-12 w-12 text-brand-primary" />
        <Text variant="Heading" as="h2" className="mb-2 text-xl">
          {isProcessing ? 'Completing Google Sign-In...' : 'Redirecting...'}
        </Text>
        <Text variant="SubText" className="text-gray-600">
          Please wait while we set up your account
        </Text>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner className="mx-auto mb-4 h-12 w-12 text-brand-primary" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}
