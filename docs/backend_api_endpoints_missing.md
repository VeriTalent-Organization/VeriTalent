# VeriTalent Backend API Endpoints - MISSING

**Document Created:** January 3, 2026
**Purpose:** List of backend endpoints that are NOT yet implemented
**Status:** Based on implementation_gaps.md analysis - these need backend development
**Priority:** High priority items marked with 🔴, Medium with 🟡, Low with 🟢

---

## Table of Contents
1. [Authentication & Authorization](#authentication--authorization)
2. [User Management](#user-management)
3. [Profiles](#profiles)
4. [Organizations](#organizations)
5. [Jobs & Applications](#jobs--applications)
6. [References](#references)
7. [Screening](#screening)
8. [AI & Analytics](#ai--analytics)
9. [Notifications](#notifications)
10. [Professional Recommendations](#professional-recommendations)
11. [Certificate Verification](#certificate-verification)
12. [Email Service](#email-service)
13. [ATS Integration](#ats-integration)

---

## Authentication & Authorization

### 🔴 POST /auth/google
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Initiate Google OAuth

**Response:** Redirect to Google OAuth URL

### 🔴 GET /auth/google/callback
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Handle Google OAuth callback

**Query Parameters:**
- code: string (OAuth authorization code)
- state: string (CSRF protection)

**Response DTO:**
```typescript
interface OAuthCallbackResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    full_name: string;
    token: string;
  };
  redirect_url: string;
}
```

### 🔴 POST /auth/linkedin
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Initiate LinkedIn OAuth

**Response DTO:**
```typescript
interface LinkedInOAuthResponse {
  authorization_url: string;
}
```

### 🔴 GET /auth/linkedin/callback
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Handle LinkedIn OAuth callback

**Query Parameters:**
- code: string (OAuth authorization code)
- state: string (CSRF protection)

**Response DTO:**
```typescript
interface LinkedInOAuthCallbackResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    full_name: string;
    linkedin_profile: object;
    token: string;
  };
}
```

---

## User Management

### 🟡 POST /users/emails/add
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Add new linked email

**Request DTO:**
```typescript
interface AddEmailRequest {
  email: string;
}
```

**Response DTO:**
```typescript
interface AddEmailResponse {
  success: boolean;
  message: string;
  verification_sent: boolean;
}
```

### 🟡 POST /users/emails/verify
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Verify email with code

**Request DTO:**
```typescript
interface VerifyEmailRequest {
  email: string;
  code: string;
}
```

**Response DTO:**
```typescript
interface VerifyEmailResponse {
  success: boolean;
  message: string;
  email_verified: boolean;
}
```

### 🟡 POST /users/emails/resend-verification
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Resend verification code

**Request DTO:**
```typescript
interface ResendVerificationRequest {
  email: string;
}
```

**Response DTO:**
```typescript
interface ResendVerificationResponse {
  success: boolean;
  message: string;
}
```

### 🟡 DELETE /users/emails/remove
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Remove linked email

**Request DTO:**
```typescript
interface RemoveEmailRequest {
  email: string;
}
```

**Response DTO:**
```typescript
interface RemoveEmailResponse {
  success: boolean;
  message: string;
}
```

### 🟡 PUT /users/emails/set-primary
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Set primary email

**Request DTO:**
```typescript
interface SetPrimaryEmailRequest {
  email: string;
}
```

**Response DTO:**
```typescript
interface SetPrimaryEmailResponse {
  success: boolean;
  message: string;
}
```

---

## Profiles

### 🔴 POST /cv/upload
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Upload and AI parse CV
**Content-Type:** multipart/form-data

**Request:** File upload with CV

**Response DTO:**
```typescript
interface CVUploadResponse {
  success: boolean;
  message: string;
  parsed_data: {
    personal_info: {
      name: string;
      email: string;
      phone?: string;
      location?: string;
    };
    skills: string[];
    experience: Array<{
      company: string;
      position: string;
      duration: string;
      description: string;
    }>;
    education: Array<{
      institution: string;
      degree: string;
      year: number;
    }>;
    certifications?: Array<{
      name: string;
      issuer: string;
      year: number;
    }>;
  };
}
```

### 🔴 POST /linkedin/import
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Import profile data from LinkedIn API

**Request DTO:**
```typescript
interface LinkedInImportRequest {
  authorization_code: string;
  redirect_uri: string;
}
```

**Response DTO:**
```typescript
interface LinkedInImportResponse {
  success: boolean;
  message: string;
  profile_data: {
    personal_info: {
      name: string;
      headline?: string;
      location?: string;
    };
    experience: Array<{
      company: string;
      position: string;
      start_date: string;
      end_date?: string;
      description?: string;
    }>;
    education: Array<{
      institution: string;
      degree?: string;
      field?: string;
      start_year?: number;
      end_year?: number;
    }>;
    skills: string[];
  };
}
```

---

## Organizations

### 🟡 PATCH /organizations/me
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Update organization

**Request DTO:**
```typescript
interface UpdateOrganizationRequest {
  name?: string;
  industry?: string;
  size?: string;
  location?: string;
  description?: string;
  website?: string;
  linkedin_page?: string;
}
```

**Response DTO:**
```typescript
interface UpdateOrganizationResponse {
  success: boolean;
  message: string;
  organization: object; // Updated organization data
}
```

### 🟡 GET /organizations/team/members
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** List all team members

**Response DTO:**
```typescript
interface GetTeamMembersResponse {
  members: Array<{
    user_id: string;
    full_name: string;
    email: string;
    role: string;
    permissions: string[];
    status: "active" | "pending" | "inactive";
    joined_at?: string;
  }>;
}
```

### 🟡 DELETE /organizations/team/members/{userId}
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Remove team member

**Response DTO:**
```typescript
interface RemoveTeamMemberResponse {
  success: boolean;
  message: string;
}
```

### 🟡 PUT /organizations/team/members/{userId}/role
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Change member role

**Request DTO:**
```typescript
interface UpdateTeamMemberRoleRequest {
  role: string;
  permissions?: string[];
}
```

**Response DTO:**
```typescript
interface UpdateTeamMemberRoleResponse {
  success: boolean;
  message: string;
}
```

### 🟡 POST /organizations/verify/domain
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Initiate domain verification

**Request DTO:**
```typescript
interface DomainVerificationRequest {
  domain: string;
}
```

**Response DTO:**
```typescript
interface DomainVerificationResponse {
  success: boolean;
  dns_instructions: string;
  verification_token: string;
}
```

### 🟡 GET /organizations/verify/domain/check
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Check domain verification status

**Response DTO:**
```typescript
interface DomainVerificationCheckResponse {
  success: boolean;
  verified: boolean;
  domain: string;
  verified_at?: string;
}
```

### 🟡 POST /organizations/verify/linkedin
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Initiate LinkedIn company page verification

**Response DTO:**
```typescript
interface LinkedInVerificationResponse {
  success: boolean;
  authorization_url: string;
}
```

### 🟡 POST /organizations/verify/documents
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Upload verification documents
**Content-Type:** multipart/form-data

**Request:** File uploads with document types

**Response DTO:**
```typescript
interface DocumentVerificationResponse {
  success: boolean;
  message: string;
  documents_uploaded: string[];
}
```

### 🟡 GET /organizations/verify/status
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Get verification status

**Response DTO:**
```typescript
interface VerificationStatusResponse {
  domain: {
    status: "verified" | "pending" | "failed" | "not_started";
    verified_at?: string;
    domain?: string;
  };
  linkedin: {
    status: "verified" | "pending" | "failed" | "not_started";
    verified_at?: string;
    linkedin_page?: string;
  };
  documents: {
    status: "verified" | "pending" | "failed" | "not_started";
    verified_at?: string;
    document_types?: string[];
  };
}
```

### 🟢 POST /organizations/pricing/set
**Status:** NOT IMPLEMENTED
**Priority:** LOW
**Purpose:** Save complete pricing configuration

**Request DTO:**
```typescript
interface SetPricingRequest {
  certificateVerificationEnabled: boolean;
  certificateVerificationPrice: number;
  customPricingTiers: Array<{
    name: string;
    price: number;
    description: string;
  }>;
}
```

**Response DTO:**
```typescript
interface SetPricingResponse {
  success: boolean;
  message: string;
}
```

### 🟢 GET /organizations/pricing
**Status:** NOT IMPLEMENTED
**Priority:** LOW
**Purpose:** Get current pricing configuration

**Response DTO:**
```typescript
interface GetPricingResponse {
  certificateVerificationEnabled: boolean;
  certificateVerificationPrice: number;
  customPricingTiers: Array<{
    name: string;
    price: number;
    description: string;
  }>;
}
```

### 🟡 GET /organizations/tokens
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Get organization API tokens

**Response DTO:**
```typescript
interface GetOrganizationTokensResponse {
  tokens: Array<{
    id: string;
    name: string;
    created_at: string;
    last_used?: string;
    status: "active" | "revoked";
  }>;
}
```

### 🟡 POST /organizations/tokens/generate
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Generate new API token

**Request DTO:**
```typescript
interface GenerateTokenRequest {
  name: string;
  permissions?: string[];
}
```

**Response DTO:**
```typescript
interface GenerateTokenResponse {
  success: boolean;
  token: string;
  token_id: string;
}
```

### 🟡 DELETE /organizations/tokens/{tokenId}
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Revoke API token

**Response DTO:**
```typescript
interface RevokeTokenResponse {
  success: boolean;
  message: string;
}
```

---

## Jobs & Applications

### 🔴 GET /jobs/search
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Enhanced job search with advanced filters

**Query Parameters:**
- q?: string (search query)
- employmentType?: string
- workType?: "remote" | "hybrid" | "onsite"
- experienceLevel?: "entry" | "mid" | "senior" | "executive"
- salaryMin?: number
- salaryMax?: number
- location?: string
- postedWithin?: "1" | "3" | "7" | "30" (days)
- page?: number
- limit?: number

**Response DTO:**
```typescript
interface JobSearchResponse {
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    employment_type: string;
    work_type?: string;
    experience_level?: string;
    salary_range?: string;
    description: string;
    posted_at: string;
    ai_match_score?: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: {
    employmentTypes: string[];
    workTypes: string[];
    experienceLevels: string[];
    locations: string[];
    salaryRanges: string[];
  };
}
```

### 🟡 GET /jobs/applications/my
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Get user's job applications

**Response DTO:**
```typescript
interface GetMyApplicationsResponse {
  applications: Array<{
    id: string;
    job_id: string;
    job_title: string;
    company: string;
    status: "pending" | "reviewed" | "interviewed" | "offered" | "rejected";
    applied_at: string;
    last_updated: string;
  }>;
}
```

### 🟡 DELETE /jobs/applications/{id}
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Withdraw job application

**Response DTO:**
```typescript
interface WithdrawApplicationResponse {
  success: boolean;
  message: string;
}
```

### 🟡 GET /jobs/feed
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Job feed (API docs show this, frontend uses `/jobs/all`)

### 🟡 GET /jobs/for-talent
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Jobs for talent

### 🟡 POST /applications/bulk-ids
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Create applications from VeriTalent ID list

**Request DTO:**
```typescript
interface BulkApplyByIdsRequest {
  veritalent_ids: string[];
  job_id: string;
  message?: string;
}
```

**Response DTO:**
```typescript
interface BulkApplyByIdsResponse {
  success: boolean;
  message: string;
  applications_created: number;
  failed_ids: string[];
}
```

### 🟡 POST /applications/bulk-cvs
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Upload multiple CVs and create draft profiles
**Content-Type:** multipart/form-data

**Request:** Multiple CV files

**Response DTO:**
```typescript
interface BulkCVUploadResponse {
  success: boolean;
  message: string;
  profiles_created: number;
  failed_uploads: Array<{
    filename: string;
    error: string;
  }>;
}
```

---

## References

### 🔴 GET /references/requests/my
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Get reference requests made by current user

**Response DTO:**
```typescript
interface GetMyReferenceRequestsResponse {
  requests: Array<{
    id: string;
    issuer_name: string;
    issuer_email: string;
    type: string;
    title: string;
    status: "pending" | "accepted" | "declined" | "issued";
    created_at: string;
    responded_at?: string;
  }>;
}
```

### 🔴 GET /references/requests/inbox
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Get reference requests for current user to respond to

**Response DTO:**
```typescript
interface GetReferenceRequestsInboxResponse {
  requests: Array<{
    id: string;
    requester_name: string;
    requester_email: string;
    type: string;
    title: string;
    message?: string;
    start_date?: string;
    end_date?: string;
    status: "pending" | "accepted" | "declined";
    created_at: string;
  }>;
}
```

### 🔴 PUT /references/requests/{id}/respond
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Accept or decline reference request

**Request DTO:**
```typescript
interface RespondToReferenceRequest {
  action: "accept" | "decline";
  message?: string;
}
```

**Response DTO:**
```typescript
interface RespondToReferenceRequestResponse {
  success: boolean;
  message: string;
}
```

### 🟡 DELETE /references/{id}/revoke
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Revoke issued reference

**Response DTO:**
```typescript
interface RevokeReferenceResponse {
  success: boolean;
  message: string;
}
```

### 🟡 PUT /references/{referenceId}/status
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Update reference status

**Request DTO:**
```typescript
interface UpdateReferenceStatusRequest {
  status: "issued" | "verified" | "rejected";
  notes?: string;
}
```

**Response DTO:**
```typescript
interface UpdateReferenceStatusResponse {
  success: boolean;
  message: string;
}
```

---

## Screening

### 🟡 POST /screening/session/{id}/shortlist/{index}
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Shortlist candidates

### 🔴 POST /screening/calculate-fit-score
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Calculate AI fit score for applicant

**Request DTO:**
```typescript
interface CalculateFitScoreRequest {
  applicant_id: string;
  job_id: string;
}
```

**Response DTO:**
```typescript
interface CalculateFitScoreResponse {
  success: boolean;
  fit_score: number;
  breakdown: {
    skills_match: number;
    experience_match: number;
    education_match: number;
    location_match: number;
  };
}
```

### 🔴 GET /jobs/{jobId}/applicants/ranked
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Get ranked list of applicants

**Response DTO:**
```typescript
interface GetRankedApplicantsResponse {
  applicants: Array<{
    id: string;
    name: string;
    email: string;
    fit_score: number;
    rank: number;
    skills_matched: string[];
    experience_years: number;
    education_level: string;
    applied_at: string;
  }>;
}
```

### 🔴 GET /ai-card/{veritalentId}/recruiter-view
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Get AI card data for recruiter view

**Response DTO:**
```typescript
interface GetRecruiterAICardResponse {
  personal_info: {
    name: string;
    location: string;
    current_role?: string;
  };
  skills: Array<{
    name: string;
    level: "beginner" | "intermediate" | "advanced";
    verified: boolean;
  }>;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: number;
  }>;
  competency_signals: Array<{
    skill: string;
    score: number;
    verified_by: string[];
  }>>;
  fit_score: number;
  recommendations: string[];
}
```

### 🟡 GET /applicants/{applicantId}/notes
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Get evaluation notes for applicant

**Response DTO:**
```typescript
interface GetApplicantNotesResponse {
  notes: Array<{
    id: string;
    type: "evaluation" | "interview" | "general";
    content: string;
    created_by: string;
    created_at: string;
    updated_at: string;
  }>;
}
```

### 🟡 POST /applicants/{applicantId}/notes
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Create evaluation note

**Request DTO:**
```typescript
interface CreateApplicantNoteRequest {
  type: "evaluation" | "interview" | "general";
  content: string;
}
```

**Response DTO:**
```typescript
interface CreateApplicantNoteResponse {
  success: boolean;
  message: string;
  note_id: string;
}
```

### 🟡 PUT /applicants/{applicantId}/notes/{noteId}
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Update evaluation note

**Request DTO:**
```typescript
interface UpdateApplicantNoteRequest {
  type?: "evaluation" | "interview" | "general";
  content: string;
}
```

**Response DTO:**
```typescript
interface UpdateApplicantNoteResponse {
  success: boolean;
  message: string;
}
```

### 🟡 DELETE /applicants/{applicantId}/notes/{noteId}
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Delete evaluation note

**Response DTO:**
```typescript
interface DeleteApplicantNoteResponse {
  success: boolean;
  message: string;
}
```

---

## AI & Analytics

### 🔴 POST /ai/analyze-profile
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Generate AI career insights

**Request DTO:**
```typescript
interface AnalyzeProfileRequest {
  veritalent_id: string;
}
```

**Response DTO:**
```typescript
interface AnalyzeProfileResponse {
  success: boolean;
  insights: {
    career_trajectory: string;
    skill_gaps: string[];
    recommendations: string[];
    market_demand: {
      high_demand_skills: string[];
      emerging_trends: string[];
    };
  };
}
```

### 🔴 GET /competency-signals/{veritalentId}
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Get calculated competency signals

**Response DTO:**
```typescript
interface GetCompetencySignalsResponse {
  signals: Array<{
    skill: string;
    level: "beginner" | "intermediate" | "advanced";
    score: number;
    verified_by: string[];
    last_updated: string;
  }>;
}
```

### 🔴 POST /competency/calculate/{veritalentId}
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Calculate all competency signals

**Response DTO:**
```typescript
interface CalculateCompetencySignalsResponse {
  success: boolean;
  message: string;
  signals_calculated: number;
}
```

### 🔴 GET /competency/breakdown/{veritalentId}/{skill}
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Get skill level breakdown

**Response DTO:**
```typescript
interface GetCompetencyBreakdownResponse {
  skill: string;
  current_level: "beginner" | "intermediate" | "advanced";
  score: number;
  breakdown: {
    work_experience: number;
    education: number;
    certifications: number;
    references: number;
    lpi_assessments: number;
  };
  improvement_suggestions: string[];
}
```

### 🔴 POST /competency/validate
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Validate skill from reference/certificate

**Request DTO:**
```typescript
interface ValidateCompetencyRequest {
  veritalent_id: string;
  skill: string;
  validation_type: "reference" | "certificate" | "lpi";
  validator_id: string;
  evidence?: string;
}
```

**Response DTO:**
```typescript
interface ValidateCompetencyResponse {
  success: boolean;
  message: string;
  validation_recorded: boolean;
}
```

### 🟡 POST /ai-card/share/{veritalentId}
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Generate shareable public link

**Response DTO:**
```typescript
interface ShareAICardResponse {
  success: boolean;
  share_token: string;
  public_url: string;
}
```

### 🟡 GET /ai-card/public/{shareToken}
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Public view of AI card

**Response DTO:**
```typescript
interface GetPublicAICardResponse {
  personal_info: {
    name: string;
    location: string;
  };
  skills: string[];
  experience: Array<{
    company: string;
    position: string;
    duration: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: number;
  }>;
  competency_signals: Array<{
    skill: string;
    level: string;
    score: number;
  }>;
  shared_at: string;
}
```

### 🟡 GET /ai-card/pdf/{veritalentId}
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Generate and download PDF

**Response:** PDF file download

### 🟢 GET /analytics/overview
**Status:** NOT IMPLEMENTED
**Priority:** LOW
**Purpose:** Organization analytics overview

**Query Parameters:**
- timeRange: "7d" | "30d" | "90d" | "1y"

**Response DTO:**
```typescript
interface GetAnalyticsOverviewResponse {
  keyMetrics: {
    totalApplications: number;
    interviewRate: number;
    conversionRate: number;
    avgTimeToHire: number;
  };
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
```

---

## Notifications

### 🔴 GET /notifications
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Get all notifications

**Query Parameters:**
- page?: number
- limit?: number
- status?: "read" | "unread"

**Response DTO:**
```typescript
interface GetNotificationsResponse {
  notifications: Array<{
    id: string;
    type: "reference_request" | "application_update" | "job_recommendation" | "team_invitation" | "certificate_verification" | "lpi_completion";
    title: string;
    message: string;
    data?: object;
    read: boolean;
    created_at: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

### 🔴 GET /notifications/unread
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Get unread count

**Response DTO:**
```typescript
interface GetUnreadCountResponse {
  count: number;
}
```

### 🔴 PUT /notifications/{id}/read
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Mark notification as read

**Response DTO:**
```typescript
interface MarkNotificationReadResponse {
  success: boolean;
  message: string;
}
```

### 🔴 PUT /notifications/read-all
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Mark all notifications as read

**Response DTO:**
```typescript
interface MarkAllNotificationsReadResponse {
  success: boolean;
  message: string;
  marked_count: number;
}
```

### 🔴 DELETE /notifications/{id}
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Delete notification

**Response DTO:**
```typescript
interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}
```

---

## Professional Recommendations

### 🟡 POST /recommendations/issue
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Issue professional recommendation

**Request DTO:**
```typescript
interface IssueRecommendationRequest {
  talent_name: string;
  talent_email: string;
  relationship_timeline: string;
  relationship_context: string;
  recommendations: string;
}
```

**Response DTO:**
```typescript
interface IssueRecommendationResponse {
  success: boolean;
  message: string;
  recommendation_id: string;
}
```

### 🟡 GET /recommendations/issued/my
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Get recommendations issued by current user

**Response DTO:**
```typescript
interface GetIssuedRecommendationsResponse {
  recommendations: Array<{
    id: string;
    talent_name: string;
    talent_email: string;
    relationship_timeline: string;
    status: "active" | "revoked";
    issued_at: string;
  }>;
}
```

### 🟡 GET /recommendations/talent/{talentId}
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Get recommendations for specific talent

**Response DTO:**
```typescript
interface GetTalentRecommendationsResponse {
  recommendations: Array<{
    id: string;
    issuer_name: string;
    issuer_company: string;
    relationship_timeline: string;
    recommendations: string;
    issued_at: string;
    status: "active" | "revoked";
  }>;
}
```

### 🟡 DELETE /recommendations/{id}/revoke
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Revoke recommendation

**Response DTO:**
```typescript
interface RevokeRecommendationResponse {
  success: boolean;
  message: string;
}
```

---

## Certificate Verification

### 🟡 POST /certificates/verify/request
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Request certificate verification
**Content-Type:** multipart/form-data

**Request DTO:**
```typescript
interface CertificateVerificationRequest {
  certificate_file: File;
  certificate_type: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date?: string;
  description?: string;
}
```

**Response DTO:**
```typescript
interface CertificateVerificationRequestResponse {
  success: boolean;
  message: string;
  request_id: string;
  status: "pending" | "approved" | "rejected";
}
```

### 🟡 GET /certificates/verify/my-requests
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Get my certificate verification requests

**Response DTO:**
```typescript
interface GetMyCertificateRequestsResponse {
  requests: Array<{
    id: string;
    certificate_type: string;
    issuing_organization: string;
    status: "pending" | "approved" | "rejected";
    submitted_at: string;
    reviewed_at?: string;
    reviewer_notes?: string;
  }>;
}
```

### 🟡 GET /certificates/verify/pending
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Get pending certificate verification requests (org admin)

**Response DTO:**
```typescript
interface GetPendingCertificateRequestsResponse {
  requests: Array<{
    id: string;
    talent_name: string;
    talent_email: string;
    certificate_type: string;
    issuing_organization: string;
    submitted_at: string;
  }>;
}
```

### 🟡 PUT /certificates/verify/{id}/approve
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Approve certificate verification (org admin)

**Request DTO:**
```typescript
interface ApproveCertificateRequest {
  verified_by: string;
  verification_notes?: string;
}
```

**Response DTO:**
```typescript
interface ApproveCertificateResponse {
  success: boolean;
  message: string;
}
```

### 🟡 PUT /certificates/verify/{id}/reject
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Reject certificate verification (org admin)

**Request DTO:**
```typescript
interface RejectCertificateRequest {
  rejection_reason: string;
}
```

**Response DTO:**
```typescript
interface RejectCertificateResponse {
  success: boolean;
  message: string;
}
```

### 🟡 GET /certificates/verified
**Status:** NOT IMPLEMENTED
**Priority:** MEDIUM
**Purpose:** Get all verified certificates for user

**Response DTO:**
```typescript
interface GetVerifiedCertificatesResponse {
  certificates: Array<{
    id: string;
    certificate_type: string;
    issuing_organization: string;
    issue_date: string;
    expiry_date?: string;
    verified_at: string;
    verified_by: string;
    verification_notes?: string;
  }>;
}
```

---

## Email Service

### 🔴 POST /email/send-verification
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Send verification email

**Request DTO:**
```typescript
interface SendVerificationEmailRequest {
  email: string;
  user_id: string;
}
```

**Response DTO:**
```typescript
interface SendVerificationEmailResponse {
  success: boolean;
  message: string;
}
```

### 🔴 POST /email/verify
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Verify email with token

**Request DTO:**
```typescript
interface VerifyEmailTokenRequest {
  email: string;
  token: string;
}
```

**Response DTO:**
```typescript
interface VerifyEmailTokenResponse {
  success: boolean;
  message: string;
  email_verified: boolean;
}
```

### 🔴 POST /email/resend-verification
**Status:** NOT IMPLEMENTED
**Priority:** HIGH
**Purpose:** Resend verification email

**Request DTO:**
```typescript
interface ResendVerificationEmailRequest {
  email: string;
}
```

**Response DTO:**
```typescript
interface ResendVerificationEmailResponse {
  success: boolean;
  message: string;
}
```

---

## ATS Integration

### 🟢 POST /api/external/ats/auth
**Status:** NOT IMPLEMENTED
**Priority:** LOW
**Purpose:** ATS API authentication

**Request DTO:**
```typescript
interface ATSAuthRequest {
  api_key: string;
  api_secret: string;
  ats_provider: string;
}
```

**Response DTO:**
```typescript
interface ATSAuthResponse {
  success: boolean;
  message: string;
  access_token: string;
  expires_at: string;
}
```

### 🟢 GET /api/external/ats/candidates
**Status:** NOT IMPLEMENTED
**Priority:** LOW
**Purpose:** Get candidates with filters

**Query Parameters:**
- status?: string
- updated_since?: string
- limit?: number
- offset?: number

**Response DTO:**
```typescript
interface GetATSCandidatesResponse {
  candidates: Array<{
    ats_id: string;
    name: string;
    email: string;
    status: string;
    applied_date: string;
    veritalent_id?: string;
  }>;
  total_count: number;
  has_more: boolean;
}
```

### 🟢 GET /api/external/ats/candidate/{veritalentId}
**Status:** NOT IMPLEMENTED
**Priority:** LOW
**Purpose:** Get specific candidate

**Response DTO:**
```typescript
interface GetATSCandidateResponse {
  ats_id: string;
  name: string;
  email: string;
  status: string;
  applied_date: string;
  veritalent_id: string;
  ai_card_url?: string;
  fit_score?: number;
}
```

### 🟢 POST /api/external/ats/webhooks/subscribe
**Status:** NOT IMPLEMENTED
**Priority:** LOW
**Purpose:** Subscribe to ATS updates

**Request DTO:**
```typescript
interface ATSSubscribeWebhooksRequest {
  webhook_url: string;
  events: string[];
}
```

**Response DTO:**
```typescript
interface ATSSubscribeWebhooksResponse {
  success: boolean;
  message: string;
  subscription_id: string;
}
```

### 🟢 POST /api/external/ats/jobs/post
**Status:** NOT IMPLEMENTED
**Priority:** LOW
**Purpose:** Post job from ATS

**Request DTO:**
```typescript
interface ATSPostJobRequest {
  ats_job_id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  employment_type: string;
}
```

**Response DTO:**
```typescript
interface ATSPostJobResponse {
  success: boolean;
  message: string;
  veritalent_job_id: string;
}
```

---

**Summary:** These endpoints are NOT yet implemented and require backend development. Priority levels indicate development urgency based on business impact and user experience.

**High Priority (🔴):** Core functionality, security, and user engagement features
**Medium Priority (🟡):** Important features for growth and user experience
**Low Priority (🟢):** Nice-to-have features for enterprise integration