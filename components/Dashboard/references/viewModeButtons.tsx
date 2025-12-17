import React from 'react';
import { Monitor, Inbox, FileText, LucideIcon } from 'lucide-react';
import { ViewMode } from '@/types/dashboard';

interface ViewButton {
  mode: ViewMode;
  label: string;
  icon: LucideIcon;
}

interface ViewModeButtonsProps {
  activeView: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

const viewButtons: ViewButton[] = [
  { mode: 'new', label: 'New Issuance', icon: Monitor },
  { mode: 'inbox', label: 'Request Inbox', icon: Inbox },
  { mode: 'issued', label: 'Issued Records', icon: FileText },
];

export default function ViewModeButtons({ activeView, onViewChange }: ViewModeButtonsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {viewButtons.map(({ mode, label, icon: Icon }) => (
        <button
          key={mode}
          onClick={() => onViewChange(mode)}
          className={`font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition text-sm sm:text-base ${
            activeView === mode
              ? 'bg-brand-primary text-white'
              : 'bg-white hover:bg-gray-50 text-brand-primary border-2 border-brand-primary'
          }`}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          {label}
        </button>
      ))}
    </div>
  );
}