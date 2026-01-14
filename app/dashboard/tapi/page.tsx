"use client";
import React, { useEffect, useState } from "react";
import RoleGuard from '@/components/guards/RoleGuard';
import { tapiService } from '@/lib/services/tapiService';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TapiSubmission {
  id?: string;
  _id?: string;
  name?: string;
  title?: string;
  description?: string;
  summary?: string;
  cohort_id?: string;
  assessment_type?: string;
  status?: string;
  submitted_at?: string;
  participant_count?: number;
}

const TapiDashboard = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cohorts' | 'upload'>('cohorts');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submissions, setSubmissions] = useState<TapiSubmission[]>([]);
  const [report, setReport] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await tapiService.getMySubmissions() as unknown;
      // Ensure we always store an array. API may return object or array.
      let items: TapiSubmission[] = [];
      if (Array.isArray(res)) items = res as TapiSubmission[];
      else if (res == null) items = [];
      else if (Array.isArray((res as unknown as { data?: unknown }).data)) items = (res as unknown as { data: TapiSubmission[] }).data;
      else if (Array.isArray((res as unknown as { submissions?: unknown }).submissions)) items = (res as unknown as { submissions: TapiSubmission[] }).submissions;
      else items = [res as TapiSubmission];

      setSubmissions(items);
    } catch (err) {
      console.error('Failed to fetch submissions', err);
    }
  };

  const handleCreateCohort = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const payload = { name, description };
      const created = await tapiService.createCohort(payload as unknown as Record<string, unknown>);
      setMessage('Cohort created');
      // Refresh submissions/list
      fetchSubmissions();
      setName('');
      setDescription('');
      console.log('Cohort created', created);
    } catch (err) {
      console.error(err);
      setMessage('Failed to create cohort');
    } finally {
      setLoading(false);
    }
  };

  const handleGetReport = async (cohortId: string) => {
    setLoading(true);
    try {
      const r = await tapiService.getCohortReport(cohortId);
      setReport(r);
    } catch (err) {
      console.error('Failed to get report', err);
    } finally {
      setLoading(false);
    }
  };

  // Derived stats
  const reviewedCount = submissions.length;
  const cohortsCount = Array.from(new Set(submissions.map(s => s.cohort_id || s.id || s.assessment_type))).length;
  const talentsCount = '—'; // TODO: replace when API returns participant counts directly

  return (
    <RoleGuard allowedRoles={["org_admin"]}>
      <div className="p-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Talent Activity & Performance Intelligence</h1>
          <p className="text-xs sm:text-sm text-gray-600">Manage and analyze talent cohorts, activities, and performance metrics</p>
          {message && <div className="mt-3 text-sm text-emerald-700">{message}</div>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Cohorts</div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '...' : cohortsCount}</div>
            </div>
            <div className="bg-slate-100 rounded p-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-700"><path d="M12 12a5 5 0 100-10 5 5 0 000 10z" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Talents</div>
              <div className="text-2xl font-bold text-gray-900">{talentsCount}</div>
            </div>
            <div className="bg-pink-100 rounded p-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-700"><path d="M12 2v6" stroke="#be185d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Reviewed</div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '...' : reviewedCount}</div>
            </div>
            <div className="bg-emerald-100 rounded p-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-700"><path d="M20 6L9 17l-5-5" stroke="#065f46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-8">
              <button className={`pb-3 text-sm font-medium ${activeTab === 'cohorts' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setActiveTab('cohorts')}>Cohorts & Talents</button>
              <button className={`pb-3 text-sm font-medium ${activeTab === 'upload' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setActiveTab('upload')}>Activity Upload & Review</button>
            </div>
            <div>
              <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 bg-brand-primary text-white px-3 py-2 rounded-md"><Plus className="w-4 h-4" /> Add New Cohort</button>
            </div>
          </div>

          <div className="mt-6">
            {activeTab === 'cohorts' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Cohorts</h3>
                <div className="overflow-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="text-xs text-gray-500">
                        <th className="py-2">Cohort Name</th>
                        <th className="py-2">Talent No.</th>
                        <th className="py-2">Reviews No.</th>
                        <th className="py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.length === 0 && (
                        <tr><td colSpan={4} className="py-4 text-center text-gray-500">No cohorts yet</td></tr>
                      )}
                      {submissions.map((s: TapiSubmission, idx: number) => (
                        <tr key={s.id || idx} className="border-t">
                          <td className="py-3">{s.name || s.title || s.assessment_type || 'Submission'}</td>
                          <td className="py-3">{s.participant_count ?? '—'}</td>
                          <td className="py-3">{s.status || '—'}</td>
                          <td className="py-3 text-sm"><button className="text-brand-primary hover:underline" onClick={() => handleGetReport(s.cohort_id || s.id || '')}>Edit Table</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'upload' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Activity Upload & Review</h3>
                <div className="text-sm text-gray-600">Use the upload flow to submit cohort activities or review submissions.</div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Recent Submissions</h4>
                  <ul className="space-y-2">
                    {submissions.length === 0 && <li className="text-gray-500">No submissions yet</li>}
                    {submissions.map((s: TapiSubmission, i: number) => (
                      <li key={s.id || i} className="bg-gray-50 border border-gray-100 rounded p-3 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{s.assessment_type || s.name || s.title || 'Submission'}</div>
                          <div className="text-xs text-gray-500">{s.submitted_at ? new Date(s.submitted_at).toLocaleString() : '—'}</div>
                        </div>
                        <div className="text-xs text-gray-500">{s.status}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Create new cohort</h3>
            <label className="block text-sm text-gray-700 mb-1">Cohort name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-3 px-3 py-2 border rounded" />

            <label className="block text-sm text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mb-3 px-3 py-2 border rounded" rows={3} />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="px-3 py-2 rounded border">Cancel</button>
              <Button onClick={handleCreateCohort} disabled={loading || !name}>{loading ? 'Creating...' : 'Create'}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Cohort report (if any) */}
      {report && (
        <div className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">Cohort report</h3>
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(report, null, 2)}</pre>
          </div>
        </div>
      )}
    </RoleGuard>
  );
};

export default TapiDashboard;
