"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Briefcase, Clock, Target, BarChart3, PieChart } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';

interface AnalyticsData {
  applicationTrends: Array<{
    date: string;
    applications: number;
    interviews: number;
    hires: number;
  }>;
  candidateSources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  timeToHire: {
    average: number;
    median: number;
    range: [number, number];
  };
  referenceVerification: {
    total: number;
    verified: number;
    pending: number;
    rejected: number;
  };
  jobPerformance: Array<{
    jobId: string;
    title: string;
    applications: number;
    interviews: number;
    hires: number;
    avgTimeToHire: number;
  }>;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function OrganizationAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const { user } = useCreateUserStore();

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockData: AnalyticsData = {
        applicationTrends: [
          { date: '2024-01-01', applications: 12, interviews: 3, hires: 1 },
          { date: '2024-01-08', applications: 18, interviews: 5, hires: 2 },
          { date: '2024-01-15', applications: 25, interviews: 8, hires: 1 },
          { date: '2024-01-22', applications: 32, interviews: 12, hires: 3 },
          { date: '2024-01-29', applications: 28, interviews: 9, hires: 2 },
          { date: '2024-02-05', applications: 35, interviews: 15, hires: 4 },
        ],
        candidateSources: [
          { source: 'LinkedIn', count: 45, percentage: 35 },
          { source: 'Company Website', count: 32, percentage: 25 },
          { source: 'Indeed', count: 28, percentage: 22 },
          { source: 'Referrals', count: 18, percentage: 14 },
          { source: 'Other', count: 6, percentage: 4 },
        ],
        timeToHire: {
          average: 21,
          median: 18,
          range: [7, 45],
        },
        referenceVerification: {
          total: 156,
          verified: 142,
          pending: 8,
          rejected: 6,
        },
        jobPerformance: [
          { jobId: 'JOB-001', title: 'Senior Software Engineer', applications: 45, interviews: 12, hires: 2, avgTimeToHire: 18 },
          { jobId: 'JOB-002', title: 'Product Manager', applications: 32, interviews: 8, hires: 1, avgTimeToHire: 25 },
          { jobId: 'JOB-003', title: 'UX Designer', applications: 28, interviews: 6, hires: 1, avgTimeToHire: 15 },
          { jobId: 'JOB-004', title: 'Data Analyst', applications: 22, interviews: 5, hires: 1, avgTimeToHire: 22 },
        ],
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-600">Analytics data will appear once you have active job postings.</p>
        </div>
      </div>
    );
  }

  const totalApplications = analyticsData.applicationTrends.reduce((sum, item) => sum + item.applications, 0);
  const totalInterviews = analyticsData.applicationTrends.reduce((sum, item) => sum + item.interviews, 0);
  const totalHires = analyticsData.applicationTrends.reduce((sum, item) => sum + item.hires, 0);
  const conversionRate = totalApplications > 0 ? ((totalHires / totalApplications) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Organization Analytics
          </h1>
          <p className="text-gray-600">
            Insights into your hiring performance and candidate pipeline
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex gap-2">
            {[
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' },
              { value: '1y', label: '1 Year' },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range.value
                    ? 'bg-brand-primary text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12%
                </span>
                {' '}from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalApplications > 0 ? ((totalInterviews / totalApplications) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {totalInterviews} interviews scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {totalHires} successful hires
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time to Hire</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.timeToHire.average} days</div>
              <p className="text-xs text-muted-foreground">
                Median: {analyticsData.timeToHire.median} days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Application Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Application Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.applicationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value, name) => [value, name === 'applications' ? 'Applications' : name === 'interviews' ? 'Interviews' : 'Hires']}
                  />
                  <Area type="monotone" dataKey="applications" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="interviews" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="hires" stackId="3" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Candidate Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Candidate Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={analyticsData.candidateSources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analyticsData.candidateSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Candidates']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Job Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Job Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.jobPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="title"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#3B82F6" name="Applications" />
                  <Bar dataKey="interviews" fill="#10B981" name="Interviews" />
                  <Bar dataKey="hires" fill="#F59E0B" name="Hires" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Reference Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Reference Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total References</span>
                  <span className="text-2xl font-bold text-gray-900">{analyticsData.referenceVerification.total}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Verified</span>
                    </div>
                    <span className="text-sm font-medium">{analyticsData.referenceVerification.verified}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Pending</span>
                    </div>
                    <span className="text-sm font-medium">{analyticsData.referenceVerification.pending}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Rejected</span>
                    </div>
                    <span className="text-sm font-medium">{analyticsData.referenceVerification.rejected}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {((analyticsData.referenceVerification.verified / analyticsData.referenceVerification.total) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Verification Rate</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Detailed Job Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Job Title</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Applications</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Interviews</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Hires</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Conversion</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Avg. Time to Hire</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.jobPerformance.map((job, index) => (
                    <tr key={job.jobId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{job.title}</td>
                      <td className="py-3 px-4 text-center">{job.applications}</td>
                      <td className="py-3 px-4 text-center">{job.interviews}</td>
                      <td className="py-3 px-4 text-center">{job.hires}</td>
                      <td className="py-3 px-4 text-center">
                        {job.applications > 0 ? ((job.hires / job.applications) * 100).toFixed(1) : 0}%
                      </td>
                      <td className="py-3 px-4 text-center">{job.avgTimeToHire} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}