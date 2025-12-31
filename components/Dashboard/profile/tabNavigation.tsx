import { useEffect, useRef, useState } from "react";
import { ArrowRight } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNavigation = ({ tabs, activeTab, onTabChange }: TabNavigationProps) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setShowArrow(el.scrollWidth > el.clientWidth);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <div className="relative border-b flex items-center border-gray-200">
      <div
        ref={tabsRef}
        className="flex gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-hide"
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-3 sm:py-4 font-medium border-b-2 transition-colors text-sm sm:text-base whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-teal-600 text-brand-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {showArrow && (
        <ArrowRight className="absolute right-4 text-gray-700 h-4 w-4 animate-arrow pointer-events-none" />
      )}
    </div>
  );
};