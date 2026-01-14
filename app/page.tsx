'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import MaxWidthContainer from '@/components/reuseables/max_width_container'
import RolePickerStep from '@/components/layout/onboarding/role_picker'
import RegistrationFormStep from '@/components/layout/onboarding/registration_form_step'
import MultiEmailIdentityStep from '@/components/layout/onboarding/multi_email_identity_step'
import BuildAICardStep from '@/components/layout/onboarding/build_ai_card_step'
import EmployerProfileStep from '@/components/layout/onboarding/employer_from_step'
import OrganizationRegistrationFormStep from '@/components/layout/onboarding/orginisation_registration_form'
import OrganizationDetailsFormStep from '@/components/layout/onboarding/organisation_registration_form2'
import VerificationProgress from '@/components/layout/onboarding/verificationProgress'
import PostLoginRoleSelection from '@/components/layout/onboarding/post_login_role_selection'
import Icons from '@/lib/configs/icons.config'
import { useCreateUserStore } from '@/lib/stores/form_submission_store'
import { userTypes } from '@/types/user_type'
import { authService, RegisterDto } from '@/lib/services/authService'
import { Text } from '@/components/reuseables/text'
import { Spinner } from '@/components/ui/spinner'

type OnboardingStepProps = {
  onNext: () => void
  onBack?: () => void
  isFinalStep?: boolean
}

type OnboardingStepComponent = React.FC<OnboardingStepProps> & {
  hideParentButtons?: boolean
}

