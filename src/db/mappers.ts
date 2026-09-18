import {
  AIDomain,
  Project,
  ClubEvent,
  EventRSVP,
  ResearchPaper,
  TeamMember,
  Testimonial,
  Achievement,
  SiteSettings,
  CodingQuest,
  QuestSubmission,
  RoadmapMilestone,
  Resource,
  AdminUser,
  ClubMember,
  JoinApplication,
  ContactMessage,
  JoinFormConfig
} from '@/types';

function parseJson<T>(val: any, fallback: T): T {
  if (!val) return fallback;
  if (typeof val === 'object') return val as T;
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

export function mapDomain(row: any): AIDomain {
  return {
    id: row.id,
    name: row.name,
    shortDesc: row.short_desc,
    fullDesc: row.full_desc,
    iconName: row.icon_name,
    technologies: parseJson(row.technologies, []),
    keyConcepts: parseJson(row.key_concepts, []),
    activeProjectsCount: row.active_projects_count ?? 0,
    researchFocus: row.research_focus ?? '',
    color: row.color,
    glowColor: row.glow_color
  };
}

export function mapProject(row: any): Project {
  return {
    id: row.id,
    title: row.title,
    domain: row.domain,
    category: row.category,
    tagline: row.tagline,
    description: row.description,
    longDescription: row.long_description,
    technologies: parseJson(row.technologies, []),
    teamMembers: parseJson(row.team_members, []),
    githubUrl: row.github_url || undefined,
    demoUrl: row.demo_url || undefined,
    paperUrl: row.paper_url || undefined,
    stars: row.stars ?? 0,
    featured: Boolean(row.featured),
    simulatorType: row.simulator_type || 'none',
    metrics: parseJson(row.metrics, undefined),
    image: row.image
  };
}

export function mapEvent(row: any): ClubEvent {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    date: row.date,
    time: row.time || undefined,
    endDate: row.end_date || undefined,
    venue: row.venue,
    location: row.location || undefined,
    speaker: parseJson(row.speaker, undefined),
    description: row.description,
    longDescription: row.long_description || undefined,
    registrationUrl: row.registration_url || undefined,
    totalSeats: row.total_seats ?? 100,
    registeredCount: row.registered_count ?? 0,
    isUpcoming: Boolean(row.is_upcoming),
    isLive: Boolean(row.is_live),
    status: row.status,
    tags: parseJson(row.tags, []),
    requirements: parseJson(row.requirements, undefined),
    agenda: parseJson(row.agenda, undefined),
    bannerImage: row.banner_image || undefined,
    posterUrl: row.poster_url || undefined,
    mediaType: row.media_type || 'image',
    recapUrl: row.recap_url || undefined
  };
}

export function mapEventRSVP(row: any): EventRSVP {
  return {
    id: row.id,
    eventId: row.event_id,
    eventTitle: row.event_title,
    studentName: row.student_name,
    studentUid: row.student_uid,
    email: row.email,
    phone: row.phone || '',
    department: row.department,
    year: row.year,
    registeredAt: row.registered_at,
    status: row.status
  };
}

export function mapResearch(row: any): ResearchPaper {
  return {
    id: row.id,
    title: row.title,
    authors: parseJson(row.authors, []),
    domain: row.domain,
    status: row.status,
    conference: row.conference || undefined,
    year: row.year,
    abstract: row.abstract,
    pdfUrl: row.pdf_url || undefined,
    codeUrl: row.code_url || undefined,
    demoUrl: row.demo_url || undefined,
    citationBibtex: row.citation_bibtex || undefined,
    keywords: parseJson(row.keywords, []),
    metrics: parseJson(row.metrics, undefined)
  };
}

export function mapTeamMember(row: any): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    domain: row.domain,
    department: row.department,
    year: row.year || undefined,
    bio: row.bio,
    avatar: row.avatar,
    linkedin: row.linkedin || undefined,
    github: row.github || undefined,
    twitter: row.twitter || undefined,
    email: row.email || undefined,
    skills: parseJson(row.skills, []),
    isFaculty: Boolean(row.is_faculty),
    isMentor: Boolean(row.is_mentor),
    specialization: row.specialization || undefined,
    orgLevel: row.org_level ?? 4,
    reportsToId: row.reports_to_id || undefined,
    treeOrder: row.tree_order ?? 99,
    spocTitle: row.spoc_title || undefined,
    initials: row.initials || undefined
  };
}

export function mapTestimonial(row: any): Testimonial {
  return {
    id: row.id,
    name: row.name,
    program: row.program,
    year: row.year,
    role: row.role,
    companyOrPlacement: row.company_or_placement || undefined,
    quote: row.quote,
    avatar: row.avatar,
    domain: row.domain
  };
}

export function mapAchievement(row: any): Achievement {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    year: row.year,
    description: row.description,
    issuer: row.issuer,
    rankOrMetric: row.rank_or_metric || undefined,
    badgeIcon: row.badge_icon
  };
}

