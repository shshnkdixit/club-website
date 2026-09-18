'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Calendar,
  Briefcase,
  Trophy,
  FolderOpen,
  Compass,
  Users,
  UserPlus,
  Sliders,
  Sparkles,
  Download,
  Plus,
  Trash2,
  Edit3,
  Save,
  Check,
  RefreshCw,
  ArrowLeft,
  Lock,
  Unlock,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Flame,
  AlertCircle,
  LogOut,
  X,
  FileSpreadsheet,
  Zap,
  Layers,
  Code2,
  Video,
  Image as ImageIcon,
  KeyRound,
  FileText,
  Upload,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  Eye,
  EyeOff,
  Copy,
  Award,
  Quote,
  BookOpen,
  Settings as SettingsIcon,
  Globe
} from 'lucide-react';
import { cmsStore, useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';
import {
  ClubEvent,
  Project,
  CodingQuest,
  Resource,
  RoadmapMilestone,
  ClubMember,
  AdminUser,
  AdminRole,
  EventRSVP,
  JoinFormConfig,
  QuestSubmission,
  TeamMember,
  CustomFormField,
  AIDomain,
  ResearchPaper,
  Testimonial,
  Achievement,
  SiteSettings
} from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    events,
    projects,
    quests,
    submissions,
    resources,
    roadmap,
    team,
    members,
    adminUsers,
    eventRsvps,
    joinConfig,
    currentAdmin,
    applications,
    domains,
    research,
    testimonials,
    achievements,
    settings,
    refresh
  } = useCMSData();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const user = cmsStore.getCurrentAdminUser();
    if (!user) {
      router.replace('/admin-login');
    } else {
      setCurrentUser(user);
      setAuthChecking(false);
    }
  }, [currentAdmin, router]);

  const isSuperAdmin = currentUser?.role === 'SUPERADMIN';

  // Active Module Tab
  const [activeModule, setActiveModule] = useState<
    | 'telemetry'
    | 'events'
    | 'challenges'
    | 'projects'
    | 'resources'
    | 'roadmap'
    | 'team'
    | 'members'
    | 'users'
    | 'join-form'
    | 'content'
  >('telemetry');

  // Site Content Sub-Module (Domains / Research / Testimonials / Achievements / Settings)
  const [contentTab, setContentTab] = useState<
    'domains' | 'research' | 'testimonials' | 'achievements' | 'settings'
  >('domains');
  const [editingDomain, setEditingDomain] = useState<Partial<AIDomain> | null>(null);
  const [editingResearch, setEditingResearch] = useState<Partial<ResearchPaper> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Partial<Achievement> | null>(null);
  const [localSettings, setLocalSettings] = useState<Partial<SiteSettings> | null>(null);

  // Search Filters for Tables
  const [memberSearch, setMemberSearch] = useState('');
  const [resourceSearch, setResourceSearch] = useState('');
  const [challengeSearch, setChallengeSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  const [teamCategoryFilter, setTeamCategoryFilter] = useState<'All' | 'Faculty' | 'Officers'>('All');

  // Modals & Editing States
  const [editingEvent, setEditingEvent] = useState<Partial<ClubEvent> | null>(null);
  const [viewingEventRsvps, setViewingEventRsvps] = useState<ClubEvent | null>(null);
  const [editingQuest, setEditingQuest] = useState<Partial<CodingQuest> | null>(null);
  const [viewingQuestSubmissions, setViewingQuestSubmissions] = useState<CodingQuest | null>(null);
  const [scoringSubmission, setScoringSubmission] = useState<QuestSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(0);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [statusInput, setStatusInput] = useState<QuestSubmission['status']>('Verified');
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingResource, setEditingResource] = useState<Partial<Resource> | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<Partial<RoadmapMilestone> | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<Partial<TeamMember> | null>(null);
  const [teamImageUploading, setTeamImageUploading] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<ClubMember> | null>(null);
  const [editingStaffUser, setEditingStaffUser] = useState<Partial<AdminUser> | null>(null);
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [copiedPasswordUserId, setCopiedPasswordUserId] = useState<string | null>(null);

  // Join Form Config State
  const [localJoinConfig, setLocalJoinConfig] = useState<JoinFormConfig>(joinConfig);
  const [newDepartmentInput, setNewDepartmentInput] = useState('');
  const [newYearInput, setNewYearInput] = useState('');
  const [newInterestInput, setNewInterestInput] = useState('');
  const [newPerkInput, setNewPerkInput] = useState('');
  const [addingCustomField, setAddingCustomField] = useState<Partial<CustomFormField> | null>(null);
  const [customFieldOptionsInput, setCustomFieldOptionsInput] = useState('');

  useEffect(() => {
    setLocalJoinConfig(joinConfig);
  }, [joinConfig]);

  // ──────────────────────────────────────────
  // CSV EXPORT UTILITIES
  // ──────────────────────────────────────────
  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    soundFx.playCelebration();
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportMembersCSV = () => {
    const headers = ['Member ID', 'Full Name', 'UID', 'Email', 'Phone Number', 'Department', 'Year', 'Skills', 'Role', 'Status', 'Joined Date'];
    const rows = members.map(m => [
      m.memberId,
      m.name,
      m.uid,
      m.email,
      m.phone || '+1 (555) 000-0000',
      m.department,
      m.year,
      m.skills.join('; '),
      m.role,
      m.status,
      m.joinedDate
    ]);
    downloadCSV(`aiml_club_members_roster_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
  };

  const handleExportEventAttendeesCSV = (event: ClubEvent) => {
    const rsvps = eventRsvps.filter(r => r.eventId === event.id);
    const headers = ['Student Name', 'Student UID', 'Email', 'Phone', 'Department', 'Year', 'RSVP Status', 'Registered At'];
    const rows = rsvps.map(r => [
      r.studentName,
      r.studentUid,
      r.email,
      r.phone,
      r.department,
      r.year,
      r.status,
      r.registeredAt
    ]);
    downloadCSV(`${event.title.replace(/\s+/g, '_')}_attendees.csv`, headers, rows);
  };

  const handleExportQuestSubmissionsCSV = (quest: CodingQuest) => {
    const questSubs = submissions.filter(s => s.questId === quest.id);
    const headers = ['Submission ID', 'Quest Title', 'Student Name', 'Student UID', 'GitHub Repo URL', 'Status', 'Points Awarded', 'Reviewer Notes', 'Submitted At'];
    const rows = questSubs.map(s => [
      s.id,
      s.questTitle,
      s.studentName,
      s.studentUID,
      s.githubRepoUrl,
      s.status,
      s.pointsAwarded ?? 0,
      s.reviewerNotes || '',
      s.submittedAt
    ]);
    downloadCSV(`${quest.title.replace(/\s+/g, '_')}_submissions.csv`, headers, rows);
  };

  const handleOpenScoringModal = (submission: QuestSubmission, defaultBounty: number) => {
    soundFx.playNeuralChime();
    setScoringSubmission(submission);
    setScoreInput(submission.pointsAwarded ?? defaultBounty);
    setStatusInput(submission.status || 'Verified');
    setFeedbackInput(submission.reviewerNotes || '');
  };

  const handleSaveSubmissionGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoringSubmission) return;
    soundFx.playCelebration();
    cmsStore.updateSubmissionScoreAndStatus(
      scoringSubmission.id,
      statusInput,
      Number(scoreInput),
      feedbackInput
    );
    setScoringSubmission(null);
    refresh();
  };

  // ──────────────────────────────────────────
  // 1-CLICK ACTIONS & CRUD HANDLERS
  // ──────────────────────────────────────────
  const handleTogglePOTW = (questId: string) => {
    soundFx.playCelebration();
    const allQuests = cmsStore.getQuests();
    allQuests.forEach(q => {
      if (q.id === questId) {
        q.isProblemOfTheWeek = true;
        q.bountyPoints = 500;
      } else {
        q.isProblemOfTheWeek = false;
      }
      cmsStore.saveQuest(q);
    });
    refresh();
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent?.title) return;
    soundFx.playClick();
    const eventStatus = editingEvent.status || (editingEvent.isLive ? 'LIVE' : editingEvent.isUpcoming ? 'UPCOMING' : 'COMPLETED');
    const eventToSave: ClubEvent = {
      id: editingEvent.id || `event-${Date.now()}`,
      title: editingEvent.title,
      type: editingEvent.type || 'Workshop',
      date: editingEvent.date || new Date().toISOString(),
      time: editingEvent.time || '10:00 AM – 01:00 PM',
      venue: editingEvent.venue || 'Turing Hall 402',
      location: editingEvent.location || editingEvent.venue || 'Turing Hall 402',
      description: editingEvent.description || '',
      registeredCount: editingEvent.registeredCount || 0,
      totalSeats: editingEvent.totalSeats || 100,
      status: eventStatus as any,
      isUpcoming: eventStatus === 'UPCOMING',
      isLive: eventStatus === 'LIVE',
      posterUrl: editingEvent.posterUrl || editingEvent.bannerImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000',
      mediaType: editingEvent.mediaType || 'image',
      recapUrl: editingEvent.recapUrl || '',
      tags: typeof editingEvent.tags === 'string' ? (editingEvent.tags as string).split(',').map((s: string) => s.trim()) : (editingEvent.tags || ['AI', 'Workshop']),
      bannerImage: editingEvent.posterUrl || editingEvent.bannerImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000'
    };
    cmsStore.saveEvent(eventToSave);
    setEditingEvent(null);
    refresh();
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Delete this event?')) {
      soundFx.playClick();
      cmsStore.deleteEvent(id);
      refresh();
    }
  };

  const handleSaveQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuest?.title) return;
    soundFx.playClick();
    const questToSave: CodingQuest = {
      id: editingQuest.id || `quest-${Date.now()}`,
      title: editingQuest.title,
      slug: editingQuest.slug || editingQuest.title.toLowerCase().replace(/\s+/g, '-'),
      domain: editingQuest.domain || 'deep-learning',
      category: editingQuest.category || 'PyTorch & Deep Learning',
      difficulty: editingQuest.difficulty || 'Medium',
      bountyPoints: Number(editingQuest.bountyPoints) || 250,
      solversCount: editingQuest.solversCount || 0,
      tags: typeof editingQuest.tags === 'string' ? (editingQuest.tags as string).split(',').map((s: string) => s.trim()) : (editingQuest.tags || ['Python', 'Algorithm']),
      isProblemOfTheWeek: !!editingQuest.isProblemOfTheWeek,
      shortSummary: editingQuest.shortSummary || '',
      problemStatement: editingQuest.problemStatement || '',
      inputFormat: editingQuest.inputFormat || '',
      outputFormat: editingQuest.outputFormat || '',
      constraints: Array.isArray(editingQuest.constraints) ? editingQuest.constraints : ['Vectorized implementation required.'],
      sampleTestCases: editingQuest.sampleTestCases || [{ input: 'x = 1', output: '1' }],
      starterCode: editingQuest.starterCode || { python: 'def solve():\n    pass\n' },
      hints: editingQuest.hints || []
    };
    cmsStore.saveQuest(questToSave);
    setEditingQuest(null);
    refresh();
  };

  const handleDeleteQuest = (id: string) => {
    if (confirm('Delete this coding challenge?')) {
      soundFx.playClick();
      cmsStore.deleteQuest(id);
      refresh();
    }
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) return;
    soundFx.playClick();
    const projectToSave: Project = {
      id: editingProject.id || `proj-${Date.now()}`,
      title: editingProject.title,
      domain: editingProject.domain || 'computer-vision',
      category: editingProject.category || 'Computer Vision',
      tagline: editingProject.tagline || '',
      description: editingProject.description || '',
      longDescription: editingProject.longDescription || editingProject.description || '',
      technologies: typeof editingProject.technologies === 'string' ? (editingProject.technologies as string).split(',').map((s: string) => s.trim()) : (editingProject.technologies || ['Python', 'AI']),
      teamMembers: typeof editingProject.teamMembers === 'string' ? (editingProject.teamMembers as string).split(',').map((s: string) => s.trim()) : (editingProject.teamMembers || ['Lead Researcher']),
      githubUrl: editingProject.githubUrl || '',
      demoUrl: editingProject.demoUrl || '',
      featured: editingProject.featured ?? true,
      simulatorType: editingProject.simulatorType || 'none',
      image: editingProject.image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000'
    };
    cmsStore.saveProject(projectToSave);
    setEditingProject(null);
    refresh();
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Delete this project?')) {
      soundFx.playClick();
      cmsStore.deleteProject(id);
      refresh();
    }
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource?.title || !editingResource?.url) return;
    soundFx.playClick();
    const resourceToSave: Resource = {
      id: editingResource.id || `res-${Date.now()}`,
      title: editingResource.title,
      description: editingResource.description || '',
      category: editingResource.category || 'AI',
      type: editingResource.type || 'Course',
      author: editingResource.author || 'AI & ML Club',
      url: editingResource.url,
      iconName: editingResource.iconName || 'BookOpen',
      tags: typeof editingResource.tags === 'string' ? (editingResource.tags as string).split(',').map((s: string) => s.trim()) : (editingResource.tags || ['Study Material']),
      featured: !!editingResource.featured,
      addedAt: editingResource.addedAt || new Date().toISOString().split('T')[0]
    };
    cmsStore.saveResource(resourceToSave);
    setEditingResource(null);
    refresh();
  };

  const handleDeleteResource = (id: string) => {
    if (confirm('Delete this resource?')) {
      soundFx.playClick();
      cmsStore.deleteResource(id);
      refresh();
    }
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone?.title) return;
    soundFx.playClick();
    const milestoneToSave: RoadmapMilestone = {
      id: editingMilestone.id || `roadmap-p${editingMilestone.phaseNumber || 1}-m${Date.now()}`,
      phaseNumber: (editingMilestone.phaseNumber || 1) as any,
      phaseName: editingMilestone.phaseName || `Phase ${editingMilestone.phaseNumber || 1}`,
      phaseTheme: editingMilestone.phaseTheme || 'Cyan Neon',
      title: editingMilestone.title,
      timeline: editingMilestone.timeline || 'Q1 2026',
      status: editingMilestone.status || 'UPCOMING',
      description: editingMilestone.description || '',
      keyTopics: typeof editingMilestone.keyTopics === 'string' ? (editingMilestone.keyTopics as string).split(',').map((s: string) => s.trim()) : (editingMilestone.keyTopics || ['Topic 1']),
      deliverables: typeof editingMilestone.deliverables === 'string' ? (editingMilestone.deliverables as string).split(',').map((s: string) => s.trim()) : (editingMilestone.deliverables || ['Deliverable 1']),
      toolsAndTech: typeof editingMilestone.toolsAndTech === 'string' ? (editingMilestone.toolsAndTech as string).split(',').map((s: string) => s.trim()) : (editingMilestone.toolsAndTech || ['Python']),
      completionPercentage: Number(editingMilestone.completionPercentage) || 0
    };
    cmsStore.saveMilestone(milestoneToSave);
    setEditingMilestone(null);
    refresh();
  };

  const handleDeleteMilestone = (id: string) => {
    if (confirm('Delete this milestone?')) {
      soundFx.playClick();
      cmsStore.deleteMilestone(id);
      refresh();
    }
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.name || !editingMember?.uid) return;
    soundFx.playClick();
    const memberToSave: ClubMember = {
      id: editingMember.id || `mem-${Date.now()}`,
      memberId: editingMember.memberId || `AIML-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: editingMember.name,
      uid: editingMember.uid.toUpperCase(),
      email: editingMember.email || `${editingMember.uid.toLowerCase()}@campus.edu`,
      phone: editingMember.phone || '+1 (555) 000-0000',
      department: editingMember.department || 'Computer Science & Engineering',
      year: editingMember.year || '1st Year',
      skills: typeof editingMember.skills === 'string' ? (editingMember.skills as string).split(',').map((s: string) => s.trim()) : (editingMember.skills || ['Python']),
      joinedDate: editingMember.joinedDate || new Date().toISOString().split('T')[0],
      role: editingMember.role || 'Member',
      status: editingMember.status || 'Active',
      githubUrl: editingMember.githubUrl || ''
    };
    cmsStore.saveMember(memberToSave);
    setEditingMember(null);
    refresh();
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Delete this registered student member?')) {
      soundFx.playClick();
      cmsStore.deleteMember(id);
      refresh();
    }
  };

  const handleSaveStaffUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaffUser?.name || !editingStaffUser?.email) return;
    soundFx.playClick();
    const userToSave: AdminUser = {
      id: editingStaffUser.id || `user-${Date.now()}`,
      name: editingStaffUser.name,
      email: editingStaffUser.email,
      role: editingStaffUser.role || 'ADMIN',
      password: editingStaffUser.password || 'admin2026password',
      createdAt: editingStaffUser.createdAt || new Date().toISOString().split('T')[0],
      avatar: editingStaffUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400'
    };
    cmsStore.saveAdminUser(userToSave);
    setEditingStaffUser(null);
    refresh();
  };

  const handleDeleteStaffUser = (id: string) => {
    const target = adminUsers.find(u => u.id === id);
    if (!target) return;

    if (target.id === currentUser?.id) {
      alert('Security Protection: You cannot delete your own active administrator account.');
      soundFx.playError();
      return;
    }

    const superAdmins = adminUsers.filter(u => u.role === 'SUPERADMIN');
    if (target.role === 'SUPERADMIN' && superAdmins.length <= 1) {
      alert('Security Protection: Cannot delete the primary SuperAdmin account. At least one SuperAdmin must remain in the system.');
      soundFx.playError();
      return;
    }

    if (confirm(`Are you sure you want to permanently delete administrator account "${target.name}" (${target.email})?`)) {
      soundFx.playClick();
      cmsStore.deleteAdminUser(id);
      refresh();
    }
  };

  const handleSaveJoinConfig = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playCelebration();
    cmsStore.saveJoinConfig(localJoinConfig);
    refresh();
  };

  // ──────────────────────────────────────────
  // TEAM LEADERSHIP CRUD HANDLERS
  // ──────────────────────────────────────────
  const handleExportTeamCSV = () => {
    const headers = ['Member ID', 'Full Name', 'Role', 'Category', 'Department', 'Year', 'Domain', 'Skills', 'Email', 'LinkedIn', 'GitHub', 'Twitter'];
    const rows = team.map(t => [
      t.id,
      t.name,
      t.role,
      t.isFaculty ? 'Faculty Coordinator' : 'Student Officer',
      t.department,
      t.year || 'N/A',
      t.domain,
      (t.skills || []).join('; '),
      t.email || '',
      t.linkedin || '',
      t.github || '',
      t.twitter || ''
    ]);
    downloadCSV(`aiml_team_leadership_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
  };

  const handleTeamAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTeamImageUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (editingTeamMember) {
        setEditingTeamMember({
          ...editingTeamMember,
          avatar: dataUrl
        });
      }
      setTeamImageUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeamMember?.name || !editingTeamMember?.role) return;
    soundFx.playCelebration();
    const memberToSave: TeamMember = {
      id: editingTeamMember.id || `team-${Date.now()}`,
      name: editingTeamMember.name,
      role: editingTeamMember.role as TeamMember['role'],
      domain: (editingTeamMember.domain || 'artificial-intelligence') as any,
      department: editingTeamMember.department || 'Dept. of Computer Science & AI',
      year: editingTeamMember.year || (editingTeamMember.isFaculty ? 'Faculty Director' : 'Core Team'),
      bio: editingTeamMember.bio || '',
      avatar: editingTeamMember.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      linkedin: editingTeamMember.linkedin || '',
      github: editingTeamMember.github || '',
      twitter: editingTeamMember.twitter || '',
      email: editingTeamMember.email || '',
      skills: Array.isArray(editingTeamMember.skills)
        ? editingTeamMember.skills
        : (editingTeamMember.skills ? (editingTeamMember.skills as any).split(',').map((s: string) => s.trim()).filter(Boolean) : ['AI', 'Deep Learning']),
      isFaculty: editingTeamMember.isFaculty ?? false,
      isMentor: editingTeamMember.isMentor ?? false,
      orgLevel: (editingTeamMember.orgLevel !== undefined && !isNaN(Number(editingTeamMember.orgLevel)) && Number(editingTeamMember.orgLevel) >= 1)
        ? Number(editingTeamMember.orgLevel)
        : (editingTeamMember.isFaculty ? 1 : 3),
      reportsToId: editingTeamMember.reportsToId || '',
      treeOrder: Number(editingTeamMember.treeOrder) || 1,
      spocTitle: editingTeamMember.spocTitle || (editingTeamMember.role || ''),
      initials: editingTeamMember.initials || editingTeamMember.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    };
    cmsStore.saveTeamMember(memberToSave);
    setEditingTeamMember(null);
    refresh();
  };

  const handleDeleteTeamMember = (id: string) => {
    if (confirm('Are you sure you want to remove this officer / advisor from the Team Leadership roster?')) {
      soundFx.playClick();
      cmsStore.deleteTeamMember(id);
      refresh();
    }
  };

  // ── Site Content: Domains ──
  const handleSaveDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDomain?.name) return;
    soundFx.playClick();
    const domainToSave: AIDomain = {
      id: (editingDomain.id || `domain-${Date.now()}`) as AIDomain['id'],
      name: editingDomain.name,
      shortDesc: editingDomain.shortDesc || '',
      fullDesc: editingDomain.fullDesc || '',
      iconName: editingDomain.iconName || 'Brain',
      technologies: typeof editingDomain.technologies === 'string' ? (editingDomain.technologies as string).split(',').map(s => s.trim()).filter(Boolean) : (editingDomain.technologies || []),
      keyConcepts: typeof editingDomain.keyConcepts === 'string' ? (editingDomain.keyConcepts as string).split(',').map(s => s.trim()).filter(Boolean) : (editingDomain.keyConcepts || []),
      activeProjectsCount: Number(editingDomain.activeProjectsCount) || 0,
      researchFocus: editingDomain.researchFocus || '',
      color: editingDomain.color || '#00CFFF',
      glowColor: editingDomain.glowColor || '#00CFFF'
    };
    cmsStore.saveDomain(domainToSave);
    setEditingDomain(null);
    refresh();
  };

  const handleDeleteDomain = (id: string) => {
    if (confirm('Delete this AI domain track? Projects referencing it will keep their domain tag as free text.')) {
      soundFx.playClick();
      cmsStore.deleteDomain(id);
      refresh();
    }
  };

  // ── Site Content: Research Papers ──
  const handleSaveResearchPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResearch?.title) return;
    soundFx.playClick();
    const paperToSave: ResearchPaper = {
      id: editingResearch.id || `paper-${Date.now()}`,
      title: editingResearch.title,
      authors: typeof editingResearch.authors === 'string' ? (editingResearch.authors as string).split(',').map(s => s.trim()).filter(Boolean) : (editingResearch.authors || []),
      domain: editingResearch.domain || 'computer-vision',
      status: editingResearch.status || 'In Progress',
      conference: editingResearch.conference || '',
      year: Number(editingResearch.year) || new Date().getFullYear(),
      abstract: editingResearch.abstract || '',
      pdfUrl: editingResearch.pdfUrl || '',
      codeUrl: editingResearch.codeUrl || '',
      demoUrl: editingResearch.demoUrl || '',
      citationBibtex: editingResearch.citationBibtex || '',
      keywords: typeof editingResearch.keywords === 'string' ? (editingResearch.keywords as string).split(',').map(s => s.trim()).filter(Boolean) : (editingResearch.keywords || []),
      metrics: editingResearch.metrics
    };
    cmsStore.saveResearch(paperToSave);
    setEditingResearch(null);
    refresh();
  };

  const handleDeleteResearchPaper = (id: string) => {
    if (confirm('Delete this research paper?')) {
      soundFx.playClick();
      cmsStore.deleteResearch(id);
      refresh();
    }
  };

  // ── Site Content: Testimonials ──
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.name) return;
    soundFx.playClick();
    const testimonialToSave: Testimonial = {
      id: editingTestimonial.id || `testi-${Date.now()}`,
      name: editingTestimonial.name,
      program: editingTestimonial.program || '',
      year: editingTestimonial.year || '',
      role: editingTestimonial.role || '',
      companyOrPlacement: editingTestimonial.companyOrPlacement || '',
      quote: editingTestimonial.quote || '',
      avatar: editingTestimonial.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400',
      domain: editingTestimonial.domain || 'computer-vision'
    };
    cmsStore.saveTestimonial(testimonialToSave);
    setEditingTestimonial(null);
    refresh();
  };

  const handleDeleteTestimonial = (id: string) => {
    if (confirm('Delete this testimonial?')) {
      soundFx.playClick();
      cmsStore.deleteTestimonial(id);
      refresh();
    }
  };

  // ── Site Content: Achievements ──
  const handleSaveAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAchievement?.title) return;
    soundFx.playClick();
    const achievementToSave: Achievement = {
      id: editingAchievement.id || `ach-${Date.now()}`,
      title: editingAchievement.title,
      category: editingAchievement.category || 'Hackathon Win',
      year: editingAchievement.year || String(new Date().getFullYear()),
      description: editingAchievement.description || '',
      issuer: editingAchievement.issuer || '',
      rankOrMetric: editingAchievement.rankOrMetric || '',
      badgeIcon: editingAchievement.badgeIcon || 'Trophy'
    };
    cmsStore.saveAchievement(achievementToSave);
    setEditingAchievement(null);
    refresh();
  };

  const handleDeleteAchievement = (id: string) => {
    if (confirm('Delete this achievement?')) {
      soundFx.playClick();
      cmsStore.deleteAchievement(id);
      refresh();
    }
  };

  // ── Site Content: Global Settings ──
  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const src = localSettings || settings;
    if (!src?.clubName) return;
    soundFx.playClick();
    const settingsToSave: SiteSettings = {
      clubName: src.clubName || 'AI & ML Club',
      tagline: src.tagline || '',
      heroHeadline: src.heroHeadline || '',
      heroSubheadline: src.heroSubheadline || '',
      stats: src.stats || settings?.stats || {
        members: 0, projects: 0, workshops: 0, hackathons: 0, publications: 0, prizePool: '$0'
      },
      announcement: src.announcement,
      socialLinks: src.socialLinks || settings?.socialLinks || {
        discord: '', whatsapp: '', linkedin: '', github: '', instagram: ''
      }
    };
    cmsStore.saveSettings(settingsToSave);
    setLocalSettings(null);
    refresh();
  };

  const handleMoveMemberInTier = (memberId: string, direction: 'left' | 'right') => {
    soundFx.playClick();
    const currentTeam = [...team];
    const targetMember = currentTeam.find(m => m.id === memberId);
    if (!targetMember) return;

    const targetTier = Number(targetMember.orgLevel) || (targetMember.isFaculty ? 1 : 3);
    
    // Get all members in the same tier sorted by current treeOrder
    const tierMembers = currentTeam
      .filter(m => (Number(m.orgLevel) || (m.isFaculty ? 1 : 3)) === targetTier)
      .sort((a, b) => (Number(a.treeOrder) || 1) - (Number(b.treeOrder) || 1));

    const currentIndex = tierMembers.findIndex(m => m.id === memberId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= tierMembers.length) return;

    // Swap positions
    const otherMember = tierMembers[newIndex];
    tierMembers[currentIndex] = otherMember;
    tierMembers[newIndex] = targetMember;

    // Re-assign sequential treeOrders 1, 2, 3...
    tierMembers.forEach((m, idx) => {
      const updatedOrder = idx + 1;
      m.treeOrder = updatedOrder;
      const globalIdx = currentTeam.findIndex(t => t.id === m.id);
      if (globalIdx >= 0) {
        currentTeam[globalIdx] = { ...m, treeOrder: updatedOrder };
      }
    });

    cmsStore.saveTeam(currentTeam);
    refresh();
  };


  // Nav Modules List
  const modules = [
    { id: 'telemetry', label: 'Telemetry Overview', icon: Zap, superAdminOnly: false },
    { id: 'events', label: `Events & Workshops (${events.length})`, icon: Calendar, superAdminOnly: false },
    { id: 'challenges', label: `Challenges (${quests.length})`, icon: Trophy, superAdminOnly: false },
    { id: 'projects', label: `Projects (${projects.length})`, icon: Briefcase, superAdminOnly: false },
    { id: 'resources', label: `Knowledge Vault (${resources.length})`, icon: FolderOpen, superAdminOnly: false },
    { id: 'content', label: `Site Content (${domains.length + research.length + testimonials.length + achievements.length})`, icon: Globe, superAdminOnly: false },
    { id: 'roadmap', label: `Roadmap (${roadmap.length})`, icon: Compass, superAdminOnly: false },
    { id: 'team', label: `Team Leadership (${team.length})`, icon: Users, superAdminOnly: true },
    { id: 'members', label: `Members (${members.length})`, icon: UserCheck, superAdminOnly: false },
    { id: 'users', label: `Staff & Users (${adminUsers.length})`, icon: ShieldCheck, superAdminOnly: true },
    { id: 'join-form', label: 'Join Form Config', icon: Sliders, superAdminOnly: true },
  ];

  if (authChecking || !currentUser) {
    return (
      <div className="min-h-screen bg-[#020205] text-white flex items-center justify-center p-4 font-mono">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-400 flex items-center justify-center mx-auto animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <p className="text-xs text-amber-300 tracking-wider font-bold">VERIFYING ADMINISTRATIVE ACCESS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020205] text-white pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 font-mono selection:bg-amber-500 selection:text-black">
      {/* Background Grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[800px] h-[400px] bg-amber-500/10 blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* ────────────────────────────────────────────────────────── */}
        {/* TOP CONTROL BAR & AUTH STATUS */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="p-6 rounded-3xl bg-[#070A18]/95 border-2 border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0 flex items-center justify-center overflow-hidden">
              <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-black tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> AUTHORIZED CMS CONTROLLER
                </span>
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
                  isSuperAdmin ? 'bg-amber-950 text-amber-300 border-amber-500' : 'bg-cyan-950 text-cyan-300 border-cyan-500'
                }`}>
                  ROLE: {currentUser?.role || 'ADMIN'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                AI/ML CLUB GOVERNANCE MATRIX
              </h1>
              <p className="text-xs text-slate-400">
                Logged in as <strong className="text-white">{currentUser?.name || 'Administrator'}</strong> ({currentUser?.email || 'admin@aimlclub.edu'})
              </p>
            </div>
          </div>

          {/* Role Status & Actions */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold ${
              isSuperAdmin
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(0,207,255,0.2)]'
            }`}>
              {isSuperAdmin ? <ShieldCheck className="w-4 h-4 text-amber-400" /> : <UserCheck className="w-4 h-4 text-cyan-400" />}
              <span>{isSuperAdmin ? 'SUPERADMIN' : 'ADMIN'}</span>
            </div>

            <Link
              href="/admin-login"
              onClick={() => cmsStore.logoutAdmin()}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-rose-500/50 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </Link>

            <Link
              href="/"
              onClick={() => soundFx.playClick()}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-[0_0_15px_rgba(0,207,255,0.4)] flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* MODULE NAVIGATION TABS */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-amber-500/20 text-xs no-scrollbar">
          {modules.map((m) => {
            const Icon = m.icon;
            const isSelected = activeModule === m.id;
            const isLocked = m.superAdminOnly && !isSuperAdmin;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setActiveModule(m.id as any);
                }}
                className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'bg-[#070D1F] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isLocked ? 'text-slate-500' : 'text-amber-400'}`} />
                <span>{m.label}</span>
                {m.superAdminOnly && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    SUPER
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* MODULE 1: MAIN TELEMETRY DASHBOARD */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeModule === 'telemetry' && (
          <div className="space-y-8">
            {/* Real-Time Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="p-5 rounded-2xl bg-[#070A18] border border-cyan-500/30 space-y-1 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase font-bold">TOTAL EVENTS</span>
                  <Calendar className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-white">{events.length}</div>
                <span className="text-[10px] text-cyan-300 block">{events.filter(e => e.isUpcoming).length} Upcoming Sessions</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#070A18] border border-violet-500/30 space-y-1 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase font-bold">PROJECTS</span>
                  <Briefcase className="w-4 h-4 text-violet-400" />
                </div>
                <div className="text-2xl font-black text-white">{projects.length}</div>
                <span className="text-[10px] text-violet-300 block">Student Builds</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#070A18] border border-yellow-500/30 space-y-1 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase font-bold">CHALLENGES</span>
                  <Trophy className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-2xl font-black text-white">{quests.length}</div>
                <span className="text-[10px] text-yellow-300 block">Active Coding Quests</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#070A18] border border-fuchsia-500/30 space-y-1 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase font-bold">RESOURCES</span>
                  <FolderOpen className="w-4 h-4 text-fuchsia-400" />
                </div>
                <div className="text-2xl font-black text-white">{resources.length}</div>
                <span className="text-[10px] text-fuchsia-300 block">Knowledge Vault</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#070A18] border border-emerald-500/30 space-y-1 shadow-[0_0_15px_rgba(0,0,0,0.5)] col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase font-bold">MEMBERS</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">{members.length}</div>
                <span className="text-[10px] text-emerald-300 block">Active Student Roster</span>
              </div>
            </div>

            {/* Live Activity Feeds */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Member Registrations Feed */}
              <div className="p-6 rounded-3xl bg-[#070A18] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Recent Student Registrations
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModule('members')}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    View All Roster →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {members.slice(0, 4).map(m => (
                    <div key={m.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white block">{m.name}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">UID: {m.uid} • {m.department}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                        {m.memberId}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events Calendar Feed */}
              <div className="p-6 rounded-3xl bg-[#070A18] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Upcoming Sessions & RSVP Counts
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModule('events')}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Manage Events →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {events.slice(0, 4).map(e => (
                    <div key={e.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <strong className="text-white block line-clamp-1">{e.title}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">{new Date(e.date).toLocaleDateString()} • {e.venue}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold font-mono">
                        {e.registeredCount} RSVPs
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* ────────────────────────────────────────────────────────── */}
        {/* MODULE 2: EVENTS & WORKSHOPS CMS */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeModule === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Events, Hackathons & Workshops CMS</h3>
                <p className="text-xs text-slate-400">Schedule sessions, manage RSVP attendee lists, configure live video reels, and export check-in rosters.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setEditingEvent({
                    title: '',
                    type: 'Workshop',
                    date: new Date().toISOString().slice(0, 16),
                    time: '10:00 AM – 01:00 PM',
                    venue: 'Turing Hall Room 402',
                    location: 'Turing Hall Room 402',
                    status: 'UPCOMING',
                    isUpcoming: true,
                    isLive: false,
                    mediaType: 'image',
                    posterUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000',
                    recapUrl: '',
                    description: '',
                    totalSeats: 100,
                    registeredCount: 0
                  });
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-[0_0_15px_rgba(0,207,255,0.4)] flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </button>
            </div>

            {/* Event Form Modal */}
            {editingEvent && (
              <form onSubmit={handleSaveEvent} className="p-6 rounded-3xl bg-[#070A18] border-2 border-cyan-500/40 space-y-4 text-xs">
                <h4 className="text-sm font-bold text-cyan-400 uppercase">
                  {editingEvent.id ? 'Edit Event Details' : 'Create New Event / Workshop'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Event Title *</label>
                    <input
                      type="text"
                      required
                      value={editingEvent.title || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      placeholder="e.g. AI DevFlow 2.0 Hackathon"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Category / Type</label>
                    <select
                      value={editingEvent.type || 'Workshop'}
                      onChange={e => setEditingEvent({ ...editingEvent, type: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    >
                      <option value="Workshop">Workshop</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Bootcamp">Bootcamp</option>
                      <option value="Guest Lecture">Guest Lecture</option>
                      <option value="AI Challenge">AI Challenge</option>
                      <option value="Project Expo">Project Expo</option>
                      <option value="Research Session">Research Session</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Lifecycle Status *</label>
                    <select
                      value={editingEvent.status || (editingEvent.isLive ? 'LIVE' : editingEvent.isUpcoming ? 'UPCOMING' : 'COMPLETED')}
                      onChange={e => {
                        const s = e.target.value as any;
                        setEditingEvent({
                          ...editingEvent,
                          status: s,
                          isLive: s === 'LIVE',
                          isUpcoming: s === 'UPCOMING'
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                    >
                      <option value="UPCOMING">UPCOMING (Open for RSVP)</option>
                      <option value="LIVE">LIVE / ONGOING (Active Sprint)</option>
                      <option value="COMPLETED">COMPLETED (Archived / Recap)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Calendar Date Picker */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Calendar Date *</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={editingEvent.date ? editingEvent.date.split('T')[0] : ''}
                      onChange={e => {
                        const newDate = e.target.value;
                        setEditingEvent({ ...editingEvent, date: newDate ? `${newDate}T10:00:00` : '' });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl p-2.5 text-white font-mono [color-scheme:dark] cursor-pointer"
                    />
                  </div>

                  {/* Time Duration Selector & Presets */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Time Duration *</span>
                    </label>
                    <div className="space-y-1.5">
                      <select
                        value={
                          [
                            '10:00 AM – 01:00 PM',
                            '02:00 PM – 05:00 PM',
                            '06:00 PM – 09:00 PM',
                            '10:00 AM – 04:00 PM',
                            '06:00 PM (48-Hour Live Sprint)',
                            '09:00 AM – 06:00 PM (Full Day)',
                            '03:00 PM – 06:30 PM'
                          ].includes(editingEvent.time || '')
                            ? editingEvent.time
                            : 'CUSTOM'
                        }
                        onChange={e => {
                          const val = e.target.value;
                          if (val !== 'CUSTOM') {
                            setEditingEvent({ ...editingEvent, time: val });
                          }
                        }}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-2.5 text-white font-mono cursor-pointer"
                      >
                        <option value="10:00 AM – 01:00 PM">10:00 AM – 01:00 PM (Morning Workshop)</option>
                        <option value="02:00 PM – 05:00 PM">02:00 PM – 05:00 PM (Afternoon Lab)</option>
                        <option value="06:00 PM – 09:00 PM">06:00 PM – 09:00 PM (Evening Session)</option>
                        <option value="10:00 AM – 04:00 PM">10:00 AM – 04:00 PM (Intensive Masterclass)</option>
                        <option value="03:00 PM – 06:30 PM">03:00 PM – 06:30 PM (Symposium)</option>
                        <option value="06:00 PM (48-Hour Live Sprint)">06:00 PM (48-Hour Live Sprint)</option>
                        <option value="09:00 AM – 06:00 PM (Full Day)">09:00 AM – 06:00 PM (Full Day Expo)</option>
                        <option value="CUSTOM">Custom Time Duration...</option>
                      </select>
                      <input
                        type="text"
                        value={editingEvent.time || ''}
                        onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })}
                        placeholder="e.g. 10:00 AM – 04:00 PM"
                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-400 rounded-xl px-2.5 py-1.5 text-white font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Campus Venue / Location */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Campus Venue / Location</label>
                    <input
                      type="text"
                      value={editingEvent.venue || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, venue: e.target.value, location: e.target.value })}
                      placeholder="e.g. Block 1, Lab 3 or Online (Discord)"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>
                </div>

                {/* Row 3: Media Upload / Drive Picker & Capacity */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Local Drive File Upload & Media Selector */}
                  <div className="sm:col-span-2 space-y-2 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-300 font-bold flex items-center gap-1.5 text-[11px] uppercase">
                        <Upload className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Event Poster / Video Trailer (Local Drive Upload) *</span>
                      </label>
                      <span className="text-[10px] text-cyan-300 font-mono">
                        Type: {editingEvent.mediaType === 'video' ? '🎬 Video Reel' : '🖼️ Image Poster'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      {/* Local File Picker Button */}
                      <label className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,207,255,0.15)] shrink-0">
                        <Upload className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span>Browse Local Device...</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const isVideo = file.type.startsWith('video/');
                            const reader = new FileReader();
                            reader.onload = ev => {
                              const result = ev.target?.result as string;
                              setEditingEvent({
                                ...editingEvent,
                                posterUrl: result,
                                bannerImage: result,
                                mediaType: isVideo ? 'video' : 'image'
                              });
                              soundFx.playClick();
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>

                      {/* URL Fallback / Direct input */}
                      <div className="flex-1 w-full relative">
                        <input
                          type="text"
                          value={editingEvent.posterUrl || editingEvent.bannerImage || ''}
                          onChange={e => setEditingEvent({ ...editingEvent, posterUrl: e.target.value, bannerImage: e.target.value })}
                          placeholder="or paste image / .mp4 video URL..."
                          className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-white font-mono text-[11px] placeholder-slate-500"
                        />
                      </div>
                    </div>

                    {/* Media Preview Box if media exists */}
                    {(editingEvent.posterUrl || editingEvent.bannerImage) && (
                      <div className="relative mt-2 p-2 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center gap-3">
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-black shrink-0 border border-slate-700">
                          {editingEvent.mediaType === 'video' ? (
                            <video
                              src={editingEvent.posterUrl || editingEvent.bannerImage}
                              className="w-full h-full object-cover"
                              muted
                              autoPlay
                              loop
                            />
                          ) : (
                            <img
                              src={editingEvent.posterUrl || editingEvent.bannerImage}
                              alt="Poster preview"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 text-[11px] font-mono text-slate-300 truncate">
                          <span className="text-emerald-400 font-bold block">✓ Media Ready for Display</span>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {(editingEvent.posterUrl || '').startsWith('data:') ? 'Local File Loaded (Data Stream)' : editingEvent.posterUrl}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingEvent({ ...editingEvent, posterUrl: '', bannerImage: '' })}
                          className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-[10px] font-bold shrink-0"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Recap URL & Seats Column */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Recap URL (Optional)</label>
                      <input
                        type="text"
                        value={editingEvent.recapUrl || ''}
                        onChange={e => setEditingEvent({ ...editingEvent, recapUrl: e.target.value })}
                        placeholder="https://github.com/... or youtube..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Total Seats Capacity *</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={2000}
                        required
                        value={editingEvent.totalSeats ?? 100}
                        onChange={e => setEditingEvent({ ...editingEvent, totalSeats: Number(e.target.value) })}
                        placeholder="e.g. 150"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl p-2.5 text-white font-mono font-bold text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Synopsis & Description</label>
                  <textarea
                    rows={3}
                    value={editingEvent.description || ''}
                    onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    placeholder="Workshop outline, takeaways, and prerequisites..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Event</span>
                  </button>
                </div>
              </form>
            )}

            {/* Events List */}
            <div className="space-y-3">
              {events.map(event => {
                const isLive = event.status === 'LIVE' || event.isLive;
                const isUpcoming = event.status === 'UPCOMING' || (event.isUpcoming && !isLive);
                const isCompleted = event.status === 'COMPLETED' || (!event.isUpcoming && !event.isLive && event.status !== 'LIVE' && event.status !== 'UPCOMING');

                return (
                  <div key={event.id} className="p-5 rounded-2xl bg-[#070A18] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
                          {event.type}
                        </span>
                        {isLive && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse">
                            LIVE NOW
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="px-2.5 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-500 text-[10px] font-bold">
                            UPCOMING
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700 text-[10px] font-bold">
                            COMPLETED
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white">{event.title}</h4>
                      <p className="text-slate-400">
                        {new Date(event.date).toLocaleDateString()} {event.time ? `• ${event.time}` : ''} • {event.location || event.venue} • <strong className="text-cyan-300 font-mono">{event.registeredCount || 0} RSVPs</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <button
                        type="button"
                        onClick={() => setViewingEventRsvps(event)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="View Registered Attendees"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>View Attendees ({eventRsvps.filter(r => r.eventId === event.id).length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExportEventAttendeesCSV(event)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-400 text-emerald-300 font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Export Attendees CSV"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingEvent(event)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Edit Event"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Event RSVP Attendees Viewer Modal */}
            {viewingEventRsvps && (
              <div className="p-6 rounded-3xl bg-[#070A18] border-2 border-emerald-500/40 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                      ATTENDEE ROSTER HUD
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      RSVP Registrations: {viewingEventRsvps.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleExportEventAttendeesCSV(viewingEventRsvps)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Attendees CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewingEventRsvps(null)}
                      className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                    >
                      Close Roster
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] border-b border-slate-800 font-bold font-mono">
                      <tr>
                        <th className="p-3">STUDENT NAME</th>
                        <th className="p-3">STUDENT UID</th>
                        <th className="p-3">EMAIL</th>
                        <th className="p-3">WHATSAPP NUMBER</th>
                        <th className="p-3">STATUS</th>
                        <th className="p-3">REGISTERED AT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {eventRsvps.filter(r => r.eventId === viewingEventRsvps.id).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-500">
                            No RSVPs registered yet for this session.
                          </td>
                        </tr>
                      ) : (
                        eventRsvps
                          .filter(r => r.eventId === viewingEventRsvps.id)
                          .map(r => (
                            <tr key={r.id} className="hover:bg-slate-900/40">
                              <td className="p-3 font-bold text-white">{r.studentName}</td>
                              <td className="p-3 text-cyan-300">{r.studentUid}</td>
                              <td className="p-3 text-slate-300">{r.email}</td>
                              <td className="p-3 text-emerald-300 font-bold">{r.phone || 'N/A'}</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                                  {r.status}
                                </span>
                              </td>
                              <td className="p-3 text-slate-400">{new Date(r.registeredAt).toLocaleString()}</td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* MODULE 3: CODING CHALLENGES & BOUNTIES CMS */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeModule === 'challenges' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Coding Challenges & Bounty Multipliers</h3>
                <p className="text-xs text-slate-400">Algorithmic quest grading, problem statement editing, and 1-Click Problem of the Week.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setEditingQuest({
                    title: '',
                    category: 'PyTorch & Deep Learning',
                    difficulty: 'Medium',
                    bountyPoints: 250,
                    tags: ['PyTorch', 'Linear Algebra'],
                    shortSummary: '',
                    problemStatement: ''
                  });
                }}
                className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs transition-all shadow-[0_0_15px_rgba(234,179,8,0.4)] flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Challenge</span>
              </button>
            </div>

            {/* Challenge Form Modal */}
            {editingQuest && (
              <form onSubmit={handleSaveQuest} className="p-6 rounded-3xl bg-[#070A18] border-2 border-yellow-500/40 space-y-4 text-xs">
                <h4 className="text-sm font-bold text-yellow-400 uppercase">
                  {editingQuest.id ? 'Edit Challenge Specs' : 'Create New Quest'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-slate-300 font-bold block">Challenge Title *</label>
                    <input
                      type="text"
                      required
                      value={editingQuest.title || ''}
                      onChange={e => setEditingQuest({ ...editingQuest, title: e.target.value })}
                      placeholder="e.g. Scaled Dot-Product Attention from Scratch"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Difficulty Level</label>
                    <select
                      value={editingQuest.difficulty || 'Medium'}
                      onChange={e => setEditingQuest({ ...editingQuest, difficulty: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    >
                      <option value="Easy">Easy (100–150 XP)</option>
                      <option value="Medium">Medium (250–350 XP)</option>
                      <option value="Hard">Hard (500 XP)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Domain Category</label>
                    <select
                      value={editingQuest.category || 'PyTorch & Deep Learning'}
                      onChange={e => setEditingQuest({ ...editingQuest, category: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    >
                      <option value="Python & NumPy">Python & NumPy</option>
                      <option value="PyTorch & Deep Learning">PyTorch & Deep Learning</option>
                      <option value="Computer Vision">Computer Vision</option>
                      <option value="NLP & LLMs">NLP & LLMs</option>
                      <option value="Reinforcement Learning">Reinforcement Learning</option>
                      <option value="Autonomous Agents">Autonomous Agents</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Bounty Points (XP)</label>
                    <input
                      type="number"
                      value={editingQuest.bountyPoints || 250}
                      onChange={e => setEditingQuest({ ...editingQuest, bountyPoints: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Short Summary</label>
                  <textarea
                    rows={2}
                    value={editingQuest.shortSummary || ''}
                    onChange={e => setEditingQuest({ ...editingQuest, shortSummary: e.target.value })}
                    placeholder="Brief 1-sentence prompt summary..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingQuest.isProblemOfTheWeek}
                      onChange={e => setEditingQuest({ ...editingQuest, isProblemOfTheWeek: e.target.checked })}
                      className="rounded text-yellow-500"
                    />
                    <span>⭐ Crown as Problem of the Week Banner</span>
                  </label>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingQuest(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-yellow-500 text-slate-950 font-black flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Quest</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Quests List */}
            <div className="space-y-3">
              {quests.map(quest => {
                const questSubs = submissions.filter(s => s.questId === quest.id);
                const pendingCount = questSubs.filter(s => s.status === 'Pending Review').length;
                const verifiedCount = questSubs.filter(s => s.status === 'Verified').length;

                return (
                  <div key={quest.id} className="p-5 rounded-2xl bg-[#070A18] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {quest.isProblemOfTheWeek ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-400 text-yellow-300 text-[10px] font-black tracking-wider flex items-center gap-1 animate-pulse">
                            ⭐ PROBLEM OF THE WEEK (+500 XP)
                          </span>
                        ) : null}
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-bold">
                          {quest.difficulty}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-yellow-950/60 border border-yellow-500/40 text-yellow-300 text-[10px] font-bold">
                          {quest.bountyPoints} XP BOUNTY
                        </span>
                        <span className="text-slate-400">{quest.category}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{quest.title}</h4>
                      <p className="text-slate-400">{quest.shortSummary}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Solvers: <strong className="text-cyan-300">{quest.solversCount || 0}</strong> • Submissions: <strong className="text-yellow-300">{questSubs.length}</strong> ({verifiedCount} verified, {pendingCount} pending)
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      {/* View Submissions & Scoring Button */}
                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          setViewingQuestSubmissions(quest);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-yellow-950/80 hover:bg-yellow-900 border border-yellow-500/50 text-yellow-300 font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="View Submissions & Score Quest"
                      >
                        <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                        <span>Submissions & Scores ({questSubs.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExportQuestSubmissionsCSV(quest)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-yellow-400 text-yellow-300 font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Export Submissions CSV"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>

                      {!quest.isProblemOfTheWeek && (
                        <button
                          type="button"
                          onClick={() => handleTogglePOTW(quest.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-yellow-400 hover:text-yellow-300 font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
                          title="Set as Problem of the Week"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>⭐ Set POTW</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setEditingQuest(quest)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Edit Quest"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteQuest(quest.id)}
                        className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300"
                        title="Delete Quest"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submissions & Scoring Matrix Floating Modal */}
            {viewingQuestSubmissions && (
              <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 pt-24 sm:pt-28 pb-8 overflow-y-auto font-mono">
                <div className="w-full max-w-5xl rounded-3xl bg-[#080E21] border-2 border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.3)] p-6 space-y-4 max-h-[85vh] my-auto flex flex-col text-xs">
                  {/* Modal Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-yellow-500/20">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-yellow-950 text-yellow-300 border border-yellow-500/40 text-[10px] font-bold flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-yellow-400" /> SUBMISSIONS & SCORING EVALUATION HUB
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700 text-[10px] font-mono font-bold">
                          BOUNTY: {viewingQuestSubmissions.bountyPoints} XP
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-1">
                        Student Submissions: {viewingQuestSubmissions.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleExportQuestSubmissionsCSV(viewingQuestSubmissions)}
                        className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewingQuestSubmissions(null)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer border border-slate-700"
                        title="Close Matrix"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Scrollable Table Body */}
                  <div className="overflow-x-auto overflow-y-auto flex-1 rounded-2xl border border-slate-800 bg-slate-950">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] border-b border-slate-800 font-bold font-mono sticky top-0 z-10">
                        <tr>
                          <th className="p-3">STUDENT</th>
                          <th className="p-3">GITHUB REPOSITORY</th>
                          <th className="p-3">SOLUTION NOTES</th>
                          <th className="p-3">STATUS</th>
                          <th className="p-3">XP SCORE</th>
                          <th className="p-3">REVIEWER NOTES</th>
                          <th className="p-3 text-right">EVALUATION ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {submissions.filter(s => s.questId === viewingQuestSubmissions.id).length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-500 font-mono">
                              No student submissions submitted yet for this challenge.
                            </td>
                          </tr>
                        ) : (
                          submissions
                            .filter(s => s.questId === viewingQuestSubmissions.id)
                            .map(s => {
                              const isVerified = s.status === 'Verified';
                              const isPending = s.status === 'Pending Review';
                              const isNeedsRev = s.status === 'Needs Revision';

                              return (
                                <tr key={s.id} className="hover:bg-slate-900/40">
                                  <td className="p-3">
                                    <span className="font-bold text-white block">{s.studentName}</span>
                                    <span className="text-[10px] text-cyan-400 font-mono">{s.studentUID}</span>
                                  </td>

                                  <td className="p-3">
                                    <a
                                      href={s.githubRepoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-mono text-[11px] max-w-[180px] truncate"
                                    >
                                      <Code2 className="w-3.5 h-3.5 shrink-0" />
                                      <span className="truncate">{s.githubRepoUrl.replace('https://github.com/', '')}</span>
                                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                    </a>
                                  </td>

                                  <td className="p-3 max-w-xs">
                                    <p className="text-slate-300 text-[11px] line-clamp-2" title={s.solutionNotes}>
                                      {s.solutionNotes}
                                    </p>
                                    <span className="text-[9px] text-slate-500 block mt-0.5">
                                      Submitted {new Date(s.submittedAt).toLocaleDateString()}
                                    </span>
                                  </td>

                                  <td className="p-3">
                                    {isVerified && (
                                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                                        ✓ Verified
                                      </span>
                                    )}
                                    {isPending && (
                                      <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 text-[10px] font-bold animate-pulse">
                                        ⏳ Under Review
                                      </span>
                                    )}
                                    {isNeedsRev && (
                                      <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                                        ⚠️ Needs Revision
                                      </span>
                                    )}
                                  </td>

                                  <td className="p-3">
                                    <span className="font-bold text-yellow-300 font-mono text-sm">
                                      {s.pointsAwarded !== undefined ? `${s.pointsAwarded} XP` : '—'}
                                    </span>
                                    <span className="text-[10px] text-slate-500 block">/ {viewingQuestSubmissions.bountyPoints} max</span>
                                  </td>

                                  <td className="p-3 max-w-xs">
                                    <span className="text-[11px] text-slate-400 italic">
                                      {s.reviewerNotes || 'No notes added'}
                                    </span>
                                  </td>

                                  <td className="p-3 text-right">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenScoringModal(s, viewingQuestSubmissions.bountyPoints)}
                                      className="px-3 py-1.5 rounded-xl bg-yellow-500/15 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-300 font-bold text-xs transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                      <span>Score & Grade</span>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Submission Scoring / Grading Modal */}
            {scoringSubmission && (
              <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 pt-24 sm:pt-28 pb-8 overflow-y-auto font-mono">
                <form
                  onSubmit={handleSaveSubmissionGrade}
                  className="w-full max-w-lg max-h-[85vh] my-auto p-6 rounded-3xl bg-[#070A18] border-2 border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.25)] space-y-4 text-xs overflow-y-auto"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-yellow-950 text-yellow-300 border border-yellow-500/40 text-[10px] font-bold">
                        BOUNTY SCORING PROTOCOL
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">
                        Grade: {scoringSubmission.studentName} ({scoringSubmission.studentUID})
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setScoringSubmission(null)}
                      className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Submission Context */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-[11px]">
                    <div className="text-slate-400">
                      Quest: <strong className="text-white">{scoringSubmission.questTitle}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Repo:</span>
                      <a
                        href={scoringSubmission.githubRepoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        {scoringSubmission.githubRepoUrl} <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <div className="text-slate-400 mt-1">
                      Notes: <span className="text-slate-300 italic">{scoringSubmission.solutionNotes}</span>
                    </div>
                  </div>

                  {/* Evaluation Status */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Evaluation Status *</label>
                    <select
                      value={statusInput}
                      onChange={e => setStatusInput(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-yellow-400 rounded-xl p-2.5 text-white font-mono font-bold"
                    >
                      <option value="Verified">✓ Verified (Solution Approved & XP Awarded)</option>
                      <option value="Pending Review">⏳ Pending Review (Under Inspection)</option>
                      <option value="Needs Revision">⚠️ Needs Revision (Issues / Resubmission Required)</option>
                    </select>
                  </div>

                  {/* Score Awarded & Presets */}
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold flex items-center justify-between">
                      <span>Bounty Points Awarded (XP) *</span>
                      <span className="text-yellow-400 font-mono text-[11px]">
                        Max Bounty: {viewingQuestSubmissions?.bountyPoints || 500} XP
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={1000}
                        required
                        value={scoreInput}
                        onChange={e => setScoreInput(Number(e.target.value))}
                        className="flex-1 bg-slate-950 border border-slate-700 focus:border-yellow-400 rounded-xl p-2.5 text-white font-mono font-bold text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setScoreInput(viewingQuestSubmissions?.bountyPoints || 500)}
                        className="px-3 py-2.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-300 font-bold text-xs shrink-0 cursor-pointer"
                      >
                        100% Full XP
                      </button>
                      <button
                        type="button"
                        onClick={() => setScoreInput(Math.floor((viewingQuestSubmissions?.bountyPoints || 500) / 2))}
                        className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs shrink-0 cursor-pointer"
                      >
                        50% Half XP
                      </button>
                    </div>
                  </div>

                  {/* Reviewer Feedback Notes */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Reviewer Feedback & Grading Notes</label>
                    <textarea
                      rows={3}
                      value={feedbackInput}
                      onChange={e => setFeedbackInput(e.target.value)}
                      placeholder="e.g. Excellent vectorized implementation. Passes all test fixtures and memory constraints."
                      className="w-full bg-slate-950 border border-slate-700 focus:border-yellow-400 rounded-xl p-2.5 text-white font-mono text-xs"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setScoringSubmission(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Confirm Grade & Award XP</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* MODULE 4: CLUB PROJECTS MATRIX CMS */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeModule === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Club Projects & Student Software Matrix</h3>
                <p className="text-xs text-slate-400">Showcase approved member software builds, AI models, and 3D simulators.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setEditingProject({
                    title: '',
                    domain: 'computer-vision',
                    category: 'Computer Vision',
                    tagline: '',
                    description: '',
                    technologies: ['PyTorch', 'OpenCV'],
                    teamMembers: ['Lead Researcher'],
                    githubUrl: 'https://github.com/aiml-club',
                    demoUrl: '',
                    simulatorType: 'none',
                    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000'
                  });
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-[0_0_15px_rgba(0,207,255,0.4)] flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            {/* Project Form Modal */}
            {editingProject && (
              <form onSubmit={handleSaveProject} className="p-6 rounded-3xl bg-[#070A18] border-2 border-cyan-500/40 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-cyan-400 uppercase">
                    {editingProject.id ? 'Edit Project' : 'Add New Project'}
                  </h4>
                  <button type="button" onClick={() => setEditingProject(null)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-300 font-bold block">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title || ''}
                      onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                      placeholder="e.g. Neural Vision Tracker"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Domain</label>
                    <input
                      type="text"
                      value={editingProject.domain || ''}
                      onChange={e => setEditingProject({ ...editingProject, domain: e.target.value as any })}
                      placeholder="computer-vision"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Category</label>
                    <input
                      type="text"
                      value={editingProject.category || ''}
                      onChange={e => setEditingProject({ ...editingProject, category: e.target.value as any })}
                      placeholder="Computer Vision"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-300 font-bold block">Tagline</label>
                    <input
                      type="text"
                      value={editingProject.tagline || ''}
                      onChange={e => setEditingProject({ ...editingProject, tagline: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-300 font-bold block">Description</label>
                    <textarea
                      rows={3}
                      value={editingProject.description || ''}
                      onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white resize-none"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-300 font-bold block">Long Description</label>
                    <textarea
                      rows={3}
                      value={editingProject.longDescription || ''}
                      onChange={e => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Technologies (comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(editingProject.technologies) ? editingProject.technologies.join(', ') : (editingProject.technologies || '')}
                      onChange={e => setEditingProject({ ...editingProject, technologies: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Team Members (comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(editingProject.teamMembers) ? editingProject.teamMembers.join(', ') : (editingProject.teamMembers || '')}
                      onChange={e => setEditingProject({ ...editingProject, teamMembers: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">GitHub URL</label>
                    <input
                      type="text"
                      value={editingProject.githubUrl || ''}
                      onChange={e => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Demo URL</label>
                    <input
                      type="text"
                      value={editingProject.demoUrl || ''}
                      onChange={e => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Paper URL</label>
                    <input
                      type="text"
                      value={editingProject.paperUrl || ''}
                      onChange={e => setEditingProject({ ...editingProject, paperUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Image URL</label>
                    <input
                      type="text"
                      value={editingProject.image || ''}
                      onChange={e => setEditingProject({ ...editingProject, image: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Simulator Type</label>
                    <input
                      type="text"
                      value={editingProject.simulatorType || 'none'}
                      onChange={e => setEditingProject({ ...editingProject, simulatorType: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Stars</label>
                    <input
                      type="number"
                      value={editingProject.stars ?? 0}
                      onChange={e => setEditingProject({ ...editingProject, stars: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="proj-featured"
                      checked={editingProject.featured ?? true}
                      onChange={e => setEditingProject({ ...editingProject, featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="proj-featured" className="text-slate-300 font-bold">Featured Project</label>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button type="submit" className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer">
                    <Save className="w-4 h-4" />
                    <span>Save Project</span>
                  </button>
                  <button type="button" onClick={() => setEditingProject(null)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Projects List */}
            <div className="space-y-3">
              {projects.map(p => (
                <div key={p.id} className="p-5 rounded-2xl bg-[#070A18] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-violet-400 font-bold uppercase">{p.category}</span>
                      <span className="text-[10px] text-slate-400">Team: {p.teamMembers.join(', ')}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-0.5">{p.title}</h4>
                    <p className="text-slate-400 line-clamp-1">{p.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProject(p)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(p.id)}
                      className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* MODULE 5: KNOWLEDGE VAULT CMS */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeModule === 'resources' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Knowledge Vault Study Materials CMS</h3>
                <p className="text-xs text-slate-400">Curate masterclasses, docs, videos, and tutorials.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setEditingResource({
                    title: '',
                    description: '',
                    category: 'AI',
                    type: 'Course',
                  author: '',
                  url: '',
                  tags: ['AI', 'Guide']
                });
              }}
              className="px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-black text-xs transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)] flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource</span>
            </button>
          </div>

          {/* Resource Form Modal */}
          {editingResource && (
            <form onSubmit={handleSaveResource} className="p-6 rounded-3xl bg-[#070A18] border-2 border-violet-500/40 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-violet-400 uppercase">
                  {editingResource.id ? 'Edit Resource' : 'Add New Resource'}
                </h4>
                <button type="button" onClick={() => setEditingResource(null)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-bold block">Title *</label>
                  <input
                    type="text"
                    required
                    value={editingResource.title || ''}
                    onChange={e => setEditingResource({ ...editingResource, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-bold block">Description</label>
                  <textarea
                    rows={2}
                    value={editingResource.description || ''}
                    onChange={e => setEditingResource({ ...editingResource, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Category</label>
                  <input
                    type="text"
                    value={editingResource.category || 'AI'}
                    onChange={e => setEditingResource({ ...editingResource, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Type</label>
                  <input
                    type="text"
                    value={editingResource.type || 'Course'}
                    onChange={e => setEditingResource({ ...editingResource, type: e.target.value as any })}
                    placeholder="Course / Video / Docs / Paper"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Author</label>
                  <input
                    type="text"
                    value={editingResource.author || ''}
                    onChange={e => setEditingResource({ ...editingResource, author: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">URL *</label>
                  <input
                    type="text"
                    required
                    value={editingResource.url || ''}
                    onChange={e => setEditingResource({ ...editingResource, url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-bold block">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingResource.tags) ? editingResource.tags.join(', ') : (editingResource.tags || '')}
                    onChange={e => setEditingResource({ ...editingResource, tags: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="res-featured"
                    checked={!!editingResource.featured}
                    onChange={e => setEditingResource({ ...editingResource, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="res-featured" className="text-slate-300 font-bold">Featured Resource</label>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" className="px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer">
                  <Save className="w-4 h-4" />
                  <span>Save Resource</span>
                </button>
                <button type="button" onClick={() => setEditingResource(null)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Resources List */}
          <div className="space-y-3">
            {resources.map(r => (
              <div key={r.id} className="p-5 rounded-2xl bg-[#070A18] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-violet-400 font-bold uppercase">{r.category}</span>
                    <span className="text-[10px] text-slate-400">[{r.type}]</span>
                    <span className="text-[10px] text-slate-400">By {r.author}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">{r.title}</h4>
                  <p className="text-slate-400 line-clamp-1">{r.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a href={r.url} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setEditingResource(r)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteResource(r.id)}
                    className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODULE: PROGRAM ROADMAP MILESTONES */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeModule === 'roadmap' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Program Roadmap & Curriculum Phases</h3>
              <p className="text-xs text-slate-400">Manage the phased learning roadmap shown on the public Roadmap page.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setEditingMilestone({
                  phaseNumber: 1,
                  phaseName: 'Phase 1',
                  phaseTheme: 'Cyan Neon',
                  title: '',
                  timeline: 'Q1 2026',
                  status: 'UPCOMING',
                  description: '',
                  keyTopics: ['Topic 1'],
                  deliverables: ['Deliverable 1'],
                  toolsAndTech: ['Python'],
                  completionPercentage: 0
                });
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Milestone</span>
            </button>
          </div>

          {/* Milestone Form Modal */}
          {editingMilestone && (
            <form onSubmit={handleSaveMilestone} className="p-6 rounded-3xl bg-[#070A18] border-2 border-emerald-500/40 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-emerald-400 uppercase">
                  {editingMilestone.id ? 'Edit Milestone' : 'Add New Milestone'}
                </h4>
                <button type="button" onClick={() => setEditingMilestone(null)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Phase Number</label>
                  <select
                    value={editingMilestone.phaseNumber || 1}
                    onChange={e => setEditingMilestone({ ...editingMilestone, phaseNumber: Number(e.target.value) as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value={1}>Phase 1</option>
                    <option value={2}>Phase 2</option>
                    <option value={3}>Phase 3</option>
                    <option value={4}>Phase 4</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Phase Name</label>
                  <input
                    type="text"
                    value={editingMilestone.phaseName || ''}
                    onChange={e => setEditingMilestone({ ...editingMilestone, phaseName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Phase Theme</label>
                  <input
                    type="text"
                    value={editingMilestone.phaseTheme || ''}
                    onChange={e => setEditingMilestone({ ...editingMilestone, phaseTheme: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-bold block">Milestone Title *</label>
                  <input
                    type="text"
                    required
                    value={editingMilestone.title || ''}
                    onChange={e => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Timeline</label>
                  <input
                    type="text"
                    value={editingMilestone.timeline || ''}
                    onChange={e => setEditingMilestone({ ...editingMilestone, timeline: e.target.value })}
                    placeholder="Q1 2026"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Status</label>
                  <select
                    value={editingMilestone.status || 'UPCOMING'}
                    onChange={e => setEditingMilestone({ ...editingMilestone, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="IN PROGRESS">IN PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Completion %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editingMilestone.completionPercentage ?? 0}
                    onChange={e => setEditingMilestone({ ...editingMilestone, completionPercentage: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1 sm:col-span-3">
                  <label className="text-slate-300 font-bold block">Description</label>
                  <textarea
                    rows={3}
                    value={editingMilestone.description || ''}
                    onChange={e => setEditingMilestone({ ...editingMilestone, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Key Topics (comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingMilestone.keyTopics) ? editingMilestone.keyTopics.join(', ') : (editingMilestone.keyTopics || '')}
                    onChange={e => setEditingMilestone({ ...editingMilestone, keyTopics: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Deliverables (comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingMilestone.deliverables) ? editingMilestone.deliverables.join(', ') : (editingMilestone.deliverables || '')}
                    onChange={e => setEditingMilestone({ ...editingMilestone, deliverables: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Tools & Tech (comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingMilestone.toolsAndTech) ? editingMilestone.toolsAndTech.join(', ') : (editingMilestone.toolsAndTech || '')}
                    onChange={e => setEditingMilestone({ ...editingMilestone, toolsAndTech: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="milestone-featured"
                    checked={!!editingMilestone.featured}
                    onChange={e => setEditingMilestone({ ...editingMilestone, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="milestone-featured" className="text-slate-300 font-bold">Featured Milestone</label>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer">
                  <Save className="w-4 h-4" />
                  <span>Save Milestone</span>
                </button>
                <button type="button" onClick={() => setEditingMilestone(null)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Milestones List */}
          <div className="space-y-3">
            {roadmap.map(m => (
              <div key={m.id} className="p-5 rounded-2xl bg-[#070A18] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Phase {m.phaseNumber}: {m.phaseName}</span>
                    <span className="text-[10px] text-slate-400">[{m.status}]</span>
                    <span className="text-[10px] text-slate-400">{m.timeline}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">{m.title}</h4>
                  <p className="text-slate-400 line-clamp-1">{m.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">{m.completionPercentage}%</span>
                  <button
                    type="button"
                    onClick={() => setEditingMilestone(m)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteMilestone(m.id)}
                    className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODULE: SITE CONTENT (DOMAINS / RESEARCH / TESTIMONIALS / ACHIEVEMENTS / SETTINGS) */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeModule === 'content' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Site Content Management</h3>
            <p className="text-xs text-slate-400">Manage AI domain tracks, research papers, testimonials, achievements, and global site settings.</p>
          </div>

          {/* Content Sub-Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {([
              { id: 'domains', label: `Domains (${domains.length})`, icon: Layers },
              { id: 'research', label: `Research (${research.length})`, icon: BookOpen },
              { id: 'testimonials', label: `Testimonials (${testimonials.length})`, icon: Quote },
              { id: 'achievements', label: `Achievements (${achievements.length})`, icon: Award },
              { id: 'settings', label: 'Global Settings', icon: SettingsIcon }
            ] as const).map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { soundFx.playClick(); setContentTab(t.id); }}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold whitespace-nowrap transition-all cursor-pointer ${
                    contentTab === t.id
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-[#070D1F] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── DOMAINS SUB-TAB ── */}
          {contentTab === 'domains' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setEditingDomain({
                    name: '',
                    shortDesc: '',
                    fullDesc: '',
                    iconName: 'Brain',
                    technologies: ['Python'],
                    keyConcepts: ['Concept 1'],
                    activeProjectsCount: 0,
                    researchFocus: '',
                    color: '#00CFFF',
                    glowColor: '#00CFFF'
                  });
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Domain</span>
              </button>

              {editingDomain && (
                <form onSubmit={handleSaveDomain} className="p-6 rounded-3xl bg-[#070A18] border-2 border-cyan-500/40 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-cyan-400 uppercase">{editingDomain.id ? 'Edit Domain' : 'Add New Domain'}</h4>
                    <button type="button" onClick={() => setEditingDomain(null)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Domain Name *</label>
                      <input type="text" required value={editingDomain.name || ''} onChange={e => setEditingDomain({ ...editingDomain, name: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Icon Name (lucide-react)</label>
                      <input type="text" value={editingDomain.iconName || ''} onChange={e => setEditingDomain({ ...editingDomain, iconName: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-300 font-bold block">Short Description</label>
                      <input type="text" value={editingDomain.shortDesc || ''} onChange={e => setEditingDomain({ ...editingDomain, shortDesc: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-300 font-bold block">Full Description</label>
                      <textarea rows={3} value={editingDomain.fullDesc || ''} onChange={e => setEditingDomain({ ...editingDomain, fullDesc: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white resize-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Technologies (comma separated)</label>
                      <input type="text" value={Array.isArray(editingDomain.technologies) ? editingDomain.technologies.join(', ') : (editingDomain.technologies || '')} onChange={e => setEditingDomain({ ...editingDomain, technologies: e.target.value as any })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Key Concepts (comma separated)</label>
                      <input type="text" value={Array.isArray(editingDomain.keyConcepts) ? editingDomain.keyConcepts.join(', ') : (editingDomain.keyConcepts || '')} onChange={e => setEditingDomain({ ...editingDomain, keyConcepts: e.target.value as any })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Research Focus</label>
                      <input type="text" value={editingDomain.researchFocus || ''} onChange={e => setEditingDomain({ ...editingDomain, researchFocus: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Active Projects Count</label>
                      <input type="number" value={editingDomain.activeProjectsCount ?? 0} onChange={e => setEditingDomain({ ...editingDomain, activeProjectsCount: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Color (hex)</label>
                      <input type="text" value={editingDomain.color || ''} onChange={e => setEditingDomain({ ...editingDomain, color: e.target.value })} placeholder="#00CFFF" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Glow Color (hex)</label>
                      <input type="text" value={editingDomain.glowColor || ''} onChange={e => setEditingDomain({ ...editingDomain, glowColor: e.target.value })} placeholder="#00CFFF" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button type="submit" className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"><Save className="w-4 h-4" /><span>Save Domain</span></button>
                    <button type="button" onClick={() => setEditingDomain(null)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer">Cancel</button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {domains.map(d => (
                  <div key={d.id} className="p-5 rounded-2xl bg-[#070A18] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div>
                      <h4 className="text-sm font-bold text-white">{d.name}</h4>
                      <p className="text-slate-400 line-clamp-1">{d.shortDesc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setEditingDomain(d)} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => handleDeleteDomain(d.id)} className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── RESEARCH SUB-TAB ── */}
          {contentTab === 'research' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setEditingResearch({ title: '', authors: ['Author'], domain: 'computer-vision', status: 'In Progress', year: new Date().getFullYear(), abstract: '', keywords: ['AI'] });
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Research Paper</span>
              </button>

              {editingResearch && (
                <form onSubmit={handleSaveResearchPaper} className="p-6 rounded-3xl bg-[#070A18] border-2 border-amber-500/40 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-amber-400 uppercase">{editingResearch.id ? 'Edit Research Paper' : 'Add New Research Paper'}</h4>
                    <button type="button" onClick={() => setEditingResearch(null)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-300 font-bold block">Title *</label>
                      <input type="text" required value={editingResearch.title || ''} onChange={e => setEditingResearch({ ...editingResearch, title: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Authors (comma separated)</label>
                      <input type="text" value={Array.isArray(editingResearch.authors) ? editingResearch.authors.join(', ') : (editingResearch.authors || '')} onChange={e => setEditingResearch({ ...editingResearch, authors: e.target.value as any })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Domain</label>
                      <input type="text" value={editingResearch.domain || ''} onChange={e => setEditingResearch({ ...editingResearch, domain: e.target.value as any })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Status</label>
                      <input type="text" value={editingResearch.status || ''} onChange={e => setEditingResearch({ ...editingResearch, status: e.target.value as any })} placeholder="Published / In Progress / Under Review" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Year</label>
                      <input type="number" value={editingResearch.year || new Date().getFullYear()} onChange={e => setEditingResearch({ ...editingResearch, year: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-300 font-bold block">Conference / Venue</label>
                      <input type="text" value={editingResearch.conference || ''} onChange={e => setEditingResearch({ ...editingResearch, conference: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-300 font-bold block">Abstract</label>
                      <textarea rows={3} value={editingResearch.abstract || ''} onChange={e => setEditingResearch({ ...editingResearch, abstract: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white resize-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">PDF URL</label>
                      <input type="text" value={editingResearch.pdfUrl || ''} onChange={e => setEditingResearch({ ...editingResearch, pdfUrl: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Code URL</label>
                      <input type="text" value={editingResearch.codeUrl || ''} onChange={e => setEditingResearch({ ...editingResearch, codeUrl: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-300 font-bold block">Keywords (comma separated)</label>
                      <input type="text" value={Array.isArray(editingResearch.keywords) ? editingResearch.keywords.join(', ') : (editingResearch.keywords || '')} onChange={e => setEditingResearch({ ...editingResearch, keywords: e.target.value as any })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button type="submit" className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"><Save className="w-4 h-4" /><span>Save Paper</span></button>
                    <button type="button" onClick={() => setEditingResearch(null)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer">Cancel</button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {research.map(r => (
                  <div key={r.id} className="p-5 rounded-2xl bg-[#070A18] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-amber-400 font-bold uppercase">{r.status}</span>
                        <span className="text-[10px] text-slate-400">{r.year}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">{r.title}</h4>
                      <p className="text-slate-400 line-clamp-1">{r.authors.join(', ')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setEditingResearch(r)} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => handleDeleteResearchPaper(r.id)} className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TESTIMONIALS SUB-TAB ── */}
          {contentTab === 'testimonials' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setEditingTestimonial({ name: '', program: '', year: '', role: '', quote: '', domain: 'computer-vision' });
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Testimonial</span>
              </button>

              {editingTestimonial && (
                <form onSubmit={handleSaveTestimonial} className="p-6 rounded-3xl bg-[#070A18] border-2 border-rose-500/40 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-rose-400 uppercase">{editingTestimonial.id ? 'Edit Testimonial' : 'Add New Testimonial'}</h4>
                    <button type="button" onClick={() => setEditingTestimonial(null)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Name *</label>
                      <input type="text" required value={editingTestimonial.name || ''} onChange={e => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Program</label>
                      <input type="text" value={editingTestimonial.program || ''} onChange={e => setEditingTestimonial({ ...editingTestimonial, program: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Year</label>
                      <input type="text" value={editingTestimonial.year || ''} onChange={e => setEditingTestimonial({ ...editingTestimonial, year: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Role</label>
                      <input type="text" value={editingTestimonial.role || ''} onChange={e => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Company / Placement</label>
                      <input type="text" value={editingTestimonial.companyOrPlacement || ''} onChange={e => setEditingTestimonial({ ...editingTestimonial, companyOrPlacement: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Domain</label>
                      <input type="text" value={editingTestimonial.domain || ''} onChange={e => setEditingTestimonial({ ...editingTestimonial, domain: e.target.value as any })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-300 font-bold block">Quote</label>
                      <textarea rows={3} value={editingTestimonial.quote || ''} onChange={e => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white resize-none" />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-300 font-bold block">Avatar URL</label>
                      <input type="text" value={editingTestimonial.avatar || ''} onChange={e => setEditingTestimonial({ ...editingTestimonial, avatar: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button type="submit" className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"><Save className="w-4 h-4" /><span>Save Testimonial</span></button>
                    <button type="button" onClick={() => setEditingTestimonial(null)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer">Cancel</button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {testimonials.map(t => (
                  <div key={t.id} className="p-5 rounded-2xl bg-[#070A18] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div>
                      <h4 className="text-sm font-bold text-white">{t.name} <span className="text-slate-400 font-normal">— {t.role}</span></h4>
                      <p className="text-slate-400 line-clamp-1">&ldquo;{t.quote}&rdquo;</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setEditingTestimonial(t)} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => handleDeleteTestimonial(t.id)} className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ACHIEVEMENTS SUB-TAB ── */}
          {contentTab === 'achievements' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setEditingAchievement({ title: '', category: 'Hackathon Win', year: String(new Date().getFullYear()), description: '', issuer: '', badgeIcon: 'Trophy' });
                }}
                className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Achievement</span>
              </button>

              {editingAchievement && (
                <form onSubmit={handleSaveAchievement} className="p-6 rounded-3xl bg-[#070A18] border-2 border-yellow-500/40 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-yellow-400 uppercase">{editingAchievement.id ? 'Edit Achievement' : 'Add New Achievement'}</h4>
                    <button type="button" onClick={() => setEditingAchievement(null)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-300 font-bold block">Title *</label>
                      <input type="text" required value={editingAchievement.title || ''} onChange={e => setEditingAchievement({ ...editingAchievement, title: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Category</label>
                      <input type="text" value={editingAchievement.category || ''} onChange={e => setEditingAchievement({ ...editingAchievement, category: e.target.value as any })} placeholder="Hackathon / Award / Publication" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Year</label>
                      <input type="text" value={editingAchievement.year || ''} onChange={e => setEditingAchievement({ ...editingAchievement, year: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Issuer</label>
                      <input type="text" value={editingAchievement.issuer || ''} onChange={e => setEditingAchievement({ ...editingAchievement, issuer: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Rank / Metric</label>
                      <input type="text" value={editingAchievement.rankOrMetric || ''} onChange={e => setEditingAchievement({ ...editingAchievement, rankOrMetric: e.target.value })} placeholder="1st Place / Top 5%" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-300 font-bold block">Badge Icon (lucide-react)</label>
                      <input type="text" value={editingAchievement.badgeIcon || ''} onChange={e => setEditingAchievement({ ...editingAchievement, badgeIcon: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-300 font-bold block">Description</label>
                      <textarea rows={3} value={editingAchievement.description || ''} onChange={e => setEditingAchievement({ ...editingAchievement, description: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white resize-none" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button type="submit" className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"><Save className="w-4 h-4" /><span>Save Achievement</span></button>
                    <button type="button" onClick={() => setEditingAchievement(null)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer">Cancel</button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {achievements.map(a => (
                  <div key={a.id} className="p-5 rounded-2xl bg-[#070A18] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-yellow-400 font-bold uppercase">{a.category}</span>
                        <span className="text-[10px] text-slate-400">{a.year}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">{a.title}</h4>
                      <p className="text-slate-400 line-clamp-1">{a.issuer} {a.rankOrMetric ? `· ${a.rankOrMetric}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setEditingAchievement(a)} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => handleDeleteAchievement(a.id)} className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── GLOBAL SETTINGS SUB-TAB ── */}
          {contentTab === 'settings' && (
            <form onSubmit={handleSaveSiteSettings} className="p-6 rounded-3xl bg-[#070A18] border-2 border-slate-700 space-y-4 text-xs">
              <h4 className="text-sm font-bold text-white uppercase">Global Site Settings</h4>
              <p className="text-slate-400">Controls the club name, tagline, hero copy and social links shown across the public site.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Club Name</label>
                  <input type="text" value={(localSettings || settings)?.clubName || ''} onChange={e => setLocalSettings({ ...(localSettings || settings), clubName: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Tagline</label>
                  <input type="text" value={(localSettings || settings)?.tagline || ''} onChange={e => setLocalSettings({ ...(localSettings || settings), tagline: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-bold block">Hero Headline</label>
                  <input type="text" value={(localSettings || settings)?.heroHeadline || ''} onChange={e => setLocalSettings({ ...(localSettings || settings), heroHeadline: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-bold block">Hero Subheadline</label>
                  <textarea rows={2} value={(localSettings || settings)?.heroSubheadline || ''} onChange={e => setLocalSettings({ ...(localSettings || settings), heroSubheadline: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white resize-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Discord Link</label>
                  <input type="text" value={(localSettings || settings)?.socialLinks?.discord || ''} onChange={e => setLocalSettings({ ...(localSettings || settings), socialLinks: { ...((localSettings || settings)?.socialLinks || {}), discord: e.target.value } as any })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">GitHub Link</label>
                  <input type="text" value={(localSettings || settings)?.socialLinks?.github || ''} onChange={e => setLocalSettings({ ...(localSettings || settings), socialLinks: { ...((localSettings || settings)?.socialLinks || {}), github: e.target.value } as any })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">LinkedIn Link</label>
                  <input type="text" value={(localSettings || settings)?.socialLinks?.linkedin || ''} onChange={e => setLocalSettings({ ...(localSettings || settings), socialLinks: { ...((localSettings || settings)?.socialLinks || {}), linkedin: e.target.value } as any })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Instagram Link</label>
                  <input type="text" value={(localSettings || settings)?.socialLinks?.instagram || ''} onChange={e => setLocalSettings({ ...(localSettings || settings), socialLinks: { ...((localSettings || settings)?.socialLinks || {}), instagram: e.target.value } as any })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">WhatsApp Link</label>
                  <input type="text" value={(localSettings || settings)?.socialLinks?.whatsapp || ''} onChange={e => setLocalSettings({ ...(localSettings || settings), socialLinks: { ...((localSettings || settings)?.socialLinks || {}), whatsapp: e.target.value } as any })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"><Save className="w-4 h-4" /><span>Save Settings</span></button>
                {localSettings && (
                  <button type="button" onClick={() => setLocalSettings(null)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer">Discard Changes</button>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODULE: TEAM LEADERSHIP & ORG TREE GOVERNANCE [SUPERADMIN] */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeModule === 'team' && (
        <div>
          {!isSuperAdmin ? (
            <div className="p-12 text-center rounded-3xl bg-rose-950/20 border-2 border-rose-500/40 text-rose-300 space-y-3">
              <Lock className="w-12 h-12 mx-auto text-rose-400" />
              <h3 className="text-lg font-black text-white">ACCESS RESTRICTED — SUPERADMIN PRIVILEGES REQUIRED</h3>
              <p className="text-xs text-rose-300/80 max-w-md mx-auto">
                Governance of the Executive Leadership Roster and Organizational Hierarchy Tree requires SuperAdmin authorization. Please sign in with an authorized SuperAdmin account to access this module.
              </p>
              <Link
                href="/admin-login"
                onClick={() => cmsStore.logoutAdmin()}
                className="inline-flex items-center gap-1.5 mt-2 px-5 py-2.5 rounded-xl bg-rose-900/80 hover:bg-rose-800 border border-rose-600 text-white font-bold text-xs cursor-pointer transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch to SuperAdmin Account</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-black tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> SUPERADMIN TEAM & ORG TREE GOVERNANCE
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Total: {team.length} Officers & Faculty Advisors
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">AI Club Leadership & Org Tree Hierarchy</h3>
                  <p className="text-xs text-slate-400">
                    Superadmins can add officers, configure their position in the Org Tree (Tier 1-4, SPOC tags, reports-to), and customize profiles.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setEditingTeamMember({
                        name: '',
                        role: 'Technical Team SPOC',
                        spocTitle: 'Technical Team SPOC',
                        initials: 'TS',
                        orgLevel: 3,
                        treeOrder: (team.length || 0) + 1,
                        domain: 'artificial-intelligence',
                        department: 'Dept. of Computer Science & Engineering',
                        year: '3rd Year B.Tech',
                        bio: '',
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
                        linkedin: '',
                        github: '',
                        twitter: '',
                        email: '',
                        skills: ['PyTorch', 'Deep Learning'],
                        isFaculty: false,
                        isMentor: true,
                        specialization: 'Neural Networks & LLMs'
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Member to Org Tree</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportTeamCSV}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-400 text-emerald-300 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#070A18] p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 overflow-x-auto text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold mr-1">Filter:</span>
                  {(['All', 'Faculty', 'Officers'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => { soundFx.playClick(); setTeamCategoryFilter(cat); }}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold text-xs ${
                        teamCategoryFilter === cat
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {cat === 'Faculty' ? 'Faculty Coordinators' : cat === 'Officers' ? 'Student Leads & SPOCs' : 'All Members'}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={teamSearch}
                    onChange={e => setTeamSearch(e.target.value)}
                    placeholder="Search team by name, role, SPOC, department..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              {/* Team Member Creation & Editing Modal */}
              {editingTeamMember && (
                <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 pt-24 sm:pt-28 pb-8 overflow-y-auto font-mono">
                  <form
                    onSubmit={handleSaveTeamMember}
                    className="w-full max-w-2xl max-h-[85vh] my-auto rounded-3xl bg-[#080E21] border-2 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)] p-6 space-y-4 overflow-y-auto text-xs"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                          {editingTeamMember.id ? 'EDIT LEADERSHIP & ORG POSITION' : 'ENROLL NEW OFFICER INTO ORG TREE'}
                        </span>
                        <h4 className="text-base font-bold text-white mt-1">
                          {editingTeamMember.id ? `Editing: ${editingTeamMember.name}` : 'Create Team Member Profile'}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingTeamMember(null)}
                        className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Basic Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold block">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={editingTeamMember.name || ''}
                          onChange={e => {
                            const name = e.target.value;
                            const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                            setEditingTeamMember({
                              ...editingTeamMember,
                              name,
                              initials: editingTeamMember.initials || initials
                            });
                          }}
                          placeholder="e.g. Harsh Vardhan Singh"
                          className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl p-2.5 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold block">Leadership Role / Title *</label>
                        <input
                          type="text"
                          required
                          value={editingTeamMember.role || ''}
                          onChange={e => setEditingTeamMember({ ...editingTeamMember, role: e.target.value as any })}
                          placeholder="e.g. Club President / Technical Lead"
                          className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl p-2.5 text-white"
                        />
                      </div>
                    </div>

                    {/* ────────────────────────────────────────────────────────── */}
                    {/* ORG TREE HIERARCHY POSITIONING CONTROLS */}
                    {/* ────────────────────────────────────────────────────────── */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">
                          🌳 ORG TREE HIERARCHY & SPOC CONFIGURATION
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold block text-[11px]">
                            Hierarchy Level / Tier *
                          </label>
                          <select
                            value={editingTeamMember.orgLevel || (editingTeamMember.isFaculty ? 1 : 3)}
                            onChange={e => setEditingTeamMember({ ...editingTeamMember, orgLevel: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-400 rounded-xl p-2 text-white font-mono"
                          >
                            <option value="1">Tier 1: Faculty Coordinators & Advisors</option>
                            <option value="2">Tier 2: President & Vice President</option>
                            <option value="3">Tier 3: Domain Lead & Team SPOC</option>
                            <option value="4">Tier 4: Core Specialist & Associate</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold block text-[11px]">
                            SPOC / Org Tag Label
                          </label>
                          <input
                            type="text"
                            value={editingTeamMember.spocTitle || ''}
                            onChange={e => setEditingTeamMember({ ...editingTeamMember, spocTitle: e.target.value })}
                            placeholder="e.g. Technical Team SPOC"
                            className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-400 rounded-xl p-2 text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold block text-[11px]">
                            2-Letter Avatar Badge Initials
                          </label>
                          <input
                            type="text"
                            maxLength={3}
                            value={editingTeamMember.initials || ''}
                            onChange={e => setEditingTeamMember({ ...editingTeamMember, initials: e.target.value.toUpperCase() })}
                            placeholder="e.g. HV, IK, TK, DS"
                            className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-400 rounded-xl p-2 text-white font-mono uppercase font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold block text-[11px]">
                            Reports To / Direct Lead in Tree
                          </label>
                          <select
                            value={editingTeamMember.reportsToId || ''}
                            onChange={e => setEditingTeamMember({ ...editingTeamMember, reportsToId: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs font-mono"
                          >
                            <option value="">None (Top Level Root)</option>
                            {team
                              .filter(m => m.id !== editingTeamMember.id)
                              .map(m => (
                                <option key={m.id} value={m.id}>
                                  {m.name} ({m.spocTitle || m.role})
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold block text-[11px] flex items-center justify-between">
                            <span>Left-to-Right Position in Tier *</span>
                            <span className="text-emerald-400 font-mono text-[10px]">#1 = Leftmost</span>
                          </label>
                          <select
                            value={editingTeamMember.treeOrder || 1}
                            onChange={e => setEditingTeamMember({ ...editingTeamMember, treeOrder: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-400 rounded-xl p-2 text-white font-mono text-xs"
                          >
                            <option value="1">Position 1 (1st / Leftmost)</option>
                            <option value="2">Position 2 (2nd from Left)</option>
                            <option value="3">Position 3 (3rd from Left)</option>
                            <option value="4">Position 4 (4th from Left)</option>
                            <option value="5">Position 5 (5th from Left)</option>
                            <option value="6">Position 6 (6th from Left)</option>
                            <option value="7">Position 7 (7th from Left)</option>
                            <option value="8">Position 8 (8th from Left)</option>
                            <option value="9">Position 9 (9th from Left)</option>
                            <option value="10">Position 10 (10th from Left)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Domain, Department & Academic Standing */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold block">AI Domain Track</label>
                        <select
                          value={editingTeamMember.domain || 'artificial-intelligence'}
                          onChange={e => setEditingTeamMember({ ...editingTeamMember, domain: e.target.value as any })}
                          className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl p-2.5 text-white font-mono"
                        >
                          <option value="artificial-intelligence">Artificial Intelligence</option>
                          <option value="machine-learning">Machine Learning</option>
                          <option value="deep-learning">Deep Learning</option>
                          <option value="generative-ai">Generative AI & LLMs</option>
                          <option value="computer-vision">Computer Vision</option>
                          <option value="natural-language-processing">NLP & Speech</option>
                          <option value="robotics">Robotics & Autonomous Systems</option>
                          <option value="reinforcement-learning">Reinforcement Learning</option>
                          <option value="data-science">Data Science</option>
                          <option value="ai-agents">Autonomous AI Agents</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold block">Department / Branch *</label>
                        <input
                          type="text"
                          required
                          value={editingTeamMember.department || ''}
                          onChange={e => setEditingTeamMember({ ...editingTeamMember, department: e.target.value })}
                          placeholder="e.g. Dept. of CSE (AI & ML)"
                          className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl p-2.5 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold block">Academic Standing / Year</label>
                        <input
                          type="text"
                          value={editingTeamMember.year || ''}
                          onChange={e => setEditingTeamMember({ ...editingTeamMember, year: e.target.value })}
                          placeholder="e.g. 4th Year B.Tech / Faculty Director"
                          className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl p-2.5 text-white"
                        />
                      </div>
                    </div>

                    {/* Category Flags */}
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingTeamMember.isFaculty ?? false}
                          onChange={e => setEditingTeamMember({ ...editingTeamMember, isFaculty: e.target.checked })}
                          className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-200">Is Faculty Advisor / Coordinator?</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingTeamMember.isMentor ?? false}
                          onChange={e => setEditingTeamMember({ ...editingTeamMember, isMentor: e.target.checked })}
                          className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-200">Is Core Mentor / Lead?</span>
                      </label>
                    </div>

                    {/* Avatar Upload / URL */}
                    <div className="space-y-2">
                      <label className="text-slate-300 font-bold block">Avatar Photo (Local Upload or URL)</label>
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <label className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 font-bold text-xs flex items-center gap-2 cursor-pointer shrink-0 transition-all">
                          <Upload className="w-4 h-4" />
                          <span>{teamImageUploading ? 'Processing...' : 'Browse Local Device...'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleTeamAvatarUpload}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="url"
                          value={editingTeamMember.avatar || ''}
                          onChange={e => setEditingTeamMember({ ...editingTeamMember, avatar: e.target.value })}
                          placeholder="Or enter Image URL (https://...)"
                          className="flex-1 w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                        />
                      </div>

                      {editingTeamMember.avatar && (
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={editingTeamMember.avatar}
                            alt="Preview"
                            className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40"
                          />
                          <div className="flex-1 text-[11px] text-slate-400 truncate">
                            Photo preview active
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingTeamMember({ ...editingTeamMember, avatar: '' })}
                            className="px-2 py-1 rounded bg-rose-950 border border-rose-800 text-rose-300 text-[10px]"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block">Biography / Leadership Statement *</label>
                      <textarea
                        rows={3}
                        required
                        value={editingTeamMember.bio || ''}
                        onChange={e => setEditingTeamMember({ ...editingTeamMember, bio: e.target.value })}
                        placeholder="Brief summary of expertise, research projects, and club contributions..."
                        className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl p-2.5 text-white text-xs"
                      />
                    </div>

                    {/* Social Coordinates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold block">LinkedIn Profile URL</label>
                        <input
                          type="url"
                          value={editingTeamMember.linkedin || ''}
                          onChange={e => setEditingTeamMember({ ...editingTeamMember, linkedin: e.target.value })}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold block">GitHub Profile URL</label>
                        <input
                          type="url"
                          value={editingTeamMember.github || ''}
                          onChange={e => setEditingTeamMember({ ...editingTeamMember, github: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold block">Email Address</label>
                        <input
                          type="email"
                          value={editingTeamMember.email || ''}
                          onChange={e => setEditingTeamMember({ ...editingTeamMember, email: e.target.value })}
                          placeholder="lead@aimlclub.edu"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold block">Specialization / Focus Tags</label>
                        <input
                          type="text"
                          value={Array.isArray(editingTeamMember.skills) ? editingTeamMember.skills.join(', ') : (editingTeamMember.skills || '')}
                          onChange={e => setEditingTeamMember({ ...editingTeamMember, skills: e.target.value as any })}
                          placeholder="e.g. PyTorch, Computer Vision, LLMs, ROS2"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setEditingTeamMember(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Team Member & Org Position</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Interactive Left-to-Right Tier Arranger */}
              <div className="p-5 rounded-3xl bg-[#080E21] border-2 border-emerald-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
                  <div>
                    <span className="text-[10px] text-emerald-400 uppercase font-black tracking-wider flex items-center gap-1.5">
                      <ArrowLeftRight className="w-3.5 h-3.5" /> ORG TREE HORIZONTAL LEFT-TO-RIGHT POSITIONING
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">
                      Arrange who appears 1st (Leftmost), 2nd, 3rd, etc. within each tier
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Click ◀ or ▶ to instantly swap positions
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    { lvl: 1, label: 'TIER 1 // FACULTY COORDINATORS & ADVISORS', color: 'border-amber-500/40 bg-amber-950/20 text-amber-300' },
                    { lvl: 2, label: 'TIER 2 // PRESIDENT & VICE PRESIDENT', color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300' },
                    { lvl: 3, label: 'TIER 3 // DOMAIN LEADS & TEAM SPOCS', color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' },
                    { lvl: 4, label: 'TIER 4 // CORE RESEARCHERS & ASSOCIATES', color: 'border-slate-700 bg-slate-900/40 text-slate-300' }
                  ].map(tierGroup => {
                    const membersInTier = team
                      .filter(m => (Number(m.orgLevel) || (m.isFaculty ? 1 : 3)) === tierGroup.lvl)
                      .sort((a, b) => (Number(a.treeOrder) || 1) - (Number(b.treeOrder) || 1));

                    if (membersInTier.length === 0) return null;

                    return (
                      <div key={tierGroup.lvl} className="p-3.5 rounded-2xl bg-[#060A18] border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${tierGroup.color}`}>
                            {tierGroup.label} ({membersInTier.length})
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Horizontal Order: Left ➔ Right
                          </span>
                        </div>

                        <div className="flex items-center gap-3 overflow-x-auto pb-1.5 pt-1">
                          {membersInTier.map((member, idx) => (
                            <div
                              key={member.id}
                              className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-md shrink-0 group hover:border-emerald-400 transition-colors"
                            >
                              <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0">
                                #{idx + 1}
                              </span>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'}
                                alt={member.name}
                                className="w-8 h-8 rounded-xl object-cover border border-slate-700"
                              />
                              <div className="min-w-0 pr-1">
                                <span className="text-xs font-bold text-white block truncate max-w-[140px]">
                                  {member.name}
                                </span>
                                <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                                  {member.spocTitle || member.role}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveMemberInTier(member.id, 'left')}
                                  className="p-1 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-slate-400 text-slate-300 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                  title="Move Left (Earlier in row)"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === membersInTier.length - 1}
                                  onClick={() => handleMoveMemberInTier(member.id, 'right')}
                                  className="p-1 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-slate-400 text-slate-300 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                  title="Move Right (Later in row)"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Team Cards Grid with Org Tree Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team
                  .filter(m => {
                    const matchSearch =
                      teamSearch === '' ||
                      m.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
                      m.role.toLowerCase().includes(teamSearch.toLowerCase()) ||
                      (m.spocTitle && m.spocTitle.toLowerCase().includes(teamSearch.toLowerCase())) ||
                      m.department.toLowerCase().includes(teamSearch.toLowerCase()) ||
                      (m.skills || []).some(s => s.toLowerCase().includes(teamSearch.toLowerCase()));

                    const matchCategory =
                      teamCategoryFilter === 'All' ||
                      (teamCategoryFilter === 'Faculty' && m.isFaculty) ||
                      (teamCategoryFilter === 'Officers' && !m.isFaculty);

                    return matchSearch && matchCategory;
                  })
                  .sort((a, b) => {
                    const tierA = Number(a.orgLevel) || (a.isFaculty ? 1 : 3);
                    const tierB = Number(b.orgLevel) || (b.isFaculty ? 1 : 3);
                    if (tierA !== tierB) return tierA - tierB;
                    return (Number(a.treeOrder) || 1) - (Number(b.treeOrder) || 1);
                  })
                  .map(m => (
                    <div
                      key={m.id}
                      className="p-5 rounded-3xl bg-[#070A18] border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3 relative flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'}
                                alt={m.name}
                                className="w-12 h-12 rounded-2xl object-cover border border-emerald-500/40"
                              />
                              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-slate-950 text-[8px] font-black text-amber-300 border border-slate-800">
                                {m.initials || m.name.slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <strong className="text-sm font-black text-white block">{m.name}</strong>
                              <span className="text-xs text-emerald-300 font-bold block">{m.spocTitle || m.role}</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black ${
                              (m.orgLevel || 1) === 1
                                ? 'bg-amber-950 text-amber-300 border-amber-500'
                                : (m.orgLevel || 2) === 2
                                ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                                : 'bg-emerald-950 text-emerald-300 border-emerald-500'
                            }`}>
                              TIER {m.orgLevel || (m.isFaculty ? 1 : 3)}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-[9px] font-mono font-bold">
                              POS #{m.treeOrder || 1}
                            </span>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-400 space-y-0.5">
                          <p className="truncate">🏛️ {m.department}</p>
                          <p>🎓 {m.year || 'Core Team'}</p>
                        </div>

                        <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                          &quot;{m.bio}&quot;
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1">
                          {(m.skills || []).map(skill => (
                            <span key={skill} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-emerald-400">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleMoveMemberInTier(m.id, 'left')}
                            className="p-1 rounded-lg bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-slate-400 transition-colors cursor-pointer"
                            title="Move Left in Tier"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveMemberInTier(m.id, 'right')}
                            className="p-1 rounded-lg bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-slate-400 transition-colors cursor-pointer"
                            title="Move Right in Tier"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingTeamMember(m)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="Edit Officer & Org Position"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTeamMember(m.id)}
                            className="p-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 cursor-pointer"
                            title="Remove from Team"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* MODULE 6: MEMBER DIRECTORY CMS */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeModule === 'members' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Registered Student Member Directory</h3>
                <p className="text-xs text-slate-400">Search student builders across campus, manually register members, and export official records.</p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setEditingMember({
                      name: '',
                      uid: '',
                      email: '',
                      department: 'Computer Science & Engineering',
                      year: '1st Year',
                      skills: ['Python', 'AI'],
                      role: 'Student Member',
                      status: 'Active'
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-[0_0_15px_rgba(0,207,255,0.4)] flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportMembersCSV}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Member Form Modal */}
            {editingMember && (
              <form onSubmit={handleSaveMember} className="p-6 rounded-3xl bg-[#070A18] border-2 border-cyan-500/40 space-y-4 text-xs">
                <h4 className="text-sm font-bold text-cyan-400 uppercase">
                  {editingMember.id ? 'Edit Member Details' : 'Register New Student Member'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editingMember.name || ''}
                      onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                      placeholder="e.g. Maya Lin"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Student UID / Roll No. *</label>
                    <input
                      type="text"
                      required
                      value={editingMember.uid || ''}
                      onChange={e => setEditingMember({ ...editingMember, uid: e.target.value })}
                      placeholder="e.g. 24BCS10088"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">University Email *</label>
                    <input
                      type="email"
                      required
                      value={editingMember.email || ''}
                      onChange={e => setEditingMember({ ...editingMember, email: e.target.value })}
                      placeholder="student@campus.edu"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Phone Number</label>
                    <input
                      type="tel"
                      value={editingMember.phone || ''}
                      onChange={e => setEditingMember({ ...editingMember, phone: e.target.value })}
                      placeholder="+1 (555) 234-5678"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Department</label>
                    <input
                      type="text"
                      value={editingMember.department || ''}
                      onChange={e => setEditingMember({ ...editingMember, department: e.target.value })}
                      placeholder="Computer Science & Engineering"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Academic Year</label>
                    <select
                      value={editingMember.year || '1st Year'}
                      onChange={e => setEditingMember({ ...editingMember, year: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">Member Role</label>
                    <input
                      type="text"
                      value={editingMember.role || 'Student Builder'}
                      onChange={e => setEditingMember({ ...editingMember, role: e.target.value })}
                      placeholder="Student Builder / Core Member"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Skills (Comma-separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingMember.skills) ? editingMember.skills.join(', ') : (editingMember.skills || '')}
                    onChange={e => setEditingMember({ ...editingMember, skills: e.target.value as any })}
                    placeholder="PyTorch, OpenCV, LangChain, NumPy"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Member</span>
                  </button>
                </div>
              </form>
            )}

            <div className="relative">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search roster by Student Name, UID, Email, Phone, Department, or Member ID..."
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
                className="w-full bg-[#070A18] border border-slate-700 focus:border-emerald-400 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#070A18]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] border-b border-slate-800 font-bold">
                  <tr>
                    <th className="p-3.5">MEMBER ID</th>
                    <th className="p-3.5">FULL NAME</th>
                    <th className="p-3.5">STUDENT UID</th>
                    <th className="p-3.5">CONTACT (EMAIL & PHONE)</th>
                    <th className="p-3.5">DEPARTMENT & YEAR</th>
                    <th className="p-3.5">SKILLS</th>
                    <th className="p-3.5">STATUS</th>
                    <th className="p-3.5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {members
                    .filter(m => memberSearch === '' ||
                      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
                      m.uid.toLowerCase().includes(memberSearch.toLowerCase()) ||
                      m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
                      (m.phone && m.phone.toLowerCase().includes(memberSearch.toLowerCase())) ||
                      m.department.toLowerCase().includes(memberSearch.toLowerCase()) ||
                      m.memberId.toLowerCase().includes(memberSearch.toLowerCase())
                    )
                    .map(m => (
                      <tr key={m.id} className="hover:bg-slate-900/40">
                        <td className="p-3.5 font-bold text-emerald-300">{m.memberId}</td>
                        <td className="p-3.5 font-bold text-white">{m.name}</td>
                        <td className="p-3.5 text-slate-300">{m.uid}</td>
                        <td className="p-3.5">
                          <span className="text-slate-300 block">{m.email}</span>
                          <span className="text-[10px] text-cyan-300 font-bold block">{m.phone || 'N/A'}</span>
                        </td>
                        <td className="p-3.5 text-slate-400">{m.department} ({m.year})</td>
                        <td className="p-3.5 text-slate-400">{m.skills.slice(0, 3).join(', ')}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                            {m.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingMember(m)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                              title="Edit Member"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMember(m.id)}
                              className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300"
                              title="Remove Member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* MODULE 8: USER & STAFF MANAGEMENT CMS [SUPERADMIN ONLY] */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeModule === 'users' && (
          <div className="space-y-6">
            {!isSuperAdmin ? (
              <div className="p-12 text-center rounded-3xl bg-rose-950/20 border-2 border-rose-500/40 text-rose-300 space-y-3">
                <Lock className="w-12 h-12 mx-auto text-rose-400" />
                <h3 className="text-lg font-black text-white">ACCESS RESTRICTED — SUPERADMIN PRIVILEGES REQUIRED</h3>
                <p className="text-xs text-rose-300/80 max-w-md mx-auto">
                  Staff governance and administrator account provisioning are restricted to SuperAdmins. Please sign in with an authorized SuperAdmin account to access this module.
                </p>
                <Link
                  href="/admin-login"
                  onClick={() => cmsStore.logoutAdmin()}
                  className="inline-flex items-center gap-1.5 mt-2 px-5 py-2.5 rounded-xl bg-rose-900/80 hover:bg-rose-800 border border-rose-600 text-white font-bold text-xs cursor-pointer transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch to SuperAdmin Account</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Administrator & Staff Governance</h3>
                    <p className="text-xs text-slate-400">Register leads/faculty mentors, elevate permissions, and reset access passwords.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setEditingStaffUser({
                        name: '',
                        email: '',
                        role: 'ADMIN',
                        password: 'aiml_' + Math.random().toString(36).substring(2, 8) + '!'
                      });
                      setShowStaffPassword(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Administrator</span>
                  </button>
                </div>

                {/* Staff User Form Modal */}
                {editingStaffUser && (
                  <form onSubmit={handleSaveStaffUser} className="p-6 rounded-3xl bg-[#070A18] border-2 border-amber-500/40 space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-amber-400 uppercase flex items-center gap-2">
                        <KeyRound className="w-4 h-4" />
                        <span>{editingStaffUser.id ? 'Edit Staff Account & Password' : 'Register New Administrator'}</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">All fields required for login access</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold block">Staff Full Name *</label>
                        <input
                          type="text"
                          required
                          value={editingStaffUser.name || ''}
                          onChange={e => setEditingStaffUser({ ...editingStaffUser, name: e.target.value })}
                          placeholder="e.g. Sudhanshu Singh"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold block">Staff Email *</label>
                        <input
                          type="email"
                          required
                          value={editingStaffUser.email || ''}
                          onChange={e => setEditingStaffUser({ ...editingStaffUser, email: e.target.value })}
                          placeholder="staff@aimlclub.edu"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold block">Role Level</label>
                        <select
                          value={editingStaffUser.role || 'ADMIN'}
                          onChange={e => setEditingStaffUser({ ...editingStaffUser, role: e.target.value as any })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-amber-400 outline-none"
                        >
                          <option value="ADMIN">ADMIN (Content & Events)</option>
                          <option value="SUPERADMIN">SUPERADMIN (Full Governance)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-300 font-bold block">Access Password *</label>
                          <button
                            type="button"
                            onClick={() => {
                              const randomPass = 'aiml_' + Math.random().toString(36).substring(2, 8) + '!';
                              setEditingStaffUser({ ...editingStaffUser, password: randomPass });
                              setShowStaffPassword(true);
                            }}
                            className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Zap className="w-2.5 h-2.5" />
                            <span>Generate</span>
                          </button>
                        </div>
                        <div className="relative flex items-center">
                          <input
                            type={showStaffPassword ? 'text' : 'password'}
                            required
                            value={editingStaffUser.password || ''}
                            onChange={e => setEditingStaffUser({ ...editingStaffUser, password: e.target.value })}
                            placeholder="Enter secure password"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 pr-20 text-white font-mono text-xs focus:border-amber-400 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowStaffPassword(!showStaffPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all border border-slate-700/60 shadow-sm"
                            title={showStaffPassword ? "Hide password" : "Show password"}
                          >
                            {showStaffPassword ? (
                              <>
                                <EyeOff className="w-3 h-3 text-amber-400" />
                                <span>Hide</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3 text-slate-300" />
                                <span>Show</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-300 text-[11px] flex items-center justify-between">
                      <span>💡 <strong>Access Note:</strong> This staff member will use this email and password to log in directly at <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded">/admin-login</code>.</span>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingStaffUser(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Account</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Staff Users List */}
                <div className="space-y-3">
                  {adminUsers.map(user => (
                    <div key={user.id} className="p-5 rounded-2xl bg-[#070A18] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold text-white">{user.name}</strong>
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black ${
                            user.role === 'SUPERADMIN' ? 'bg-amber-950 text-amber-300 border-amber-500' : 'bg-cyan-950 text-cyan-300 border-cyan-500'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-3">
                          <span>{user.email}</span>
                          <span>•</span>
                          <span>Created on {user.createdAt}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <span className="text-slate-500">Access Key:</span>
                          <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-amber-300 font-semibold">
                            {user.password || 'admin2026password'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(user.password || 'admin2026password');
                              setCopiedPasswordUserId(user.id);
                              setTimeout(() => setCopiedPasswordUserId(null), 2000);
                            }}
                            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                            title="Copy Password"
                          >
                            {copiedPasswordUserId === user.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span className="text-[9px]">{copiedPasswordUserId === user.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingStaffUser(user);
                            setShowStaffPassword(true);
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 cursor-pointer"
                          title="Edit Account & Reset Password"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit / Reset Pass</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStaffUser(user.id)}
                          className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 cursor-pointer"
                          title="Delete Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* MODULE 9: JOIN FORM CONFIGURATOR CMS [SUPERADMIN ONLY] */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeModule === 'join-form' && (
          <div className="space-y-6">
            {!isSuperAdmin ? (
              <div className="p-12 text-center rounded-3xl bg-rose-950/20 border-2 border-rose-500/40 text-rose-300 space-y-3">
                <Lock className="w-12 h-12 mx-auto text-rose-400" />
                <h3 className="text-lg font-black text-white">ACCESS RESTRICTED — SUPERADMIN PRIVILEGES REQUIRED</h3>
                <p className="text-xs text-rose-300/80 max-w-md mx-auto">
                  Configuring public membership admissions and form fields requires SuperAdmin authorization. Please sign in with an authorized SuperAdmin account to access this module.
                </p>
                <Link
                  href="/admin-login"
                  onClick={() => cmsStore.logoutAdmin()}
                  className="inline-flex items-center gap-1.5 mt-2 px-5 py-2.5 rounded-xl bg-rose-900/80 hover:bg-rose-800 border border-rose-600 text-white font-bold text-xs cursor-pointer transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch to SuperAdmin Account</span>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSaveJoinConfig} className="p-6 sm:p-8 rounded-3xl bg-[#070A18] border-2 border-amber-500/40 space-y-8 text-xs">
                {/* Header & Save Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-black tracking-wider flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5" /> FULL FORM GOVERNANCE & CUSTOMIZER
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Status: {localJoinConfig.admissionsOpen ? '🟢 Open' : '🔴 Paused (Form Hidden)'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">Join Form Portal & Questions Configurator</h3>
                    <p className="text-xs text-slate-400">
                      Customize titles, toggle questions, manage dropdown streams, and create dynamic custom application fields for /join.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Form Changes</span>
                  </button>
                </div>

                {/* ────────────────────────────────────────────────────────── */}
                {/* 1. ADMISSIONS MASTER SWITCH & VISIBILITY CONTROL */}
                {/* ────────────────────────────────────────────────────────── */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <strong className="text-sm text-white block">Admissions Status & Visibility Protocol</strong>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {localJoinConfig.admissionsOpen
                          ? '🟢 Admissions are currently OPEN. The membership registration form is active on /join.'
                          : '🔴 Admissions are PAUSED. The registration form is COMPLETELY HIDDEN on /join and replaced with the Admissions Closed screen.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setLocalJoinConfig({ ...localJoinConfig, admissionsOpen: !localJoinConfig.admissionsOpen });
                      }}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                        localJoinConfig.admissionsOpen
                          ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                          : 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                      }`}
                    >
                      {localJoinConfig.admissionsOpen ? '✓ OPEN FOR ADMISSIONS' : '✕ ADMISSIONS PAUSED (FORM HIDDEN)'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-900">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block uppercase text-[11px]">
                        Next Anticipated Intake Window / Cohort Date
                      </label>
                      <input
                        type="text"
                        value={localJoinConfig.nextCohortDate || ''}
                        onChange={e => setLocalJoinConfig({ ...localJoinConfig, nextCohortDate: e.target.value })}
                        placeholder="e.g. Spring 2027 (Nov 2026)"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block uppercase text-[11px]">
                        Custom Application Closure Notice (Displayed when paused)
                      </label>
                      <textarea
                        rows={2}
                        value={localJoinConfig.closureNotice}
                        onChange={e => setLocalJoinConfig({ ...localJoinConfig, closureNotice: e.target.value })}
                        placeholder="Notice shown to visitors when intake is closed..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* ────────────────────────────────────────────────────────── */}
                {/* 2. FORM BRANDING, TITLES & BUTTON LABELS */}
                {/* ────────────────────────────────────────────────────────── */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Form Branding, Headlines & Instructions</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block text-[11px]">Portal Badge Text</label>
                      <input
                        type="text"
                        value={localJoinConfig.portalBadge || ''}
                        onChange={e => setLocalJoinConfig({ ...localJoinConfig, portalBadge: e.target.value })}
                        placeholder="e.g. MEMBERSHIP RECRUITMENT PORTAL"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block text-[11px]">Main Form Title / Headline</label>
                      <input
                        type="text"
                        value={localJoinConfig.formTitle || ''}
                        onChange={e => setLocalJoinConfig({ ...localJoinConfig, formTitle: e.target.value })}
                        placeholder="e.g. APPLY TO JOIN THE AI/ML CLUB"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block text-[11px]">Form Subtitle & Application Instructions</label>
                    <textarea
                      rows={2}
                      value={localJoinConfig.formSubtitle || ''}
                      onChange={e => setLocalJoinConfig({ ...localJoinConfig, formSubtitle: e.target.value })}
                      placeholder="Instructions displayed right below the main title on /join..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block text-[11px]">Submit Button Label</label>
                      <input
                        type="text"
                        value={localJoinConfig.submitButtonText || ''}
                        onChange={e => setLocalJoinConfig({ ...localJoinConfig, submitButtonText: e.target.value })}
                        placeholder="e.g. SUBMIT APPLICATION & ENROLL"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block text-[11px]">Success Screen Title</label>
                      <input
                        type="text"
                        value={localJoinConfig.successTitle || ''}
                        onChange={e => setLocalJoinConfig({ ...localJoinConfig, successTitle: e.target.value })}
                        placeholder="e.g. WELCOME TO THE AI/ML CLUB!"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block text-[11px]">Success Confirmation Message</label>
                      <input
                        type="text"
                        value={localJoinConfig.successMessage || ''}
                        onChange={e => setLocalJoinConfig({ ...localJoinConfig, successMessage: e.target.value })}
                        placeholder="e.g. Application received and approved..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* ────────────────────────────────────────────────────────── */}
                {/* 3. CORE FIELD VISIBILITY & SECTION TOGGLES */}
                {/* ────────────────────────────────────────────────────────── */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>Core Sections & Field Visibility Toggles</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-amber-500/40 transition-all">
                      <span className="text-xs text-slate-200 font-bold">Contact Phone Number</span>
                      <input
                        type="checkbox"
                        checked={localJoinConfig.showPhoneField !== false}
                        onChange={e => setLocalJoinConfig({ ...localJoinConfig, showPhoneField: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                    </label>

                    <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-amber-500/40 transition-all">
                      <span className="text-xs text-slate-200 font-bold">Social Links (GitHub & LinkedIn)</span>
                      <input
                        type="checkbox"
                        checked={localJoinConfig.showSocialLinks !== false}
                        onChange={e => setLocalJoinConfig({ ...localJoinConfig, showSocialLinks: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                    </label>

                    <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-amber-500/40 transition-all">
                      <span className="text-xs text-slate-200 font-bold">Portfolio / Resume Link</span>
                      <input
                        type="checkbox"
                        checked={localJoinConfig.showPortfolioField !== false}
                        onChange={e => setLocalJoinConfig({ ...localJoinConfig, showPortfolioField: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                    </label>

                    <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-amber-500/40 transition-all">
                      <span className="text-xs text-slate-200 font-bold">AI Domain Tracks Selector</span>
                      <input
                        type="checkbox"
                        checked={localJoinConfig.showDomainInterests !== false}
                        onChange={e => setLocalJoinConfig({ ...localJoinConfig, showDomainInterests: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                    </label>

                    <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-amber-500/40 transition-all sm:col-span-2">
                      <span className="text-xs text-slate-200 font-bold">Statement of Purpose / Essay Question</span>
                      <input
                        type="checkbox"
                        checked={localJoinConfig.showStatementOfPurpose !== false}
                        onChange={e => setLocalJoinConfig({ ...localJoinConfig, showStatementOfPurpose: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                    </label>
                  </div>

                  {localJoinConfig.showStatementOfPurpose !== false && (
                    <div className="space-y-1 pt-1">
                      <label className="text-slate-300 font-bold block text-[11px]">Custom Statement of Purpose Prompt Label</label>
                      <input
                        type="text"
                        value={localJoinConfig.sopPrompt || ''}
                        onChange={e => setLocalJoinConfig({ ...localJoinConfig, sopPrompt: e.target.value })}
                        placeholder="e.g. Statement of Purpose / Why do you want to join the AI/ML Club?"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs"
                      />
                    </div>
                  )}
                </div>

                {/* ────────────────────────────────────────────────────────── */}
                {/* 4. CUSTOM DYNAMIC QUESTIONS & FIELDS BUILDER */}
                {/* ────────────────────────────────────────────────────────── */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Plus className="w-4 h-4 text-amber-400" />
                        <span>Custom Dynamic Form Questions ({localJoinConfig.customFields?.length || 0})</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">Add custom text inputs, dropdown selects, URLs, or long-form questions to the join form.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setAddingCustomField({
                          id: `field-${Date.now()}`,
                          label: '',
                          type: 'text',
                          placeholder: '',
                          helperText: '',
                          required: false,
                          options: []
                        });
                        setCustomFieldOptionsInput('');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Custom Field</span>
                    </button>
                  </div>

                  {/* List of Custom Fields */}
                  <div className="space-y-2">
                    {(localJoinConfig.customFields || []).length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2">No custom dynamic fields added yet. Click &quot;Add Custom Field&quot; above to create one.</p>
                    ) : (
                      (localJoinConfig.customFields || []).map((field, idx) => (
                        <div key={field.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-white font-bold">{field.label}</strong>
                              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-[10px] text-amber-300 font-mono">
                                {field.type.toUpperCase()}
                              </span>
                              {field.required && (
                                <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[9px] font-bold">
                                  REQUIRED
                                </span>
                              )}
                            </div>
                            {field.helperText && <span className="text-slate-400 text-[10px] block mt-0.5">{field.helperText}</span>}
                            {field.options && field.options.length > 0 && (
                              <span className="text-[10px] text-slate-500 block">Options: {field.options.join(' | ')}</span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              soundFx.playClick();
                              setLocalJoinConfig({
                                ...localJoinConfig,
                                customFields: (localJoinConfig.customFields || []).filter((_, i) => i !== idx)
                              });
                            }}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300"
                            title="Remove Field"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Custom Field Inline Modal / Form */}
                  {addingCustomField && (
                    <div className="p-4 rounded-2xl bg-[#0B1020] border-2 border-amber-500/40 space-y-3 pt-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <strong className="text-xs font-bold text-amber-300 uppercase">Create New Form Question</strong>
                        <button
                          type="button"
                          onClick={() => setAddingCustomField(null)}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold block text-[11px]">Field / Question Label *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Prior AI/ML Project Links"
                            value={addingCustomField.label || ''}
                            onChange={e => setAddingCustomField({ ...addingCustomField, label: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold block text-[11px]">Field Input Type</label>
                          <select
                            value={addingCustomField.type || 'text'}
                            onChange={e => setAddingCustomField({ ...addingCustomField, type: e.target.value as any })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                          >
                            <option value="text">Text Input (Short)</option>
                            <option value="textarea">Textarea (Paragraph / Essay)</option>
                            <option value="select">Dropdown Select Menu</option>
                            <option value="url">URL Link (Website / Repo)</option>
                            <option value="email">Email Address</option>
                            <option value="number">Numeric Input</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold block text-[11px]">Placeholder Text</label>
                          <input
                            type="text"
                            placeholder="e.g. https://github.com/..."
                            value={addingCustomField.placeholder || ''}
                            onChange={e => setAddingCustomField({ ...addingCustomField, placeholder: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold block text-[11px]">Helper Description</label>
                          <input
                            type="text"
                            placeholder="e.g. Optional link to past hackathon submissions"
                            value={addingCustomField.helperText || ''}
                            onChange={e => setAddingCustomField({ ...addingCustomField, helperText: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                          />
                        </div>
                      </div>

                      {addingCustomField.type === 'select' && (
                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold block text-[11px]">
                            Dropdown Options (Comma-separated)
                          </label>
                          <input
                            type="text"
                            placeholder="Beginner, Intermediate, Advanced"
                            value={customFieldOptionsInput}
                            onChange={e => setCustomFieldOptionsInput(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={addingCustomField.required ?? false}
                            onChange={e => setAddingCustomField({ ...addingCustomField, required: e.target.checked })}
                            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                          />
                          <span className="text-xs font-bold text-slate-200">Is this field required?</span>
                        </label>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setAddingCustomField(null)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!addingCustomField.label?.trim()) return;
                              const newField: CustomFormField = {
                                id: addingCustomField.id || `field-${Date.now()}`,
                                label: addingCustomField.label.trim(),
                                type: addingCustomField.type || 'text',
                                placeholder: addingCustomField.placeholder || '',
                                helperText: addingCustomField.helperText || '',
                                required: addingCustomField.required ?? false,
                                options: customFieldOptionsInput.split(',').map(s => s.trim()).filter(Boolean)
                              };
                              setLocalJoinConfig({
                                ...localJoinConfig,
                                customFields: [...(localJoinConfig.customFields || []), newField]
                              });
                              setAddingCustomField(null);
                              soundFx.playClick();
                            }}
                            className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs"
                          >
                            Insert Question
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ────────────────────────────────────────────────────────── */}
                {/* 5. ACADEMIC DEPARTMENTS & STREAMS */}
                {/* ────────────────────────────────────────────────────────── */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <label className="text-slate-300 font-bold block uppercase text-[11px]">
                    Selectable Academic Departments & Engineering Streams
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {localJoinConfig.departments.map((dept, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs flex items-center gap-2">
                        <span>{dept}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setLocalJoinConfig({
                              ...localJoinConfig,
                              departments: localJoinConfig.departments.filter((_, i) => i !== idx)
                            });
                          }}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Add department stream (e.g. Mechanical Engineering)..."
                      value={newDepartmentInput}
                      onChange={e => setNewDepartmentInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newDepartmentInput.trim()) {
                          setLocalJoinConfig({
                            ...localJoinConfig,
                            departments: [...localJoinConfig.departments, newDepartmentInput.trim()]
                          });
                          setNewDepartmentInput('');
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* ────────────────────────────────────────────────────────── */}
                {/* 6. ACADEMIC YEARS / COHORT STANDINGS */}
                {/* ────────────────────────────────────────────────────────── */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <label className="text-slate-300 font-bold block uppercase text-[11px]">
                    Selectable Academic Years & Cohorts
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {localJoinConfig.academicYears.map((year, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs flex items-center gap-2">
                        <span>{year}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setLocalJoinConfig({
                              ...localJoinConfig,
                              academicYears: localJoinConfig.academicYears.filter((_, i) => i !== idx)
                            });
                          }}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Add year / cohort (e.g. 5th Year Dual Degree)..."
                      value={newYearInput}
                      onChange={e => setNewYearInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newYearInput.trim()) {
                          setLocalJoinConfig({
                            ...localJoinConfig,
                            academicYears: [...localJoinConfig.academicYears, newYearInput.trim()]
                          });
                          setNewYearInput('');
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* ────────────────────────────────────────────────────────── */}
                {/* 7. AI DOMAIN INTERESTS */}
                {/* ────────────────────────────────────────────────────────── */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <label className="text-slate-300 font-bold block uppercase text-[11px]">
                    Selectable AI Domain Research Tracks
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {localJoinConfig.domainInterests.map((interest, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 text-xs flex items-center gap-2">
                        <span>{interest}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setLocalJoinConfig({
                              ...localJoinConfig,
                              domainInterests: localJoinConfig.domainInterests.filter((_, i) => i !== idx)
                            });
                          }}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Add AI track (e.g. Quantum Machine Learning)..."
                      value={newInterestInput}
                      onChange={e => setNewInterestInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newInterestInput.trim()) {
                          setLocalJoinConfig({
                            ...localJoinConfig,
                            domainInterests: [...localJoinConfig.domainInterests, newInterestInput.trim()]
                          });
                          setNewInterestInput('');
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* ────────────────────────────────────────────────────────── */}
                {/* 8. MEMBERSHIP PERKS */}
                {/* ────────────────────────────────────────────────────────── */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <label className="text-slate-300 font-bold block uppercase text-[11px]">
                    Membership Perks & Benefits (Displayed on Admissions Page)
                  </label>
                  <div className="space-y-2">
                    {(localJoinConfig.membershipPerks || []).map((perk, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-200">
                        <span className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{perk}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setLocalJoinConfig({
                              ...localJoinConfig,
                              membershipPerks: (localJoinConfig.membershipPerks || []).filter((_, i) => i !== idx)
                            });
                          }}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1 max-w-lg">
                    <input
                      type="text"
                      placeholder="Add membership perk (e.g. Free Cloud GPU Compute Credits)..."
                      value={newPerkInput}
                      onChange={e => setNewPerkInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newPerkInput.trim()) {
                          setLocalJoinConfig({
                            ...localJoinConfig,
                            membershipPerks: [...(localJoinConfig.membershipPerks || []), newPerkInput.trim()]
                          });
                          setNewPerkInput('');
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Bottom Save Action */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Form Configuration Changes</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
