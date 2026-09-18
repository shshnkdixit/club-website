'use client';

import { useState, useEffect } from 'react';
import {
  AIDomain,
  Project,
  ClubEvent,
  ResearchPaper,
  TeamMember,
  Testimonial,
  Achievement,
  SiteSettings,
  JoinApplication,
  ContactMessage,
  RobotCommandLog,
  CodingQuest,
  QuestSubmission,
  RoadmapMilestone,
  Resource,
  AdminUser,
  EventRSVP,
  ClubMember,
  JoinFormConfig
} from '@/types';
import {
  INITIAL_DOMAINS,
  INITIAL_PROJECTS,
  INITIAL_EVENTS,
  INITIAL_RESEARCH,
  INITIAL_TEAM,
  INITIAL_TESTIMONIALS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_SETTINGS,
  INITIAL_QUESTS,
  INITIAL_ROADMAP,
  INITIAL_RESOURCES,
  INITIAL_ADMIN_USERS,
  INITIAL_MEMBERS,
  INITIAL_EVENT_RSVPS,
  INITIAL_JOIN_CONFIG,
  INITIAL_SUBMISSIONS
} from './data';

const STORAGE_KEYS = {
  DOMAINS: 'aiml_club_domains_v1',
  PROJECTS: 'aiml_club_projects_v1',
  EVENTS: 'aiml_club_events_v2',
  RESEARCH: 'aiml_club_research_v1',
  TEAM: 'aiml_club_team_v1',
  TESTIMONIALS: 'aiml_club_testimonials_v1',
  ACHIEVEMENTS: 'aiml_club_achievements_v1',
  SETTINGS: 'aiml_club_settings_v1',
  APPLICATIONS: 'aiml_club_applications_v1',
  MESSAGES: 'aiml_club_messages_v1',
  ROBOT_LOGS: 'aiml_club_robot_logs_v1',
  QUESTS: 'aiml_club_quests_v1',
  SUBMISSIONS: 'aiml_club_quest_submissions_v1',
  ROADMAP: 'aiml_club_roadmap_v1',
  RESOURCES: 'aiml_club_resources_v1',
  ADMIN_USERS: 'aiml_club_admin_users_v1',
  MEMBERS: 'aiml_club_members_v1',
  EVENT_RSVPS: 'aiml_club_event_rsvps_v1',
  JOIN_CONFIG: 'aiml_club_join_config_v1',
  CURRENT_ADMIN: 'aiml_club_current_admin_v1',
};

// Safe local storage helper
function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch custom event for cross-component sync
    window.dispatchEvent(new CustomEvent('aiml_store_updated', { detail: { key } }));
  } catch (e) {
    console.warn(`Error writing ${key} to localStorage`, e);
  }
}

// Background sync helper
function apiCall(url: string, method: 'POST' | 'PUT' | 'DELETE' = 'POST', body?: any) {
  if (typeof window === 'undefined') return;
  try {
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    }).catch(err => console.warn(`API sync [${method} ${url}] notice:`, err.message));
  } catch {}
}

