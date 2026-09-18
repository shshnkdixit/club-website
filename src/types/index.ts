export type AIDomainId = 
  | 'artificial-intelligence'
  | 'machine-learning'
  | 'deep-learning'
  | 'generative-ai'
  | 'computer-vision'
  | 'natural-language-processing'
  | 'robotics'
  | 'data-science'
  | 'reinforcement-learning'
  | 'ai-agents';

export interface AIDomain {
  id: AIDomainId;
  name: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  technologies: string[];
  keyConcepts: string[];
  activeProjectsCount: number;
  researchFocus: string;
  color: string;
  glowColor: string;
}

export interface Project {
  id: string;
  title: string;
  domain: AIDomainId;
  category: 'AI' | 'ML' | 'Computer Vision' | 'NLP' | 'Robotics' | 'Generative AI' | 'AI Agents' | 'Deep Learning';
  tagline: string;
  description: string;
  longDescription: string;
  technologies: string[];
  teamMembers: string[];
  githubUrl?: string;
  demoUrl?: string;
  paperUrl?: string;
  stars?: number;
  featured: boolean;
  simulatorType?: 'computer-vision' | 'robotics' | 'neural-network' | 'ai-agent' | 'none';
  metrics?: { label: string; value: string }[];
  image: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  type: 'Workshop' | 'Hackathon' | 'Bootcamp' | 'Guest Lecture' | 'AI Challenge' | 'Coding Competition' | 'Research Session' | 'Project Expo';
  date: string; // e.g. "Nov 15, 2026" or ISO
  time?: string; // e.g. "10:00 AM"
  endDate?: string;
  venue: string;
  location?: string;
  speaker?: {
    name: string;
    role: string;
    organization: string;
    avatar?: string;
  };
  description: string;
  longDescription?: string;
  registrationUrl?: string;
  totalSeats?: number;
  registeredCount: number;
  isUpcoming: boolean;
  isLive?: boolean;
  status?: 'UPCOMING' | 'LIVE' | 'COMPLETED';
  tags: string[];
  requirements?: string[];
  agenda?: { time: string; activity: string }[];
  bannerImage?: string;
  posterUrl?: string;
  mediaType?: 'image' | 'video';
  recapUrl?: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  domain: AIDomainId;
  status: 'Published' | 'Under Review' | 'Preprint' | 'In Progress';
  conference?: string;
  year: number;
  abstract: string;
  pdfUrl?: string;
  codeUrl?: string;
  demoUrl?: string;
  citationBibtex?: string;
  keywords: string[];
  metrics?: { label: string; value: string };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  domain: AIDomainId;
  department: string;
  year?: string;
  bio: string;
  avatar: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  email?: string;
  skills: string[];
  isFaculty?: boolean;
  isMentor?: boolean;
  specialization?: string;
  orgLevel?: number; // 1: President / Faculty Director, 2: Vice President, 3: Team SPOCs / Leads, 4: Core Members
  reportsToId?: string; // ID of leader they report to
  treeOrder?: number; // Sorting order within tree level
  spocTitle?: string; // e.g. "Technical Team SPOC", "Marketing Team SPOC", "Event Management SPOC"
  initials?: string; // 2-letter badge (e.g. HV, IK, GR, AP, TK, DS)
}

export interface Testimonial {
  id: string;
  name: string;
  program: string;
  year: string;
  role: string;
  companyOrPlacement?: string;
  quote: string;
  avatar: string;
  domain: AIDomainId;
}

export interface Achievement {
  id: string;
  title: string;
  category: 'Hackathon Win' | 'Research Publication' | 'Grant & Funding' | 'Industry Project' | 'Certification';
  year: string;
  description: string;
  issuer: string;
  rankOrMetric?: string;
  badgeIcon: string;
}

export interface JoinApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  year: string;
  department: string;
  skills: string[];
  aiInterests: AIDomainId[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  statementOfPurpose: string;
  submittedAt: string;
  status: 'Pending' | 'Reviewing' | 'Accepted' | 'Waitlisted';
  applicationId: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  programOrCompany?: string;
  purpose: 'Join Club' | 'Collaboration' | 'Research' | 'Workshop' | 'Sponsorship' | 'General Inquiry';
  message: string;
  submittedAt: string;
  read: boolean;
}

export interface SiteSettings {
  clubName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  stats: {
    members: number;
    projects: number;
    workshops: number;
    hackathons: number;
    publications: number;
    prizePool: string;
  };
  announcement?: {
    enabled: boolean;
    text: string;
    linkUrl?: string;
    linkText?: string;
  };
  socialLinks: {
    discord: string;
    whatsapp: string;
    linkedin: string;
    github: string;
    instagram: string;
    youtube?: string;
  };
}

