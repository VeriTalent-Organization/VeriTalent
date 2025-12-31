// ===== FRONTEND TYPES =====

// Form-related types
type IconPosition = "start" | "end" | "inline-start" | "inline-end";

interface DropdownConfig {
  options: string[];
  defaultValue?: string;
  onSelect?: (value: string) => void;
}

interface IconConfig {
  icon: React.ReactNode;
  position: IconPosition;
  type?: "icon" | "text" | "button";
  onClick?: () => void;
  tooltip?: string;
}

interface FieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  type?: string;
  icons?: IconConfig[];
  dropdown?: DropdownConfig;
  /** layout */
  row?: string;        // same value = same row
  colSpan?: number;    // grid span (1–12)
  rows?: number;       // for textarea height
  maxLength?: number;  // character limit for textarea
}

interface FormProps {
  fields: FieldConfig[];
  classNames?: string;
  submitButtonText?: string;
  submitButtonStyle?: string;
  submitButtonPosition?: "left" | "center" | "right" | "full";
  showSubmitButton?: boolean;
  formType?: string;
  submitFunction?: (data: Record<string, string>) => void;
}

// Component prop types
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

interface ViewButton {
  id: ViewMode;
  label: string;
  count?: number;
}

interface ViewModeButtonsProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

interface NewIssuanceViewProps {
  formData: FormData;
  onFormChange: (field: keyof FormData, value: string) => void;
  onSubmit: () => void;
}

interface ProfileHeaderProps {
  name: string;
  title: string;
  email: string;
  initials: string;
}

interface NotificationsTabProps {
  notifications: {
    email: boolean;
    newApplications: boolean;
    interviewReminders: boolean;
    systemUpdates: boolean;
  };
  onToggle: (key: keyof NotificationsTabProps['notifications']) => void;
}

interface NotificationOption {
  key: string;
  title: string;
  description: string;
}

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
}

interface TextProps {
  variant?: string;
  className?: string;
  children: React.ReactNode;
}

type TextVariant = "Heading" | "SubHeadings" | "SubText" | "RegularText";

interface MaxWidthContainerProps {
  children: React.ReactNode;
  className?: string;
  large?: boolean;
}

interface UserTypeCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

interface VeriTalentCardProps {
  userType: string;
  isVerified?: boolean;
  talentData?: TalentCardData;
}

interface ExistingJobSelectorProps {
  onSelect: (job: ExistingJob) => void;
}

interface InternalLPIFeedProps {
  onNavigate: (mode: LPIMode) => void;
}

interface LPIReportsViewProps {
  onNavigate: (mode: LPIMode) => void;
}

interface ModeOptionCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

interface NewRequestsSectionProps {
  onViewRepository: (type: RepositoryType) => void;
}

interface ReferencesDashboardProps {
  onViewRepository: (type: RepositoryType) => void;
}

interface RepositoryCardProps {
  item: RepositoryItem;
  onAction: (action: string, item: RepositoryItem) => void;
}

interface StepFooterProps {
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  showBack?: boolean;
  loading?: boolean;
}

