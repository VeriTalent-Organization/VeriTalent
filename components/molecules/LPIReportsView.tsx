import React, { useEffect, useState } from "react";
import { FileText, Eye } from "lucide-react";
import StatsSection from "@/components/molecules/StatsSection";
import { LPIMode, LPIReport } from "@/types/dashboard";
import { listReports } from "@/lib/services/lpiService";
import { useCreateUserStore } from "@/lib/stores/form_submission_store";

interface LPIReportsViewProps {
  onNavigate: (mode: LPIMode) => void;
}

export default function LPIReportsView({ onNavigate }: LPIReportsViewProps) {
  const { user } = useCreateUserStore();
  const [reports, setReports] = useState<LPIReport[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "internal" | "institutional">("all");
  const [selectedReport, setSelectedReport] = useState<LPIReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetched = await listReports();
        setReports(fetched);
      } catch (err) {
        console.error("Failed to load LPI reports", err);
        setError("Unable to load reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredReports = reports.filter(report => {
    if (activeFilter === "all") return true;
    return report.type === activeFilter;
  });

  const stats = [
    { label: "Placement ID", value: user.veritalent_id || "N/A" },
    { label: "Internal LPI Report", value: reports.filter((r) => r.type === "internal").length },
    { label: "Institutional LPI Report", value: reports.filter((r) => r.type === "institutional").length },
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
        {loading ? (
          <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading reports...</p>
            </div>
          </div>
        ) : (
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
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="p-2 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-red-600 text-sm mt-3">{error}</p>
        )}

        {filteredReports.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No reports found for the selected filter.
          </div>
        )}
      </div>
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedReport.title}</h3>
                <p className="text-xs text-gray-500">{selectedReport.subtitle}</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="px-6 py-5 space-y-3">
              <p className="text-sm text-gray-700">{selectedReport.description}</p>
              <p className="text-xs text-gray-500">Date: {selectedReport.date}</p>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 rounded-lg bg-brand-primary text-white hover:bg-cyan-700">
                  Open Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}