# VeriTalent Backend API Endpoints & DTOs

**Document Created:** January 3, 2026
**Purpose:** Comprehensive list of all required backend endpoints with their request/response DTOs and schemas

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
10. [Tokens & Payments](#tokens--payments)
11. [LPI (Learning & Performance Intelligence)](#lpi-learning--performance-intelligence)
12. [TAPI (Talent Assessment Platform Interface)](#tapi-talent-assessment-platform-interface)

---

## Authentication & Authorization

### POST /auth/register
**Purpose:** User registration with CV upload
**Content-Type:** multipart/form-data

**Request DTO:**
```typescript
interface RegisterRequest {
  primaryEmail: string;           // required
  password: string;               // required
  fullName: string;               // required
  location: string;               // required
  accountType: "talent" | "recruiter" | "organization"; // required
  cv_file?: File;                 // optional, binary
  cv_source?: "upload" | "linkedin"; // optional
  linkedin_connected?: boolean;   // optional
  linked_emails?: string[];       // optional, JSON array
  organizationName?: string;      // optional
  organizationDomain?: string;    // optional
  organizationLinkedinPage?: string; // optional
  organisationSize?: string;      // optional
  organisationRcNumber?: string;  // optional
  organisationIndustry?: string;  // optional
  organisationLocation?: string;  // optional
  professionalDesignation?: string; // optional
  professionalStatus?: string;    // optional
  recruiterOrganizationName?: string; // optional
}
```

**Response DTO:**
```typescript
interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    user_type: string;
    token?: string;
  };
}
```

### POST /auth/login
**Purpose:** User authentication

**Request DTO:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response DTO:**
```typescript
interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    user_type: string;
    available_roles: string[];
    active_role: string;
    token: string;
  };
}
```

### POST /auth/switch-role
**Purpose:** Switch user role

**Request DTO:**
```typescript
interface SwitchRoleRequest {
  role: "talent" | "recruiter" | "org_admin";
}
```

**Response DTO:**
```typescript
interface SwitchRoleResponse {
  success: boolean;
  message: string;
  user: {
    active_role: string;
    token: string;
  };
}
```

### GET /auth/google
**Purpose:** Initiate Google OAuth

**Response:** Redirect to Google OAuth URL

### GET /auth/google/callback
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

### POST /auth/linkedin
**Purpose:** Initiate LinkedIn OAuth

**Response DTO:**
```typescript
interface LinkedInOAuthResponse {
  authorization_url: string;
}
```

### GET /auth/linkedin/callback
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

### POST /users/role/add
**Purpose:** Add additional roles to user

**Request DTO:**
```typescript
interface AddRoleRequest {
  role: "talent" | "recruiter" | "org_admin";
}
```

**Response DTO:**
```typescript
interface AddRoleResponse {
  success: boolean;
  message: string;
  user: {
    available_roles: string[];
  };
}
```

### PATCH /users/email/link
**Purpose:** Link additional email to user account

**Request DTO:**
```typescript
interface LinkEmailRequest {
  email: string;
}
```

**Response DTO:**
```typescript
interface LinkEmailResponse {
  success: boolean;
  message: string;
  verification_required: boolean;
}
```

### GET /users/me
**Purpose:** Get current user profile

**Response DTO:**
```typescript
interface UserProfileResponse {
  id: string;
  primary_email: string;
  full_name: string;
  location: string;
  user_type: string;
  available_roles: string[];
  active_role: string;
  linked_emails: string[];
  profile_complete: boolean;
  organization_id?: string;
  created_at: string;
  updated_at: string;
}
```

### PATCH /users/recruiter/profile
**Purpose:** Update recruiter profile

**Request DTO:**
```typescript
interface UpdateRecruiterProfileRequest {
  professional_title?: string;
  company?: string;
  experience_years?: number;
  specializations?: string[];
  linkedin_url?: string;
  bio?: string;
}
```

**Response DTO:**
```typescript
interface UpdateRecruiterProfileResponse {
  success: boolean;
  message: string;
  profile: object; // Updated profile data
}
```

### POST /users/emails/add
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

### POST /users/emails/verify
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

### POST /users/emails/resend-verification
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

### DELETE /users/emails/remove
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

### PUT /users/emails/set-primary
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

### POST /profiles/create
**Purpose:** Create user profile

**Request DTO:**
```typescript
interface CreateProfileRequest {
  bio?: string;
  skills?: string[];
  experience_years?: number;
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    graduation_year: number;
  }>;
  work_experience?: Array<{
    company: string;
    position: string;
    start_date: string;
    end_date?: string;
    description: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    issue_date: string;
    expiry_date?: string;
  }>;
}
```

**Response DTO:**
```typescript
interface CreateProfileResponse {
  success: boolean;
  message: string;
  profile: object; // Created profile data
}
```

### GET /profiles/me
**Purpose:** Get user profile

**Response DTO:**
```typescript
interface GetProfileResponse {
  id: string;
  user_id: string;
  bio?: string;
  skills?: string[];
  experience_years?: number;
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    graduation_year: number;
  }>;
  work_experience?: Array<{
    company: string;
    position: string;
    start_date: string;
    end_date?: string;
    description: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    issue_date: string;
    expiry_date?: string;
  }>;
  created_at: string;
  updated_at: string;
}
```

### POST /cv/upload
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

### POST /linkedin/import
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

### POST /organizations/create
**Purpose:** Create organization

**Request DTO:**
```typescript
interface CreateOrganizationRequest {
  name: string;
  domain: string;
  industry: string;
  size: string;
  location: string;
  description?: string;
  website?: string;
  linkedin_page?: string;
}
```

**Response DTO:**
```typescript
interface CreateOrganizationResponse {
  success: boolean;
  message: string;
  organization: {
    id: string;
    name: string;
    domain: string;
    verification_status: "pending" | "verified" | "rejected";
  };
}
```

### GET /organizations/me
**Purpose:** Get organization data

**Response DTO:**
```typescript
interface GetOrganizationResponse {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  location: string;
  description?: string;
  website?: string;
  linkedin_page?: string;
  verification_status: "pending" | "verified" | "rejected";
  verification_data?: {
    domain_verified: boolean;
    linkedin_verified: boolean;
    documents_verified: boolean;
  };
  team_members: Array<{
    user_id: string;
    full_name: string;
    email: string;
    role: string;
    status: "active" | "pending" | "inactive";
  }>;
  created_at: string;
  updated_at: string;
}
```

### PATCH /organizations/me
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

### POST /organizations/{id}/team/add
**Purpose:** Add team members

**Request DTO:**
```typescript
interface AddTeamMemberRequest {
  email: string;
  role: "recruiter" | "org_admin";
  permissions?: string[];
}
```

**Response DTO:**
```typescript
interface AddTeamMemberResponse {
  success: boolean;
  message: string;
  invitation_id: string;
}
```

### GET /organizations/team/members
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

### DELETE /organizations/team/members/{userId}
**Purpose:** Remove team member

**Response DTO:**
```typescript
interface RemoveTeamMemberResponse {
  success: boolean;
  message: string;
}
```

### PUT /organizations/team/members/{userId}/role
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

### POST /organizations/verify/domain
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

### GET /organizations/verify/domain/check
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

### POST /organizations/verify/linkedin
**Purpose:** Initiate LinkedIn company page verification

**Response DTO:**
```typescript
interface LinkedInVerificationResponse {
  success: boolean;
  authorization_url: string;
}
```

### POST /organizations/verify/documents
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

### GET /organizations/verify/status
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

### POST /organizations/pricing/set
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

### GET /organizations/pricing
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

### GET /organizations/tokens
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

### POST /organizations/tokens/generate
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

### DELETE /organizations/tokens/{tokenId}
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

### POST /jobs/create
**Purpose:** Create job posting

**Request DTO:**
```typescript
interface CreateJobRequest {
  title: string;
  company: string;
  location: string;
  employment_type: "Full-time" | "Part-time" | "Contract" | "Internship";
  description: string;
  requirements: string;
  salary_min?: number;
  salary_max?: number;
  skills_required: string[];
  application_deadline?: string;
  contact_email?: string;
}
```

**Response DTO:**
```typescript
interface CreateJobResponse {
  success: boolean;
  message: string;
  job: {
    id: string;
    title: string;
    status: "active" | "draft";
    created_at: string;
  };
}
```

### GET /jobs/all
**Purpose:** Get all jobs (feed)

**Query Parameters:**
- page?: number
- limit?: number
- search?: string
- location?: string
- employment_type?: string

**Response DTO:**
```typescript
interface GetJobsResponse {
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    employment_type: string;
    description: string;
    posted_at: string;
    application_count: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

### GET /jobs/search
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

### GET /jobs/my-posted
**Purpose:** Get jobs posted by current user

**Response DTO:**
```typescript
interface GetMyPostedJobsResponse {
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    status: "active" | "draft" | "closed";
    application_count: number;
    created_at: string;
  }>;
}
```

### GET /jobs/recommendations
**Purpose:** Get AI-matched job recommendations

**Response DTO:**
```typescript
interface GetJobRecommendationsResponse {
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    match_score: number;
    matched_skills: string[];
    skill_gaps: string[];
    ai_insights: string;
  }>;
  user_fit_insights: {
    location?: string;
    skills?: string[];
    experience_years?: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

### GET /jobs/{id}
**Purpose:** Get job details

**Response DTO:**
```typescript
interface GetJobDetailsResponse {
  id: string;
  title: string;
  company: string;
  location: string;
  employment_type: string;
  description: string;
  requirements: string;
  salary_min?: number;
  salary_max?: number;
  skills_required: string[];
  application_deadline?: string;
  posted_at: string;
  application_count: number;
  organization: {
    name: string;
    logo?: string;
    verified: boolean;
  };
}
```

### POST /jobs/apply/{id}
**Purpose:** Apply for job

**Request DTO:**
```typescript
interface ApplyForJobRequest {
  cover_letter?: string;
  expected_salary?: number;
  available_from?: string;
  additional_info?: string;
}
```

**Response DTO:**
```typescript
interface ApplyForJobResponse {
  success: boolean;
  message: string;
  application_id: string;
}
```

### GET /jobs/applications/my
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

### DELETE /jobs/applications/{id}
**Purpose:** Withdraw job application

**Response DTO:**
```typescript
interface WithdrawApplicationResponse {
  success: boolean;
  message: string;
}
```

### POST /applications/bulk-ids
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

### POST /applications/bulk-cvs
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

### POST /references/request
**Purpose:** Create reference request

**Request DTO:**
```typescript
interface CreateReferenceRequest {
  issuer_user_id: string;
  type: "work" | "performance" | "membership" | "studentship" | "acknowledgement";
  title: string;
  message?: string;
  start_date?: string;
  end_date?: string;
}
```

**Response DTO:**
```typescript
interface CreateReferenceResponse {
  success: boolean;
  message: string;
  request_id: string;
}
```

### GET /references/requests/my
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

### GET /references/requests/inbox
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

### PUT /references/requests/{id}/respond
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

### POST /references/issue
**Purpose:** Issue reference

**Request DTO:**
```typescript
interface IssueReferenceRequest {
  talent_user_id: string;
  type: "work" | "performance" | "membership" | "studentship" | "acknowledgement";
  title: string;
  relationship_timeline: string;
  relationship_context: string;
  recommendations: string;
  start_date?: string;
  end_date?: string;
  contact_details?: {
    email: string;
    phone?: string;
  };
}
```

**Response DTO:**
```typescript
interface IssueReferenceResponse {
  success: boolean;
  message: string;
  reference_id: string;
}
```

### GET /references/my-references
**Purpose:** Get references for current user

**Response DTO:**
```typescript
interface GetMyReferencesResponse {
  references: Array<{
    id: string;
    type: string;
    title: string;
    issuer_name: string;
    issuer_company: string;
    status: "pending" | "issued" | "verified";
    issued_at?: string;
    verified_at?: string;
  }>;
}
```

### GET /references/issued
**Purpose:** Get references issued by current user

**Response DTO:**
```typescript
interface GetIssuedReferencesResponse {
  references: Array<{
    id: string;
    type: string;
    title: string;
    talent_name: string;
    talent_email: string;
    status: "active" | "revoked";
    issued_at: string;
  }>;
}
```

### DELETE /references/{id}/revoke
**Purpose:** Revoke issued reference

**Response DTO:**
```typescript
interface RevokeReferenceResponse {
  success: boolean;
  message: string;
}
```

### PUT /references/{referenceId}/status
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

### POST /screening/session/create
**Purpose:** Create screening session

**Request DTO:**
```typescript
interface CreateScreeningSessionRequest {
  job_id: string;
  name: string;
  description?: string;
  criteria: {
    skills: string[];
    experience_years: number;
    education_level?: string;
    location?: string;
  };
}
```

**Response DTO:**
```typescript
interface CreateScreeningSessionResponse {
  success: boolean;
  message: string;
  session: {
    id: string;
    job_id: string;
    name: string;
    status: "active" | "completed";
    created_at: string;
  };
}
```

### GET /screening/sessions
**Purpose:** Get all screening sessions

**Response DTO:**
```typescript
interface GetScreeningSessionsResponse {
  sessions: Array<{
    id: string;
    job_id: string;
    job_title: string;
    name: string;
    status: "active" | "completed";
    candidate_count: number;
    created_at: string;
  }>;
}
```

### GET /screening/session/{id}
**Purpose:** Get specific screening session

**Response DTO:**
```typescript
interface GetScreeningSessionResponse {
  id: string;
  job_id: string;
  name: string;
  description?: string;
  status: "active" | "completed";
  criteria: object;
  candidates: Array<{
    id: string;
    name: string;
    email: string;
    fit_score: number;
    status: "shortlisted" | "rejected" | "pending";
    applied_at: string;
  }>;
  created_at: string;
}
```

### POST /screening/session/{id}/bulk-cv
**Purpose:** Bulk CV upload for screening
**Content-Type:** multipart/form-data

**Request:** Multiple CV files

**Response DTO:**
```typescript
interface BulkCVScreeningResponse {
  success: boolean;
  message: string;
  candidates_processed: number;
  candidates_added: number;
}
```

### POST /screening/session/{id}/screen-ids
**Purpose:** Screen candidates by VeriTalent IDs

**Request DTO:**
```typescript
interface ScreenByIdsRequest {
  veritalent_ids: string[];
}
```

**Response DTO:**
```typescript
interface ScreenByIdsResponse {
  success: boolean;
  message: string;
  candidates_added: number;
  failed_ids: string[];
}
```

### POST /screening/calculate-fit-score
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

### GET /jobs/{jobId}/applicants/ranked
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

### GET /ai-card/{veritalentId}/recruiter-view
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
  }>;
  fit_score: number;
  recommendations: string[];
}
```

### GET /applicants/{applicantId}/notes
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

### POST /applicants/{applicantId}/notes
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

### PUT /applicants/{applicantId}/notes/{noteId}
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

### DELETE /applicants/{applicantId}/notes/{noteId}
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

### POST /ai/analyze-profile
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

### GET /competency-signals/{veritalentId}
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

### POST /competency/calculate/{veritalentId}
**Purpose:** Calculate all competency signals

**Response DTO:**
```typescript
interface CalculateCompetencySignalsResponse {
  success: boolean;
  message: string;
  signals_calculated: number;
}
```

### GET /competency/breakdown/{veritalentId}/{skill}
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

### POST /competency/validate
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

### POST /ai-card/share/{veritalentId}
**Purpose:** Generate shareable public link

**Response DTO:**
```typescript
interface ShareAICardResponse {
  success: boolean;
  share_token: string;
  public_url: string;
}
```

### GET /ai-card/public/{shareToken}
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

### GET /ai-card/pdf/{veritalentId}
**Purpose:** Generate and download PDF

**Response:** PDF file download

### GET /analytics/overview
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

### GET /notifications
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

### GET /notifications/unread
**Purpose:** Get unread count

**Response DTO:**
```typescript
interface GetUnreadCountResponse {
  count: number;
}
```

### PUT /notifications/{id}/read
**Purpose:** Mark notification as read

**Response DTO:**
```typescript
interface MarkNotificationReadResponse {
  success: boolean;
  message: string;
}
```

### PUT /notifications/read-all
**Purpose:** Mark all notifications as read

**Response DTO:**
```typescript
interface MarkAllNotificationsReadResponse {
  success: boolean;
  message: string;
  marked_count: number;
}
```

### DELETE /notifications/{id}
**Purpose:** Delete notification

**Response DTO:**
```typescript
interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}
```

---

## Tokens & Payments

### GET /tokens/balance
**Purpose:** Get token balance

**Response DTO:**
```typescript
interface GetTokenBalanceResponse {
  personal: number;
  organizational: number;
  total_available: number;
  history: Array<{
    id: string;
    type: "purchase" | "usage" | "refund";
    amount: number;
    description: string;
    created_at: string;
  }>;
}
```

### GET /tokens/history
**Purpose:** Get token history

**Query Parameters:**
- page?: number
- limit?: number
- type?: "purchase" | "usage" | "refund"

**Response DTO:**
```typescript
interface GetTokenHistoryResponse {
  transactions: Array<{
    id: string;
    type: "purchase" | "usage" | "refund";
    amount: number;
    balance_after: number;
    description: string;
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

### POST /tokens/purchase
**Purpose:** Purchase tokens

**Request DTO:**
```typescript
interface PurchaseTokensRequest {
  amount: number;
  payment_method: "card" | "bank_transfer";
  currency: "NGN" | "USD";
}
```

**Response DTO:**
```typescript
interface PurchaseTokensResponse {
  success: boolean;
  message: string;
  transaction_id: string;
  tokens_added: number;
  payment_url?: string;
}
```

---

## LPI (Learning & Performance Intelligence)

### POST /tapi/submit
**Purpose:** Submit data to TAPI

**Request DTO:**
```typescript
interface TapiSubmitRequest {
  data: object;
  assessment_type: string;
  participant_id: string;
}
```

**Response DTO:**
```typescript
interface TapiSubmitResponse {
  success: boolean;
  message: string;
  submission_id: string;
  results?: object;
}
```

### POST /tapi/cohort/create
**Purpose:** Create cohort

**Request DTO:**
```typescript
interface CreateCohortRequest {
  name: string;
  description?: string;
  participant_ids: string[];
  assessment_type: string;
}
```

**Response DTO:**
```typescript
interface CreateCohortResponse {
  success: boolean;
  message: string;
  cohort_id: string;
}
```

### GET /tapi/my-submissions
**Purpose:** Get my submissions

**Response DTO:**
```typescript
interface GetMySubmissionsResponse {
  submissions: Array<{
    id: string;
    assessment_type: string;
    status: "pending" | "completed" | "failed";
    submitted_at: string;
    results?: object;
  }>;
}
```

### GET /tapi/cohort/{id}/report
**Purpose:** Get cohort report

**Response DTO:**
```typescript
interface GetCohortReportResponse {
  cohort_id: string;
  name: string;
  participant_count: number;
  average_score?: number;
  completion_rate: number;
  individual_results: Array<{
    participant_id: string;
    score?: number;
    completed_at?: string;
    status: "completed" | "in_progress" | "not_started";
  }>;
  generated_at: string;
}
```

### GET /api/lpi/reports
**Purpose:** Get LPI reports

**Response DTO:**
```typescript
interface GetLPIReportsResponse {
  reports: Array<{
    id: string;
    participant_id: string;
    assessment_type: string;
    score: number;
    competencies: Array<{
      name: string;
      score: number;
      level: string;
    }>;
    generated_at: string;
  }>;
}
```

### GET /api/lpi/reports-with-signals
**Purpose:** Get LPI reports with competency signals

**Response DTO:**
```typescript
interface GetLPIReportsWithSignalsResponse {
  reports: Array<{
    id: string;
    participant_id: string;
    assessment_type: string;
    score: number;
    competency_signals: Array<{
      skill: string;
      score: number;
      level: "beginner" | "intermediate" | "advanced";
      verified: boolean;
    }>;
    generated_at: string;
  }>;
}
```

---

## Professional Recommendations

### POST /recommendations/issue
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

### GET /recommendations/issued/my
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

### GET /recommendations/talent/{talentId}
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

---

## Certificate Verification

### POST /certificates/verify/request
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

### GET /certificates/verify/my-requests
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

### GET /certificates/verify/pending
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

### PUT /certificates/verify/{id}/approve
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

### PUT /certificates/verify/{id}/reject
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

### GET /certificates/verified
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

### POST /email/send-verification
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

### POST /email/verify
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

### POST /email/resend-verification
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

### POST /api/external/ats/auth
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

### GET /api/external/ats/candidates
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

### GET /api/external/ats/candidate/{veritalentId}
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

### POST /api/external/ats/webhooks/subscribe
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

### POST /api/external/ats/jobs/post
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

**Note:** This document provides comprehensive API specifications for all required backend endpoints. Each endpoint includes the HTTP method, request DTO schema, and response DTO schema. Implementation should follow RESTful conventions and include proper error handling, validation, and authentication middleware.