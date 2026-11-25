export type NavSection =
  | "dashboard"
  | "jobs"
  | "resume"
  | "cover-letters"
  | "profile"
  | "tracker"
  | "extension"
  | "network"
  | "interviews"
  | "learning"
  | "assistant"
  | "alerts"
  | "settings";

export type PhilosopherId =
  | "aristotle"
  | "plato"
  | "davinci"
  | "cicero"
  | "socrates"
  | "marcus"
  | "zeus"
  | "hephaestus"
  | "hermes"
  | "athena"
  | "themis"
  | "plutus"
  | "apollo";

export type RequirementEvidenceStatus = "has" | "transferable" | "improve" | "missing";

export interface JobRequirementAudit {
  id: string;
  text: string;
  mustHave: boolean;
  status: RequirementEvidenceStatus;
  evidenceRef: string;
}

export type JobTriageState = "inbox" | "saved" | "passed";

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  monogram: string;
  location: string;
  arrangement: "Remote" | "Hybrid" | "On-site";
  experienceLevel: "Mid" | "Senior" | "Lead";
  industry: string;
  salaryLabel: string;
  salaryDisclosed: boolean;
  salaryMinGBP: number;
  matchScore: number;
  sourceCount: number;
  sources: string[];
  postedAge: string;
  staleWarning?: string;
  redFlags: string[];
  skills: string[];
  triage: JobTriageState;
  requirements: JobRequirementAudit[];
  platoNote: string;
}

export type DiffStatus = "pending" | "accepted" | "rejected";

export interface CvDiffItem {
  id: string;
  section: string;
  variantId: string;
  original: string;
  proposed: string;
  sourceNote: string;
  hasUnsupportedClaim: boolean;
  unsupportedReason?: string;
  status: DiffStatus;
}

export interface CvVariant {
  id: string;
  label: string;
  targetRole: string;
  summary: string;
  bullets: { id: string; text: string; verified: boolean; source?: string }[];
  atsScore: number;
  templateId: string;
}

export interface CvTemplate {
  id: string;
  name: string;
  category: "Executive" | "Technical" | "Minimal" | "Operations";
  columns: "1-Column ATS" | "1-Column Compact";
  description: string;
  accentColor: string;
}

export interface CoverLetterDraft {
  id: string;
  title: string;
  company: string;
  role: string;
  tone: "Measured Executive" | "Technical Direct" | "Warm Editorial";
  status: "Draft" | "Cited & Ready" | "Archived";
  updatedAt: string;
  paragraphs: string[];
  citedProofIds: string[];
}

export type ApplicationTruthState =
  | "prepared"
  | "user_reported"
  | "verified";

export type PipelineStage =
  | "planned"
  | "applied"
  | "assessment"
  | "interviewing"
  | "offer"
  | "archived";

export interface ApplicationRecord {
  id: string;
  jobId?: string;
  role: string;
  company: string;
  monogram: string;
  salary: string;
  stage: PipelineStage;
  truthState: ApplicationTruthState;
  confirmationHash?: string;
  updatedAt: string;
  source: "Vex Prepared" | "Extension Verified" | "Manual Entry";
  checklist: {
    cvVerified: boolean;
    letterAttached: boolean;
    noticeChecked: boolean;
  };
  notes: string;
}

export interface NetworkContact {
  id: string;
  name: string;
  role: string;
  company: string;
  warmth: "Warm Intro" | "Direct Peer" | "Cold Outreach";
  urgency: "Follow-up Today" | "This Week" | "Synced";
  pinned: boolean;
  linkedAppId?: string;
  lastTouch: string;
  note: string;
  avatar?: string;
}

export type SkillLevel =
  | "Self-reported"
  | "CV-backed"
  | "Demonstrated in Vex"
  | "Verified";

export interface ProfileSkill {
  id: string;
  name: string;
  domain: "Governance" | "Release" | "SQL Audit" | "Briefs" | "Frontend";
  level: SkillLevel;
  evidence: string;
  premiumLabel?: string;
}

