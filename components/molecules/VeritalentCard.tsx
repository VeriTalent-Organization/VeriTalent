import React, { useState, useEffect } from 'react';
import { Download, ChevronDown, Eye, FileCheck, RefreshCw, Edit } from 'lucide-react';
import { TalentCardData, VeriTalentCardProps } from '@/types/dashboard';
import { userTypes } from '@/types/user_type';
import { profilesService } from '@/lib/services/profilesService';
// import { usersService } from '@/lib/services/usersService';
import { useCreateUserStore } from '@/lib/stores/form_submission_store';

const defaultTalentData: TalentCardData = {
  name: "Loading...",
  id: "Loading...",
  role: "Loading...",
  location: "Loading...",
  education: "No education data available",
  linkedin: "Not provided",
  bio: "No bio available",
  workExperience: "No work experience data available",
  educationSummary: "No education summary available",
  accomplishments: [],
  aiFitScore: 0,
  careerSignalStrength: 0,
  matchedRoles: [],
  skillGaps: [],
  growthRecommendations: "No recommendations available"
};

const VeriTalentCard: React.FC<VeriTalentCardProps> = ({ 
  userType, 
  isVerified = false,
  talentData: initialTalentData = defaultTalentData
}: VeriTalentCardProps) => {
  const [talentData, setTalentData] = useState<TalentCardData>(initialTalentData);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateUser } = useCreateUserStore();
  
  // Form state for editing
  const [editForm, setEditForm] = useState({
    careerObjective: '',
    bio: '',
    workExperience: [] as string[],
    education: [] as string[],
    accomplishments: [] as string[],
    skills: [] as { skill: string; level: string; source: string }[],
  });

  useEffect(() => {
    const loadProfile = () => {
      try {
        // Use talent profile data from store (already fetched in root layout)
        const profile = user.talentProfile || {};
        
        // Map profile and user store data to component format
        const mappedData = {
          name: user.full_name || defaultTalentData.name,
          id: user.veritalent_id || defaultTalentData.id,
          role: profile.careerObjective || defaultTalentData.role,
          location: user.location || user.country || defaultTalentData.location,
          education: Array.isArray(profile.education) && profile.education.length > 0 
            ? profile.education.join(', ') 
            : defaultTalentData.education,
          linkedin: user.linkedin_connected
            ? `linkedin.com/in/${user.full_name?.toLowerCase().replace(/\s+/g, '-')}` 
            : defaultTalentData.linkedin,
          bio: profile.bio || defaultTalentData.bio,
          workExperience: Array.isArray(profile.workExperience) && profile.workExperience.length > 0
            ? profile.workExperience.join('. ')
            : defaultTalentData.workExperience,
          educationSummary: profile.educationSummary || (Array.isArray(profile.education) && profile.education.length > 0 ? profile.education.join('. ') : defaultTalentData.educationSummary),
          accomplishments: profile.accomplishments || defaultTalentData.accomplishments,
          aiFitScore: profile.aiFitScore || defaultTalentData.aiFitScore,
          careerSignalStrength: profile.careerSignalStrength || defaultTalentData.careerSignalStrength,
          matchedRoles: profile.matchedRoles || defaultTalentData.matchedRoles,
          skillGaps: profile.skillGaps || defaultTalentData.skillGaps,
          growthRecommendations: profile.growthRecommendations || defaultTalentData.growthRecommendations,
          skills: Array.isArray(profile.skills) && profile.skills.length > 0
            ? profile.skills.map((skill: { skill: string; level: string; source: string }) => ({
                name: skill.skill,
                verifiedBy: skill.source || 'AI',
                level: skill.level.charAt(0).toUpperCase() + skill.level.slice(1),
                color: skill.level === 'advanced' 
                  ? 'bg-green-100 text-green-700' 
                  : skill.level === 'intermediate' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700'
              }))
            : undefined,
        };
        
        setTalentData(mappedData);
        
        // Populate edit form
        setEditForm({
          careerObjective: profile.careerObjective || '',
          bio: profile.bio || '',
          workExperience: Array.isArray(profile.workExperience) ? profile.workExperience : [],
          education: Array.isArray(profile.education) ? profile.education : [],
          accomplishments: profile.accomplishments || [],
          skills: Array.isArray(profile.skills) ? profile.skills : [],
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
        // Use user store data as fallback
        setTalentData({
          ...defaultTalentData,
          name: user.full_name || defaultTalentData.name,
          id: user.veritalent_id || defaultTalentData.id,
          location: user.location || user.country || defaultTalentData.location,
        });
      } finally {
        setLoading(false);
      }
    };
    
    console.log('[VeriTalentCard] useEffect triggered:', { 
      userType, 
      full_name: user.full_name, 
      veritalent_id: user.veritalent_id,
      profile_fetched: user.profile_fetched,
      condition: user.profile_fetched || (user.full_name && user.veritalent_id)
    });
    
    if (userType === userTypes.TALENT) {
      // Load profile if we have user data (either from profile_fetched or basic login data)
      if (user.profile_fetched || (user.full_name && user.veritalent_id)) {
        console.log('[VeriTalentCard] Loading profile...');
        loadProfile();
      } else {
        // Still waiting for user data to be hydrated
        console.log('[VeriTalentCard] Waiting for user data...');
        setLoading(true);
      }
    } else {
      setLoading(false);
    }
  }, [userType, user.full_name, user.veritalent_id, user.location, user.country, user.linkedin_connected, user.talentProfile, user.profile_fetched]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const response = await profilesService.create({
        careerObjective: editForm.careerObjective,
        education: editForm.education.filter(e => e.trim() !== ''),
        workExperience: editForm.workExperience.filter(w => w.trim() !== ''),
        skills: editForm.skills.map(s => ({
          skill: s.skill,
          level: s.level.toLowerCase() as 'beginner' | 'intermediate' | 'advanced',
          source: s.source,
        })),
      });
      
      // Update store with new profile data
      const savedProfile = response.data?.profile || response.data;
      if (savedProfile) {
        updateUser({
          talentProfile: {
            ...user.talentProfile,
            ...savedProfile,
          },
        });
      }
      
      // Update local state with saved data
      setTalentData(prev => ({
        ...prev,
        role: editForm.careerObjective || prev.role,
        bio: editForm.bio,
        workExperience: editForm.workExperience.join('. '),
        education: editForm.education.join(', '),
        educationSummary: editForm.education.join('. '),
        accomplishments: editForm.accomplishments,
        skills: editForm.skills.map(s => ({
          name: s.skill,
          verifiedBy: s.source,
          level: s.level.charAt(0).toUpperCase() + s.level.slice(1),
          color: s.level.toLowerCase() === 'advanced'
            ? 'bg-green-100 text-green-700'
            : s.level.toLowerCase() === 'intermediate'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 text-gray-700',
        })),
      }));
      
      setIsEditModalOpen(false);
    } catch (err: any) {
      console.error('[VeriTalentCard] Error saving profile:', err);
      setError(err?.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleArrayFieldChange = (field: 'workExperience' | 'education' | 'accomplishments', index: number, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }));
  };

  const handleAddArrayField = (field: 'workExperience' | 'education' | 'accomplishments') => {
    setEditForm(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const handleRemoveArrayField = (field: 'workExperience' | 'education' | 'accomplishments', index: number) => {
    setEditForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Veritalent AI card...</p>
        </div>
      </div>
    );
  }
  const isTalent = userType === userTypes.TALENT;
  const isRecruiterOrOrg = userType === userTypes.INDEPENDENT_RECRUITER || userType === userTypes.ORGANISATION;

  const skills = talentData.skills || [
    { name: 'Digital Marketing', verifiedBy: 'AI + References', level: 'Advanced', color: 'bg-green-100 text-green-700' },
    { name: 'SEO & Analytics', verifiedBy: 'Recommendation (Manager)', level: 'Advanced', color: 'bg-green-100 text-green-700' },
    { name: 'Content Strategy', verifiedBy: 'AI', level: 'Intermediate', color: 'bg-blue-100 text-blue-700' },
    { name: 'Communication', verifiedBy: 'AI + Reference + Certificate', level: 'Advanced', color: 'bg-green-100 text-green-700' }
  ];

  return (
    <div className="flex-1 bg-gray-50 p-2 sm:p-6">
      <div className="">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Veritalent AI card</h1>
          <p className="text-xs sm:text-sm text-gray-600">AI-powered Career Insights with Verifiable Credibility.</p>
        </div>

        {/* Talent Information Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Talent Information</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Talent Name:</label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
                {talentData.name}
              </div>
            </div>
            <div className="flex items-end sm:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">Job Market</span>
                <button className="px-4 py-1.5 bg-green-100 text-green-700 rounded-md text-sm font-medium flex items-center gap-1">
                  Active
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">VeriTalent ID:</label>
            <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
              {isRecruiterOrOrg && !isVerified ? "Not Available" : talentData.id}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">Profile Status:</label>
            {isRecruiterOrOrg && !isVerified ? (
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg w-20"></div>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm font-medium">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                Verified
              </span>
            )}
          </div>

          {/* AI Fit Score - Shows for all user types */}
          {isRecruiterOrOrg && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">AI Fit Score</span>
                <span className="text-sm font-bold text-gray-900">{talentData.aiFitScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={isVerified ? "bg-brand-primary h-2 rounded-full" : "bg-gray-300 h-2 rounded-full"} 
                  style={{ width: `${talentData.aiFitScore}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Other Roles Matched - Shows for all user types */}
          {isRecruiterOrOrg && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">Other Role Matched:</label>
              <div className="flex flex-wrap gap-2">
                {talentData.matchedRoles?.map((role, index) => (
                  <span key={index} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Basic Profile Info */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Basic Profile Info</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Current / Target Role:</label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
                {talentData.role}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Location:</label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
                {talentData.location}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Education:</label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-gray-700">
                {talentData.education}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Linkedin Profile:</label>
              <div className="bg-gray-100 px-4 py-2.5 rounded-lg text-sm text-blue-600 break-all">
                {talentData.linkedin}
              </div>
            </div>
          </div>
        </div>

        {/* Career Snapshot */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Career Snapshot</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Bio:</label>
              <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700 leading-relaxed">
                {talentData.bio}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Work Experience Summary:</label>
              <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700 leading-relaxed">
                {talentData.workExperience}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Education Summary:</label>
              <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700 leading-relaxed">
                {talentData.educationSummary}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Accomplishments:</label>
              <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700 space-y-1">
                {talentData.accomplishments.map((item, index) => (
                  <div key={index}>• {item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Competency Signals - Only for Talent and Verified Recruiters/Orgs */}
        {(isTalent || (isRecruiterOrOrg && isVerified)) && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Skill & Competency Signals (AI + Verified Data)</h2>
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto mb-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Skill</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Verified By</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Competency Level</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((skill, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-4 py-4 text-sm text-gray-700">{skill.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{skill.verifiedBy}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${skill.color}`}>
                          {skill.level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3 mb-4">
              {skills.map((skill, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">{skill.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${skill.color}`}>
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Verified by: {skill.verifiedBy}</p>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-xs sm:text-sm text-green-800">
                <span className="font-medium">AI Signal Summary:</span> AI analyses CV data, verified references and activity footprints to rank competencies as Beginner / Intermediate / Advanced or percentage strength scores.
              </p>
            </div>
          </div>
        )}

        {/* VeriTalent Repository - Only for Talent and Verified Recruiters/Orgs */}
        {(isTalent || (isRecruiterOrOrg && isVerified)) && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">VeriTalent Repository</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Affiliation Reference Card */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Affiliation Reference</h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded font-medium">Pending</span>
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-700 font-medium">Nigeria Computer Society</p>
                  <p className="text-xs text-gray-600">Associate Member</p>
                  <p className="text-xs text-gray-600">Expired - Since 2024</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors">
                    <Eye className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors">
                    <Download className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors">
                    <FileCheck className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>

              {/* Certificate Verification Card */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Certificate Verification</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Verified</span>
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-700 font-medium">University of Lagos</p>
                  <p className="text-xs text-gray-600">B.Sc. Computer Science</p>
                  <p className="text-xs text-gray-600">Issued - Oct 2020</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors">
                    <Eye className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors">
                    <Download className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors">
                    <FileCheck className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>

              {/* Certificate Card */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Certificate</h3>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-medium">Under verification</span>
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-700 font-medium">Certificate</p>
                  <p className="text-xs text-gray-600">Google Digital Certificate</p>
                  <p className="text-xs text-gray-600">Jan 2023 - Mar 2024</p>
                </div>
                <div className="flex justify-end">
                  <button className="p-2 bg-brand-primary text-white rounded hover:bg-cyan-700 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights & Growth Path - Only for Talent */}
        {isTalent && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">AI Insights & Growth Path</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">Skill Gaps:</label>
              <div className="flex flex-wrap gap-2">
                {talentData.skillGaps?.map((gap, index) => (
                  <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm">{gap}</span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">Growth Recommendations:</label>
              <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm text-gray-700">
                {talentData.growthRecommendations}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-900">Career Signal Strength</label>
                <span className="text-sm font-bold text-gray-900">{talentData.careerSignalStrength}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                <div className="bg-brand-primary h-3 rounded-full" style={{ width: `${talentData.careerSignalStrength}%` }}></div>
              </div>
              <p className="text-xs text-gray-500">Based on verified data consistency</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3">
            {isTalent && (
              <>
                <button className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm">
                  <RefreshCw className="w-5 h-5" />
                  <span>Refresh AI Insights</span>
                </button>
                <button className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="w-5 h-5" />
                  <span>Edit Card</span>
                </button>
                <button className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm">
                  Request Reference
                </button>
              </>
            )}
            <button className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm">
              <Download className="w-5 h-5" />
              <span>Download PDF{isTalent ? '' : ' (VeriTalent AI Card)'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10000 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-dvh overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Career Profile</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                  {error}
                </div>
              )}
              
              {/* Career Objective */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Career Objective / Target Role</label>
                <input
                  type="text"
                  value={editForm.careerObjective}
                  onChange={(e) => setEditForm(prev => ({ ...prev, careerObjective: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="e.g., Senior Product Manager"
                />
              </div>
              
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="Brief professional summary..."
                />
              </div>
              
              {/* Work Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Work Experience</label>
                {editForm.workExperience.map((exp, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={exp}
                      onChange={(e) => handleArrayFieldChange('workExperience', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      placeholder="e.g., Senior Developer at TechCorp (2020-2023)"
                    />
                    <button
                      onClick={() => handleRemoveArrayField('workExperience', index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddArrayField('workExperience')}
                  className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  + Add Experience
                </button>
              </div>
              
              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Education</label>
                {editForm.education.map((edu, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={edu}
                      onChange={(e) => handleArrayFieldChange('education', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      placeholder="e.g., B.Sc. Computer Science, University of Lagos"
                    />
                    <button
                      onClick={() => handleRemoveArrayField('education', index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddArrayField('education')}
                  className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  + Add Education
                </button>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 sm:p-6 flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                disabled={saving}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-cyan-700 font-medium disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Demo component showing different views
export default function Demo() {
  const [currentView, setCurrentView] = React.useState<string>(userTypes.TALENT);
  const [isVerified, setIsVerified] = React.useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* View Switcher */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-semibold mb-3">View As:</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentView(userTypes.TALENT)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === userTypes.TALENT
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Talent
            </button>
            <button
              onClick={() => {
                setCurrentView(userTypes.INDEPENDENT_RECRUITER);
                setIsVerified(true);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === userTypes.INDEPENDENT_RECRUITER
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Recruiter (Verified)
            </button>
            <button
              onClick={() => {
                setCurrentView(userTypes.ORGANISATION);
                setIsVerified(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === userTypes.ORGANISATION
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Organisation (Unverified)
            </button>
          </div>
          {currentView !== userTypes.TALENT && (
            <div className="mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Is Verified</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Card Component */}
      <VeriTalentCard userType={currentView} isVerified={isVerified} />
    </div>
  );
}

// Export the VeriTalentCard component
export { VeriTalentCard };