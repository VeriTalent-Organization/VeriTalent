'use client';

import React, { useState } from 'react';
import { Linkedin, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { cvParsingService, ParsedCVData } from '@/lib/services/cvParsingService';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LinkedInImportProps {
  onImportSuccess?: (data: ParsedCVData) => void;
  onImportError?: (error: string) => void;
  className?: string;
}

export default function LinkedInImport({
  onImportSuccess,
  onImportError,
  className = ''
}: LinkedInImportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'connecting' | 'importing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importedData, setImportedData] = useState<ParsedCVData | null>(null);
  const { user, updateUser } = useCreateUserStore();

  const handleLinkedInImport = async () => {
    setIsImporting(true);
    setImportStatus('connecting');
    setErrorMessage(null);

    try {
      // For profile import, we'll redirect to a special LinkedIn import endpoint
      // This should be different from the authentication endpoint
      const linkedInImportUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://veritalent-server.onrender.com/v1'}/linkedin/import-profile?redirect_uri=${encodeURIComponent(`${window.location.origin}/auth/linkedin/import`)}`;

      // Redirect to LinkedIn import (this will handle OAuth and profile fetching)
      window.location.href = linkedInImportUrl;

    } catch (error: unknown) {
      console.error('LinkedIn import initiation error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to initiate LinkedIn import';
      setErrorMessage(errorMsg);
      setImportStatus('error');
      onImportError?.(errorMsg);
    } finally {
      setIsImporting(false);
    }
  };

  const handleRetry = () => {
    setImportStatus('idle');
    setErrorMessage(null);
    setImportedData(null);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Linkedin className="w-5 h-5 text-blue-600" />
          Import from LinkedIn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Connect your LinkedIn profile to automatically import your professional information,
          work experience, education, and skills.
        </p>

        {importStatus === 'idle' && (
          <div className="space-y-3">
            <Button
              onClick={handleLinkedInImport}
              disabled={isImporting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              {isImporting ? 'Connecting...' : 'Connect LinkedIn & Import Profile'}
            </Button>

            <div className="text-xs text-gray-500 space-y-1">
              <p>• We&apos;ll securely access your public LinkedIn profile</p>
              <p>• No posts or private information will be accessed</p>
              <p>• You can review and edit all imported data</p>
            </div>
          </div>
        )}

        {importStatus === 'connecting' && (
          <div className="flex flex-col items-center gap-3 p-6">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <div className="text-center">
              <p className="font-semibold text-gray-900">Connecting to LinkedIn</p>
              <p className="text-sm text-gray-600">Please complete authentication in the popup window</p>
            </div>
          </div>
        )}

        {importStatus === 'importing' && (
          <div className="flex flex-col items-center gap-3 p-6">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <div className="text-center">
              <p className="font-semibold text-gray-900">Importing Profile Data</p>
              <p className="text-sm text-gray-600">Extracting your professional information...</p>
            </div>
          </div>
        )}

        {importStatus === 'success' && importedData && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="space-y-2">
                <p className="font-semibold">LinkedIn profile imported successfully!</p>
                <div className="text-sm space-y-1">
                  {importedData.personalInfo?.fullName && (
                    <p>• Name: {importedData.personalInfo.fullName}</p>
                  )}
                  {importedData.workExperience && importedData.workExperience.length > 0 && (
                    <p>• {importedData.workExperience.length} work experience{importedData.workExperience.length !== 1 ? 's' : ''}</p>
                  )}
                  {importedData.education && importedData.education.length > 0 && (
                    <p>• {importedData.education.length} education entr{importedData.education.length !== 1 ? 'ies' : 'y'}</p>
                  )}
                  {importedData.skills && importedData.skills.length > 0 && (
                    <p>• {importedData.skills.length} skill{importedData.skills.length !== 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {importStatus === 'error' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-3">
                <p className="font-semibold">Import failed</p>
                <p className="text-sm">{errorMessage}</p>
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {user?.linkedin_connected && importStatus === 'idle' && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">LinkedIn account connected</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}