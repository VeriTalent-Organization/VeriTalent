import React from 'react';
import { Eye, Download, Share2 } from 'lucide-react';
import { RepositoryItem } from '@/types/dashboard';

interface RepositoryCardProps {
  repository: RepositoryItem;
  onView: () => void;
}

export default function RepositoryCard({ repository, onView }: RepositoryCardProps) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex justify-between mb-4">
        <h3 className="text-sm font-semibold">{repository.type}</h3>
        <span className={`px-2 py-1 text-xs rounded ${repository.badgeColor}`}>
          {repository.badge}
        </span>
      </div>

      <div className="mb-4 text-sm">
        <p className="font-medium">{repository.organization}</p>
        <p className="text-xs text-gray-600">{repository.subtitle}</p>
        <p className="text-xs text-gray-600">{repository.period}</p>
      </div>

      <div className="flex gap-2">
        {repository.actions >= 1 && (
          <button
            onClick={onView}
            className="p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
        {repository.actions >= 2 && (
          <button className="p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        )}
        {repository.actions >= 3 && (
          <button className="p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}