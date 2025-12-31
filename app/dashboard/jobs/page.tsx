'use client';

import React from 'react';
import JobRecommendations from '@/components/Dashboard/jobs/JobRecommendations';
import MyPostedJobs from '@/components/Dashboard/jobs/MyPostedJobs';
import RoleGuard from '@/components/guards/RoleGuard';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';
import { userTypes } from '@/types/user_type';

export default function JobsPage() {
  const { user } = useCreateUserStore();

  // Show MyPostedJobs for recruiters and organizations
  if (user.user_type === userTypes.INDEPENDENT_RECRUITER || user.user_type === userTypes.ORGANISATION) {
    return (
      <RoleGuard allowedRoles={['recruiter', 'org_admin']}>
        <div className="p-6">
          <MyPostedJobs />
        </div>
      </RoleGuard>
    );
  }

  // Show JobRecommendations for talent
  return (
    <RoleGuard allowedRoles={['talent']}>
      <JobRecommendations />
    </RoleGuard>
  );
}