export interface ProofCase {
  id: string;
  title: string;
  metric: string;
  summary: string;
  repoUrl?: string;
}

export interface RoadmapMilestone {
  id: string;
  phase: "I. Agora" | "II. Lyceum" | "III. Acropolis" | "IV. Delphi";
  category: "skill" | "project" | "application" | "certification";
  title: string;
  description: string;
  dueLabel: string;
  completed: boolean;
}

export interface InterviewSession {
  id: string;
  company: string;
  role: string;
  track: "Behavioral" | "Technical" | "HR" | "Company-specific";
  seniority: "Mid" | "Senior" | "Lead";
  mentor: PhilosopherId;
  date: string;
  durationMin: number;
  starScore: number;
  feedback: string;
  answerDraft?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  skillTarget: string;
  durationMin: number;
  progress: number;
  salaryBoost: string;
  rolesUnlocked: number;
  quizPassed: boolean;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface AlertItem {
  id: string;
  category: "Application" | "CV Truth" | "Interview" | "Deadline" | "Reminder";
  title: string;
  detail: string;
  timestamp: string;
  unread: boolean;
  snoozed: boolean;
  targetSection: NavSection;
}

export interface DailyStep {
  id: string;
  category: "CV" | "JOB SEARCH" | "INTERVIEW" | "LEARNING";
  duration: string;
  title: string;
  done: boolean;
  targetSection: NavSection;
}

export interface ZeusActionPlan {
  id: string;
  prompt: string;
  summary: string;
  reads: string[];
  writes: string[];
  status: "awaiting_approval" | "executed" | "cancelled";
  timestamp: string;
}

export interface McpAuditEntry {
  id: string;
  toolName: string;
  payloadSummary: string;
  status: "ok" | "blocked";
  timestamp: string;
}

export interface BillingInvoice {
  id: string;
  date: string;
  planLabel: string;
  amount: string;
  status: "Paid" | "Active";
  method: string;
}

export interface ExternalAppAccess {
  id: string;
  name: string;
  scope: string;
  connected: boolean;
}

export interface CanonicalProfile {
  name: string;
  headline: string;
  targetRole: string;
  workPattern: "Hybrid" | "Remote" | "On-site";
  location: string;
  noticePeriod: string;
  salaryRange: string;
  publicHandle: string;
  publicEnabled: boolean;
  linkedinAlignmentPct: number;
  credentials: string[];
  skills: ProfileSkill[];
  proofCases: ProofCase[];
  repos: {
    id: string;
    name: string;
    description: string;
    stars: number;
    commits: number;
    stack: string[];
    featured: boolean;
  }[];
}

export interface WorkspacePreferences {
  sampleBannerDismissed: boolean;
  alertTier: "Essential" | "Standard" | "Everything";
  quietHours: boolean;
  aiInferenceOptIn: boolean;
  extensionGuardrails: {
    verifiedSkillsOnly: boolean;
    alwaysStopBeforeSubmit: boolean;
    captureConfirmationHash: boolean;
    flagUnstatedFields: boolean;
  };
  sitePermissions: {
    greenhouse: boolean;
    lever: boolean;
    ashby: boolean;
    workday: boolean;
  };
  plan: "Free" | "Pro" | "Ultra";
  aiCreditsUsed: number;
  aiCreditsLimit: number;
}

export interface VexWorkspaceState {
  profile: CanonicalProfile;
  jobs: JobMatch[];
  cvVariants: CvVariant[];
  activeVariantId: string;
  cvDiffs: CvDiffItem[];
  coverLetters: CoverLetterDraft[];
  applications: ApplicationRecord[];
  contacts: NetworkContact[];
  interviews: InterviewSession[];
  learning: LearningModule[];
  roadmap: RoadmapMilestone[];
  alerts: AlertItem[];
  dailySteps: DailyStep[];
  zeusPlans: ZeusActionPlan[];
  mcpLogs: McpAuditEntry[];
  invoices: BillingInvoice[];
  externalApps: ExternalAppAccess[];
  preferences: WorkspacePreferences;
}
