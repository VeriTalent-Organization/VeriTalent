'use client';

import React, { useState, useRef } from 'react';
import { FileText, Upload, CheckCircle, Edit3, Save, X, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { cvParsingService, ParsedCVData, CVParseRequest } from '@/lib/services/cvParsingService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import LinkedInImport from '@/components/Dashboard/linkedin-import/LinkedInImport';

interface CVParsingComponentProps {
  onComplete?: (parsedData: ParsedCVData) => void;
  onBack?: () => void;
  initialData?: ParsedCVData;
}

export default function CVParsingComponent({
  onComplete,
  onBack,
  initialData
}: CVParsingComponentProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedCVData | null>(initialData || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ParsedCVData | null>(null);
  const [dataSource, setDataSource] = useState<'upload' | 'linkedin' | null>(null);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLinkedInImportSuccess = (data: ParsedCVData) => {
    setParsedData(data);
    setEditData(JSON.parse(JSON.stringify(data))); // Deep copy for editing
    setDataSource('linkedin');
  };

  const handleLinkedInImportError = (error: string) => {
    setError(error);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidFileType(file)) {
        setUploadedFile(file);
        setParsedData(null);
        setError(null);
      } else {
        setError('Please select a valid CV file (PDF, DOC, or DOCX)');
      }
    }
  };

  const isValidFileType = (file: File): boolean => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return validTypes.includes(file.type);
  };

  const handleParseCV = async () => {
    if (!uploadedFile) return;

    setIsParsing(true);
    setParsingProgress(0);
    setError(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setParsingProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const request: CVParseRequest = {
        file: uploadedFile,
        extractPersonalInfo: true,
        extractWorkExperience: true,
        extractEducation: true,
        extractSkills: true,
        extractCertifications: true,
        extractLanguages: true,
        extractProjects: true,
      };

      const response = await cvParsingService.parseCV(request);
      clearInterval(progressInterval);
      setParsingProgress(100);

      if (response.success && response.data) {
        setParsedData(response.data);
        setEditData(JSON.parse(JSON.stringify(response.data))); // Deep copy for editing
      } else {
        setError(response.error || 'Failed to parse CV');
      }
    } catch (err: unknown) {
      console.error('CV parsing error:', err);
      setError('Failed to parse CV. Please try again.');
    } finally {
      setIsParsing(false);
      setParsingProgress(0);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(parsedData ? JSON.parse(JSON.stringify(parsedData)) : null);
  };

  const handleSave = () => {
    if (editData) {
      setParsedData(editData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(parsedData ? JSON.parse(JSON.stringify(parsedData)) : null);
  };

  const handleComplete = () => {
    if (parsedData && onComplete) {
      onComplete(parsedData);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    if (!editData) return;
    setEditData({
      ...editData,
      personalInfo: {
        ...editData.personalInfo,
        [field]: value,
      },
    });
  };

  const addWorkExperience = () => {
    if (!editData) return;
    const newExperience = {
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentRole: false,
      description: '',
      achievements: [],
    };
    setEditData({
      ...editData,
      workExperience: [...(editData.workExperience || []), newExperience],
    });
  };

  const updateWorkExperience = (index: number, field: string, value: any) => {
    if (!editData?.workExperience) return;
    const updated = [...editData.workExperience];
    updated[index] = { ...updated[index], [field]: value };
    setEditData({
      ...editData,
      workExperience: updated,
    });
  };

  const removeWorkExperience = (index: number) => {
    if (!editData?.workExperience) return;
    const updated = editData.workExperience.filter((_, i) => i !== index);
    setEditData({
      ...editData,
      workExperience: updated,
    });
  };

  const addSkill = () => {
    if (!editData) return;
    const newSkill = { skill: '', level: 'intermediate' as const };
    setEditData({
      ...editData,
      skills: [...(editData.skills || []), newSkill],
    });
  };

  const updateSkill = (index: number, field: string, value: any) => {
    if (!editData?.skills) return;
    const updated = [...editData.skills];
    updated[index] = { ...updated[index], [field]: value };
    setEditData({
      ...editData,
      skills: updated,
    });
  };

  const removeSkill = (index: number) => {
    if (!editData?.skills) return;
    const updated = editData.skills.filter((_, i) => i !== index);
    setEditData({
      ...editData,
      skills: updated,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI CV Parsing
        </h1>
        <p className="text-gray-600">
          Upload your CV or import from LinkedIn to let our AI extract your professional information automatically.
          Review and edit the results before saving.
        </p>
      </div>

      {/* Data Source Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* CV Upload Section */}
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Your CV
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              {uploadedFile ? (
                <div className="flex flex-col items-center gap-3">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                  <p className="font-semibold text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <FileText className="w-12 h-12 text-gray-400" />
                  <p className="font-semibold text-gray-900">Click to upload your CV</p>
                  <p className="text-sm text-gray-600">PDF, DOC, or DOCX (max 10MB)</p>
                </div>
              )}
            </div>

            {uploadedFile && !parsedData && (
              <Button
                onClick={handleParseCV}
                disabled={isParsing}
                className="w-full"
              >
                {isParsing ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    Parsing CV... {parsingProgress}%
                  </>
                ) : (
                  'Parse CV with AI'
                )}
              </Button>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

        {/* LinkedIn Import Section */}
        <LinkedInImport
          onImportSuccess={handleLinkedInImportSuccess}
          onImportError={handleLinkedInImportError}
        />
      </div>

      {/* Parsed Data Display/Edit */}
      {parsedData && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Parsed CV Data
              </CardTitle>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {isEditing ? (
                    <Input
                      value={editData?.personalInfo?.fullName || ''}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900">{parsedData.personalInfo?.fullName || 'Not found'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editData?.personalInfo?.email || ''}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900">{parsedData.personalInfo?.email || 'Not found'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {isEditing ? (
                    <Input
                      value={editData?.personalInfo?.phone || ''}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900">{parsedData.personalInfo?.phone || 'Not found'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  {isEditing ? (
                    <Input
                      value={editData?.personalInfo?.location || ''}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900">{parsedData.personalInfo?.location || 'Not found'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Work Experience */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Work Experience</h3>
                {isEditing && (
                  <Button variant="outline" size="sm" onClick={addWorkExperience}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {(isEditing ? editData?.workExperience : parsedData.workExperience)?.map((exp, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">
                        {exp.jobTitle} at {exp.company}
                      </h4>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeWorkExperience(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                        {isEditing ? (
                          <Input
                            value={exp.jobTitle}
                            onChange={(e) => updateWorkExperience(index, 'jobTitle', e.target.value)}
                          />
                        ) : (
                          <p className="text-gray-900">{exp.jobTitle}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        {isEditing ? (
                          <Input
                            value={exp.company}
                            onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                          />
                        ) : (
                          <p className="text-gray-900">{exp.company}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={exp.startDate || ''}
                            onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                          />
                        ) : (
                          <p className="text-gray-900">{exp.startDate || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={exp.endDate || ''}
                            onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                          />
                        ) : (
                          <p className="text-gray-900">{exp.endDate || 'Present'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {(!parsedData.workExperience || parsedData.workExperience.length === 0) && !isEditing && (
                  <p className="text-gray-500 italic">No work experience found</p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Skills</h3>
                {isEditing && (
                  <Button variant="outline" size="sm" onClick={addSkill}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(isEditing ? editData?.skills : parsedData.skills)?.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                    {isEditing ? (
                      <>
                        <Input
                          value={skill.skill}
                          onChange={(e) => updateSkill(index, 'skill', e.target.value)}
                          className="w-32 h-8"
                        />
                        <Select
                          value={skill.level}
                          onValueChange={(value) => updateSkill(index, 'level', value)}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(index)}
                          className="text-red-600 hover:text-red-800 h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="font-medium">{skill.skill}</span>
                        <Badge variant="secondary" className="text-xs">
                          {skill.level}
                        </Badge>
                      </>
                    )}
                  </div>
                ))}
                {(!parsedData.skills || parsedData.skills.length === 0) && !isEditing && (
                  <p className="text-gray-500 italic">No skills found</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <div className="flex gap-3">
          {parsedData && (
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm & Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
