import MaxWidthContainer from '@/components/reuseables/max_width_container'
import { Text } from '@/components/reuseables/text'
import Icons from '@/lib/configs/icons.config'
import Image from 'next/image'
import React from 'react'

const Home = () => {
  return (
    <MaxWidthContainer large >
      <div className='flex items-center py-6'>
        <Image height={200} width={200} alt='veritalent logo' src={Icons.veritalentLogo}/>
      </div>
      <div className='flex items-center justify-center'>
        <Text as='h1' variant='Heading'>Welcome to <span className='text-brand-primary'>VeriTalent!</span></Text>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
      <UserTypeCard
        icon={<User size={64} strokeWidth={1.5} />}
        title="I'm a Talent"
        description="For individuals building their AI career profile to showcase skills and opportunities."
        selected={selectedType === 'talent'}
        onClick={() => setSelectedType('talent')}
      />

      <UserTypeCard
        icon={<Briefcase size={64} strokeWidth={1.5} />}
        title="I'm an Independent Recruiter/Manager"
        description="For individuals managing a portfolio of talent or recruiting for various clients."
        selected={selectedType === 'recruiter'}
        onClick={() => setSelectedType('recruiter')}
      />

      <UserTypeCard
        icon={<Building2 size={64} strokeWidth={1.5} />}
        title="I represent an Organisation"
        description="For teams and companies looking to manage their internal talent and recruit new members."
        selected={selectedType === 'organization'}
        onClick={() => setSelectedType('organization')}
      />
    </div>
      </div>
    </MaxWidthContainer>
  )
}

export default Home