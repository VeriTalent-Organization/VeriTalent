import UserTypeCard from '@/components/reuseables/cards/user_type_card'
import { Text } from '@/components/reuseables/text'
import { useCreateUserStore } from '@/lib/stores/form_submission_store'
import { userTypes } from '@/types/user_type'
import { Briefcase, Building2, User, LogIn } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'

interface RolePickerStepProps {
  onNext?: () => void
  onBack?: () => void
  isFinalStep?: boolean
}

const RolePickerStep: React.FC<RolePickerStepProps> & {
  hideParentButtons?: boolean
} = ({ onNext }) => {
  const { user, updateUser } = useCreateUserStore()
  const router = useRouter()

  // If user is null (guest), use default role for selection state
  const selectedType = user?.user_type ?? userTypes.TALENT

  const handleSelect = (type: userTypes) => {
    // If user is null, this will create the initial user object
    updateUser({ user_type: type })

    // Note: Auto-advance removed to ensure explicit confirmation
    // Users must click Next button to proceed, preventing accidental role selection
  }

  const handleLogin = () => {
    // Navigate to login page
    router.push('/auth/login')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] gap-12 px-4">
      {/* Login Button */}
      <div className="w-full flex justify-end">
        <button
          onClick={handleLogin}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
        >
          <LogIn size={16} />
          Already have an account? Login
        </button>
      </div>

      <div className="text-center space-y-6 max-w-2xl">
        <Text as="h1" variant="SubHeadings" className="text-3xl sm:text-4xl md:text-5xl">
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