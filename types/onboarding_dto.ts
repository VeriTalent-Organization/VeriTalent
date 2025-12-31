import { z } from 'zod'
import { userTypes } from './user_type'

// Base fields shared across onboarding
const BaseOnboardingSchema = z.object({
  user_type: z.nativeEnum(userTypes),
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  country: z.string().min(1, 'Country is required'),
  has_agreed_to_terms: z.boolean(),
})

// Talent-specific onboarding
export const TalentOnboardingSchema = BaseOnboardingSchema.merge(
  z.object({
    user_type: z.literal(userTypes.TALENT),
    // Identity + AI Card step additions
    linked_emails: z.array(z.string().email()).min(1),
    veritalent_id: z.string().optional(),
    // CV source: upload or LinkedIn. When `upload`, require storage fields; when `linkedin`, require connection.
    cv_source: z.enum(['upload', 'linkedin']),
    // Storage-centric fields (required for `upload`, optional for `linkedin`)
    cv_key: z.string().min(1).optional(),
    cv_file_name: z.string().min(1).optional(),
    cv_mime_type: z.string().min(1).optional(),
    cv_file_size: z.number().int().positive().optional(),
    cv_url: z.string().url().optional(),
    cv_hash: z.string().optional(),
    // LinkedIn connection flag (required true when `cv_source` = 'linkedin')
    linkedin_connected: z.boolean().optional(),
  })
).refine(
  (dto) => {
    if (dto.cv_source === 'upload') {
      return !!dto.cv_key && !!dto.cv_file_name && !!dto.cv_mime_type && typeof dto.cv_file_size === 'number'
    }
    if (dto.cv_source === 'linkedin') {
      return dto.linkedin_connected === true
    }
    return false
  },
  {
    message:
      'Provide storage fields for cv_source=upload (cv_key, cv_file_name, cv_mime_type, cv_file_size) or set linkedin_connected=true for cv_source=linkedin',
    path: ['cv_source'],
  }
)

// Independent Recruiter onboarding
export const RecruiterOnboardingSchema = BaseOnboardingSchema.merge(
  z.object({
    user_type: z.literal(userTypes.INDEPENDENT_RECRUITER),
    professional_status: z.string().min(1),
    current_designation: z.string().min(1),
    organisation_name: z.string().min(1),
  })
)

// Organisation onboarding (aligned with `types/create_user.ts` fields)
export const OrganisationOnboardingSchema = BaseOnboardingSchema.merge(
  z.object({
    user_type: z.literal(userTypes.ORGANISATION),
    organisation_name: z.string().min(1),
    email_domain: z.string().min(1),
    website: z.string().url(),
    industry: z.string().min(1),
    organisation_size: z.string().min(1),
    location: z.string().min(1),
    rc_number: z.string().min(1),
  })
)

// Discriminated union for full onboarding payload
export const OnboardingDTOSchema = z.union([
  TalentOnboardingSchema,
  RecruiterOnboardingSchema,
  OrganisationOnboardingSchema,
])

// Inferred TypeScript types for convenience
export type TalentOnboardingDTO = z.infer<typeof TalentOnboardingSchema>
export type RecruiterOnboardingDTO = z.infer<typeof RecruiterOnboardingSchema>
export type OrganisationOnboardingDTO = z.infer<typeof OrganisationOnboardingSchema>
export type OnboardingDTO = z.infer<typeof OnboardingDTOSchema>

// Example payloads (for backend reference)
/*
// TALENT
const exampleTalent: TalentOnboardingDTO = {
  user_type: userTypes.TALENT,
  full_name: 'Jane Doe',
  email: 'jane@example.com',
  password: 'strongPass123',
  country: 'NG',
  has_agreed_to_terms: true,
  linked_emails: ['jane@example.com', 'jane@institution.edu'],
  veritalent_id: 'VT/1234-AB',
  cv_source: 'upload',
  cv_key: 'cv/jane-doe/2025-12-27/resume.pdf',
  cv_file_name: 'resume.pdf',
  cv_mime_type: 'application/pdf',
  cv_file_size: 524288,
  cv_url: 'https://storage.example.com/cv/jane-doe/2025-12-27/resume.pdf',
}

// INDEPENDENT_RECRUITER
const exampleRecruiter: RecruiterOnboardingDTO = {
  user_type: userTypes.INDEPENDENT_RECRUITER,
  full_name: 'John Recruiter',
  email: 'john@agency.com',
  password: 'strongPass123',
  country: 'NG',
  has_agreed_to_terms: true,
  professional_status: 'Senior Recruiter',
  current_designation: 'Lead Talent Partner',
  organisation_name: 'TalentWorks Ltd',
}

// ORGANISATION
const exampleOrganisation: OrganisationOnboardingDTO = {
  user_type: userTypes.ORGANISATION,
  full_name: 'Org Admin',
  email: 'admin@acme.com',
  password: 'strongPass123',
  country: 'NG',
  has_agreed_to_terms: true,
  organisation_name: 'Acme Corp',
  email_domain: 'acme.com',
  website: 'https://acme.com',
  industry: 'Technology',
  organisation_size: '201-500',
  location: 'Lagos, NG',
  rc_number: 'RC-987654',
}
*/
