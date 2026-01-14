"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { useCreateUserStore } from "@/lib/stores/form_submission_store";
import { userTypes } from "@/types/user_type";
import { jobsService } from "@/lib/services/jobsService";
import { screeningService } from "@/lib/services/screeningService";

export default function DashboardPage() {
  const [expandedJob, setExpandedJob] = useState("JOB-2025-DS-005");
  const [stats, setStats] = useState([
    { title: 'Opened Roles', value: '0', change: '+0%', trend: 'up' },
    { title: 'Applications Received', value: '0', change: '+0%', trend: 'up' },
    { title: 'Interview Shortlist', value: '0', change: '-0%', trend: 'down' },
  ]);
  const [jobRoles, setJobRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useCreateUserStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobs, sessions] = await Promise.all([
          jobsService.getMyPosted(),
          screeningService.getSessions()
        ]);
        // Map jobs to jobRoles format
        setJobRoles(jobs.map((job: any) => ({
          id: job.id,
          screened: sessions.filter((s: any) => s.jobId === job.id).length,
          interviews: 0, // Calculate from sessions
          applicants: [] // Need to fetch applicants separately
        })));
        setStats([
          { title: 'Opened Roles', value: jobs.length.toString(), change: '+0%', trend: 'up' },
          { title: 'Applications Received', value: '0', change: '+0%', trend: 'up' }, // Need API for this
          { title: 'Interview Shortlist', value: '0', change: '-0%', trend: 'down' },
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 sm:space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-linear-to-br from-indigo-50 to-purple-50 border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className={`text-sm font-medium mt-1 ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Screened Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-bold">Screened Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                Screening Performance Rating
              </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900">80%</span>
            </div>
            <Progress value={80} className="h-2" />
            <p className="text-xs text-gray-500">
              Applicants VeriTalent ID ensures optimal screening performances
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Post Job/CV Upload */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          Post Job/CV Upload/VeriTalent ID Upload
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-linear-to-br from-indigo-50 to-purple-50 border-0 cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-1">Post a Job</h3>
              <p className="text-sm text-cyan-600 font-medium">Automated Screening</p>
            </CardContent>
          </Card>
          <Card className="bg-linear-to-br from-indigo-50 to-purple-50 border-0 cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900">Bulk CV Upload</h3>
            </CardContent>
          </Card>
          <Card className="bg-linear-to-br from-indigo-50 to-purple-50 border-0 cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900">VeriTalent ID Upload</h3>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Screening Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-bold">Screening Interface</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 sm:space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 sm:gap-6 border-b border-gray-200 overflow-x-auto">
              <button className="pb-3 px-1 border-b-2 border-gray-900 font-medium text-gray-900 text-sm sm:text-base whitespace-nowrap">
                Opened Roles
              </button>
              <button className="pb-3 px-1 text-gray-500 hover:text-gray-900 text-sm sm:text-base whitespace-nowrap">
                Job ID
              </button>
            </div>

            {/* Table Header - Hidden on mobile */}
            <div className="hidden sm:grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 pb-2 border-b border-gray-200">
              <div className="col-span-4">Job IDs</div>
              <div className="col-span-4">No. Screened</div>
              <div className="col-span-4">No. interview</div>
            </div>

            {/* Job Roles */}
            <div className="space-y-4">
              {jobRoles.map((job) => (
                <div key={job.id} className="space-y-4">
                  {/* Mobile Layout */}
                  <div 
                    className="sm:hidden bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => setExpandedJob(expandedJob === job.id ? '' : job.id)}
                  >
                    <div className="font-medium text-gray-900 mb-2">{job.id}</div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Screened: <span className="font-medium text-gray-900">{job.screened}</span></span>
                      <span className="text-gray-600">Interviews: <span className="font-medium text-gray-900">{job.interviews}</span></span>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div 
                    className="hidden sm:grid grid-cols-12 gap-4 items-center py-3 hover:bg-gray-50 cursor-pointer rounded-lg"
                    onClick={() => setExpandedJob(expandedJob === job.id ? '' : job.id)}
                  >
                    <div className="col-span-4 font-medium text-gray-900">{job.id}</div>
                    <div className="col-span-4 text-gray-700">{job.screened}</div>
                    <div className="col-span-4 text-gray-700">{job.interviews}</div>
                  </div>

                  {/* Expanded Applicants */}
                  {expandedJob === job.id && job.applicants.length > 0 && (
                    <Card className="sm:ml-8 bg-gray-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm sm:text-base font-semibold">
                          Opened Roles - {job.id}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {/* Table Header - Hidden on mobile */}
                          <div className="hidden sm:grid grid-cols-12 gap-4 text-xs font-medium text-gray-600 pb-2 border-b border-gray-200">
                            <div className="col-span-3">Applicant Names</div>
                            <div className="col-span-3">Fit Score</div>
                            <div className="col-span-3">Interview Rating</div>
                            <div className="col-span-3">AI Card</div>
                          </div>

                          {job.applicants.map((applicant: any, idx: number) => (
                            <div key={idx}>
                              {/* Mobile Layout */}
                              <div className="sm:hidden bg-white p-3 rounded-lg space-y-2">
                                <div className="font-medium text-gray-900">{applicant.name}</div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-600">Fit Score:</span>
                                    <span className="ml-1 text-gray-900">{applicant.fitScore}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Interview:</span>
                                    <span className="ml-1 text-gray-900">{applicant.interviewRating}</span>
                                  </div>
                                </div>
                                <div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    applicant.aiCard === 'Available'
                                      ? 'bg-green-100 text-brand-primary'
                                      : 'bg-red-100 text-red-700'
                                  }`}>
                                    {applicant.aiCard}
                                  </span>
                                </div>
                              </div>

                              {/* Desktop Layout */}
                              <div className="hidden sm:grid grid-cols-12 gap-4 items-center text-sm py-2">
                                <div className="col-span-3 text-gray-700">{applicant.name}</div>
                                <div className="col-span-3 text-gray-700">{applicant.fitScore}</div>
                                <div className="col-span-3 text-gray-700">{applicant.interviewRating}</div>
                                <div className="col-span-3">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    applicant.aiCard === 'Available'
                                      ? 'bg-green-100 text-brand-primary'
                                      : 'bg-red-100 text-red-700'
                                  }`}>
                                    {applicant.aiCard}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}