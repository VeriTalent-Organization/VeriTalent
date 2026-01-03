"use client";

import { useState, useEffect } from "react";
import { useCreateUserStore } from "@/lib/stores/form_submission_store";
import { Key, Plus, Trash2, Edit2, CheckCircle, AlertCircle } from "lucide-react";
import { ProfileHeader } from './profileHeader';
import { TabNavigation } from './tabNavigation';
import { organizationsService, OrganizationResponseDto, VerificationStatusDto } from '@/lib/services/organizationsService';
import { UserMeResponseDto } from '@/lib/services/usersService';
import DomainVerificationModal from './DomainVerificationModal';
import LinkedInVerificationModal from './LinkedInVerificationModal';
import DocumentVerificationModal from './DocumentVerificationModal';

export default function OrganizationProfile() {
  const { user } = useCreateUserStore();
  const [activeTab, setActiveTab] = useState('organization');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Organization data state
  const [orgData, setOrgData] = useState<OrganizationResponseDto | null>(null);
  const [userData, setUserData] = useState<UserMeResponseDto | null>(null);
  
  // Verification status state
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatusDto | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  
  // Modal states
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  // Pricing state
  const [pricingConfig, setPricingConfig] = useState({
    certificateVerificationEnabled: false,
    certificateVerificationPrice: 0,
    customPricingTiers: [] as Array<{ name: string; price: number; description: string }>,
  });
  const [pricingSaving, setPricingSaving] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    linkedinPage: '',
    industry: '',
    location: '',
    website: '',
    size: '',
    rcNumber: '',
  });
  
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'Recruiter', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'Screener', status: 'pending' },
  ]);
  const [tokens, setTokens] = useState([
    { id: 1, name: 'API Token 1', created: '2024-01-15', lastUsed: '2024-12-20', active: true },
  ]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Recruiter');

  // Fetch organization data (user data already in store from root layout)
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('[OrganizationProfile] Starting profile fetch...');
        
        // User data is already in store from root layout
        const userDataFromStore: UserMeResponseDto = {
          id: user.id || '',
          veritalentId: user.veritalent_id || '',
          fullName: user.full_name || '',
          email: user.email || '',
          primaryEmail: user.primary_email || user.email,
          activeRole: user.active_role || 'org_admin',
          roles: user.roles || ['org_admin'],
          location: user.location || user.country,
          organizationName: user.organization_name,
          organizationDomain: user.organization_domain,
          organizationLinkedinPage: user.organization_linkedin_page,
          organisationSize: user.organisation_size,
          organisationRcNumber: user.organisation_rc_number,
          organisationIndustry: user.organisation_industry,
          organisationLocation: user.organisation_location,
        };
        setUserData(userDataFromStore);
        console.log('[OrganizationProfile] User data loaded from store');
        
        // Try to fetch organization data
        try {
          console.log('[OrganizationProfile] Calling /organizations/me...');
          const orgResponse = await organizationsService.getMe();
          console.log('[OrganizationProfile] /organizations/me response:', orgResponse);
          
          if (orgResponse.success && orgResponse.data?.organization) {
            const org = orgResponse.data.organization;
            setOrgData(org);
            console.log('[OrganizationProfile] Organization data set:', org);
            setFormData({
              name: org.name || '',
              domain: org.domain || '',
              linkedinPage: org.linkedinPage || '',
              industry: org.industry || '',
              location: org.location || '',
              website: org.website || '',
              size: org.size || '',
              rcNumber: org.rcNumber || '',
            });
          }
        } catch (orgErr: unknown) {
          // Handle 404 - organization not created yet
          const err = orgErr as { response?: { status?: number; data?: unknown } };
          console.error('[OrganizationProfile] Error fetching organization:', orgErr);
          console.log('[OrganizationProfile] Error status:', err?.response?.status);
          console.log('[OrganizationProfile] Error data:', err?.response?.data);
          
          if (err?.response?.status === 404) {
            console.log('[OrganizationProfile] 404: No organization found - enabling create mode');
            setOrgData(null);
            // Enable editing mode so user can create their organization
            setIsEditing(true);
          } else {
            throw orgErr; // Re-throw other errors
          }
        }
      } catch (err: unknown) {
        console.error('[OrganizationProfile] Fatal error fetching profile data:', err);
        const error = err as { response?: { data?: unknown; status?: number }; message?: string };
        console.log('[OrganizationProfile] Error details:', {
          status: error?.response?.status,
          data: error?.response?.data,
          message: error?.message
        });
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
        console.log('[OrganizationProfile] Fetch complete');
      }
    };
    
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch verification status
  const fetchVerificationStatus = async () => {
    try {
      setVerificationLoading(true);
      const response = await organizationsService.getVerificationStatus();
      if (response.success) {
        setVerificationStatus(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch verification status:', err);
      // Set default status if API fails
      setVerificationStatus({
        domain: { status: 'not_started' },
        linkedin: { status: 'not_started' },
        documents: { status: 'not_started' },
      });
    } finally {
      setVerificationLoading(false);
    }
  };

  // Refresh verification status after modal actions
  const handleVerificationComplete = () => {
    fetchVerificationStatus();
  };

  // Initial fetch of verification status
  useEffect(() => {
    if (orgData) {
      fetchVerificationStatus();
    }
  }, [orgData]);

  // Save organization profile
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      
      console.log('[OrganizationProfile] Starting save...', { hasOrgData: !!orgData });
      
      // Validate required fields
      if (!formData.name || !formData.rcNumber) {
        console.warn('[OrganizationProfile] Validation failed - missing required fields');
        setError('Organization Name and RC Number are required fields.');
        setSaving(false);
        return;
      }
      
      let response;
      
      // If no organization exists, create it; otherwise update
      if (!orgData) {
        console.log('[OrganizationProfile] Creating new organization...');
        console.log('[OrganizationProfile] Payload:', formData);
        response = await organizationsService.create({
          name: formData.name,
          domain: formData.domain,
          linkedinPage: formData.linkedinPage,
          industry: formData.industry,
          location: formData.location,
          website: formData.website,
          size: formData.size || '1-10',
          rcNumber: formData.rcNumber,
        });
        console.log('[OrganizationProfile] Create response:', response);
      } else {
        console.log('[OrganizationProfile] Updating existing organization...');
        console.log('[OrganizationProfile] Payload:', formData);
        response = await organizationsService.update(formData);
        console.log('[OrganizationProfile] Update response:', response);
      }
      
      if (response.success && response.data?.organization) {
        console.log('[OrganizationProfile] Save successful, updating state');
        setOrgData(response.data.organization);
        setIsEditing(false);
      } else {
        console.warn('[OrganizationProfile] Response missing success or data:', response);
      }
    } catch (err: unknown) {
      console.error('[OrganizationProfile] Error saving profile:', err);
      const error = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
      console.log('[OrganizationProfile] Error details:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message
      });
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save changes. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
      console.log('[OrganizationProfile] Save complete');
    }
  };

  // Handle input change
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Cancel editing
  const handleCancelEdit = () => {
    // Reset form data to original org data
    if (orgData) {
      setFormData({
        name: orgData.name || '',
        domain: orgData.domain || '',
        linkedinPage: orgData.linkedinPage || '',
        industry: orgData.industry || '',
        location: orgData.location || '',
        website: orgData.website || '',
        size: orgData.size || '',
        rcNumber: orgData.rcNumber || '',
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const orgTabs = [
    { id: 'organization', label: 'Organization Info' },
    { id: 'verification', label: 'Verification' },
    { id: 'team', label: 'Team Members' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'tokens', label: 'API Tokens' },
    { id: 'account', label: 'Account Settings' },
  ];

  const handleAddMember = () => {
    if (newMemberEmail.trim()) {
      const newMember = {
        id: Math.max(...teamMembers.map(m => m.id), 0) + 1,
        name: newMemberEmail.split('@')[0],
        email: newMemberEmail,
        role: newMemberRole,
        status: 'pending',
      };
      setTeamMembers([...teamMembers, newMember]);
      setNewMemberEmail('');
      setShowAddMember(false);
    }
  };

  const handleRemoveMember = (id: number) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  const handleRevokeToken = (id: number) => {
    setTokens(tokens.filter(t => t.id !== id));
  };

  // Pricing handlers
  const handlePricingChange = (field: string, value: boolean | number) => {
    setPricingConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPricingTier = () => {
    setPricingConfig(prev => ({
      ...prev,
      customPricingTiers: [
        ...prev.customPricingTiers,
        { name: '', price: 0, description: '' }
      ]
    }));
  };

  const handleUpdatePricingTier = (index: number, field: string, value: string | number) => {
    setPricingConfig(prev => ({
      ...prev,
      customPricingTiers: prev.customPricingTiers.map((tier, i) =>
        i === index ? { ...tier, [field]: value } : tier
      )
    }));
  };

  const handleRemovePricingTier = (index: number) => {
    setPricingConfig(prev => ({
      ...prev,
      customPricingTiers: prev.customPricingTiers.filter((_, i) => i !== index)
    }));
  };

  const handleSavePricing = async () => {
    try {
      setPricingSaving(true);
      // TODO: Implement API call to save pricing configuration
      console.log('Saving pricing configuration:', pricingConfig);
      // For now, just show success message
      alert('Pricing configuration saved successfully!');
    } catch (error) {
      console.error('Error saving pricing:', error);
      alert('Failed to save pricing configuration. Please try again.');
    } finally {
      setPricingSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading organization profile...</p>
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
          name={orgData?.name || userData?.fullName || 'Organization'}
          title="Organization Administrator"
          email={userData?.email || user.email || ''}
          initials={orgData?.name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'ORG'}
          onEdit={() => {
            setIsEditing(true);
            setActiveTab('organization');
          }}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Active Listings</p>
            <p className="text-3xl font-bold text-gray-900">12</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Team Members</p>
            <p className="text-3xl font-bold text-gray-900">{teamMembers.filter(m => m.status === 'active').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Verifications Issued</p>
            <p className="text-3xl font-bold text-gray-900">89</p>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <TabNavigation
            tabs={orgTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Organization Information Tab */}
            {activeTab === 'organization' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Organization Information</h2>
                  {!orgData && !isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium text-sm"
                    >
                      Create Organization
                    </button>
                  )}
                </div>
                
                {!orgData && !isEditing && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Organization not found.</strong> Please create your organization profile to continue.
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={userData?.email || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                    <input
                      type="text"
                      value={formData.domain}
                      onChange={(e) => handleInputChange('domain', e.target.value)}
                      disabled={!isEditing}
                      placeholder="company.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., Technology, Finance"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      disabled={!isEditing}
                      placeholder="https://company.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!isEditing}
                      placeholder="City, Country"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Page</label>
                    <input
                      type="url"
                      value={formData.linkedinPage}
                      onChange={(e) => handleInputChange('linkedinPage', e.target.value)}
                      disabled={!isEditing}
                      placeholder="https://linkedin.com/company/..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                    <input
                      type="text"
                      value={formData.size}
                      onChange={(e) => handleInputChange('size', e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., 1-10, 11-50, 51-200"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">RC Number</label>
                    <input
                      type="text"
                      value={formData.rcNumber}
                      onChange={(e) => handleInputChange('rcNumber', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Registration number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">VeriTalent ID</label>
                    <input
                      type="text"
                      value={userData?.veritalentId || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
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
                      {saving ? 'Saving...' : (orgData ? 'Save Changes' : 'Create Organization')}
                    </button>
                    {orgData && (
                      <button 
                        onClick={handleCancelEdit}
                        disabled={saving}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Verification Tab */}
            {activeTab === 'verification' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Organization Verification</h2>
                
                {verificationLoading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading verification status...</p>
                  </div>
                )}

                {!verificationLoading && verificationStatus && (
                  <div className="space-y-4">
                    {/* Domain Verification */}
                    <div className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {verificationStatus.domain.status === 'verified' ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : verificationStatus.domain.status === 'pending' ? (
                              <AlertCircle className="w-5 h-5 text-yellow-600" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-gray-400" />
                            )}
                            <h3 className="font-semibold text-gray-900">Domain Verification</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            Status: <span className={`font-medium ${
                              verificationStatus.domain.status === 'verified' ? 'text-green-700' :
                              verificationStatus.domain.status === 'pending' ? 'text-yellow-700' :
                              'text-gray-700'
                            }`}>
                              {verificationStatus.domain.status === 'verified' ? 'Verified' :
                               verificationStatus.domain.status === 'pending' ? 'Pending' :
                               verificationStatus.domain.status === 'failed' ? 'Failed' :
                               'Not Started'}
                            </span>
                          </p>
                          {verificationStatus.domain.domain && (
                            <p className="text-sm text-gray-600 mb-3">
                              Domain: <span className="font-mono text-gray-900">{verificationStatus.domain.domain}</span>
                            </p>
                          )}
                          {verificationStatus.domain.verifiedAt && (
                            <p className="text-sm text-gray-600">
                              Verified on: {new Date(verificationStatus.domain.verifiedAt).toLocaleDateString()}
                            </p>
                          )}
                          {verificationStatus.domain.status !== 'verified' && (
                            <button
                              onClick={() => setShowDomainModal(true)}
                              className="mt-3 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium text-sm"
                            >
                              {verificationStatus.domain.status === 'pending' ? 'Check Verification' : 'Verify Domain'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* LinkedIn Verification */}
                    <div className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {verificationStatus.linkedin.status === 'verified' ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : verificationStatus.linkedin.status === 'pending' ? (
                              <AlertCircle className="w-5 h-5 text-yellow-600" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-gray-400" />
                            )}
                            <h3 className="font-semibold text-gray-900">LinkedIn Verification</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            Status: <span className={`font-medium ${
                              verificationStatus.linkedin.status === 'verified' ? 'text-green-700' :
                              verificationStatus.linkedin.status === 'pending' ? 'text-yellow-700' :
                              'text-gray-700'
                            }`}>
                              {verificationStatus.linkedin.status === 'verified' ? 'Verified' :
                               verificationStatus.linkedin.status === 'pending' ? 'Pending' :
                               verificationStatus.linkedin.status === 'failed' ? 'Failed' :
                               'Not Started'}
                            </span>
                          </p>
                          {verificationStatus.linkedin.linkedinPage && (
                            <p className="text-sm text-gray-600 mb-3">
                              LinkedIn Page: <a href={verificationStatus.linkedin.linkedinPage} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline break-all">{verificationStatus.linkedin.linkedinPage}</a>
                            </p>
                          )}
                          {verificationStatus.linkedin.verifiedAt && (
                            <p className="text-sm text-gray-600">
                              Verified on: {new Date(verificationStatus.linkedin.verifiedAt).toLocaleDateString()}
                            </p>
                          )}
                          {verificationStatus.linkedin.status !== 'verified' && (
                            <button
                              onClick={() => setShowLinkedInModal(true)}
                              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                              Verify with LinkedIn
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Documents Verification */}
                    <div className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {verificationStatus.documents.status === 'verified' ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : verificationStatus.documents.status === 'pending' ? (
                              <AlertCircle className="w-5 h-5 text-yellow-600" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-gray-400" />
                            )}
                            <h3 className="font-semibold text-gray-900">Document Verification</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            Status: <span className={`font-medium ${
                              verificationStatus.documents.status === 'verified' ? 'text-green-700' :
                              verificationStatus.documents.status === 'pending' ? 'text-yellow-700' :
                              'text-gray-700'
                            }`}>
                              {verificationStatus.documents.status === 'verified' ? 'Verified' :
                               verificationStatus.documents.status === 'pending' ? 'Under Review' :
                               verificationStatus.documents.status === 'failed' ? 'Rejected' :
                               'Not Started'}
                            </span>
                          </p>
                          {verificationStatus.documents.documentType && (
                            <p className="text-sm text-gray-600 mb-3">
                              Document Type: <span className="font-medium">{verificationStatus.documents.documentType}</span>
                            </p>
                          )}
                          {verificationStatus.documents.verifiedAt && (
                            <p className="text-sm text-gray-600">
                              Verified on: {new Date(verificationStatus.documents.verifiedAt).toLocaleDateString()}
                            </p>
                          )}
                          {verificationStatus.documents.status === 'pending' && (
                            <p className="text-sm text-amber-700 bg-amber-50 p-2 rounded mt-2">
                              Your documents are being reviewed. This may take 1-3 business days.
                            </p>
                          )}
                          {verificationStatus.documents.status === 'failed' && (
                            <p className="text-sm text-red-700 bg-red-50 p-2 rounded mt-2">
                              Your documents were rejected. Please upload valid documents.
                            </p>
                          )}
                          {(verificationStatus.documents.status === 'not_started' || verificationStatus.documents.status === 'failed') && (
                            <button
                              onClick={() => setShowDocumentModal(true)}
                              className="mt-3 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium text-sm"
                            >
                              Upload Documents
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Pricing Configuration</h2>
                  <button
                    onClick={handleSavePricing}
                    disabled={pricingSaving}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {pricingSaving ? 'Saving...' : 'Save Configuration'}
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Certificate Verification Pricing */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Verification</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Enable Certificate Verification</label>
                          <p className="text-sm text-gray-500">Allow talent users to request certificate verification</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pricingConfig.certificateVerificationEnabled}
                            onChange={(e) => handlePricingChange('certificateVerificationEnabled', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                        </label>
                      </div>

                      {pricingConfig.certificateVerificationEnabled && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Verification Price (Tokens)
                          </label>
                          <div className="relative max-w-xs">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">₦</span>
                            </div>
                            <input
                              type="number"
                              min="0"
                              step="100"
                              value={pricingConfig.certificateVerificationPrice}
                              onChange={(e) => handlePricingChange('certificateVerificationPrice', parseInt(e.target.value) || 0)}
                              className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                              placeholder="5000"
                            />
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Set the price in tokens for certificate verification</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Custom Pricing Tiers */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Custom Pricing Tiers</h3>
                        <p className="text-sm text-gray-600">Create custom pricing tiers for different services</p>
                      </div>
                      <button
                        onClick={handleAddPricingTier}
                        className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 font-medium text-sm flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Tier
                      </button>
                    </div>

                    <div className="space-y-4">
                      {pricingConfig.customPricingTiers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>No custom pricing tiers configured</p>
                          <p className="text-sm">Add your first tier to get started</p>
                        </div>
                      ) : (
                        pricingConfig.customPricingTiers.map((tier, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Tier Name
                                </label>
                                <input
                                  type="text"
                                  value={tier.name}
                                  onChange={(e) => handleUpdatePricingTier(index, 'name', e.target.value)}
                                  placeholder="e.g., Premium Verification"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Price (Tokens)
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">₦</span>
                                  </div>
                                  <input
                                    type="number"
                                    min="0"
                                    step="100"
                                    value={tier.price}
                                    onChange={(e) => handleUpdatePricingTier(index, 'price', parseInt(e.target.value) || 0)}
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                                    placeholder="10000"
                                  />
                                </div>
                              </div>
                              <div className="flex items-end gap-2">
                                <div className="flex-1">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                  </label>
                                  <input
                                    type="text"
                                    value={tier.description}
                                    onChange={(e) => handleUpdatePricingTier(index, 'description', e.target.value)}
                                    placeholder="Brief description"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                                  />
                                </div>
                                <button
                                  onClick={() => handleRemovePricingTier(index)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                                  title="Remove tier"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Pricing Summary</h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span>Certificate Verification:</span>
                        <span className="font-medium">
                          {pricingConfig.certificateVerificationEnabled
                            ? `₦${pricingConfig.certificateVerificationPrice.toLocaleString()} tokens`
                            : 'Disabled'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Custom Tiers:</span>
                        <span className="font-medium">{pricingConfig.customPricingTiers.length} configured</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-100 rounded-md">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Pricing changes will take effect immediately for new requests.
                        Existing pending requests will use the pricing at the time of request.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team Members Tab */}
            {activeTab === 'team' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
                  <button
                    onClick={() => setShowAddMember(!showAddMember)}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Member
                  </button>
                </div>

                {/* Add Member Form */}
                {showAddMember && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-4">Invite Team Member</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                          placeholder="member@company.com"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select
                          value={newMemberRole}
                          onChange={(e) => setNewMemberRole(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                          <option>Admin</option>
                          <option>Recruiter</option>
                          <option>Screener</option>
                          <option>Reference Issuer</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddMember}
                          className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium"
                        >
                          Send Invite
                        </button>
                        <button
                          onClick={() => {
                            setShowAddMember(false);
                            setNewMemberEmail('');
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Members List */}
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{member.email}</p>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            {member.role}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            member.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {member.status === 'active' ? 'Active' : 'Pending'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm text-brand-primary hover:bg-brand-primary/5 rounded flex items-center gap-1">
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* API Tokens Tab */}
            {activeTab === 'tokens' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">API Tokens</h2>
                  <button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Generate Token
                  </button>
                </div>

                <p className="text-gray-600 mb-6">
                  API tokens allow your team to authenticate requests to VeriTalent&apos;s API. Keep them secure.
                </p>

                <div className="space-y-3">
                  {tokens.map((token) => (
                    <div
                      key={token.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{token.name}</h3>
                        <p className="text-sm text-gray-600">
                          Created: {new Date(token.created).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRevokeToken(token.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
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
                      <p className="text-sm text-gray-600">Your organization account is verified</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">Enforce 2FA for all team members</p>
                    </div>
                    <button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium text-sm">
                      Enable
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">Billing & Subscription</h3>
                      <p className="text-sm text-gray-600">Manage your subscription and billing</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verification Modals */}
      <DomainVerificationModal
        isOpen={showDomainModal}
        onClose={() => setShowDomainModal(false)}
        currentDomain={orgData?.domain}
        onVerificationComplete={handleVerificationComplete}
      />

      <LinkedInVerificationModal
        isOpen={showLinkedInModal}
        onClose={() => setShowLinkedInModal(false)}
        currentLinkedInPage={orgData?.linkedinPage}
        onVerificationComplete={handleVerificationComplete}
      />

      <DocumentVerificationModal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        onVerificationComplete={handleVerificationComplete}
      />
    </div>
  );
}
