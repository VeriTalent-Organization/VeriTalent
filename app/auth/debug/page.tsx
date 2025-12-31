'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Text } from '@/components/reuseables/text';

export const dynamic = 'force-dynamic';

/**
 * OAuth Debug Page
 * 
 * This page helps debug OAuth callback issues by showing all URL parameters
 * and fragments received. Use this to verify what the backend is sending.
 * 
 * Access: /auth/debug
 */
function OAuthDebugContent() {
  const searchParams = useSearchParams();

  // Compute debug info directly during render - no effects needed
  const debugInfo = typeof window !== 'undefined' ? {
    fullUrl: window.location.href,
    origin: window.location.origin,
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    searchParams: Object.fromEntries(searchParams.entries()),
    hashParams: Object.fromEntries(new URLSearchParams(window.location.hash.substring(1)).entries()),
  } : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <Text variant="Heading" as="h1" className="mb-6 text-2xl">
          OAuth Debug Information
        </Text>

        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Text variant="SubText" className="text-sm text-blue-900">
              <strong>How to use:</strong> Have your backend redirect to this page with the OAuth response.
              <br />
              Example: <code className="bg-blue-100 px-2 py-1 rounded">
                {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/debug?token=YOUR_TOKEN
              </code>
            </Text>
          </div>

          {/* Debug Information */}
          {debugInfo && (
            <>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-lg">URL Information</h3>
                <div className="space-y-2 font-mono text-sm">
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-gray-600">Full URL:</span>
                    <span className="break-all text-blue-600">{debugInfo.fullUrl}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-gray-600">Origin:</span>
                    <span className="text-blue-600">{debugInfo.origin}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-gray-600">Pathname:</span>
                    <span className="text-blue-600">{debugInfo.pathname}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-gray-600">Search:</span>
                    <span className="text-blue-600">{debugInfo.search || '(empty)'}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-gray-600">Hash:</span>
                    <span className="text-blue-600">{debugInfo.hash || '(empty)'}</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-lg">Query Parameters (from URL search)</h3>
                {Object.keys(debugInfo.searchParams).length > 0 ? (
                  <div className="space-y-2 font-mono text-sm">
                    {Object.entries(debugInfo.searchParams).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-[200px_1fr] gap-2">
                        <span className="text-gray-600">{key}:</span>
                        <span className="break-all text-green-600">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No query parameters found</p>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-lg">Hash Parameters (from URL fragment)</h3>
                {Object.keys(debugInfo.hashParams).length > 0 ? (
                  <div className="space-y-2 font-mono text-sm">
                    {Object.entries(debugInfo.hashParams).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-[200px_1fr] gap-2">
                        <span className="text-gray-600">{key}:</span>
                        <span className="break-all text-green-600">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No hash parameters found</p>
                )}
              </div>

              {/* Backend Configuration Guide */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-lg text-green-900">Backend Configuration</h3>
                <Text variant="SubText" className="text-sm text-green-900 space-y-2">
                  <p>Your backend should redirect to one of these URLs after OAuth:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>
                      <strong>Google:</strong> <code className="bg-green-100 px-2 py-1 rounded">
                        {debugInfo.origin}/auth/google/callback?token=JWT_TOKEN
                      </code>
                    </li>
                    <li>
                      <strong>LinkedIn:</strong> <code className="bg-green-100 px-2 py-1 rounded">
                        {debugInfo.origin}/auth/linkedin/callback?token=JWT_TOKEN
                      </code>
                    </li>
                    <li>
                      <strong>Microsoft:</strong> <code className="bg-green-100 px-2 py-1 rounded">
                        {debugInfo.origin}/auth/microsoft/callback?token=JWT_TOKEN
                      </code>
                    </li>
                  </ul>
                  <p className="mt-3">
                    <strong>Note:</strong> The token parameter must be in the query string (after ?), 
                    not in the hash fragment (after #).
                  </p>
                </Text>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default function OAuthDebugPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading debug information...</p>
        </div>
      </div>
    }>
      <OAuthDebugContent />
    </Suspense>
  );
}