import React from 'react';
import { notFound } from 'next/navigation';
import PublicVeriTalentCard from '@/components/PublicVeriTalentCard';

interface PublicAICardPageProps {
  params: {
    shareToken: string;
  };
}

export default function PublicAICardPage({ params }: PublicAICardPageProps) {
  // In a real implementation, you would validate the share token here
  // For now, we'll just render a public version of the card

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">VeriTalent AI Card</h1>
          <p className="text-gray-600">Shared publicly for recruitment purposes</p>
        </div>

        <PublicVeriTalentCard shareToken={params.shareToken} />
      </div>
    </div>
  );
}