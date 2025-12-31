'use client';

import { useState } from 'react';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';
import { userTypes } from '@/types/user_type';
import { X } from 'lucide-react';
import { Text } from '@/components/reuseables/text';
import EmployerProfileStep from '@/components/layout/onboarding/employer_from_step';
import OrganizationRegistrationFormStep from '@/components/layout/onboarding/orginisation_registration_form';
import OrganizationDetailsFormStep from '@/components/layout/onboarding/organisation_registration_form2';
import { authService } from '@/lib/services/authService';
import { usersService } from '@/lib/services/usersService';
import { organizationsService } from '@/lib/services/organizationsService';
import { useRouter } from 'next/navigation';

interface RoleSwitchOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: 'talent' | 'recruiter' | 'org_admin';
  onComplete: () => void;
}

export default function RoleSwitchOnboardingModal({
  isOpen,
  onClose,
  targetRole,
  onComplete,
}: RoleSwitchOnboardingModalProps) {
  const { user, updateUser } = useCreateUserStore();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Determine what steps are needed based on target role
  const getStepsForRole = () => {
    switch (targetRole) {
      case 'recruiter':
        return [EmployerProfileStep]; // Just employer profile
      case 'org_admin':
        return [OrganizationRegistrationFormStep, OrganizationDetailsFormStep]; // Two org forms
      case 'talent':
      default:
        return []; // No additional steps for talent
    }
  };

  const steps = getStepsForRole();
  const CurrentStepComponent = steps[currentStep];

  const handleNext = async () => {
    const isFinalStep = currentStep === steps.length - 1;

    if (isFinalStep) {
      // Complete the role switch with sequential API calls
      setIsSubmitting(true);
      setError(null);

      try {
        // Set flag to prevent dashboard redirect during role switch
        updateUser({ is_switching_role: true });

        // STEP 1: Add role to user's roles array
        console.log(`[RoleSwitch] Step 1: Adding role "${targetRole}" via /users/role/add`);
        await usersService.addRole({ role: targetRole });
        console.log('[RoleSwitch] ✓ Step 1 complete: Role added successfully');

        // STEP 2: Switch to the new role (get new access token with updated roles)
        console.log(`[RoleSwitch] Step 2: Switching to role "${targetRole}" via /auth/switch-role`);
        const switchResponse = await authService.switchRole({ role: targetRole });
        console.log('[RoleSwitch] ✓ Step 2 complete: Role switched');
        
        const newAccessToken = switchResponse?.token || switchResponse?.access_token;
        if (!newAccessToken) {
          throw new Error('No access token returned from /auth/switch-role');
        }
        console.log('[RoleSwitch] ✓ New access token received');

        // Update token in store immediately so next API call uses it
        const currentUser = useCreateUserStore.getState().user;
        updateUser({ 
          ...currentUser,
          token: newAccessToken,
          is_switching_role: true // Keep flag set
        });
        console.log('[RoleSwitch] ✓ Token updated in store for subsequent API calls');

        // STEP 3: Create profile or organization using the NEW token
        console.log(`[RoleSwitch] Step 3: Creating profile/organization for "${targetRole}" with new token`);
        if (targetRole === 'recruiter') {
          await usersService.updateRecruiterProfile({
            professionalDesignation: user?.current_designation,
            recruiterOrganizationName: user?.organisation_name,
            professionalStatus: user?.professional_status || 'Recruiter',
          });
          console.log('[RoleSwitch] ✓ Step 3 complete: Recruiter profile created');
        } else if (targetRole === 'org_admin') {
          if (!user?.organization_name || !user?.organisation_rc_number || !user?.organization_domain) {
            throw new Error('Missing required organization fields');
          }
          
          // Debug: Log what's in the store
          console.log('[RoleSwitch] User store data:', {
            organization_name: user.organization_name,
            organisation_rc_number: user.organisation_rc_number,
            organization_domain: user.organization_domain,
            organization_linkedin_page: user.organization_linkedin_page,
            organisation_industry: user.organisation_industry,
            organisation_location: user.organisation_location,
            organisation_size: user.organisation_size,
          });
          
          const orgPayload = {
            name: user.organization_name,
            domain: user.organization_domain,
            linkedinPage: user.organization_linkedin_page || '',
            industry: user.organisation_industry || '',
            location: user.organisation_location || '',
            website: user.organization_linkedin_page || '',
            size: user.organisation_size || '',
            rcNumber: user.organisation_rc_number,
          };
          
          console.log('[RoleSwitch] Organization creation payload:', orgPayload);
          
          await organizationsService.create(orgPayload);
          console.log('[RoleSwitch] ✓ Step 3 complete: Organization created');
        } else if (targetRole === 'talent') {
          console.log('[RoleSwitch] ✓ Step 3 skipped: Talent role needs no profile creation');
        }

        // Final store update with all role information
        const user_type =
          targetRole === 'recruiter' ? userTypes.INDEPENDENT_RECRUITER :
          targetRole === 'talent' ? userTypes.TALENT : userTypes.ORGANISATION;

        const currentRoles = user?.roles || [];
        const updatedRoles = currentRoles.includes(targetRole) ? currentRoles : [...currentRoles, targetRole];

        const finalUser = useCreateUserStore.getState().user;
        updateUser({ 
          ...finalUser,
          user_type,
          active_role: targetRole,
          roles: updatedRoles as ('talent' | 'recruiter' | 'org_admin')[],
          token: newAccessToken, // Ensure new token is set
          is_switching_role: false
        });
        
        console.log('[RoleSwitch] ✓✓✓ All steps complete! Token: ✓, Role: ✓, Profile: ✓');
        
        setIsSubmitting(false);
        onComplete();
        onClose();
        
        // Redirect to appropriate landing page for the new role
        if (targetRole === 'talent') {
          router.push('/dashboard/ai-card');
        } else {
          router.push('/dashboard');
        }
      } catch (err: any) {
        console.error('[RoleSwitch] Error during role switch:', err);
        console.error('[RoleSwitch] Error details:', {
          status: err?.response?.status,
          message: err?.response?.data?.message,
          fullError: err
        });
        
        // Clear the role switch flag on error
        updateUser({ is_switching_role: false });
        
        const errorResponse = err?.response?.data;
        const errorMessage = errorResponse?.message || err?.message || 'Failed to switch role. Please try again.';
        const statusCode = err?.response?.status;
        
        setError(`${errorMessage}${statusCode ? ` (${statusCode})` : ''}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getRoleLabel = () => {
    switch (targetRole) {
      case 'recruiter':
        return 'Independent Recruiter';
      case 'org_admin':
        return 'Company Administrator';
      case 'talent':
        return 'Talent';
      default:
        return 'Unknown Role';
    }
  };

  // If switching to talent (no steps needed), complete immediately
  if (steps.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
          <div className="flex justify-between items-center mb-4">
            <Text variant="Heading" as="h2" className="text-xl">
              Switch to {getRoleLabel()}
            </Text>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <Text variant="SubText" className="mb-6 text-gray-600">
            No additional information needed. Ready to switch?
          </Text>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsSubmitting(true);
                setError(null);
                try {
                  // Step 1: Add the role
                  console.log(`[RoleSwitch] Adding role ${targetRole} to user`);
                  try {
                    await usersService.addRole({ role: targetRole });
                    console.log('[RoleSwitch] Role added successfully');
                  } catch (addRoleErr: any) {
                    const status = addRoleErr?.response?.status;
                    const message = addRoleErr?.response?.data?.message;
                    
                    // If role already exists, continue
                    if (status === 409 || message?.toLowerCase().includes('already')) {
                      console.warn('[RoleSwitch] Role already exists, continuing...');
                    } else {
                      console.error('[RoleSwitch] Failed to add role, will attempt to continue:', message);
                    }
                  }
                  
                  // Step 2: Switch to the new role
                  console.log(`[RoleSwitch] Switching to role ${targetRole}`);
                  const switchResponse = await authService.switchRole({ role: targetRole });
                  console.log('[RoleSwitch] Role switch successful');
                  
                  // Extract new token from response
                  const newToken = switchResponse?.token || switchResponse?.access_token;
                  if (newToken) {
                    console.log('[RoleSwitch] New token received, updating store');
                  }
                  
                  // Update store
                  const currentRoles = user?.roles || [];
                  const updatedRoles = currentRoles.includes(targetRole)
                    ? currentRoles
                    : [...currentRoles, targetRole];
                  
                  updateUser({ 
                    user_type: userTypes.TALENT,
                    active_role: 'talent',
                    roles: updatedRoles as ('talent' | 'recruiter' | 'org_admin')[],
                    token: newToken || user?.token // Use new token if available
                  });
                  
                  console.log('[RoleSwitch] Store updated, current token:', newToken ? 'New token set' : 'Old token kept');
                  
                  // Wait to ensure Zustand persist completes
                  await new Promise(resolve => setTimeout(resolve, 300));
                  
                  // Verify token is in localStorage
                  const storedData = localStorage.getItem('veritalent-user-storage');
                  console.log('[RoleSwitch] LocalStorage has data:', !!storedData);
                  
                  onComplete();
                  onClose();
                  
                  // Redirect to appropriate landing page
                  router.push('/dashboard/ai-card');
                } catch (err: any) {
                  const errorResponse = err?.response?.data;
                  const errorMessage = errorResponse?.message || err?.message || 'Failed to add role';
                  const statusCode = err?.response?.status;
                  setError(`${errorMessage}${statusCode ? ` (${statusCode})` : ''}`);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Adding Role...' : 'Confirm & Add Role'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <Text variant="Heading" as="h2" className="text-xl">
              Complete Your {getRoleLabel()} Profile
            </Text>
            <Text variant="SubText" className="text-sm text-gray-600 mt-1">
              Step {currentStep + 1} of {steps.length}
            </Text>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-brand-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {CurrentStepComponent && (
            <CurrentStepComponent
              onNext={handleNext}
              onBack={currentStep > 0 ? handleBack : undefined}
              isFinalStep={currentStep === steps.length - 1}
            />
          )}
        </div>

        {/* Footer - Only show if step doesn't have its own buttons */}
        {CurrentStepComponent && !CurrentStepComponent.hideParentButtons && (
          <div className="flex justify-between items-center p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={currentStep > 0 ? handleBack : onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              {currentStep > 0 ? 'Back' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving...'
                : currentStep === steps.length - 1
                ? 'Complete & Switch'
                : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
