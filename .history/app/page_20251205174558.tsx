'use client'
import RolePickerStep from '@/components/layout/onboarding/role_picker'
import UserTypeCard from '@/components/reuseables/cards/user_type_card'
import MaxWidthContainer from '@/components/reuseables/max_width_container'
import { Text } from '@/components/reuseables/text'
import Icons from '@/lib/configs/icons.config'
import { Briefcase, Building2, User } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

const Home = () => {
  const steps = [
    RolePickerStep
  ]
  return (
    <MaxWidthContainer large >
      <div className='flex items-center py-6'>
        <Image height={200} width={200} alt='veritalent logo' src={Icons.veritalentLogo}/>
      </div>

      {/* NEXT AND BACK BUTTONS */}
      
    </MaxWidthContainer>
  )
}

export default Home