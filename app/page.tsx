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
import LoginPage from '@/components/layout/onboarding/login'
import Icons from '@/lib/configs/icons.config'
import { useCreateUserStore } from '@/lib/stores/form_submission_store'
import { userTypes } from '@/types/user_type'
import { authService, RegisterDto } from '@/lib/services/authService'
import { Text } from '@/components/reuseables/text'

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
  const { user } = useCreateUserStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect already-authenticated users
  useEffect(() => {
    if (user?.token) {
      router.replace('/dashboard')
    }
  }, [user?.token, router])

  // Always show login as first step
  const [showLogin, setShowLogin] = useState(true)

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
    const isFinalStep = currentStep === steps.length - 1

    if (!isFinalStep) {
      setCurrentStep(currentStep + 1)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const registerData: RegisterDto = {
        primaryEmail: user.email,
        password: user.password || '',
        fullName: user.full_name,
        location: user.country,
        role:
          user.user_type === userTypes.TALENT
            ? 'talent'
            : user.user_type === userTypes.INDEPENDENT_RECRUITER
            ? 'recruiter'
            : 'org_admin',
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
        registerData.role === 'org_admin' &&
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
      // Just ensure token is set and redirect immediately
      localStorage.setItem('hasEverRegistered', 'true')

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err: unknown) {
      console.error('Registration error:', err)
      const message = (err as { message?: string })?.message || 'Registration failed. Please try again.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  // Render login first
  if (showLogin) {
    return (
      <MaxWidthContainer large>
        <div className="flex items-center py-6">
          <Image height={200} width={200} alt="veritalent logo" src={Icons.veritalentLogo} />
        </div>

        <div className="min-h-[400px] flex items-center justify-center">
          <LoginPage
            onLoginSuccess={() => router.push('/dashboard')}
            onShowRegister={() => setShowLogin(false)}
          />
        </div>

        <div className="text-center mt-8">
          <span className="text-gray-600">New here? </span>
          <button
            onClick={() => setShowLogin(false)}
            className="text-brand-primary font-medium hover:underline"
          >
            Create an account
          </button>
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

      <div className="min-h-[400px] flex items-center justify-center">
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
        <div className="flex justify-between mt-10 mb-6">
          <button
            onClick={goBack}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>

          <button
            onClick={goNext}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg bg-brand-primary text-white disabled:opacity-40 hover:bg-brand-primary/90 transition-colors"
          >
            {isSubmitting ? 'Creating account...' : isFinalStep ? 'Finish' : 'Next'}
          </button>
        </div>
      )}
    </MaxWidthContainer>
  )
}

export default Home
