// components/UserTypeCard.tsx
import React from 'react';
import { cn } from '@/lib/utils'; // Optional cn utility

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
        'relative flex flex-col items-center justify-center pt-12 pb-8 px-6 bg-white rounded-2xl shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md',
        selected ? 'border-t-4 border-t-primary' : 'border border-transparent',
        className
      )}
    >
      {/* Top center indicator dot (only when selected) */}
      {selected && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full" /> {/* Optional inner white dot for contrast */}
        </div>
      )}

      {/* Icon - grays when unselected, primary when selected */}
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