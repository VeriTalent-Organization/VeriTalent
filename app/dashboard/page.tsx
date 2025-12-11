"use client";

import React, { useState } from "react";
// import { Search, Plus, User } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
// import Link from "next/link";

// KEEP your full main content here — unchanged except sidebar removed
export default function DashboardPage() {
  const [expandedJob, setExpandedJob] = useState("JOB-2025-DS-005");

  const stats = [
    { title: 'Opened Roles', value: '10', change: '+10%', trend: 'up' },
    { title: 'Applications Received', value: '100', change: '+20%', trend: 'up' },
    { title: 'Interview Shortlist', value: '50', change: '-5%', trend: 'down' },
  ];

  const jobRoles = [
    {
      id: 'JOB-2025-DS-005',
      screened: 20,
      interviews: 5,
      applicants: [
        { name: 'Sam Sulek', fitScore: '60%', interviewRating: '72%', aiCard: 'Available' },
        { name: 'Parlola Ajayi', fitScore: '57%', interviewRating: '73%', aiCard: 'Available' },
        { name: 'Peace Olayemi', fitScore: '40%', interviewRating: '-', aiCard: 'Not available' },
      ]
    },
    { id: 'REF-2025-FED-003', screened: 32, interviews: 15, applicants: [] },
    { id: 'REQ-2025-SWE-001', screened: 19, interviews: 6, applicants: [] },
  ];


  return (
    <>

      {/* Dashboard Content */}
      <div className="p-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, index) => (
            <Card key={index} className="bg-linear-to-br from-indigo-50 to-purple-50 border-0">
                <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                    {stat.title}
                </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
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
            <CardTitle className="text-xl font-bold">Screened Tracker</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                    Screening Performance Rating
                </span>
                <span className="text-sm font-bold text-gray-900">80%</span>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">
            Post Job/CV Upload/VeriTalent ID Upload
            </h2>
            <div className="grid grid-cols-3 gap-4">
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
            <CardTitle className="text-xl font-bold">Screening Interface</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-6">
                {/* Tabs */}
                <div className="flex gap-6 border-b border-gray-200">
                <button className="pb-3 px-1 border-b-2 border-gray-900 font-medium text-gray-900">
                    Opened Roles
                </button>
                <button className="pb-3 px-1 text-gray-500 hover:text-gray-900">
                    Job ID
                </button>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 pb-2 border-b border-gray-200">
                <div className="col-span-4">Job IDs</div>
                <div className="col-span-4">No. Screened</div>
                <div className="col-span-4">No. interview</div>
                </div>

                {/* Job Roles */}
                <div className="space-y-4">
                {jobRoles.map((job) => (
                    <div key={job.id} className="space-y-4">
                    <div 
                        className="grid grid-cols-12 gap-4 items-center py-3 hover:bg-gray-50 cursor-pointer rounded-lg"
                        onClick={() => setExpandedJob(expandedJob === job.id ? '' : job.id)}
                    >
                        <div className="col-span-4 font-medium text-gray-900">{job.id}</div>
                        <div className="col-span-4 text-gray-700">{job.screened}</div>
                        <div className="col-span-4 text-gray-700">{job.interviews}</div>
                    </div>

                    {/* Expanded Applicants */}
                    {expandedJob === job.id && job.applicants.length > 0 && (
                        <Card className="ml-8 bg-gray-50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">
                            Opened Roles - {job.id}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-600 pb-2 border-b border-gray-200">
                                <div className="col-span-3">Applicant Names</div>
                                <div className="col-span-3">Fit Score</div>
                                <div className="col-span-3">Interview Rating</div>
                                <div className="col-span-3">AI Card</div>
                            </div>
                            {job.applicants.map((applicant, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-4 items-center text-sm py-2">
                                <div className="col-span-3 text-gray-700">{applicant.name}</div>
                                <div className="col-span-3 text-gray-700">{applicant.fitScore}</div>
                                <div className="col-span-3 text-gray-700">{applicant.interviewRating}</div>
                                <div className="col-span-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    applicant.aiCard === 'Available'
                                        ? 'bg-green-100 text-brand-primary '
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                    {applicant.aiCard}
                                    </span>
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
    </>
  );
}
