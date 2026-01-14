'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cvParsingService, ParsedCVData } from '@/lib/services/cvParsingService';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function LinkedInImportCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUser } = useCreateUserStore();

  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [parsedData, setParsedData] = useState<ParsedCVData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleImportCallback = async () => {
      try {
        const success = searchParams.get('success');
        const error = searchParams.get('error');
        const profileData = searchParams.get('data');

        if (error) {
          setStatus('error');
          setError(decodeURIComponent(error));
          return;
        }

        if (success === 'true' && profileData) {
          // Parse the profile data from the URL parameter
          const data: ParsedCVData = JSON.parse(decodeURIComponent(profileData));

          setParsedData(data);
          setStatus('success');

          // Update user store with imported data
          updateUser({
            linkedin_connected: true,
            parsed_cv_data: data,
            cv_parsed: true,
            cv_source: 'linkedin'
          });

        } else {
          setStatus('error');
          setError('Invalid response from LinkedIn import');
        }

      } catch (error) {
        console.error('LinkedIn import callback error:', error);
        setStatus('error');
        setError('Failed to process LinkedIn profile data');
      }
    };

    handleImportCallback();
  }, [searchParams, updateUser]);

  const handleContinue = () => {
    // Redirect back to the CV parsing step or dashboard
    router.push('/dashboard/ai-card');
  };

  const handleRetry = () => {
    router.push('/dashboard/ai-card');
  };

  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Importing LinkedIn Profile
              </h2>
              <p className="text-gray-600">
                Please wait while we extract and process your professional information...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success' && parsedData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-6 h-6" />
              LinkedIn Profile Imported Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Imported Information:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {parsedData.personalInfo?.fullName && (
                  <div>
                    <span className="font-medium">Name:</span> {parsedData.personalInfo.fullName}
                  </div>
                )}
                {parsedData.personalInfo?.email && (
                  <div>
                    <span className="font-medium">Email:</span> {parsedData.personalInfo.email}
                  </div>
                )}
                {parsedData.workExperience && parsedData.workExperience.length > 0 && (
                  <div>
                    <span className="font-medium">Experience:</span> {parsedData.workExperience.length} position{parsedData.workExperience.length !== 1 ? 's' : ''}
                  </div>
                )}
                {parsedData.education && parsedData.education.length > 0 && (
                  <div>
                    <span className="font-medium">Education:</span> {parsedData.education.length} degree{parsedData.education.length !== 1 ? 's' : ''}
                  </div>
                )}
                {parsedData.skills && parsedData.skills.length > 0 && (
                  <div>
                    <span className="font-medium">Skills:</span> {parsedData.skills.length} skill{parsedData.skills.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Your LinkedIn profile has been successfully imported and processed.
                You can now review and edit this information in your AI Card.
              </p>
              <Button onClick={handleContinue} className="bg-blue-600 hover:bg-blue-700">
                Continue to AI Card
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-6 h-6" />
              Import Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                {error || 'There was an error importing your LinkedIn profile. Please try again.'}
              </p>
              <div className="space-y-2">
                <Button onClick={handleRetry} variant="outline" className="w-full">
                  Try Again
                </Button>
                <Button onClick={handleContinue} className="w-full">
                  Continue to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

export default function LinkedInImportCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <LinkedInImportCallbackContent />
    </Suspense>
  );
}