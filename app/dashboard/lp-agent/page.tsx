"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MaxWidthContainer from "@/components/reuseables/max_width_container";
import { useCreateUserStore } from "@/lib/stores/form_submission_store";
import { userTypes } from "@/types/user_type";
import { Users, FileText, TrendingUp, Award, Upload, LinkIcon, RefreshCw, Download } from "lucide-react";
import RoleGuard from "@/components/guards/RoleGuard";
import {
  createSubmission,
  getProcessingStatus,
  listReportsWithSignals,
  listSubmissions,
  retrySubmission,
  type LearnerSubmission,
  type ProcessingSummary,
  type LPIReportWithSignals,
} from "@/lib/services/lpiService";

type ViewMode = "submissions" | "processing" | "reports";

const pageSize = 5;

export default function InstitutionalLPIAgentPage() {
  const router = useRouter();
  const { user } = useCreateUserStore();
  const [activeView, setActiveView] = useState<ViewMode>("submissions");
  const [submissions, setSubmissions] = useState<LearnerSubmission[]>([]);
  const [processing, setProcessing] = useState<ProcessingSummary | null>(null);
  const [reports, setReports] = useState<LPIReportWithSignals[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [uploading, setUploading] = useState(false);

  // Manual submission form state
  const [form, setForm] = useState({
    learnerName: "",
    learnerEmail: "",
    program: "",
    submissionType: "Project",
    link: "",
    notes: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const isOrg = user?.user_type === userTypes.ORGANISATION;

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [subs, proc, reps] = await Promise.all([
          listSubmissions().catch(() => []),
          getProcessingStatus().catch(() => null),
          listReportsWithSignals().catch(() => []),
        ]);

        setSubmissions(subs);
        setProcessing(proc);
        setReports(reps);
      } catch (err) {
        setError((err as { message?: string })?.message || "Failed to load LPI data.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const totalLearners = submissions.length;
    const reportsCount = reports.length;
    const signalsCount = reports.reduce((acc, r) => acc + (r.competencySignals?.length || 0), 0);
    const processed = processing?.processed ?? 0;
    return [
      { label: "Total Learners/Interns", value: totalLearners, icon: Users },
      { label: "Submissions", value: submissions.length, icon: FileText },
      { label: "AI Reports Generated", value: reportsCount, icon: TrendingUp },
      { label: "Competency Signals", value: signalsCount, icon: Award },
      { label: "Processed", value: processed, icon: TrendingUp },
    ];
  }, [submissions, reports, processing]);

  const pagedSubmissions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return submissions.slice(start, start + pageSize);
  }, [page, submissions]);

  const totalPages = Math.max(1, Math.ceil(submissions.length / pageSize));

  const handleRetry = async (id: string) => {
    await retrySubmission(id);
    const [subs, proc] = await Promise.all([
      listSubmissions().catch(() => submissions),
      getProcessingStatus().catch(() => processing),
    ]);
    setSubmissions(subs);
    setProcessing(proc);
  };

  const handleUpload = async () => {
    if (!form.learnerName || !form.learnerEmail) {
      setError("Learner name and email are required.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("learnerName", form.learnerName);
      data.append("learnerEmail", form.learnerEmail);
      data.append("program", form.program);
      data.append("submissionType", form.submissionType);
      if (form.link) data.append("link", form.link);
      if (form.notes) data.append("notes", form.notes);
      if (file) data.append("file", file);

      await createSubmission(data);

      const subs = await listSubmissions();
      setSubmissions(subs);
      setFile(null);
      setForm({ learnerName: "", learnerEmail: "", program: "", submissionType: "Project", link: "", notes: "" });
    } catch (err) {
      setError((err as { message?: string })?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleConfigureIntegration = () => {
    alert("Integration configuration is not wired to backend yet. Provide LMS webhook/API settings when available.");
  };

  return (
    <RoleGuard allowedRoles={['org_admin']}>
      <MaxWidthContainer large className="py-6 sm:py-8">
        {!isOrg && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-sm text-gray-700">
              The Institutional LPI Agent is available for Organization accounts only.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-4 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
        )}

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Institutional Learning & Performance Intelligence Agent
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Manage learner/intern submissions, AI processing, and competency reports for your organization.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-600">{stat.label}</span>
              <stat.icon className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* View Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { id: "submissions" as const, label: "Learner Submissions" },
          { id: "processing" as const, label: "AI Processing" },
          { id: "reports" as const, label: "Reports & Signals" },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeView === view.id
                ? "bg-brand-primary text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {activeView === "submissions" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Learner/Intern Submissions</h3>
            <p className="text-sm text-gray-600 mb-4">
              Integrate and manage submissions from learners and interns within your organization.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4 lg:col-span-2">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Integration Setup</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Connect your LMS or send submissions via API. Manual uploads are also supported below.
                    </p>
                  </div>
                  <button
                    onClick={handleConfigureIntegration}
                    className="px-4 py-2 bg-brand-primary text-white text-sm rounded-lg hover:bg-cyan-700 transition"
                  >
                    Configure
                  </button>
                </div>
                <div className="text-sm text-gray-500">Integration API path: /api/lpi/submissions</div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Manual Submission Upload</h4>
                <div className="space-y-3">
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Learner name"
                    value={form.learnerName}
                    onChange={(e) => setForm({ ...form, learnerName: e.target.value })}
                  />
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Learner email"
                    value={form.learnerEmail}
                    onChange={(e) => setForm({ ...form, learnerEmail: e.target.value })}
                  />
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Program / Cohort"
                    value={form.program}
                    onChange={(e) => setForm({ ...form, program: e.target.value })}
                  />
                  <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    value={form.submissionType}
                    onChange={(e) => setForm({ ...form, submissionType: e.target.value })}
                  >
                    <option value="Project">Project</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Log/Reflection">Log/Reflection</option>
                  </select>
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Link (optional)"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                  />
                  <textarea
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Notes (optional)"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="text-sm text-gray-600"
                    />
                  </label>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full px-4 py-2 bg-brand-primary text-white text-sm rounded-lg hover:bg-cyan-700 transition disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : "Upload Submission"}
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Submissions</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Status legend:</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">Queued</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-50 text-yellow-700">Processing</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-50 text-green-700">Completed</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-red-50 text-red-700">Failed</span>
                </div>
              </div>

              {isLoading ? (
                <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading submissions...</p>
                  </div>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-sm text-gray-500">No submissions yet. Configure integration or upload manually.</div>
              ) : (
                <div className="space-y-3">
                  {pagedSubmissions.map((sub) => (
                    <div key={sub.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{sub.learnerName}</div>
                          <div className="text-xs text-gray-600">{sub.learnerEmail}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sub.status === "queued"
                            ? "bg-blue-50 text-blue-700"
                            : sub.status === "processing"
                            ? "bg-yellow-50 text-yellow-700"
                            : sub.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-600 flex items-center gap-2">
                        <span>{sub.program}</span>
                        <span>•</span>
                        <span>{sub.submissionType}</span>
                        <span>•</span>
                        <span>{new Date(sub.submittedAt).toLocaleString()}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-brand-primary">
                        {sub.downloadUrl && (
                          <a href={sub.downloadUrl} className="flex items-center gap-1 hover:underline" target="_blank" rel="noreferrer">
                            <LinkIcon className="w-3 h-3" /> View
                          </a>
                        )}
                        {sub.status === "failed" && sub.failureReason && (
                          <span className="text-red-600">{sub.failureReason}</span>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-2 text-sm text-gray-700">
                    <span>
                      Page {page} of {totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 border rounded-md disabled:opacity-50"
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 border rounded-md disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === "processing" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Processing & Analysis</h3>
            <p className="text-sm text-gray-600 mb-4">
              AI-powered analysis of learner submissions to generate performance insights.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {[{
                label: "Processed",
                value: processing?.processed ?? 0,
                tone: "text-green-700",
              }, {
                label: "In Queue",
                value: processing?.inQueue ?? 0,
                tone: "text-yellow-700",
              }, {
                label: "Failed",
                value: processing?.failed ?? 0,
                tone: "text-red-700",
              }].map((item) => (
                <div key={item.label} className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className={`text-2xl font-bold ${item.tone}`}>{item.value}</div>
                  <div className="text-sm text-gray-700">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">Failed Items</h4>
                  <p className="text-sm text-gray-600">Retry failed submissions.</p>
                </div>
              </div>

              {!processing?.failedItems || processing.failedItems.length === 0 ? (
                <div className="text-sm text-gray-500">No failed items.</div>
              ) : (
                <div className="space-y-2">
                  {processing.failedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{item.learnerName}</div>
                        <div className="text-xs text-gray-600">{item.reason || "No reason provided"}</div>
                      </div>
                      <button
                        onClick={() => handleRetry(item.id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <RefreshCw className="w-4 h-4" /> Retry
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === "reports" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Reports & Competency Signals</h3>
            <p className="text-sm text-gray-600 mb-4">
              View generated reports and competency signals for your learners and interns.
            </p>

            {isLoading ? (
              <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading reports...</p>
                </div>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-sm text-gray-500">No reports available yet.</div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{report.title}</div>
                        <div className="text-xs text-gray-600">{report.learnerName || "Unknown learner"}</div>
                        <div className="text-xs text-gray-500">{report.date}</div>
                      </div>
                      {report.downloadUrl && (
                        <a
                          href={report.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-sm text-brand-primary hover:underline"
                        >
                          <Download className="w-4 h-4" /> Download
                        </a>
                      )}
                    </div>

                    {report.competencySignals && report.competencySignals.length > 0 && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {report.competencySignals.map((sig) => (
                          <div key={sig.label} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center justify-between text-sm text-blue-900 font-semibold">
                              <span>{sig.label}</span>
                              <span>{sig.score}%</span>
                            </div>
                            <div className="mt-2 h-2 bg-blue-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600"
                                style={{ width: `${Math.min(100, Math.max(0, sig.score))}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </MaxWidthContainer>
    </RoleGuard>
  );
}
