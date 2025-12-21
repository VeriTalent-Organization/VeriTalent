import React from 'react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { key: "post-job", label: "Post Job" },
  { key: "cv-upload", label: "CV Upload" },
  { key: "veritilent-ai", label: "Veritilent AI Card ID" }
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-6 border-b pb-4 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`
            px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base whitespace-nowrap
            ${activeTab === tab.key
              ? "bg-brand-primary text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-200"}
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}