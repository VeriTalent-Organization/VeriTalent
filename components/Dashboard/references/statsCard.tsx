import React from 'react';

interface Stat {
  label: string;
  value: number;
}

interface StatsCardsProps {
  stats: Stat[];
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-indigo-50 rounded-lg p-4 sm:p-6">
          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}