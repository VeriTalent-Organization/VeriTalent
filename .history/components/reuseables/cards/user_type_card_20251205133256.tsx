// components/UserTypeCard.tsx
import React from 'react';
import { cn } from '@/lib/utils'; // Optional: if you have a cn utility (common with shadcn)

interface UserTypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const UserTypeCard: React.FC<UserTypeCardProps> = ({
  title,
  description,
  icon,
  selected = false,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center p-8 bg-white rounded-2xl border-2 border-transparent cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        selected &&
          'border-primary ring-4 ring-primary/20 bg-primary/5', // Highlight when selected
        className
      )}
    >
      {/* Optional: small circle indicator in top-left (like your screenshot) */}
      {selected && (
        <div className="absolute top-3 left-3 w-6 h-6 bg-brand-primary rounded-full border-4 border-white" />
      )}

      {/* Icon with primary tint when selected */}
      <div
        className={cn(
          'mb-6 text-gray-400',
          selected && 'text-primary'
        )}
      >
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
        {title}
      </h3>

      <p className="text-sm text-gray-600 text-center leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default UserTypeCard;