interface TabNavigationProps {
  tabs: Array<{ id: string; label: string }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

interface StatsSectionProps {
  stats: StatCardProps[];
}

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

interface JobFormFieldProps {
  label: string;
  type?: 'text' | 'select' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
}

// ===== BACKEND TYPES (API Response Models) =====

// 🔄 BACKEND: Notification API (/api/notifications)
interface Notification {
  id: string;
  type: 'application' | 'reference' | 'screening' | 'system' | 'message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

// 🔄 BACKEND: Points/Transactions API (/api/points/transactions)
interface Transaction {
  id: number;
  type: 'usage' | 'purchase' | 'bonus';
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}

// 🔄 BACKEND: Points/Packages API (/api/points/packages)
interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: number;
  originalPrice?: number;
  popular?: boolean;
}

// 🔄 BACKEND: LPI Reports API (/api/lpi/reports)
interface Report {
  id: number;
  title: string;
  type: "internal" | "institutional";
  subtitle: string;
  description: string;
  date: string;
  status?: 'processing' | 'completed' | 'failed';
}

// 🔄 BACKEND: LPI Reports View (frontend component)
interface LPIReport {
  id: number;
  title: string;
  type: 'internal' | 'institutional';
  subtitle: string;
  description: string;
  date: string;
}

// 🔄 BACKEND: Talent Card API (/api/talent/{id}/card)
interface TalentCardData {
  name: string;
  id: string;
  role: string;
  location: string;
  education: string;
  linkedin: string;
  bio: string;
  workExperience: string;
  educationSummary: string;
  accomplishments: string[];
  aiFitScore?: number;
  careerSignalStrength?: number;
  matchedRoles?: string[];
  skillGaps?: string[];
  growthRecommendations?: string;
  skills?: Array<{
    name: string;
    verifiedBy: string;
    level: string;
    color: string;
  }>;
}

// 🔄 BACKEND: Recommendation API (/api/recommendations)
interface Recommendation {
  issuer: string;
  talentName: string;
  dateIssued: string;
  timeline: string;
  relationshipContext: string;
  recommendations: string;
}

// ===== EXISTING TYPES =====

// types/jobContext.ts
export type CVUploadMode = "existing" | "create";

export interface JobContextData {
  jobTitle: string;
  companyName: string;
  employmentType: string;
  location: string;
  roleOverview: string;
}

export const defaultJobData: JobContextData = {
  jobTitle: "",
  companyName: "",
  employmentType: "",
  location: "",
  roleOverview: "",
};

export interface JobContextLabels {
  title?: string;
  existingOption?: string;
  createOption?: string;
  jobTitle?: string;
  companyName?: string;
  employmentType?: string;
  location?: string;
  roleOverview?: string;
}

export interface ExistingJob {
  _id: string;
  title: string;
  companyName: string;
  employmentType: string;
  location: string;
  applicationDeadline: string;
  status: string;
  views: number;
  applicants: Array<{ _id: string; fullName: string }>;
  createdAt: string;
  updatedAt: string;
}

// types/careerRepository.ts
export type RepositoryType =
  | "Work Reference"
  | "Membership Reference"
  | "Certificate Verification"
  | "Certificate"
  | "Work History"
  | "Recommendation";

export type PageMode =
  | "dashboard"
  | "work-reference"
  | "certificate-verification"
  | "add-existing";

export type LPIMode = "reports" | "internal-feed" | "institutional-sync";

export interface RepositoryItem {
  type: RepositoryType;
  badge: string;
  badgeColor: string;
  organization: string;
  subtitle: string;
  period: string;
  showOnCard: boolean;
  actions: number;
}

// types/verifyIssue.ts
export type ViewMode = 'new' | 'inbox' | 'issued';
export type TabType = 'work' | 'other';

export interface Request {
  talent: string;
  credentialType: string;
  dateSubmitted: string;
  status: string;
}

export interface BulkRecord {
  talent: string;
  credentialType: string;
  dateIssued: string;
  status: string;
}

export interface IssuedRecord {
  talent: string;
  credentialType: string;
  dateIssued: string;
  status: string;
  statusColor: string;
  isBulk?: boolean;
  bulkRecords?: BulkRecord[];
  dateSubmitted?: string;
}

export interface FormData {
  issuer: string;
  talentName: string;
  talentEmail: string;
  roleDepartment: string;
  employmentType: string;
  onsite: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
}

// ===== EXPORTS =====
export type {
  // Frontend types
  IconPosition,
  DropdownConfig,
  IconConfig,
  FieldConfig,
  FormProps,
  SidebarProps,
  DashboardHeaderProps,
  ViewButton,
  ViewModeButtonsProps,
  NewIssuanceViewProps,
  ProfileHeaderProps,
  NotificationsTabProps,
  NotificationOption,
  Tab,
  TabNavigationProps,
  FormField,
  TextProps,
  TextVariant,
  MaxWidthContainerProps,
  UserTypeCardProps,
  VeriTalentCardProps,
  ExistingJobSelectorProps,
  InternalLPIFeedProps,
  LPIReportsViewProps,
  ModeOptionCardProps,
  NewRequestsSectionProps,
  ReferencesDashboardProps,
  RepositoryCardProps,
  StepFooterProps,
  StatCardProps,
  StatsSectionProps,
  ProgressIndicatorProps,
  JobFormFieldProps,

  // Backend types (API models)
  Notification,
  Transaction,
  TokenPackage,
  Report,
  LPIReport,
  Recommendation,
  TalentCardData,
};