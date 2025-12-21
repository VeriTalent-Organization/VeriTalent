import React from 'react';
import { RepositoryType } from '@/types/dashboard';
import WorkReferenceModal from '@/components/Dashboard/career-repo/work-reference-modal';
import MembershipReferenceModal from '@/components/Dashboard/career-repo/membership-reference-modal';
import CertificateVerificationModal from '@/components/Dashboard/career-repo/certificate-verification modal';
import CertificateModal from '@/components/Dashboard/career-repo/certificate-modal';
import WorkHistoryModal from '@/components/Dashboard/career-repo/work-history';
import RecommendationModal from '@/components/Dashboard/career-repo/recommendation-modal';

interface ModalManagerProps {
  activeModal: RepositoryType | null;
  onClose: () => void;
}

export default function ModalManager({ activeModal, onClose }: ModalManagerProps) {
  if (!activeModal) return null;

  return (
    <>
      {activeModal === "Work Reference" && (
        <WorkReferenceModal onClose={onClose} />
      )}
      {activeModal === "Membership Reference" && (
        <MembershipReferenceModal onClose={onClose} />
      )}
      {activeModal === "Certificate Verification" && (
        <CertificateVerificationModal onClose={onClose} />
      )}
      {activeModal === "Certificate" && (
        <CertificateModal onClose={onClose} />
      )}
      {activeModal === "Work History" && (
        <WorkHistoryModal onClose={onClose} />
      )}
      {activeModal === "Recommendation" && (
        <RecommendationModal onClose={onClose} />
      )}
    </>
  );
}