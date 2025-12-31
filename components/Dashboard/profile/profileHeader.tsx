import { Camera } from 'lucide-react';

interface ProfileHeaderProps {
  name: string;
  title: string;
  email: string;
  initials: string;
  onEdit?: () => void;
}

export const ProfileHeader = ({ name, title, email, initials, onEdit }: ProfileHeaderProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-xl sm:text-2xl lg:text-3xl font-semibold text-brand-primary">
                {initials}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-brand-primary rounded-full flex items-center justify-center hover:bg-cyan-700">
              <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </button>
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              {name}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-1">{title}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 truncate">{email}</p>
          </div>
        </div>
        <button 
          onClick={onEdit}
          className="w-full sm:w-auto bg-brand-primary hover:bg-cyan-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};