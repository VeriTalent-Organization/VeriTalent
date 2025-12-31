import { userTypes } from "./user_type";

export interface CreateUserInterface{
    user_type:userTypes;  // Current active role
    available_roles?: ('talent' | 'recruiter' | 'org_admin')[];  // All roles user has access to
    full_name:string;
    email:string;
    password:string;
    country:string;
    has_agreed_to_terms:boolean;
    professional_status?:string;
    current_designation?:string;
    organisation_name?:string;
    location?:string
    rc_number?:string;
    email_domain?:string;
    website?:string;
    industry?:string;
    organisation_size?:string;
    address?:string;
    // Organization-specific fields
    organization_name?: string;
    organisation_rc_number?: string;
    organization_domain?: string;
    organization_linkedin_page?: string;
    organisation_industry?: string;
    organisation_location?: string;
    token?: string | null;
    veritalent_id?: string;
    linked_emails?: string[];
    linkedin_connected?: boolean;
    cv_uploaded?: boolean;
}