const Home = () => {
  const router = useRouter()
  const { user, _hasHydrated } = useCreateUserStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasRedirected = React.useRef(false)

  // Redirect already-authenticated users (wait for hydration AND active_role from server)
  useEffect(() => {
    if (!_hasHydrated) return; // Wait for store to hydrate
    
    // Wait for both token AND available_roles (which comes from login)
    if (user?.token && user?.available_roles && !hasRedirected.current) {
      hasRedirected.current = true;
      
      // Check if user has multiple roles and no active_role set
      if (user.available_roles.length > 1 && !user.active_role) {
        console.log('[app/page] User has multiple roles, showing role selection');
        setShowPostLoginRoleSelection(true);
        return;
      }
      
      // User has single role or active_role already set, redirect normally
      const dashboardRoute = user.active_role === 'talent' ? '/dashboard/ai-card' : '/dashboard';
      console.log('[app/page] Redirecting authenticated user to:', dashboardRoute, { active_role: user.active_role });
      router.replace(dashboardRoute);
    }
  }, [user?.token, user?.active_role, user?.available_roles, _hasHydrated, router])

  const [showLogin, setShowLogin] = useState(true)
  const [showPostLoginRoleSelection, setShowPostLoginRoleSelection] = useState(false)

  // Dynamically define onboarding steps based on role
  const steps = useMemo(() => {
    const baseSteps = [RolePickerStep]

    if (!user) return [RolePickerStep]

    switch (user.user_type) {
      case userTypes.TALENT:
        return [...baseSteps, RegistrationFormStep, MultiEmailIdentityStep, BuildAICardStep]
      case userTypes.INDEPENDENT_RECRUITER:
        return [...baseSteps, RegistrationFormStep, EmployerProfileStep]
      case userTypes.ORGANISATION:
        return [
          ...baseSteps,
          RegistrationFormStep,
          OrganizationRegistrationFormStep,
          OrganizationDetailsFormStep,
          VerificationProgress,
        ]
      default:
        return [RolePickerStep]
    }
  }, [user])

  // Handle next step / registration
  const goNext = async () => {
    // Validation: If on role picker step (step 0), ensure role is selected
    if (currentStep === 0 && !user?.user_type) {
      setError('Please select your role to continue.');
      return;
    }

    const isFinalStep = currentStep === steps.length - 1

    if (!isFinalStep) {
      setCurrentStep(currentStep + 1)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Validation: Ensure user has selected a valid role before registration
      if (!user?.user_type) {
        setError('Please select your role before continuing.');
        setCurrentStep(0); // Go back to role picker
        return;
      }

      // Validation: Ensure role is one of the valid types
      if (![userTypes.TALENT, userTypes.INDEPENDENT_RECRUITER, userTypes.ORGANISATION].includes(user.user_type)) {
        setError('Invalid role selected. Please try again.');
        setCurrentStep(0);
        return;
      }

      const registerData: RegisterDto = {
        primaryEmail: user.email,
        password: user.password || '',
        fullName: user.full_name,
        location: user.country,
        accountType:
          user.user_type === userTypes.TALENT
            ? 'talent'
            : user.user_type === userTypes.INDEPENDENT_RECRUITER
            ? 'recruiter'
            : 'organization',
      }

      // Add role-specific fields only when they exist
      if (user.user_type === userTypes.INDEPENDENT_RECRUITER) {
        if (user.current_designation) registerData.professionalDesignation = user.current_designation;
        if (user.professional_status) registerData.professionalStatus = user.professional_status;
        if (user.organisation_name) registerData.recruiterOrganizationName = user.organisation_name;
      }

      // Add talent-specific CV fields
      if (user.user_type === userTypes.TALENT) {
        if (user.cv_source) registerData.cv_source = user.cv_source;
        if (user.linkedin_connected !== undefined) registerData.linkedin_connected = user.linkedin_connected;
        if (user.cv_file) registerData.cv_file = user.cv_file;
        if (user.linked_emails) registerData.linked_emails = user.linked_emails;
      }

      if (user.user_type === userTypes.ORGANISATION) {
        if (user.organization_name) registerData.organizationName = user.organization_name;
        if (user.organization_domain) registerData.organizationDomain = user.organization_domain;
        if (user.organization_linkedin_page) registerData.organizationLinkedinPage = user.organization_linkedin_page;
        if (user.organisation_size) registerData.organisationSize = user.organisation_size;
        if (user.organisation_rc_number) registerData.organisationRcNumber = user.organisation_rc_number;
        if (user.organisation_industry) registerData.organisationIndustry = user.organisation_industry;
        if (user.organisation_location) registerData.organisationLocation = user.organisation_location;
      }

      // Basic client-side guardrails for org admin payload completeness
      if (
        user.user_type === userTypes.ORGANISATION &&
        (!registerData.organizationName || !registerData.organizationDomain)
      ) {
        setError('Please provide your organization name and official email domain.');
        return;
      }

      // Debug: inspect payload (without password) during onboarding
      if (process.env.NODE_ENV !== 'production') {
        const debugPayload = { ...registerData } as Record<string, unknown>;
        delete (debugPayload as { password?: string }).password;
        console.log('Submitting register payload →', debugPayload);
      }

      const { token } = await authService.register(registerData)

      // Note: authService.register already updates the store with token and user data
      // The useEffect will detect the token and handle redirect
      localStorage.setItem('hasEverRegistered', 'true')
    } catch (err: unknown) {
      console.error('Registration error:', err)
      const message = (err as { message?: string })?.message || 'Registration failed. Please try again.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePostLoginRoleSelected = async (role: 'talent' | 'recruiter' | 'org_admin') => {
    console.log('[app/page] Post-login role selected:', role);
    
    try {
      // Switch to the selected role
      await authService.switchRole({ role });
      
      // Update the store with the selected role
      const user_type = role === 'recruiter' ? userTypes.INDEPENDENT_RECRUITER : 
                       role === 'talent' ? userTypes.TALENT : userTypes.ORGANISATION;
      
      useCreateUserStore.getState().updateUser({
        active_role: role,
        user_type
      });
      
      // Redirect to appropriate dashboard
      const dashboardRoute = role === 'talent' ? '/dashboard/ai-card' : '/dashboard';
      router.replace(dashboardRoute);
    } catch (error) {
      console.error('Failed to switch role:', error);
      setError('Failed to switch role. Please try again.');
      setShowPostLoginRoleSelection(false);
      hasRedirected.current = false; // Allow retry
    }
  }

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  // Render post-login role selection
  if (showPostLoginRoleSelection) {
    return (
      <MaxWidthContainer large>
        <div className="flex items-center py-6">
          <Image height={200} width={200} alt="veritalent logo" src={Icons.veritalentLogo} />
        </div>

        <div className="min-h-[400px] flex items-center justify-center">
          <PostLoginRoleSelection onRoleSelected={handlePostLoginRoleSelected} />
        </div>
      </MaxWidthContainer>
    )
  }

  const CurrentStepComponent = steps[currentStep]
  if (!CurrentStepComponent) {
    return (
      <MaxWidthContainer large>
        <div className="flex items-center justify-center min-h-[600px]">
          <Text variant="SubText" className="text-lg text-gray-600">
            Loading onboarding step...
          </Text>
        </div>
      </MaxWidthContainer>
    )
  }

  const StepComponent = CurrentStepComponent as OnboardingStepComponent
  const isFinalStep = currentStep === steps.length - 1
  const hideParentButtons = StepComponent.hideParentButtons ?? false

  return (
    <MaxWidthContainer large>
      <div className="flex items-center py-6">
        <Image height={200} width={200} alt="veritalent logo" src={Icons.veritalentLogo} />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="min-h-[400px] flex mb-10 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full"
          >
            <StepComponent onNext={goNext} onBack={goBack} isFinalStep={isFinalStep} />
          </motion.div>
        </AnimatePresence>
      </div>

      {steps[currentStep] && !hideParentButtons && (
        <div className="flex justify-between">
          <button
            onClick={goBack}
            disabled={currentStep === 0 || isSubmitting}
            className="px-6 py-3 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Back
          </button>

          <button
            onClick={goNext}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg bg-brand-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-primary/90 transition-colors flex items-center gap-2 justify-center"
          >
            {isSubmitting && <Spinner className="text-white" />}
            {isSubmitting ? 'Creating account...' : isFinalStep ? 'Finish' : 'Next'}
          </button>
        </div>
      )}
    </MaxWidthContainer>
  )
}

export default Home