// Global CMS API
export const cmsStore = {
  // Getters
  getDomains: (): AIDomain[] => getStored(STORAGE_KEYS.DOMAINS, INITIAL_DOMAINS),
  getProjects: (): Project[] => getStored(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS),
  getEvents: (): ClubEvent[] => getStored(STORAGE_KEYS.EVENTS, INITIAL_EVENTS),
  getResearch: (): ResearchPaper[] => getStored(STORAGE_KEYS.RESEARCH, INITIAL_RESEARCH),
  getTeam: (): TeamMember[] => getStored(STORAGE_KEYS.TEAM, INITIAL_TEAM),
  getTestimonials: (): Testimonial[] => getStored(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS),
  getAchievements: (): Achievement[] => getStored(STORAGE_KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS),
  getSettings: (): SiteSettings => getStored(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS),
  getApplications: (): JoinApplication[] => getStored(STORAGE_KEYS.APPLICATIONS, []),
  getMessages: (): ContactMessage[] => getStored(STORAGE_KEYS.MESSAGES, []),
  getRobotLogs: (): RobotCommandLog[] => getStored(STORAGE_KEYS.ROBOT_LOGS, []),

  // Projects CRUD
  saveProject: (project: Project) => {
    const projects = cmsStore.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.unshift(project);
    }
    setStored(STORAGE_KEYS.PROJECTS, projects);
    apiCall('/api/admin/projects', 'POST', project);
  },
  deleteProject: (id: string) => {
    const projects = cmsStore.getProjects().filter(p => p.id !== id);
    setStored(STORAGE_KEYS.PROJECTS, projects);
    apiCall(`/api/admin/projects?id=${encodeURIComponent(id)}`, 'DELETE');
  },

  // Events CRUD
  saveEvent: (event: ClubEvent) => {
    const events = cmsStore.getEvents();
    const index = events.findIndex(e => e.id === event.id);
    if (index >= 0) {
      events[index] = event;
    } else {
      events.unshift(event);
    }
    setStored(STORAGE_KEYS.EVENTS, events);
    apiCall('/api/admin/events', 'POST', event);
  },
  deleteEvent: (id: string) => {
    const events = cmsStore.getEvents().filter(e => e.id !== id);
    setStored(STORAGE_KEYS.EVENTS, events);
    apiCall(`/api/admin/events?id=${encodeURIComponent(id)}`, 'DELETE');
  },

  // Research CRUD
  saveResearch: (paper: ResearchPaper) => {
    const research = cmsStore.getResearch();
    const index = research.findIndex(r => r.id === paper.id);
    if (index >= 0) {
      research[index] = paper;
    } else {
      research.unshift(paper);
    }
    setStored(STORAGE_KEYS.RESEARCH, research);
    apiCall('/api/admin/research', 'POST', paper);
  },
  deleteResearch: (id: string) => {
    const research = cmsStore.getResearch().filter(r => r.id !== id);
    setStored(STORAGE_KEYS.RESEARCH, research);
    apiCall(`/api/admin/research?id=${encodeURIComponent(id)}`, 'DELETE');
  },

  // Domains CRUD
  saveDomain: (domain: AIDomain) => {
    const domains = cmsStore.getDomains();
    const index = domains.findIndex(d => d.id === domain.id);
    if (index >= 0) {
      domains[index] = domain;
    } else {
      domains.push(domain);
    }
    setStored(STORAGE_KEYS.DOMAINS, domains);
    apiCall('/api/admin/domains', 'POST', domain);
  },
  deleteDomain: (id: string) => {
    const domains = cmsStore.getDomains().filter(d => d.id !== id);
    setStored(STORAGE_KEYS.DOMAINS, domains);
    apiCall(`/api/admin/domains?id=${encodeURIComponent(id)}`, 'DELETE');
  },

  // Testimonials CRUD
  saveTestimonial: (testimonial: Testimonial) => {
    const testimonials = cmsStore.getTestimonials();
    const index = testimonials.findIndex(t => t.id === testimonial.id);
    if (index >= 0) {
      testimonials[index] = testimonial;
    } else {
      testimonials.unshift(testimonial);
    }
    setStored(STORAGE_KEYS.TESTIMONIALS, testimonials);
    apiCall('/api/admin/testimonials', 'POST', testimonial);
  },
  deleteTestimonial: (id: string) => {
    const testimonials = cmsStore.getTestimonials().filter(t => t.id !== id);
    setStored(STORAGE_KEYS.TESTIMONIALS, testimonials);
    apiCall(`/api/admin/testimonials?id=${encodeURIComponent(id)}`, 'DELETE');
  },

  // Achievements CRUD
  saveAchievement: (achievement: Achievement) => {
    const achievements = cmsStore.getAchievements();
    const index = achievements.findIndex(a => a.id === achievement.id);
    if (index >= 0) {
      achievements[index] = achievement;
    } else {
      achievements.unshift(achievement);
    }
    setStored(STORAGE_KEYS.ACHIEVEMENTS, achievements);
    apiCall('/api/admin/achievements', 'POST', achievement);
  },
  deleteAchievement: (id: string) => {
    const achievements = cmsStore.getAchievements().filter(a => a.id !== id);
    setStored(STORAGE_KEYS.ACHIEVEMENTS, achievements);
    apiCall(`/api/admin/achievements?id=${encodeURIComponent(id)}`, 'DELETE');
  },

  // Team CRUD
  saveTeamMember: (member: TeamMember) => {
    const team = cmsStore.getTeam();
    const index = team.findIndex(t => t.id === member.id);
    if (index >= 0) {
      team[index] = member;
    } else {
      team.push(member);
    }
    setStored(STORAGE_KEYS.TEAM, team);
    apiCall('/api/admin/team', 'POST', member);
  },
  saveTeam: (team: TeamMember[]) => {
    setStored(STORAGE_KEYS.TEAM, team);
  },
  deleteTeamMember: (id: string) => {
    const team = cmsStore.getTeam().filter(t => t.id !== id);
    setStored(STORAGE_KEYS.TEAM, team);
    apiCall(`/api/admin/team?id=${encodeURIComponent(id)}`, 'DELETE');
  },

  // Settings
  saveSettings: (settings: SiteSettings) => {
    setStored(STORAGE_KEYS.SETTINGS, settings);
    apiCall('/api/admin/settings', 'POST', settings);
  },

  // Applications
  addApplication: (app: JoinApplication) => {
    const apps = cmsStore.getApplications();
    apps.unshift(app);
    setStored(STORAGE_KEYS.APPLICATIONS, apps);
    apiCall('/api/applications', 'POST', app);
  },
  updateApplicationStatus: (id: string, status: JoinApplication['status']) => {
    const apps = cmsStore.getApplications().map(a => a.id === id ? { ...a, status } : a);
    setStored(STORAGE_KEYS.APPLICATIONS, apps);
  },
  deleteApplication: (id: string) => {
    const apps = cmsStore.getApplications().filter(a => a.id !== id);
    setStored(STORAGE_KEYS.APPLICATIONS, apps);
  },

  // Contact Messages
  addMessage: (msg: ContactMessage) => {
    const msgs = cmsStore.getMessages();
    msgs.unshift(msg);
    setStored(STORAGE_KEYS.MESSAGES, msgs);
    apiCall('/api/contact', 'POST', msg);
  },
  markMessageRead: (id: string) => {
    const msgs = cmsStore.getMessages().map(m => m.id === id ? { ...m, read: true } : m);
    setStored(STORAGE_KEYS.MESSAGES, msgs);
  },
  deleteMessage: (id: string) => {
    const msgs = cmsStore.getMessages().filter(m => m.id !== id);
    setStored(STORAGE_KEYS.MESSAGES, msgs);
  },

  // Robot Command Logs
  logRobotCommand: (log: RobotCommandLog) => {
    const logs = cmsStore.getRobotLogs();
    logs.unshift(log);
    if (logs.length > 50) logs.pop(); // keep last 50
    setStored(STORAGE_KEYS.ROBOT_LOGS, logs);
  },

  getQuests: (): CodingQuest[] => getStored(STORAGE_KEYS.QUESTS, INITIAL_QUESTS),
  getSubmissions: (): QuestSubmission[] => {
    const list = getStored<QuestSubmission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    if (!list || list.length === 0) {
      setStored(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
      return INITIAL_SUBMISSIONS;
    }
    return list;
  },

  // Quests CRUD
  saveQuest: (quest: CodingQuest) => {
    const quests = cmsStore.getQuests();
    const index = quests.findIndex(q => q.id === quest.id);
    if (index >= 0) {
      quests[index] = quest;
    } else {
      quests.unshift(quest);
    }
    setStored(STORAGE_KEYS.QUESTS, quests);
    apiCall('/api/admin/challenges', 'POST', quest);
  },
  deleteQuest: (id: string) => {
    const quests = cmsStore.getQuests().filter(q => q.id !== id);
    setStored(STORAGE_KEYS.QUESTS, quests);
    apiCall(`/api/admin/challenges?id=${encodeURIComponent(id)}`, 'DELETE');
  },

  // Submissions CRUD & Scoring
  saveSubmission: (sub: QuestSubmission) => {
    const subs = cmsStore.getSubmissions();
    subs.unshift(sub);
    setStored(STORAGE_KEYS.SUBMISSIONS, subs);

    // Increment quest solver count
    const quests = cmsStore.getQuests();
    const quest = quests.find(q => q.id === sub.questId);
    if (quest) {
      quest.solversCount = (quest.solversCount || 0) + 1;
      cmsStore.saveQuest(quest);
    }
  },
  updateSubmissionStatus: (id: string, status: QuestSubmission['status']) => {
    const subs = cmsStore.getSubmissions().map(s => s.id === id ? { ...s, status } : s);
    setStored(STORAGE_KEYS.SUBMISSIONS, subs);
  },
  updateSubmissionScoreAndStatus: (
    id: string,
    status: QuestSubmission['status'],
    pointsAwarded?: number,
    reviewerNotes?: string
  ) => {
    const subs = cmsStore.getSubmissions().map(s => 
      s.id === id ? { ...s, status, pointsAwarded: pointsAwarded ?? s.pointsAwarded, reviewerNotes: reviewerNotes ?? s.reviewerNotes } : s
    );
    setStored(STORAGE_KEYS.SUBMISSIONS, subs);
  },

  // Roadmap CRUD
  getRoadmap: (): RoadmapMilestone[] => getStored(STORAGE_KEYS.ROADMAP, INITIAL_ROADMAP),
  saveMilestone: (milestone: RoadmapMilestone) => {
    const roadmap = cmsStore.getRoadmap();
    const index = roadmap.findIndex(m => m.id === milestone.id);
    if (index >= 0) {
      roadmap[index] = milestone;
    } else {
      roadmap.push(milestone);
    }
    setStored(STORAGE_KEYS.ROADMAP, roadmap);
    apiCall('/api/admin/roadmap', 'POST', milestone);
  },
  deleteMilestone: (id: string) => {
    const roadmap = cmsStore.getRoadmap().filter(m => m.id !== id);
    setStored(STORAGE_KEYS.ROADMAP, roadmap);
    apiCall(`/api/admin/roadmap?id=${encodeURIComponent(id)}`, 'DELETE');
  },

  // Resources CRUD
  getResources: (): Resource[] => getStored(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES),
  saveResource: (resource: Resource) => {
    const resources = cmsStore.getResources();
    const index = resources.findIndex(r => r.id === resource.id);
    if (index >= 0) {
      resources[index] = resource;
    } else {
      resources.unshift(resource);
    }
    setStored(STORAGE_KEYS.RESOURCES, resources);
    apiCall('/api/admin/resources', 'POST', resource);
  },
  deleteResource: (id: string) => {
    const resources = cmsStore.getResources().filter(r => r.id !== id);
    setStored(STORAGE_KEYS.RESOURCES, resources);
    apiCall(`/api/admin/resources?id=${encodeURIComponent(id)}`, 'DELETE');
  },

  // Admin Users & Staff CRUD (SuperAdmin Only)
  getAdminUsers: (): AdminUser[] => {
    const list = getStored<AdminUser[]>(STORAGE_KEYS.ADMIN_USERS, INITIAL_ADMIN_USERS);
    if (!list || list.length === 0) {
      setStored(STORAGE_KEYS.ADMIN_USERS, INITIAL_ADMIN_USERS);
      return INITIAL_ADMIN_USERS;
    }
    let modified = false;
    INITIAL_ADMIN_USERS.forEach(seedUser => {
      const exists = list.some(u => u.email.toLowerCase().trim() === seedUser.email.toLowerCase().trim() || u.id === seedUser.id);
      if (!exists) {
        list.unshift(seedUser);
        modified = true;
      }
    });
    if (modified) {
      setStored(STORAGE_KEYS.ADMIN_USERS, list);
    }
    return list;
  },
  saveAdminUser: (user: AdminUser) => {
    const users = cmsStore.getAdminUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.unshift(user);
    }
    setStored(STORAGE_KEYS.ADMIN_USERS, users);
    apiCall('/api/admin/users', 'POST', user);
  },
  deleteAdminUser: (id: string) => {
    const users = cmsStore.getAdminUsers().filter(u => u.id !== id);
    setStored(STORAGE_KEYS.ADMIN_USERS, users);
    apiCall(`/api/admin/users?id=${encodeURIComponent(id)}`, 'DELETE');
  },

  // Members Directory CRUD
  getMembers: (): ClubMember[] => getStored(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS),
  saveMember: (member: ClubMember) => {
    const members = cmsStore.getMembers();
    const index = members.findIndex(m => m.id === member.id);
    if (index >= 0) {
      members[index] = member;
    } else {
      members.unshift(member);
    }
    setStored(STORAGE_KEYS.MEMBERS, members);
    apiCall('/api/admin/members', 'POST', member);
  },
  deleteMember: (id: string) => {
    const members = cmsStore.getMembers().filter(m => m.id !== id);
    setStored(STORAGE_KEYS.MEMBERS, members);
    apiCall(`/api/admin/members?id=${encodeURIComponent(id)}`, 'DELETE');
  },

  // Event RSVPs & Attendance CRUD
  getEventRsvps: (): EventRSVP[] => getStored(STORAGE_KEYS.EVENT_RSVPS, INITIAL_EVENT_RSVPS),
  saveEventRsvp: (rsvp: EventRSVP) => {
    const rsvps = cmsStore.getEventRsvps();
    const index = rsvps.findIndex(r => r.id === rsvp.id);
    if (index >= 0) {
      rsvps[index] = rsvp;
    } else {
      rsvps.unshift(rsvp);
    }
    setStored(STORAGE_KEYS.EVENT_RSVPS, rsvps);
    apiCall('/api/events/register', 'POST', {
      eventId: rsvp.eventId,
      eventTitle: rsvp.eventTitle,
      name: rsvp.studentName,
      uid: rsvp.studentUid,
      email: rsvp.email,
      contactNo: rsvp.phone,
      department: rsvp.department,
      year: rsvp.year
    });
  },
  updateRsvpStatus: (id: string, status: EventRSVP['status']) => {
    const rsvps = cmsStore.getEventRsvps().map(r => r.id === id ? { ...r, status } : r);
    setStored(STORAGE_KEYS.EVENT_RSVPS, rsvps);
  },

  // Join Form Dynamic Config (SuperAdmin Only)
  getJoinConfig: (): JoinFormConfig => getStored(STORAGE_KEYS.JOIN_CONFIG, INITIAL_JOIN_CONFIG),
  saveJoinConfig: (config: JoinFormConfig) => {
    setStored(STORAGE_KEYS.JOIN_CONFIG, config);
    apiCall('/api/admin/join-config', 'POST', config);
  },

  // Active Admin Session Management
  getCurrentAdminUser: (): AdminUser | null => {
    if (typeof window === 'undefined') return null;
    const allUsers = cmsStore.getAdminUsers();

    let candidate: AdminUser | null = getStored<AdminUser | null>(STORAGE_KEYS.CURRENT_ADMIN, null);
    if (!candidate) {
      try {
        const match = document.cookie.match(/aiml_admin_session=([^;]+)/);
        if (match) {
          candidate = JSON.parse(decodeURIComponent(match[1]));
        }
      } catch {}
    }

    if (candidate && candidate.email) {
      const cleanEmail = candidate.email.toLowerCase().trim();
      const liveUser = allUsers.find(u => u.email.toLowerCase().trim() === cleanEmail || u.id === candidate?.id);
      if (liveUser) {
        return liveUser;
      }
    }

    if (candidate) {
      cmsStore.logoutAdmin();
    }
    return null;
  },
  setCurrentAdminUser: (user: AdminUser | null) => {
    setStored(STORAGE_KEYS.CURRENT_ADMIN, user);
    if (typeof window !== 'undefined') {
      if (user) {
        const { password, ...safeUser } = user;
        document.cookie = `aiml_admin_session=${encodeURIComponent(JSON.stringify(safeUser))}; path=/; max-age=2592000; SameSite=Lax`;
      } else {
        document.cookie = 'aiml_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
  },
  logoutAdmin: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
      document.cookie = 'aiml_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.dispatchEvent(new CustomEvent('aiml_store_updated', { detail: { key: STORAGE_KEYS.CURRENT_ADMIN } }));
    }
  },

  // Reset to Factory Seed
  resetToDefaults: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.DOMAINS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.RESEARCH);
    localStorage.removeItem(STORAGE_KEYS.TEAM);
    localStorage.removeItem(STORAGE_KEYS.TESTIMONIALS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.QUESTS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.ROADMAP);
    localStorage.removeItem(STORAGE_KEYS.RESOURCES);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_USERS);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.EVENT_RSVPS);
    localStorage.removeItem(STORAGE_KEYS.JOIN_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
    document.cookie = 'aiml_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.dispatchEvent(new CustomEvent('aiml_store_updated', { detail: { key: 'all' } }));
  }
};