export function mapSiteSettings(row: any): SiteSettings {
  return {
    clubName: row.club_name,
    tagline: row.tagline,
    heroHeadline: row.hero_headline,
    heroSubheadline: row.hero_subheadline,
    stats: parseJson(row.stats, {
      members: 500,
      projects: 24,
      workshops: 18,
      hackathons: 6,
      publications: 12,
      prizePool: '$25,000+'
    }),
    announcement: parseJson(row.announcement, undefined),
    socialLinks: parseJson(row.social_links, {
      discord: 'https://discord.gg/aimlclub',
      whatsapp: 'https://chat.whatsapp.com/aimlclub',
      linkedin: 'https://linkedin.com/company/aiml-club',
      github: 'https://github.com/aiml-club',
      instagram: 'https://instagram.com/aiml_club'
    })
  };
}

export function mapQuest(row: any): CodingQuest {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    domain: row.domain,
    category: row.category,
    difficulty: row.difficulty,
    bountyPoints: row.bounty_points,
    solversCount: row.solvers_count ?? 0,
    tags: parseJson(row.tags, []),
    isProblemOfTheWeek: Boolean(row.is_problem_of_the_week),
    expiresAt: row.expires_at || undefined,
    shortSummary: row.short_summary,
    problemStatement: row.problem_statement,
    inputFormat: row.input_format,
    outputFormat: row.output_format,
    constraints: parseJson(row.constraints, []),
    sampleTestCases: parseJson(row.sample_test_cases, []),
    starterCode: parseJson(row.starter_code, { python: '' }),
    hints: parseJson(row.hints, [])
  };
}

export function mapSubmission(row: any): QuestSubmission {
  return {
    id: row.id,
    questId: row.quest_id,
    questTitle: row.quest_title,
    studentName: row.student_name,
    studentUID: row.student_uid,
    githubRepoUrl: row.github_repo_url || '',
    solutionNotes: row.solution_notes || '',
    submittedCode: row.submitted_code || undefined,
    status: row.status,
    submittedAt: row.submitted_at,
    pointsAwarded: row.points_awarded ?? undefined,
    reviewerNotes: row.reviewer_notes || undefined
  };
}

export function mapRoadmap(row: any): RoadmapMilestone {
  return {
    id: row.id,
    phaseNumber: row.phase_number,
    phaseName: row.phase_name,
    phaseTheme: row.phase_theme,
    title: row.title,
    timeline: row.timeline,
    status: row.status,
    description: row.description,
    keyTopics: parseJson(row.key_topics, []),
    deliverables: parseJson(row.deliverables, []),
    toolsAndTech: parseJson(row.tools_and_tech, []),
    completionPercentage: row.completion_percentage ?? 0,
    featured: Boolean(row.featured)
  };
}

export function mapResource(row: any): Resource {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    type: row.type,
    author: row.author,
    url: row.url,
    iconName: row.icon_name || undefined,
    tags: parseJson(row.tags, []),
    featured: Boolean(row.featured),
    addedAt: row.added_at || undefined
  };
}

export function mapAdminUser(row: any): AdminUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    password: row.password || undefined,
    createdAt: row.created_at,
    lastLogin: row.last_login || undefined,
    avatar: row.avatar || undefined
  };
}

export function mapClubMember(row: any): ClubMember {
  return {
    id: row.id,
    memberId: row.member_id,
    name: row.name,
    uid: row.uid,
    email: row.email,
    phone: row.phone || undefined,
    department: row.department,
    year: row.year,
    skills: parseJson(row.skills, []),
    joinedDate: row.joined_date,
    role: row.role,
    status: row.status,
    githubUrl: row.github_url || undefined,
    avatar: row.avatar || undefined
  };
}

export function mapJoinConfig(row: any): JoinFormConfig {
  return {
    admissionsOpen: Boolean(row.admissions_open),
    closureNotice: row.closure_notice || '',
    nextCohortDate: row.next_cohort_date || undefined,
    portalBadge: row.portal_badge || undefined,
    formTitle: row.form_title || undefined,
    formSubtitle: row.form_subtitle || undefined,
    submitButtonText: row.submit_button_text || undefined,
    successTitle: row.success_title || undefined,
    successMessage: row.success_message || undefined,
    departments: parseJson(row.departments, []),
    academicYears: parseJson(row.academic_years, []),
    domainInterests: parseJson(row.domain_interests, []),
    membershipPerks: parseJson(row.membership_perks, []),
    customFields: parseJson(row.custom_fields, []),
    showPhoneField: Boolean(row.show_phone_field),
    showPortfolioField: Boolean(row.show_portfolio_field),
    showSocialLinks: Boolean(row.show_social_links),
    showDomainInterests: Boolean(row.show_domain_interests),
    showStatementOfPurpose: Boolean(row.show_statement_of_purpose),
    sopPrompt: row.sop_prompt || undefined,
    lastUpdated: row.last_updated
  };
}
