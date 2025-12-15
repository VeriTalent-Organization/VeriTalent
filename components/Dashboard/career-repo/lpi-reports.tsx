import React, { useState } from "react";
import { FileText, Eye } from "lucide-react";

// Component for LPI Reports section
export default function LPIReportsView() {
  const [activeFilter, setActiveFilter] = useState<"all" | "internal" | "institutional">("all");

  // Sample report data
  const reports = [
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

  const filteredReports = reports.filter(report => {
    if (activeFilter === "all") return true;
    return report.type === activeFilter;
  });

  return (
    <div>
      {/* Stats Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your Learning and performance intelligence report
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-sm text-gray-700 mb-1">Placement ID</p>
            <p className="text-xl font-bold text-gray-900">VT-98421-NG</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6">
            <p className="text-sm text-gray-700 mb-1">Internal LPI Report</p>
            <p className="text-xl font-bold text-gray-900">5</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-sm text-gray-700 mb-1">Institutional LPI Report</p>
            <p className="text-xl font-bold text-gray-900">2</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-8 flex gap-4">
        <button className="px-6 py-3 bg-white border-2 border-brand-primary text-brand-primary rounded-lg flex items-center gap-2 hover:bg-cyan-50 transition-colors">
          <FileText className="w-5 h-5" />
          Internal LPI Feed
        </button>
        <button className="px-6 py-3 bg-white border-2 border-brand-primary text-brand-primary rounded-lg flex items-center gap-2 hover:bg-cyan-50 transition-colors">
          <FileText className="w-5 h-5" />
          Institutional LPI In-Sync
        </button>
      </div>

      {/* Reports Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reports</h2>
        
        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === "all"
                ? "bg-brand-primary text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("internal")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === "internal"
                ? "bg-brand-primary text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Internal LPI Reports
          </button>
          <button
            onClick={() => setActiveFilter("institutional")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === "institutional"
                ? "bg-brand-primary text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Institutional LPI Reports
          </button>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {report.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{report.subtitle}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-1">{report.description}</p>
                <p className="text-sm text-gray-500">{report.date}</p>
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
          <div className="text-center py-12 text-gray-500">
            No reports found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}