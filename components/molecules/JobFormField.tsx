import React from 'react';

interface JobFormFieldProps {
  label: string;
  type?: 'text' | 'select' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
}

export default function JobFormField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  options,
  rows = 4
}: JobFormFieldProps) {
  const baseClasses = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-gray-900 placeholder-gray-400";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">{label}</label>
      
      {type === 'text' && (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClasses}
        />
      )}

      {type === 'select' && (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClasses} text-gray-700 bg-white`}
        >
          <option value="">Select type</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {type === 'textarea' && (
        <textarea
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClasses} resize-none`}
        />
      )}
    </div>
  );
}