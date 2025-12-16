import React, { useState } from "react";
import { FileText, Eye } from "lucide-react";
import StatsSection from "@/components/molecules/StatsSection";
import { LPIMode } from "@/types/dashboard";

interface LPIReportsViewProps {
  onNavigate: (mode: LPIMode) => void;
}

interface Report {
  id: number;
  title: string;
  type: "internal" | "institutional";
  subtitle: string;
  description: string;
  date: string;
}

const reports: Report[] = [
  {
    id: 1,
    title: "Activity Footprint",
    type: "internal",
    subtitle: "Internal",
    description: "Github contributions - open source",
    date: "08 - Dec - 2025",
  },
  {
    id: 2,
    title: "Portfolios",
    type: "internal",
    subtitle: "Internal",
    description: "Brand Identity & Logo design",
    date: "05 - Dec - 2025",
  },
];

export default function LPIReportsView({ onNavigate }: LPIReportsViewProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "internal" | "institutional">("all");

  const filteredReports = reports.filter(report => {
    if (activeFilter === "all") return true;
    return report.type === activeFilter;
  });

  const stats = [
    { label: "Placement ID", value: "VT-98421-NG" },
    { label: "Internal LPI Report", value: 5 },
    { label: "Institutional LPI Report", value: 2 },
  ];

  return (
    <div>
      <StatsSection 
        title="Your Learning and performance intelligence report" 
        stats={stats}
      />

      {/* Action Buttons */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={() => onNavigate("internal-feed")}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-brand-primary text-white rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-700 transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span className="text-sm sm:text-base">Internal LPI Feed</span>
        </button>
        <button
          onClick={() => onNavigate("institutional-sync")}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-white border-2 border-brand-primary text-brand-primary rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-50 transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span className="text-sm sm:text-base">Institutional LPI In-Sync</span>
        </button>
      </div>

      {/* Reports Section */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Reports</h2>
        
        {/* Filter Tabs */}
        <div className="mb-6 flex flex-col sm:flex-row gap-2 overflow-x-auto">
          {[
            { id: "all" as const, label: "All" },
            { id: "internal" as const, label: "Internal LPI Reports" },
            { id: "institutional" as const, label: "Institutional LPI Reports" },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === filter.id
                  ? "bg-brand-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="mb-4">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                  {report.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{report.subtitle}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-xs sm:text-sm text-gray-700 mb-1">{report.description}</p>
                <p className="text-xs sm:text-sm text-gray-500">{report.date}</p>
              </div>

              <div className="flex justify-end">
                <button className="p-2 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No reports found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}