"use client";
import { useState, useEffect } from "react";
import { useCreateUserStore } from "@/lib/stores/form_submission_store";
import { userTypes } from "@/types/user_type";
import TalentProfile from '@/components/Dashboard/profile/TalentProfile';
import RecruiterProfile from '@/components/Dashboard/profile/RecruiterProfile';
import OrganizationProfile from '@/components/Dashboard/profile/OrganizationProfile';

const ProfilePage = () => {
  const { user } = useCreateUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate profile load
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Route to appropriate profile based on user type
  switch (user?.user_type) {
    case userTypes.TALENT:
      return <TalentProfile />;
    case userTypes.INDEPENDENT_RECRUITER:
      return <RecruiterProfile />;
    case userTypes.ORGANISATION:
      return <OrganizationProfile />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="text-center">
            <p className="text-gray-600">Unknown user type</p>
          </div>
        </div>
      );
  }
};

export default ProfilePage;