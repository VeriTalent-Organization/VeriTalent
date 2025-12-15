'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import MaxWidthContainer from '@/components/reuseables/max_width_container'
import RolePickerStep from '@/components/layout/onboarding/role_picker'
import { useCreateUserStore } from '@/lib/stores/form_submission_store'
import { userTypes } from '@/types/user_type'
import Icons from '@/lib/configs/icons.config'
import OrganizationRegistrationFormStep from '@/components/layout/onboarding/orginisation_registration_form'
import OrganizationDetailsFormStep from '@/components/layout/onboarding/organisation_registration_form2'
// Import your step components
import RegistrationFormStep from '@/components/layout/onboarding/registration_form_step'
import EmployerProfileStep from '@/components/layout/onboarding/employer_from_step'
import LoginPage from '@/components/layout/onboarding/login'

type StepComponentType = React.FC<{ onNext?: () => void; onBack?: () => void }> & {
  hasNextButton?: boolean;
};


const Home = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const { user } = useCreateUserStore()

  // Define steps based on user role
  const steps = useMemo(() => {
    const baseSteps = [RolePickerStep]

    switch (user.user_type) {
      case userTypes.TALENT:
        return [
          ...baseSteps,
          RegistrationFormStep,
          LoginPage
        ]

      case userTypes.INDEPENT_RECRUITER:
        return [
          ...baseSteps,
          RegistrationFormStep,
          EmployerProfileStep,
          LoginPage
        ]

      case userTypes.ORGANISATION:
        return [
          ...baseSteps,
          RegistrationFormStep,
          OrganizationRegistrationFormStep,
          OrganizationDetailsFormStep,
          LoginPage
        ]

      default:
        // If no role selected yet, only show role picker
        return [RolePickerStep]
    }
  }, [user.user_type])

  const StepComponent = steps[currentStep] as StepComponentType;

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  const hideParentNextButton = StepComponent.hasNextButton;

  // Reset to role picker if user changes role
  const handleRoleChange = () => {
    setCurrentStep(0)
  }

  return (
    <MaxWidthContainer large>
      
      <div className='flex items-center py-6'>
        <Image
          height={200}
          width={200}
          alt='veritalent logo'
          src={Icons.veritalentLogo}
        />
      </div>

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
            <StepComponent onNext={goNext} onBack={goBack} />
          </motion.div>
        </AnimatePresence>
      </div>

      {!hideParentNextButton && (
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
            disabled={currentStep === steps.length - 1}
            className="px-6 py-3 rounded-lg bg-brand-primary text-white disabled:opacity-40 hover:bg-brand-primary/90 transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      )}

    </MaxWidthContainer>
  )
}

export default Home