export type RobotActionState = 
  | 'idle'
  | 'welcome'
  | 'wave'
  | 'listening'
  | 'thinking'
  | 'processing'
  | 'explaining'
  | 'success'
  | 'error'
  | 'diagnostics'
  | 'neural_network'
  | 'computer_vision'
  | 'research_mode'
  | 'show_projects'
  | 'show_events'
  | 'point_hologram'
  | 'celebrate'
  | 'dancing'
  | 'running'
  | 'angry'
  | 'sleep'
  | 'combat'
  | 'fly'
  | 'turn_around'
  | 'matrix';

export type NovaEyeState = 'idle' | 'happy' | 'thinking' | 'processing' | 'speaking' | 'warning' | 'success';

export type NovaCoreState = 'idle' | 'listening' | 'thinking' | 'processing' | 'completed' | 'error';

export interface RobotCommandLog {
  id: string;
  command: string;
  timestamp: string;
  actionTriggered: RobotActionState;
  response: string;
}

export type QuestDifficulty = 'Easy' | 'Medium' | 'Hard';

export type QuestCategory = 
  | 'Python & NumPy'
  | 'PyTorch & Deep Learning'
  | 'Computer Vision'
  | 'NLP & LLMs'
  | 'Reinforcement Learning'
  | 'Autonomous Agents';

export interface CodingQuest {
  id: string;
  title: string;
  slug: string;
  domain: AIDomainId;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  bountyPoints: number;
  solversCount: number;
  tags: string[];
  isProblemOfTheWeek?: boolean;
  expiresAt?: string; // ISO format date string for weekly countdown
  shortSummary: string;
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  sampleTestCases: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: {
    python: string;
  };
  hints: string[];
}

export interface QuestSubmission {
  id: string;
  questId: string;
  questTitle: string;
  studentName: string;
  studentUID: string;
  githubRepoUrl: string;
  solutionNotes: string;
  submittedCode?: string;
  status: 'Pending Review' | 'Verified' | 'Needs Revision';
  submittedAt: string;
  pointsAwarded?: number;
  reviewerNotes?: string;
}

// ──────────────────────────────────────────
// ROADMAP & CURRICULUM TRAJECTORY
// ──────────────────────────────────────────
export type MilestoneStatus = 'COMPLETED' | 'IN PROGRESS' | 'UPCOMING';

export interface RoadmapMilestone {
  id: string;
  phaseNumber: 1 | 2 | 3 | 4;
  phaseName: string;
  phaseTheme: string;
  title: string;
  timeline: string;
  status: MilestoneStatus;
  description: string;
  keyTopics: string[];
  deliverables: string[];
  toolsAndTech: string[];
  completionPercentage: number;
  featured?: boolean;
}

// ──────────────────────────────────────────
// KNOWLEDGE VAULT / RESOURCES
// ──────────────────────────────────────────
export type ResourceCategory = 
  | 'AI'
  | 'Machine Learning'
  | 'Python'
  | 'Git & GitHub'
  | 'Generative AI'
  | 'Computer Vision'
  | 'Data Science';

export type ResourceType = 
  | 'Course'
  | 'Video'
  | 'Article'
  | 'Documentation'
  | 'Tutorial'
  | 'Tool';

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  type: ResourceType;
  author: string;
  url: string;
  iconName?: string;
  tags: string[];
  featured?: boolean;
  addedAt?: string;
}

// ──────────────────────────────────────────
// ADMIN CMS & GOVERNANCE TYPES
// ──────────────────────────────────────────
export type AdminRole = 'ADMIN' | 'SUPERADMIN';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  password?: string;
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

export interface EventRSVP {
  id: string;
  eventId: string;
  eventTitle: string;
  studentName: string;
  studentUid: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  registeredAt: string;
  status: 'Confirmed' | 'Waitlisted' | 'Checked In';
}

export interface ClubMember {
  id: string;
  memberId: string; // e.g. AIML-2026-0042
  name: string;
  uid: string;
  email: string;
  phone?: string;
  department: string;
  year: string;
  skills: string[];
  joinedDate: string;
  role: string; // e.g. "Core Member", "Researcher", "Lead"
  status: 'Active' | 'Alumni' | 'Probation';
  githubUrl?: string;
  avatar?: string;
}

export interface CustomFormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'tel' | 'select' | 'url' | 'number';
  placeholder?: string;
  helperText?: string;
  required: boolean;
  options?: string[];
}

export interface JoinFormConfig {
  admissionsOpen: boolean;
  closureNotice: string;
  nextCohortDate?: string;
  portalBadge?: string;
  formTitle?: string;
  formSubtitle?: string;
  submitButtonText?: string;
  successTitle?: string;
  successMessage?: string;
  departments: string[];
  academicYears: string[];
  domainInterests: string[];
  membershipPerks: string[];
  customFields?: CustomFormField[];
  showPhoneField?: boolean;
  showPortfolioField?: boolean;
  showSocialLinks?: boolean;
  showDomainInterests?: boolean;
  showStatementOfPurpose?: boolean;
  sopPrompt?: string;
  lastUpdated: string;
}
