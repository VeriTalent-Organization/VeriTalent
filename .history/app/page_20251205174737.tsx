'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import MaxWidthContainer from '@/components/reuseables/max_width_container'
import RolePickerStep from '@/components/layout/onboarding/role_picker'

import Icons from '@/lib/configs/icons.config'

const Home = () => {
  const steps = [
    RolePickerStep, 
    // Add more steps here (e.g. ProfileInfoStep, ProfessionalDetailsStep…)
  ]

  const [currentStep, setCurrentStep] = useState(0)

  const StepComponent = steps[currentStep]

  const goNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1)
  }

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  return (
    <MaxWidthContainer large>
      
      {/* LOGO */}
      <div className='flex items-center py-6'>
        <Image
          height={200}
          width={200}
          alt='veritalent logo'
          src={Icons.veritalentLogo}
        />
      </div>

      {/* STEP ANIMATION WRAPPER */}
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
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* NEXT & BACK CONTROLS */}
      <div className="flex justify-between mt-10">
        <button
          onClick={goBack}
          disabled={currentStep === 0}
          className="px-6 py-3 rounded-lg border border-gray-300 disabled:opacity-40"
        >
          Back
        </button>

        <button
          onClick={goNext}
          disabled={currentStep === steps.length - 1}
          className="px-6 py-3 rounded-lg bg-brand-primary text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>

    </MaxWidthContainer>
  )
}

export default Home
