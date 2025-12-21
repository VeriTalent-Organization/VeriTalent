'use client';

import React, { useState } from 'react';
import TabNavigation from '@/components/molecules/TabNavigation';
import PostJobTab from '@/components/molecules/PostJob';
import CVUploadTab from '@/components/molecules/CvUpload';
import VeritalentAITab from '@/components/molecules/VeritalentAI';

export default function CreateJobPage() {
  const [activeTab, setActiveTab] = useState("post-job");

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === "post-job" && <PostJobTab />}
        {activeTab === "cv-upload" && <CVUploadTab />}
        {activeTab === "veritilent-ai" && <VeritalentAITab />}
      </div>
    </div>
  );
}