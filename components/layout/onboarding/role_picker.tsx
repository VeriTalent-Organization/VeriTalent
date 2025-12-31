import UserTypeCard from '@/components/reuseables/cards/user_type_card'
import { Text } from '@/components/reuseables/text'
import { useCreateUserStore } from '@/lib/stores/form_submission_store'
import { userTypes } from '@/types/user_type'
import { Briefcase, Building2, User } from 'lucide-react'
import React from 'react'

interface RolePickerStepProps {
  onNext?: () => void
  onBack?: () => void
  isFinalStep?: boolean
}

const RolePickerStep: React.FC<RolePickerStepProps> & {
  hideParentButtons?: boolean
} = ({ onNext }) => {
  const { user, updateUser } = useCreateUserStore()

  // If user is null (guest), use default role for selection state
  const selectedType = user?.user_type ?? userTypes.TALENT

  const handleSelect = (type: userTypes) => {
    // If user is null, this will create the initial user object
    updateUser({ user_type: type })

    // Optional: Auto-advance after selection (great UX!)
    if (onNext) {
      setTimeout(() => onNext(), 300) // Small delay for visual feedback
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] gap-12 px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <Text as="h1" variant="Heading" className="text-3xl sm:text-4xl md:text-5xl">
          Welcome to <span className="text-brand-primary">VeriTalent!</span>
        </Text>

        <Text as="h3" variant="SubText" className="text-lg sm:text-xl text-gray-600">
          First, let&apos;s select your primary role.
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
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
          selected={selectedType === userTypes.INDEPENDENT_RECRUITER}
          onClick={() => handleSelect(userTypes.INDEPENDENT_RECRUITER)}
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
  )
}

// RolePicker does NOT have internal buttons → show parent's Next button if needed
RolePickerStep.hideParentButtons = false

export default RolePickerStep