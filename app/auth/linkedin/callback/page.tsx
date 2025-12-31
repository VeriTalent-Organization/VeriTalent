'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/services/authService';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/reuseables/text';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';
import { userTypes } from '@/types/user_type';

export const dynamic = 'force-dynamic';

/**
 * LinkedIn OAuth Callback Handler
 * 
 * This page handles the redirect from the backend after LinkedIn OAuth.
 * Expected flow:
 * 1. User clicks "Login with LinkedIn"
 * 2. Frontend redirects to backend: /auth/linkedin
 * 3. Backend handles OAuth with LinkedIn
 * 4. Backend redirects back to: /auth/linkedin/callback?token=xxx
 * 5. This page extracts token and user data, stores in Zustand, redirects to dashboard
 */
function LinkedInCallbackContent() {
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

        // Also check URL hash for token
        if (!token && typeof window !== 'undefined') {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          token = hashParams.get('token') || 
                  hashParams.get('access_token') || 
                  hashParams.get('accessToken');
        }

        console.log('LinkedIn OAuth Callback - URL Search Params:', {
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
            token = await authService.exchangeOAuthCode('linkedin', code);
          } catch (err) {
            console.error('Failed to exchange code for token:', err);
            setError(`Failed to complete authentication: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setIsProcessing(false);
            return;
          }
        }

        if (!token) {
          const allParams = Array.from(searchParams.entries());
          const debugInfo = allParams.length > 0 
            ? `Received parameters: ${allParams.map(([k]) => k).join(', ')}` 
            : 'No URL parameters received';
          
          setError(`No authentication token received from LinkedIn. ${debugInfo}. See console for details.`);
          setIsProcessing(false);
          return;
        }

        // Handle the LinkedIn authentication callback (reuse Google handler as it's the same process)
        await authService.handleGoogleCallback(token);

        // Redirect to role-specific dashboard
        const { user } = useCreateUserStore.getState();
        const dashboardRoute = user.user_type === userTypes.TALENT ? '/dashboard/ai-card' : '/dashboard';
        router.replace(dashboardRoute);
      } catch (err) {
        console.error('LinkedIn OAuth callback error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to complete LinkedIn authentication. Please try again.';
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
          {isProcessing ? 'Completing LinkedIn Sign-In...' : 'Redirecting...'}
        </Text>
        <Text variant="SubText" className="text-gray-600">
          Please wait while we set up your account
        </Text>
      </div>
    </div>
  );
}

export default function LinkedInCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner className="mx-auto mb-4 h-12 w-12 text-brand-primary" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LinkedInCallbackContent />
    </Suspense>
  );
}