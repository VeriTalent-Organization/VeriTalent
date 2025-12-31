"use client";

import { useState, useEffect } from "react";
import { useCreateUserStore } from "@/lib/stores/form_submission_store";
import { Key, Building2, Users, Eye, Trash2, AlertCircle } from "lucide-react";
import { ProfileHeader } from './profileHeader';
import { TabNavigation } from './tabNavigation';
import { usersService } from '@/lib/services/usersService';

export default function RecruiterProfile() {
  const { user } = useCreateUserStore();
  const [activeTab, setActiveTab] = useState('professional');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    professionalDesignation: '',
    recruiterOrganizationName: '',
    professionalStatus: '',
    phone: '',
    location: '',
    bio: '',
    linkedinUrl: '',
  });
  
  const [tokens, setTokens] = useState([
    { id: 1, name: 'API Token 1', created: '2024-01-15', lastUsed: '2024-12-20', active: true },
    { id: 2, name: 'API Token 2', created: '2023-06-10', lastUsed: '2024-12-15', active: true },
  ]);
  const [showNewTokenForm, setShowNewTokenForm] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');

  // Load user profile data from store on mount
  useEffect(() => {
    // User data is already fetched in root layout and available in store
    setFormData({
      fullName: user.full_name || '',
      email: user.email || '',
      professionalDesignation: user.current_designation || '',
      recruiterOrganizationName: user.organisation_name || '',
      professionalStatus: user.professional_status || 'Recruiter',
      phone: '',
      location: user.location || user.country || '',
      bio: '',
      linkedinUrl: '',
    });
    setLoading(false);
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      
      await usersService.updateRecruiterProfile({
        professionalDesignation: formData.professionalDesignation,
        recruiterOrganizationName: formData.recruiterOrganizationName,
        professionalStatus: formData.professionalStatus || 'Recruiter',
        bio: formData.bio,
        linkedinUrl: formData.linkedinUrl,
        phone: formData.phone,
      });
      
      setIsEditing(false);
    } catch (err: unknown) {
      console.error('[RecruiterProfile] Error saving profile:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data if needed
    setIsEditing(false);
    setError(null);
  };

  const recruiterTabs = [
    { id: 'professional', label: 'Professional Info' },
    { id: 'tokens', label: 'API Tokens' },
    { id: 'roles', label: 'Role & Permissions' },
    { id: 'account', label: 'Account Settings' },
  ];

  const handleGenerateToken = () => {
    if (newTokenName.trim()) {
      const newToken = {
        id: Math.max(...tokens.map(t => t.id), 0) + 1,
        name: newTokenName,
        created: new Date().toISOString().split('T')[0],
        lastUsed: 'Never',
        active: true,
      };
      setTokens([...tokens, newToken]);
      setNewTokenName('');
      setShowNewTokenForm(false);
    }
  };

  const handleRevokeToken = (id: number) => {
    setTokens(tokens.filter(t => t.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Profile Header */}
        <ProfileHeader
          name={formData.fullName || 'Recruiter'}
          title={formData.professionalDesignation || 'Independent Recruiter'}
          email={formData.email || ''}
          initials={formData.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'R'}
          onEdit={() => {
            setIsEditing(true);
            setActiveTab('professional');
          }}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Active Job Postings</p>
            <p className="text-3xl font-bold text-gray-900">5</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Applicants Screened</p>
            <p className="text-3xl font-bold text-gray-900">247</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Recommendations Issued</p>
            <p className="text-3xl font-bold text-gray-900">32</p>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <TabNavigation
            tabs={recruiterTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Professional Information Tab */}
            {activeTab === 'professional' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Professional Designation</label>
                    <input
                      type="text"
                      value={formData.professionalDesignation}
                      onChange={(e) => handleInputChange('professionalDesignation', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                    <input
                      type="text"
                      value={formData.recruiterOrganizationName}
                      onChange={(e) => handleInputChange('recruiterOrganizationName', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                      disabled={!isEditing}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
                {isEditing && (
                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* API Tokens Tab */}
            {activeTab === 'tokens' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">API Tokens</h2>
                  <button
                    onClick={() => setShowNewTokenForm(!showNewTokenForm)}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium flex items-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    Generate Token
                  </button>
                </div>

                <p className="text-gray-600 mb-6">
                  API tokens allow you to authenticate requests to VeriTalent&apos;s API. Keep them secure and never share them.
                </p>

                {/* Generate New Token Form */}
                {showNewTokenForm && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-4">Generate New Token</h3>
                    <div className="flex gap-2 flex-col sm:flex-row">
                      <input
                        type="text"
                        value={newTokenName}
                        onChange={(e) => setNewTokenName(e.target.value)}
                        placeholder="Token name (e.g., 'Screening API')"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                      <button
                        onClick={handleGenerateToken}
                        className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium"
                      >
                        Generate
                      </button>
                      <button
                        onClick={() => {
                          setShowNewTokenForm(false);
                          setNewTokenName('');
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Tokens List */}
                <div className="space-y-3">
                  {tokens.map((token) => (
                    <div
                      key={token.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{token.name}</h3>
                        <p className="text-sm text-gray-600">
                          Created: {new Date(token.created).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Last used: {token.lastUsed}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {token.active && (
                          <button className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        )}
                        <button
                          onClick={() => handleRevokeToken(token.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Role & Permissions Tab */}
            {activeTab === 'roles' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Role & Permissions</h2>
                <div className="space-y-4">
                  <div className="p-4 sm:p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-4">
                      <Users className="w-6 h-6 text-brand-primary mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">Current Role</h3>
                        <p className="text-gray-600 mb-3">Independent Recruiter</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            Manage Job Postings
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            Screen Candidates
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            Issue Recommendations
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 border border-gray-200 rounded-lg bg-blue-50">
                    <div className="flex items-start gap-4">
                      <Building2 className="w-6 h-6 text-brand-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Switch to Organization Admin</h3>
                        <p className="text-gray-600 mb-4">
                          If you also manage an organization on VeriTalent, you can switch roles from the top navigation menu.
                        </p>
                        <button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium text-sm">
                          Go to Organization
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === 'account' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">Account Status</h3>
                      <p className="text-sm text-gray-600">Your account is active and verified</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">Add extra security to your account</p>
                    </div>
                    <button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium text-sm">
                      Enable
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">Data Export</h3>
                      <p className="text-sm text-gray-600">Download a copy of your account data</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm">
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
