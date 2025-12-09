import UserTypeCard from '@/components/reuseables/cards/user_type_card'
import { Text } from '@/components/reuseables/text'
import { useCreateUserStore } from '@/lib/stores/form_submission_store'
import { userTypes } from '@/types/user_type'
import { Briefcase, Building2, User } from 'lucide-react'
import React from 'react'


const RolePickerStep = () => {

  const { user, setUser } = useCreateUserStore()
  const selectedType = user.user_type

  const handleSelect = (type: string) => {
    setUser({ user_type: type as any })
  }

  return (
    <div>
      <div className='flex items-center justify-center flex-col gap-12'>
        
        <Text as='h1' variant='Heading' >
          Welcome to <span className='text-brand-primary'>VeriTalent!</span>
        </Text>

        <Text as='h3' variant='SubText'>
          First, let’s select your primary role.
        </Text>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">

          <UserTypeCard
            icon={<User size={64} strokeWidth={1.5} />}
            title="I'm a Talent"
            description="For individuals building their AI career profile to showcase skills and opportunities."
            selected={selectedType === userTypes.TALENT}
            onClick={() => handleSelect(userTypes.TALENT)}
          />

          <UserTypeCard
            icon={<Briefcase size={64} strokeWidth={1.5} />}
            title="I'm an Independent Recruiter/Manager"
            description="For individuals managing a portfolio of talent or recruiting for various clients."
            selected={selectedType === userTypes.INDEPENT_RECRUITER}
            onClick={() => handleSelect(userTypes.INDEPENT_RECRUITER)}
          />

          <UserTypeCard
            icon={<Building2 size={64} strokeWidth={1.5} />}
            title="I represent an Organisation"
            description="For teams and companies looking to manage their internal talent and recruit new members."
            selected={selectedType === userTypes.ORGANISATION}
            onClick={() => handleSelect(userTypes.ORGANISATION)}
          />

        </div>
      </div>
    </div>
  )
}

export default RolePickerStep
