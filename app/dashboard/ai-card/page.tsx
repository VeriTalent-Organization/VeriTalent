"use client";
import { VeriTalentCard } from '@/components/molecules/VeritalentCard';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';
import RoleGuard from '@/components/guards/RoleGuard';

const AICardPage = () => {
  const { user } = useCreateUserStore();

  return (
    <RoleGuard allowedRoles={['talent']}>
      <VeriTalentCard
        userType={user.user_type}
        isVerified={true} // You can implement verification logic here
      />
    </RoleGuard>
  );
};

export default AICardPage;