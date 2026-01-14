"use client";

import { useState, useMemo } from "react";
import { useCreateUserStore } from "@/lib/stores/form_submission_store";
import { Mail, Briefcase, Award, Share2, Download, Link as LinkIcon, Trash2, Plus } from "lucide-react";
import { ProfileHeader } from './profileHeader';
import { TabNavigation } from './tabNavigation';
import { EmailVerificationModal } from './EmailVerificationModal';
import CertificateVerificationModal from './CertificateVerificationModal';
import { usersService } from '@/lib/services/usersService';

export default function TalentProfile() {
  const { user } = useCreateUserStore();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  
  // Get career history from talentProfile or use default
  const initialCareerHistory = useMemo(() => {
    if (user.talentProfile?.workExperience && user.talentProfile.workExperience.length > 0) {
      return user.talentProfile.workExperience.map((exp, index) => ({
        id: index + 1,
        title: exp,
        company: '',
        startDate: '',
        endDate: '',
      }));
    }
    return [
      { id: 1, title: 'Senior Developer', company: 'Tech Corp', startDate: '2022', endDate: 'Present' },
    ];
  }, [user.talentProfile]);
  
  const [careerHistory, setCareerHistory] = useState(initialCareerHistory);
  const [newEmail, setNewEmail] = useState('');
  const [additionalEmails, setAdditionalEmails] = useState<Array<{ email: string; primary: boolean; verified: boolean }>>([]);
  const [verificationModal, setVerificationModal] = useState<{ isOpen: boolean; email: string }>({ isOpen: false, email: '' });
  const [certificateModal, setCertificateModal] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Compute linked emails from store data
  const linkedEmailsFromStore = useMemo(() => {
    if (!user.profile_fetched) return [];
    return [
      { email: user.primary_email || user.email, primary: true, verified: true },
      ...(user.linked_emails || []).map((email: string) => ({
        email,
        primary: false,
        verified: true,
      })),
    ];
  }, [user.profile_fetched, user.primary_email, user.email, user.linked_emails]);

  // Merge store emails with locally added emails
  const localLinkedEmails = useMemo(() => {
    return [...linkedEmailsFromStore, ...additionalEmails];
  }, [linkedEmailsFromStore, additionalEmails]);

  const talentTabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'career', label: 'Career History' },
    { id: 'emails', label: 'Linked Emails' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'card', label: 'VeriTalent AI Card' },
    { id: 'account', label: 'Account Settings' },
  ];

  const handleAddEmail = async () => {
    if (!newEmail || !localLinkedEmails.find(e => e.email === newEmail)) {
      setEmailLoading(true);
      setEmailError('');
      try {
        // Add email via backend
        await usersService.addEmail({ email: newEmail });

        // Add to local state as unverified
        setAdditionalEmails([...additionalEmails, { email: newEmail, primary: false, verified: false }]);

        // Open verification modal
        setVerificationModal({ isOpen: true, email: newEmail });
        setNewEmail('');
      } catch (error: any) {
        setEmailError(error.response?.data?.message || 'Failed to add email');
      } finally {
        setEmailLoading(false);
      }
    }
  };

  const handleRemoveEmail = async (email: string) => {
    setEmailLoading(true);
    setEmailError('');
    try {
      await usersService.removeEmail(email);
      // Remove from local state
      setAdditionalEmails(additionalEmails.filter(e => e.email !== email));
    } catch (error: any) {
      setEmailError(error.response?.data?.message || 'Failed to remove email');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleSetPrimaryEmail = async (email: string) => {
    setEmailLoading(true);
    setEmailError('');
    try {
      await usersService.setPrimaryEmail({ email });
      // Update local state
      setAdditionalEmails(
        additionalEmails.map(e => ({
          ...e,
          primary: e.email === email,
        }))
      );
    } catch (error: any) {
      setEmailError(error.response?.data?.message || 'Failed to set primary email');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleAddCareer = () => {
    const newCareer = {
      id: Math.max(...careerHistory.map(c => c.id), 0) + 1,
      title: 'New Position',
      company: 'Company Name',
      startDate: new Date().getFullYear().toString(),
      endDate: 'Present',
    };
    setCareerHistory([...careerHistory, newCareer]);
  };

  const handleVerifyEmail = async (code: string) => {
    setEmailLoading(true);
    setEmailError('');
    try {
      await usersService.verifyEmail({ email: verificationModal.email, code });

      // Update local state to mark as verified
      setAdditionalEmails(
        additionalEmails.map(e =>
          e.email === verificationModal.email ? { ...e, verified: true } : e
        )
      );

      setVerificationModal({ isOpen: false, email: '' });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Verification failed');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleCertificateVerification = async (certificateData: any) => {
    // TODO: Implement certificate verification API call
    console.log('Certificate verification request:', certificateData);
    // For now, just show success message
    alert('Certificate verification request submitted successfully! You will be notified once verification is complete.');
  };

  const handleResendVerificationCode = async () => {
    setEmailLoading(true);
    setEmailError('');
    try {
      await usersService.resendVerificationCode(verificationModal.email);
    } catch (error: any) {
      setEmailError(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleDeleteCareer = (id: number) => {
    setCareerHistory(careerHistory.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <ProfileHeader
          name={user.full_name || 'Talent User'}
          title={user.talentProfile?.careerObjective || 'Professional'}
          email={user.primary_email || user.email || ''}
          initials={user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'T'}
          onEdit={() => {
            setIsEditing(true);
            setActiveTab('personal');
          }}
        />

        {/* VeriTalent AI Card Quick Access */}
        <div className="bg-linear-to-r from-brand-primary to-cyan-600 rounded-lg shadow-md p-6 mb-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Your VeriTalent AI Card</h3>
              <p className="text-cyan-50 mb-3">
                VeriTalent ID: <span className="font-mono font-bold">{user.veritalent_id || 'N/A'}</span>
              </p>
              <p className="text-sm text-cyan-100">
                Your verified AI-powered career profile that showcases your skills, experience, and competency signals
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-4 py-2 bg-white text-brand-primary rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="flex-1 sm:flex-none px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 font-medium flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <TabNavigation
            tabs={talentTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      defaultValue={user.full_name?.split(' ')[0] || ''}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      defaultValue={user.full_name?.split(' ').slice(1).join(' ') || ''}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user.primary_email || user.email || ''}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue=""
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      defaultValue={user.location || ''}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Title</label>
                    <input
                      type="text"
                      defaultValue={user.talentProfile?.careerObjective || ''}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      defaultValue={user.talentProfile?.bio || ''}
                      rows={4}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
                {isEditing && (
                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium"
                    >
                      Save Changes
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Career History Tab */}
            {activeTab === 'career' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Career History</h2>
                  <button
                    onClick={handleAddCareer}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Position
                  </button>
                </div>
                <div className="space-y-4">
                  {careerHistory.map((career) => (
                    <div key={career.id} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                          <input
                            type="text"
                            defaultValue={career.title}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                          <input
                            type="text"
                            defaultValue={career.company}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                          <input
                            type="text"
                            defaultValue={career.startDate}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                          <input
                            type="text"
                            defaultValue={career.endDate}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCareer(career.id)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded flex items-center gap-2 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Linked Emails Tab */}
            {activeTab === 'emails' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Linked Emails</h2>
                <p className="text-gray-600 mb-6">
                  Manage multiple email addresses linked to your account. Use any email to sign in.
                </p>

                {/* Current Linked Emails */}
                <div className="space-y-3 mb-6">
                  {localLinkedEmails.map((emailData) => (
                    <div key={emailData.email} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{emailData.email}</p>
                          <div className="flex gap-2 mt-1">
                            {emailData.primary && (
                              <span className="px-2 py-1 text-xs font-medium bg-brand-primary/10 text-brand-primary rounded">
                                Primary
                              </span>
                            )}
                            {emailData.verified ? (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                Verified
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!emailData.verified && (
                          <button
                            onClick={() => setVerificationModal({ isOpen: true, email: emailData.email })}
                            className="text-sm text-blue-600 hover:bg-blue-50 px-3 py-1 rounded"
                          >
                            Verify
                          </button>
                        )}
                        {!emailData.primary && (
                          <button
                            onClick={() => handleSetPrimaryEmail(emailData.email)}
                            disabled={emailLoading}
                            className="text-sm text-brand-primary hover:bg-brand-primary/5 px-3 py-1 rounded disabled:opacity-50"
                          >
                            Set Primary
                          </button>
                        )}
                        {!emailData.primary && (
                          <button
                            onClick={() => handleRemoveEmail(emailData.email)}
                            disabled={emailLoading}
                            className="text-sm text-red-600 hover:bg-red-50 px-3 py-1 rounded disabled:opacity-50"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Email */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Add New Email</h3>
                  {emailError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{emailError}</p>
                    </div>
                  )}
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Enter email address"
                      disabled={emailLoading}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-50"
                    />
                    <button
                      onClick={handleAddEmail}
                      disabled={!newEmail.trim() || emailLoading}
                      className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium disabled:opacity-50"
                    >
                      {emailLoading ? 'Adding...' : 'Add Email'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VeriTalent AI Card Tab */}
            {activeTab === 'card' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">VeriTalent AI Card</h2>
                <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200 mb-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">VeriTalent ID</p>
                      <p className="font-mono font-bold text-lg text-gray-900">{user.veritalent_id || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Profile Status</p>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${user.talentProfile?.isPublic ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        <p className="font-medium text-gray-900">
                          {user.talentProfile?.isPublic ? 'Public & Verified' : 'Private'}
                        </p>
                      </div>
                    </div>
                    {user.talentProfile?.shareableLink && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Shareable Link</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={user.talentProfile.shareableLink}
                            className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(user.talentProfile?.shareableLink || '');
                              alert('Link copied to clipboard!');
                            }}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Card Contents</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="w-4 h-4 text-brand-primary" />
                          <span>Skills & Competency ({user.talentProfile?.skills?.length || 0})</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4 text-brand-primary" />
                          <span>Work Experience ({user.talentProfile?.workExperience?.length || 0})</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="w-4 h-4 text-brand-primary" />
                          <span>Education ({user.talentProfile?.education?.length || 0})</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <LinkIcon className="w-4 h-4 text-brand-primary" />
                          <span>LinkedIn {user.linkedin_connected ? 'Connected' : 'Not Connected'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share Card
                  </button>
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export as PDF
                  </button>
                </div>
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Certificates</h2>
                  <button
                    onClick={() => setCertificateModal(true)}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 font-medium flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Request Verification
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Pending Verifications */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">Pending Verifications</h3>
                    <p className="text-sm text-yellow-700">No pending certificate verifications.</p>
                  </div>

                  {/* Verified Certificates */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">Verified Certificates</h3>
                    <p className="text-sm text-green-700">No verified certificates yet.</p>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Certificate Verification</h3>
                    <p className="text-sm text-blue-700">
                      Upload your certificates for verification by our team. Verified certificates add credibility to your profile and help employers trust your qualifications.
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 list-disc list-inside space-y-1">
                      <li>Supported formats: PDF, JPG, PNG</li>
                      <li>Maximum file size: 5MB</li>
                      <li>Verification typically takes 2-3 business days</li>
                      <li>You'll receive a notification once verification is complete</li>
                    </ul>
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={verificationModal.isOpen}
        onClose={() => setVerificationModal({ isOpen: false, email: '' })}
        email={verificationModal.email}
        onVerify={handleVerifyEmail}
        onResendCode={handleResendVerificationCode}
        isLoading={emailLoading}
        error={emailError}
      />

      {/* Certificate Verification Modal */}
      <CertificateVerificationModal
        isOpen={certificateModal}
        onClose={() => setCertificateModal(false)}
        onSubmit={handleCertificateVerification}
      />
    </div>
  );
}