// React Hook to subscribe to real-time CMS changes with database sync
export function useCMSData() {
  const [data, setData] = useState({
    domains: INITIAL_DOMAINS,
    projects: INITIAL_PROJECTS,
    events: INITIAL_EVENTS,
    research: INITIAL_RESEARCH,
    team: INITIAL_TEAM,
    testimonials: INITIAL_TESTIMONIALS,
    achievements: INITIAL_ACHIEVEMENTS,
    settings: INITIAL_SETTINGS,
    quests: INITIAL_QUESTS,
    submissions: [] as QuestSubmission[],
    roadmap: INITIAL_ROADMAP,
    resources: INITIAL_RESOURCES,
    adminUsers: INITIAL_ADMIN_USERS,
    members: INITIAL_MEMBERS,
    eventRsvps: INITIAL_EVENT_RSVPS,
    joinConfig: INITIAL_JOIN_CONFIG,
    currentAdmin: null as AdminUser | null,
    applications: [] as JoinApplication[],
    messages: [] as ContactMessage[],
    robotLogs: [] as RobotCommandLog[],
    isHydrated: false
  });

  const refresh = () => {
    setData({
      domains: cmsStore.getDomains(),
      projects: cmsStore.getProjects(),
      events: cmsStore.getEvents(),
      research: cmsStore.getResearch(),
      team: cmsStore.getTeam(),
      testimonials: cmsStore.getTestimonials(),
      achievements: cmsStore.getAchievements(),
      settings: cmsStore.getSettings(),
      quests: cmsStore.getQuests(),
      submissions: cmsStore.getSubmissions(),
      roadmap: cmsStore.getRoadmap(),
      resources: cmsStore.getResources(),
      adminUsers: cmsStore.getAdminUsers(),
      members: cmsStore.getMembers(),
      eventRsvps: cmsStore.getEventRsvps(),
      joinConfig: cmsStore.getJoinConfig(),
      currentAdmin: cmsStore.getCurrentAdminUser(),
      applications: cmsStore.getApplications(),
      messages: cmsStore.getMessages(),
      robotLogs: cmsStore.getRobotLogs(),
      isHydrated: true
    });
  };

  useEffect(() => {
    refresh();

    // Async sync with PostgreSQL Database
    fetch('/api/cms')
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          if (result.domains?.length) setStored(STORAGE_KEYS.DOMAINS, result.domains);
          if (result.projects?.length) setStored(STORAGE_KEYS.PROJECTS, result.projects);
          if (result.events?.length) setStored(STORAGE_KEYS.EVENTS, result.events);
          if (result.research?.length) setStored(STORAGE_KEYS.RESEARCH, result.research);
          if (result.team?.length) setStored(STORAGE_KEYS.TEAM, result.team);
          if (result.testimonials?.length) setStored(STORAGE_KEYS.TESTIMONIALS, result.testimonials);
          if (result.achievements?.length) setStored(STORAGE_KEYS.ACHIEVEMENTS, result.achievements);
          if (result.settings) setStored(STORAGE_KEYS.SETTINGS, result.settings);
          if (result.quests?.length) setStored(STORAGE_KEYS.QUESTS, result.quests);
          if (result.submissions?.length) setStored(STORAGE_KEYS.SUBMISSIONS, result.submissions);
          if (result.roadmap?.length) setStored(STORAGE_KEYS.ROADMAP, result.roadmap);
          if (result.resources?.length) setStored(STORAGE_KEYS.RESOURCES, result.resources);
          if (result.adminUsers?.length) setStored(STORAGE_KEYS.ADMIN_USERS, result.adminUsers);
          if (result.members?.length) setStored(STORAGE_KEYS.MEMBERS, result.members);
          if (result.eventRsvps?.length) setStored(STORAGE_KEYS.EVENT_RSVPS, result.eventRsvps);
          if (result.joinConfig) setStored(STORAGE_KEYS.JOIN_CONFIG, result.joinConfig);
          refresh();
        }
      })
      .catch(err => {
        console.warn('PostgreSQL database sync fallback to local cache:', err);
      });

    const handleUpdate = () => refresh();
    window.addEventListener('aiml_store_updated', handleUpdate);
    return () => window.removeEventListener('aiml_store_updated', handleUpdate);
  }, []);

  return { ...data, refresh };
}
