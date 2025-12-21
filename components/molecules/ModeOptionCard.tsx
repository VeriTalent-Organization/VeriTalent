import React from 'react';
import { CVUploadMode } from '@/types/dashboard';

interface ModeOptionCardProps {
  mode: CVUploadMode;
  isSelected: boolean;
  title: string;
  onSelect: (mode: CVUploadMode) => void;
  children?: React.ReactNode;
}

export default function ModeOptionCard({
  mode,
  isSelected,
  title,
  onSelect,
  children
}: ModeOptionCardProps) {
  return (
    <div
      className={`bg-white rounded-xl p-2 lg:p-8 border-2 cursor-pointer transition-all shadow-sm group ${
        isSelected 
          ? "border-brand-primary bg-brand-primary-50/20" 
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => onSelect(mode)}
    >
      <div className="flex flex-col items-center text-center gap-4">
        {/* Checkbox circle */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            isSelected 
              ? "bg-brand-primary text-white" 
              : "bg-white border-2 border-gray-300 group-hover:border-gray-400"
          }`}
        >
          {isSelected && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900">{title}</h3>

        {children}
      </div>
    </div>
  );
}