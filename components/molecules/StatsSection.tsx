import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
      <p className="text-xs sm:text-sm text-gray-700 mb-1">{label}</p>
      <p className="text-lg sm:text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

interface StatsSectionProps {
  title: string;
  stats: { label: string; value: string | number }[];
}

export default function StatsSection({ title, stats }: StatsSectionProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} label={stat.label} value={stat.value} />
        ))}
      </div>
    </div>
  );
}