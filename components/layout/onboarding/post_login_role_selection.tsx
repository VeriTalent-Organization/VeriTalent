import UserTypeCard from '@/components/reuseables/cards/user_type_card'
import { Text } from '@/components/reuseables/text'
import { useCreateUserStore } from '@/lib/stores/form_submission_store'
import { userTypes } from '@/types/user_type'
import { Briefcase, Building2, User } from 'lucide-react'
import React from 'react'

interface PostLoginRoleSelectionProps {
  onRoleSelected: (role: 'talent' | 'recruiter' | 'org_admin') => void
}

const PostLoginRoleSelection: React.FC<PostLoginRoleSelectionProps> = ({ onRoleSelected }) => {
  const { user } = useCreateUserStore()

  const availableRoles = user?.available_roles || []

  // Map available roles to user types for display
  const roleOptions = [
    {
      value: 'talent' as const,
      type: userTypes.TALENT,
      icon: <User size={64} strokeWidth={1.5} />,
      title: "Continue as Talent",
      description: "Access your AI career profile, job opportunities, and career repository."
    },
    {
      value: 'recruiter' as const,
      type: userTypes.INDEPENDENT_RECRUITER,
      icon: <Briefcase size={64} strokeWidth={1.5} />,
      title: "Continue as Independent Recruiter",
      description: "Manage your posted jobs, screen candidates, and issue recommendations."
    },
    {
      value: 'org_admin' as const,
      type: userTypes.ORGANISATION,
      icon: <Building2 size={64} strokeWidth={1.5} />,
      title: "Continue as Company Administrator",
      description: "Manage your organization's team, jobs, and verification processes."
    }
  ].filter(option => availableRoles.includes(option.value))

  const handleSelect = (role: 'talent' | 'recruiter' | 'org_admin') => {
    onRoleSelected(role)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] gap-12 px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <Text as="h1" variant="SubHeadings" className="text-3xl sm:text-4xl md:text-5xl">
          Welcome back, {user?.full_name || 'User'}!
        </Text>

        <Text as="h3" variant="SubText" className="text-lg sm:text-xl text-gray-600">
          You have multiple roles. Please select how you&apos;d like to continue.
        </Text>
      </div>

      <div className={`grid gap-8 max-w-6xl w-full ${
        roleOptions.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'
      }`}>
        {roleOptions.map((option) => (
          <UserTypeCard
            key={option.value}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={false} // No pre-selection for post-login
            onClick={() => handleSelect(option.value)}
          />
        ))}
      </div>
    </div>
  )
}

export default PostLoginRoleSelection