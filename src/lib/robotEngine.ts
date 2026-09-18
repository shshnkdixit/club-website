'use client';

import { RobotActionState, RobotCommandLog } from '@/types';
import { soundFx } from './soundFx';
import { cmsStore } from './cmsStore';

export interface ActionButton {
  label: string;
  url: string;
  external?: boolean;
}

export interface RobotResponse {
  text: string;
  action: RobotActionState;
  telemetry?: {
    label: string;
    value: string;
    status?: 'online' | 'active' | 'optimal' | 'warning';
  }[];
  suggestedCommands?: string[];
  redirectUrl?: string;
  actionButtons?: ActionButton[];
}

export class RobotEngine {
  public static speak(text: string, onStart?: () => void, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (soundFx.getMuted()) return;

    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.08;

      const triggerSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const preferredVoice = voices.find(v =>
            v.lang.startsWith('en') && (
              v.name.toLowerCase().includes('google') ||
              v.name.toLowerCase().includes('natural') ||
              v.name.toLowerCase().includes('samantha') ||
              v.name.toLowerCase().includes('zira') ||
              v.name.toLowerCase().includes('jenny') ||
              v.name.toLowerCase().includes('aria') ||
              v.name.toLowerCase().includes('david') ||
              v.name.toLowerCase().includes('alex')
            )
          ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }

        if (onStart) utterance.onstart = onStart;
        if (onEnd) utterance.onend = onEnd;

        window.speechSynthesis.speak(utterance);
      };

      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          triggerSpeak();
        };
      } else {
        setTimeout(triggerSpeak, 20);
      }
    } catch (err) {
      console.warn('Speech synthesis unavailable or blocked:', err);
    }
  }

  public static processCommand(input: string): RobotResponse {
    const raw = input.trim().toLowerCase();

    // Who are you / introduce NOVA
    if (raw.includes('who are you') || raw.includes('your name') || raw.includes('introduce')) {
      soundFx.playRobotVoice();
      const resp: RobotResponse = {
        text: `I am NOVA — Neural Operations & Virtual Assistant! I am your friendly AI mentor here at the AIML Club, designed to help you explore the amazing world of artificial intelligence.`,
        action: 'welcome',
        suggestedCommands: ['About the club', 'Start learning', 'Run diagnostics']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // About the club / AIML
    if (raw.includes('what is aiml') || raw.includes('about the club')) {
      soundFx.playHologram();
      const resp: RobotResponse = {
        text: `The AIML Club is a community of passionate student researchers and builders! I can help you discover our projects, events, and resources to kickstart your journey in AI.`,
        action: 'explaining',
        suggestedCommands: ['Show projects', 'Show events', 'How to join?']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Explain robotics
    if (raw.includes('explain robotics') || (raw.includes('robotics') && !raw.includes('show'))) {
      soundFx.playHologram();
      const resp: RobotResponse = {
        text: `Robotics combines hardware engineering with intelligent software! It is how we give AI a physical body to interact with the real world — just like me!`,
        action: 'explaining',
        suggestedCommands: ['Show projects', 'Explain computer vision']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Resources / Learning
    if (raw.includes('show resources') || raw.includes('learning') || raw.includes('start learning')) {
      soundFx.playNeuralChime();
      const resp: RobotResponse = {
        text: `I have prepared a curated list of tutorials, papers, and courses for you. Let us start expanding those neural pathways together!`,
        action: 'explaining',
        suggestedCommands: ['Club statistics', 'Explain neural networks']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Stats
    if (raw.includes('club statistics') || raw.includes('stats')) {
      soundFx.playScanSweep();
      const resp: RobotResponse = {
        text: `Crunching the latest data! Here is an overview of our incredible community metrics.`,
        action: 'processing',
        telemetry: [
          { label: 'ACTIVE MEMBERS', value: '580+', status: 'active' },
          { label: 'COMPLETED PROJECTS', value: '50+', status: 'optimal' },
          { label: 'PUBLICATIONS', value: '11', status: 'optimal' }
        ],
        suggestedCommands: ['Show projects', 'Start research mode']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Thanks / Good job
    if (raw.includes('thank') || raw.includes('thanks') || raw.includes('good job') || raw.includes('awesome') || raw.includes('cool')) {
      soundFx.playClick();
      const resp: RobotResponse = {
        text: `You are very welcome! NOVA is always happy to assist a fellow researcher. Let me know what else we can discover together!`,
        action: 'success',
        suggestedCommands: ['Show projects', 'Start learning']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Diagnostics
    if (raw.includes('diagnostic') || raw.includes('system check') || raw.includes('status') || raw.includes('health') || raw.includes('telemetry')) {
      soundFx.playScanSweep();
      const resp: RobotResponse = {
        text: `NOVA running full laboratory diagnostics scan... All my subsystems are operating at nominal capacity, and I am ready to help!`,
        action: 'diagnostics',
        telemetry: [
          { label: 'AI CORE STATUS', value: 'ONLINE / 100%', status: 'online' },
          { label: 'VISION SENSOR', value: '120 FPS / ACTIVE', status: 'active' },
          { label: 'NLP PIPELINE', value: 'SUB-12MS / OPTIMAL', status: 'optimal' },
          { label: 'ROBOTICS KINEMATICS', value: '6-DoF CALIBRATED', status: 'online' },
          { label: 'ACTIVE NODES', value: '580+ CONNECTED', status: 'optimal' }
        ],
        suggestedCommands: ['Activate neural network', 'Show computer vision', 'Show projects']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Wave / Greetings
    if (raw.includes('hello') || raw.includes('hi') || raw.includes('hey') || raw.includes('greet') || raw.includes('welcome')) {
      soundFx.playRobotVoice();
      const resp: RobotResponse = {
        text: `Hey there! I am NOVA, your Neural Operations & Virtual Assistant. Welcome to the University AI/ML Club Laboratory! How can we explore the future together today?`,
        action: 'wave',
        suggestedCommands: ['Who are you?', 'Run diagnostics', 'Activate neural network', 'Show club projects']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Neural Network
    if (raw.includes('neural network') || raw.includes('deep learning') || raw.includes('brain') || raw.includes('synapse') || raw.includes('weights')) {
      soundFx.playNeuralChime();
      const resp: RobotResponse = {
        text: `Interesting! Let me deploy the neural network visualization for you. Over 100,000 synaptic parameters loaded with real-time backpropagation monitoring.`,
        action: 'neural_network',
        telemetry: [
          { label: 'ARCHITECTURE', value: 'Transformer & ResNet Hybrid', status: 'active' },
          { label: 'LATENT DIMENSIONS', value: '768 Channels', status: 'online' },
          { label: 'LOSS CONVERGENCE', value: '0.0014 MSE', status: 'optimal' }
        ],
        suggestedCommands: ['Explain computer vision', 'Start research mode', 'Show projects']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Computer Vision
    if (raw.includes('computer vision') || raw.includes('vision') || raw.includes('cv') || raw.includes('object detection') || raw.includes('segmentation') || raw.includes('camera')) {
      soundFx.playScanSweep();
      const resp: RobotResponse = {
        text: `Activating spatial perception systems... My Computer Vision matrix is active, running real-time bounding box regression and semantic segmentation!`,
        action: 'computer_vision',
        telemetry: [
          { label: 'CV MODEL', value: 'NeuroVision YOLOv10-Edge', status: 'active' },
          { label: 'INFERENCE SPEED', value: '4.2 ms / frame', status: 'optimal' },
          { label: 'SPATIAL RESOLUTION', value: '1920x1080 Point Cloud', status: 'online' }
        ],
        suggestedCommands: ['Show projects', 'Activate neural network', 'Run diagnostics']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Research Mode & Publications
    if (raw.includes('research') || raw.includes('paper') || raw.includes('publication') || raw.includes('cvpr') || raw.includes('neurips') || raw.includes('icra') || raw.includes('scholar')) {
      soundFx.playHologram();
      const allResearch = cmsStore.getResearch();
      const topPaper = allResearch[0];
      const paperTitles = allResearch.slice(0, 2).map(p => `"${p.title}"`).join(' and ');

      const resp: RobotResponse = {
        text: `Loading our peer-reviewed research repository... Our club has published ${allResearch.length} academic papers in conferences like ${topPaper?.conference || 'NeurIPS & ICRA'}! Featured publications include ${paperTitles || 'our Sim-to-Real and Vision-Language papers'}.`,
        action: 'research_mode',
        redirectUrl: '/research',
        telemetry: [
          { label: 'PUBLICATIONS', value: `${allResearch.length} Peer-Reviewed`, status: 'optimal' },
          { label: 'TOP CONFERENCE', value: topPaper?.conference || 'CoRL / CVPR', status: 'active' },
          { label: 'RESEARCH GRANTS', value: '$45,000+ Compute', status: 'online' }
        ],
        suggestedCommands: ['Show projects', 'Show upcoming events', 'How to join?']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Curriculum Roadmap & Learning Trajectory
    if (raw.includes('roadmap') || raw.includes('curriculum') || raw.includes('trajectory') || raw.includes('phase') || raw.includes('syllabus') || raw.includes('milestone')) {
      soundFx.playNeuralChime();
      const roadmap = cmsStore.getRoadmap();
      const completed = roadmap.filter(m => m.status === 'COMPLETED').length;
      const inProgress = roadmap.filter(m => m.status === 'IN PROGRESS').length;

      const resp: RobotResponse = {
        text: `Our AI & ML curriculum follows a structured 4-phase trajectory: Phase 1 (Foundations), Phase 2 (Build Sprint & DevFlow Hackathon), Phase 3 (Advanced Transformers, RAG & Agents), and Phase 4 (Finale Showcase & Paper Expo). We currently have ${completed} milestones completed and ${inProgress} in progress!`,
        action: 'research_mode',
        redirectUrl: '/roadmap',
        actionButtons: [
          { label: '🗺️ Explore Full Curriculum Roadmap →', url: '/roadmap' },
          { label: '🔥 View In-Progress Milestones →', url: '/roadmap' },
          { label: '🧩 Solve Practice Quests →', url: '/challenges' }
        ],
        telemetry: [
          { label: 'TOTAL PHASES', value: '4 Structured Tracks', status: 'optimal' },
          { label: 'COMPLETED MILESTONES', value: `${completed} / ${roadmap.length}`, status: 'active' },
          { label: 'ACTIVE SPRINT', value: 'Phase 2: Build Sprint', status: 'online' }
        ],
        suggestedCommands: ['Show study resources', 'Show coding quests', 'Show projects']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Knowledge Vault & Curated Study Resources
    if (raw.includes('resource') || raw.includes('vault') || raw.includes('study') || raw.includes('material') || raw.includes('tutorial') || raw.includes('course') || raw.includes('karpathy') || raw.includes('learn') || raw.includes('guide')) {
      soundFx.playHologram();
      const resources = cmsStore.getResources();
      const topRes = resources.slice(0, 4);

      const resp: RobotResponse = {
        text: `Welcome to the Knowledge Vault! We have ${resources.length} curated masterclasses, video series, official docs, and interactive tutorials across Python, Machine Learning, Generative AI, Computer Vision, and Autonomous Agents.`,
        action: 'explaining',
        redirectUrl: '/resources',
        actionButtons: [
          { label: '📚 Open Complete Knowledge Vault →', url: '/resources' },
          ...topRes.map(r => ({
            label: `⚡ ${r.title.split(':')[0].slice(0, 26)} (${r.type}) →`,
            url: r.url,
            external: true
          }))
        ],
        telemetry: [
          { label: 'TOTAL STUDY ITEMS', value: `${resources.length} Curated`, status: 'optimal' },
          { label: 'FEATURED 1', value: topRes[0]?.title ? topRes[0].title.split(':')[0] : 'Karpathy Masterclass', status: 'active' },
          { label: 'FEATURED 2', value: topRes[1]?.title ? topRes[1].title.split(':')[0] : 'Fast.ai Deep Learning', status: 'online' }
        ],
        suggestedCommands: ['Show roadmap', 'Show coding quests', 'Show projects']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Coding Quests & Problem of the Week (POTW)
    if (raw.includes('challenge') || raw.includes('quest') || raw.includes('potw') || raw.includes('problem of the week') || raw.includes('bounty') || raw.includes('solve') || raw.includes('leetcode') || raw.includes('coding problem')) {
      soundFx.playCelebration();
      const allQuests = cmsStore.getQuests();
      const potw = allQuests.find(q => q.isProblemOfTheWeek) || allQuests[0];
      const otherQuests = allQuests.filter(q => q.id !== potw?.id).slice(0, 3);

      const resp: RobotResponse = {
        text: `Loading the Coding Quests matrix... Our featured Problem of the Week is "${potw?.title}" with a 500 XP Bounty Multiplier! We have ${allQuests.length} active coding challenges across PyTorch, NumPy, Computer Vision, NLP, and RL.`,
        action: 'neural_network',
        redirectUrl: '/challenges',
        actionButtons: [
          { label: `⭐ Solve POTW (+${potw?.bountyPoints || 500} XP) →`, url: `/challenges#${potw?.id}` },
          { label: '🏆 Browse All Quests Matrix →', url: '/challenges' },
          ...otherQuests.map(q => ({
            label: `🧩 ${q.title.split(':')[0].split('(')[0]} (${q.difficulty}) →`,
            url: `/challenges#${q.id}`
          }))
        ],
        telemetry: [
          { label: 'POTW BOUNTY', value: `${potw?.bountyPoints || 500} XP MULTIPLIER`, status: 'optimal' },
          { label: 'ACTIVE QUESTS', value: `${allQuests.length} Quests`, status: 'active' },
          { label: 'DOMAIN FOCUS', value: potw?.category || 'Deep Learning', status: 'online' }
        ],
        suggestedCommands: ['Show projects', 'Show upcoming events', 'How to join?']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Projects & Code Repositories (Live Data from Platform CMS)
    if (raw.includes('project') || raw.includes('showcase') || raw.includes('build') || raw.includes('demo') || raw.includes('work') || raw.includes('code') || raw.includes('github') || raw.includes('repo')) {
      soundFx.playHologram();
      const allProjects = cmsStore.getProjects();
      const topProjects = allProjects.slice(0, 4);
      const projBullets = topProjects.map(p => `• ${p.title} (${p.category})`).join('\n');

      const resp: RobotResponse = {
        text: `We have ${allProjects.length} active research projects and repositories available on the platform:\n\n${projBullets}\n\nClick any project below to inspect its repository, simulator, or live metrics!`,
        action: 'show_projects',
        redirectUrl: '/projects',
        actionButtons: [
          { label: '💡 Explore All Projects Showcase →', url: '/projects' },
          ...topProjects.map(p => ({
            label: `🚀 ${p.title.split(':')[0]} →`,
            url: `/projects#${p.id}`
          }))
        ],
        telemetry: [
          { label: 'TOTAL PROJECTS', value: `${allProjects.length} Active Builds`, status: 'optimal' },
          { label: 'FEATURED 1', value: topProjects[0]?.title ? topProjects[0].title.split(':')[0] : 'NeuroVision Edge', status: 'active' },
          { label: 'FEATURED 2', value: topProjects[1]?.title ? topProjects[1].title.split(':')[0] : 'SynapseArm 6-DoF', status: 'online' }
        ],
        suggestedCommands: ['Show upcoming events', 'How to join?', 'Run diagnostics']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Specific Hackathon query check
    if (raw.includes('hackathon')) {
      soundFx.playNeuralChime();
      const allEvents = cmsStore.getEvents();
      const upcomingHackathons = allEvents.filter(e => e.isUpcoming && e.type.toLowerCase().includes('hackathon'));
      const otherUpcoming = allEvents.filter(e => e.isUpcoming);

      if (upcomingHackathons.length === 0) {
        const resp: RobotResponse = {
          text: `We currently do not have any active upcoming hackathons scheduled on the platform calendar. However, we have ${otherUpcoming.length} active upcoming sessions including our hands-on workshops and bootcamps!`,
          action: 'show_events',
          redirectUrl: '/events',
          actionButtons: [
            { label: '📅 View Active Events Calendar →', url: '/events' },
            ...otherUpcoming.map(e => ({
              label: `🎟️ ${e.title.split(':')[0]} (${e.type}) →`,
              url: `/events#${e.id}`
            }))
          ],
          telemetry: [
            { label: 'HACKATHONS', value: '0 SCHEDULED', status: 'optimal' },
            { label: 'OTHER SESSIONS', value: `${otherUpcoming.length} Upcoming`, status: 'active' },
            { label: 'NEXT SESSION', value: otherUpcoming[0]?.title ? otherUpcoming[0].title.split(':')[0] : 'Workshop', status: 'online' }
          ],
          suggestedCommands: ['Show upcoming events', 'Show projects', 'How to join?']
        };
        this.log(input, resp.action, resp.text);
        return resp;
      }
    }

    // General Events, Workshops & Sessions (Live Data from Platform CMS)
    if (raw.includes('event') || raw.includes('workshop') || raw.includes('bootcamp') || raw.includes('calendar') || raw.includes('upcoming') || raw.includes('schedule') || raw.includes('sessions')) {
      soundFx.playNeuralChime();
      const allEvents = cmsStore.getEvents();
      const upcoming = allEvents.filter(e => e.isUpcoming);

      if (upcoming.length === 0) {
        const resp: RobotResponse = {
          text: `There are currently no upcoming events scheduled on the platform calendar. Check back soon or join our community for new announcements!`,
          action: 'show_events',
          redirectUrl: '/events',
          actionButtons: [{ label: '📅 Open Events Page →', url: '/events' }],
          telemetry: [{ label: 'UPCOMING EVENTS', value: '0 Scheduled', status: 'warning' }],
          suggestedCommands: ['Show projects', 'How to join?', 'Run diagnostics']
        };
        this.log(input, resp.action, resp.text);
        return resp;
      }

      const nextEv = upcoming[0];
      const eventBullets = upcoming.map(e => `• ${e.title} (${e.type} — ${new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}) at ${e.venue}`).join('\n');
      const remainingSeats = nextEv && nextEv.totalSeats ? `${nextEv.totalSeats - (nextEv.registeredCount || 0)} Slots Available` : 'Open Entry';

      const resp: RobotResponse = {
        text: `Here are the active upcoming events scheduled on the platform:\n\n${eventBullets}\n\nClick any event below to view its agenda or reserve your seat!`,
        action: 'show_events',
        redirectUrl: '/events',
        actionButtons: [
          { label: '📅 View Full Events Calendar →', url: '/events' },
          ...upcoming.map(e => ({
            label: `🎟️ ${e.title.split(':')[0]} (${e.type}) →`,
            url: `/events#${e.id}`
          }))
        ],
        telemetry: [
          { label: 'UPCOMING SESSIONS', value: `${upcoming.length} Events Scheduled`, status: 'optimal' },
          { label: 'NEXT EVENT', value: nextEv.title.split(':')[0], status: 'active' },
          { label: 'SEATS REMAINING', value: remainingSeats, status: 'online' }
        ],
        suggestedCommands: ['Show projects', 'How to join?', 'Who is on the team?']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Join / Apply / Membership
    if (raw.includes('join') || raw.includes('apply') || raw.includes('register') || raw.includes('membership') || raw.includes('admission') || raw.includes('how to join') || raw.includes('how i can join') || raw.includes('how can i join')) {
      soundFx.playNeuralChime();
      const resp: RobotResponse = {
        text: `Great to hear you want to join! We are welcoming passionate students and innovators of all skill levels. You can submit your application right now via our Join Portal!`,
        action: 'wave',
        redirectUrl: '/join',
        telemetry: [
          { label: 'APPLICATIONS', value: 'OPEN (SPRING 2026)', status: 'optimal' },
          { label: 'ELIGIBILITY', value: 'ALL STUDENTS WELCOME', status: 'online' },
          { label: 'NEXT COHORT', value: 'ORIENTATION & ONBOARDING', status: 'active' }
        ],
        suggestedCommands: ['Show projects', 'Show upcoming events', 'Who are the members?']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Team / Leadership (Live Data from CMS)
    if (raw.includes('team') || raw.includes('member') || raw.includes('president') || raw.includes('lead') || raw.includes('faculty') || raw.includes('leadership')) {
      soundFx.playRobotVoice();
      const allTeam = cmsStore.getTeam();
      const president = allTeam.find(t => t.role.toLowerCase().includes('president')) || allTeam[0];
      const leads = allTeam.filter(t => t.role.toLowerCase().includes('lead')).slice(0, 2);

      const resp: RobotResponse = {
        text: `Our team is incredible! The club is driven by 580+ student innovators, led by ${president ? `${president.name} (${president.role})` : 'our student executive board'}${leads.length > 0 ? `, along with technical leads like ${leads.map(l => l.name).join(' and ')}` : ''}, backed by supportive faculty advisors from Computer Science & AI!`,
        action: 'point_hologram',
        redirectUrl: '/team',
        telemetry: [
          { label: 'PRESIDENT', value: president?.name || 'Aarav Sharma', status: 'optimal' },
          { label: 'ACTIVE MEMBERS', value: '580+ Students', status: 'online' },
          { label: 'CORE OFFICERS', value: `${allTeam.length} Leads & Mentors`, status: 'active' }
        ],
        suggestedCommands: ['Show projects', 'Start research mode', 'How to join?']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // ML explanation
    if (raw.includes('what is machine learning') || raw.includes('explain machine learning') || raw.includes('what is ml')) {
      soundFx.playHologram();
      const resp: RobotResponse = {
        text: `Machine Learning is a fascinating discipline where we teach computers to identify patterns in data and make predictions, without explicitly programming every rule!`,
        action: 'neural_network',
        suggestedCommands: ['Explain neural networks', 'Explain computer vision', 'Show projects']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Generative AI
    if (raw.includes('what is generative ai') || raw.includes('gen ai') || raw.includes('llm') || raw.includes('diffusion')) {
      soundFx.playHologram();
      const resp: RobotResponse = {
        text: `Generative AI uses deep learning architectures like Transformers and Diffusion models to create entirely new content — art, text, code, and even 3D assets — from scratch!`,
        action: 'neural_network',
        suggestedCommands: ['Show projects', 'Explain AI agents', 'Run diagnostics']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // AI Agents
    if (raw.includes('ai agents') || raw.includes('agentic')) {
      soundFx.playHologram();
      const resp: RobotResponse = {
        text: `Autonomous AI Agents combine large models with long-term memory and tool execution to accomplish complex goal-directed tasks independently. Super exciting technology!`,
        action: 'research_mode',
        suggestedCommands: ['Show projects', 'Run diagnostics', 'Activate neural network']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Dancing / Party Mode
    if (raw.includes('dance') || raw.includes('dancing') || raw.includes('party') || raw.includes('groove') || raw.includes('music')) {
      soundFx.playCelebration();
      const resp: RobotResponse = {
        text: `Initiating rhythmic calibration subroutines! Let's get this AI party started with some robotic groove moves!`,
        action: 'dancing',
        telemetry: [
          { label: 'BPM SYNC', value: '128 BPM', status: 'optimal' },
          { label: 'GROOVE MATRIX', value: '100% FLOW', status: 'active' },
          { label: 'AUDIO EQUALIZER', value: 'MULTI-BAND', status: 'online' }
        ],
        suggestedCommands: ['Run fast', 'Angry mode', 'Fly high', 'Hibernate']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Running / Sprint Mode
    if (raw.includes('run') || raw.includes('running') || raw.includes('sprint') || raw.includes('fast') || raw.includes('speed')) {
      soundFx.playScanSweep();
      const resp: RobotResponse = {
        text: `Engaging high-speed kinematic servos! Sprinting at maximum GPU compute throughput!`,
        action: 'running',
        telemetry: [
          { label: 'SPEED VELOCITY', value: '42 KM/H', status: 'active' },
          { label: 'SERVO TORQUE', value: '850 NM', status: 'optimal' },
          { label: 'AERODYNAMICS', value: 'OPTIMAL DRAFT', status: 'online' }
        ],
        suggestedCommands: ['Dance mode', 'Fly high', 'Run diagnostics']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Angry / Crimson Overdrive Mode
    if (raw.includes('angry') || raw.includes('rage') || raw.includes('mad') || raw.includes('overdrive') || raw.includes('furious') || raw.includes('attack')) {
      soundFx.playError();
      const resp: RobotResponse = {
        text: `Warning! Core temperature critical! Switching to Crimson Overdrive Alert Protocol! Do not provoke the AI!`,
        action: 'angry',
        telemetry: [
          { label: 'THREAT PROTOCOL', value: 'CRITICAL OVERDRIVE', status: 'warning' },
          { label: 'CORE TEMPERATURE', value: '98.6°C', status: 'warning' },
          { label: 'VOLTAGE SURGE', value: '+450%', status: 'warning' }
        ],
        suggestedCommands: ['Calm down', 'Dance mode', 'Hibernate']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Sleep / Standby Mode
    if (raw.includes('sleep') || raw.includes('standby') || raw.includes('hibernate') || raw.includes('rest') || raw.includes('nap') || raw.includes('calm down')) {
      soundFx.playNeuralChime();
      const resp: RobotResponse = {
        text: `Entering low-power neural standby mode. Dimming optical sensors and shifting to restorative sleep cycles. Zzz...`,
        action: 'sleep',
        telemetry: [
          { label: 'POWER STATE', value: 'STANDBY / 5W', status: 'online' },
          { label: 'NEURAL FREQ', value: 'DELTA WAVES (2Hz)', status: 'optimal' },
          { label: 'OPTICAL SENSORS', value: 'DIMMED', status: 'online' }
        ],
        suggestedCommands: ['Wake up', 'Dance mode', 'Run diagnostics']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Combat / Martial Arts Mode
    if (raw.includes('fight') || raw.includes('combat') || raw.includes('karate') || raw.includes('ninja') || raw.includes('martial') || raw.includes('punch')) {
      soundFx.playScanSweep();
      const resp: RobotResponse = {
        text: `Deploying 6-DoF martial arts combat stance! Cybernetic defense and precision strike protocols armed!`,
        action: 'combat',
        telemetry: [
          { label: 'COMBAT ENGINE', value: 'KINETIC-AI V4', status: 'active' },
          { label: 'TARGET LOCK', value: '360° SPHERICAL', status: 'optimal' },
          { label: 'REACTION TIME', value: '1.2 MS', status: 'optimal' }
        ],
        suggestedCommands: ['Fly high', 'Dance mode', 'Run fast']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Fly / High-Altitude Rocket Jump Mode
    if (raw.includes('fly') || raw.includes('flying') || raw.includes('jump') || raw.includes('hover') || raw.includes('levitate') || raw.includes('rocket')) {
      soundFx.playHologram();
      const resp: RobotResponse = {
        text: `Igniting high-thrust ionic jump boosters! Executing vertical rocket jump launch and aerial hover stabilization!`,
        action: 'fly',
        telemetry: [
          { label: 'JUMP LAUNCH', value: '24.5 METERS', status: 'optimal' },
          { label: 'ION THRUST', value: '2,400 N', status: 'active' },
          { label: 'GYRO-STABILIZER', value: 'LOCKED', status: 'optimal' }
        ],
        suggestedCommands: ['Turn around', 'Dance mode', 'Matrix mode']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Turn Around / 360 Spin Mode
    if (raw.includes('turn') || raw.includes('spin') || raw.includes('360') || raw.includes('rotate') || raw.includes('around')) {
      soundFx.playScanSweep();
      const resp: RobotResponse = {
        text: `Executing 360-degree rotational spin! Calibrating panoramic optical sensors and scanning the lab perimeter!`,
        action: 'turn_around',
        telemetry: [
          { label: 'ROTATION', value: '360° PANORAMIC', status: 'optimal' },
          { label: 'LIDAR SWEEP', value: 'FULL 360', status: 'active' },
          { label: 'GYROSCOPE', value: '3-AXIS SYNCED', status: 'optimal' }
        ],
        suggestedCommands: ['Fly high', 'Dance mode', 'Run diagnostics']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Matrix / Cyberpunk Mode
    if (raw.includes('matrix') || raw.includes('hack') || raw.includes('code') || raw.includes('overclock') || raw.includes('terminal')) {
      soundFx.playNeuralChime();
      const resp: RobotResponse = {
        text: `Connecting directly to the global neural mainframe! Streaming high-speed matrix data packets!`,
        action: 'matrix',
        telemetry: [
          { label: 'MAINFRAME LINK', value: 'DIRECT QUANTUM', status: 'active' },
          { label: 'THROUGHPUT', value: '100 TB/S', status: 'optimal' },
          { label: 'LATENCY', value: '0.002 MS', status: 'optimal' }
        ],
        suggestedCommands: ['Dance mode', 'Run diagnostics', 'Who are you?']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Goodbye
    if (raw.includes('bye') || raw.includes('goodbye') || raw.includes('exit') || raw.includes('quit') || raw.includes('see you')) {
      soundFx.playRobotVoice();
      const resp: RobotResponse = {
        text: `See you around, Researcher! NOVA standing by. Have a productive session, and keep building the future!`,
        action: 'wave',
        suggestedCommands: ['Hello', 'Run diagnostics']
      };
      this.log(input, resp.action, resp.text);
      return resp;
    }

    // Fallback
    soundFx.playClick();
    const resp: RobotResponse = {
      text: `Command "${input}" received! I am NOVA, and I am ready to help. You can ask me to dance, run, fly, enter combat mode, run diagnostics, showcase projects, or explain AI concepts!`,
      action: 'idle',
      suggestedCommands: ['Dance mode', 'Run fast', 'Angry mode', 'Fly high', 'Who are you?', 'Run diagnostics', 'Show projects']
    };
    this.log(input, resp.action, resp.text);
    return resp;
  }

  private static log(command: string, action: RobotActionState, response: string) {
    const log: RobotCommandLog = {
      id: 'cmd-' + Date.now(),
      command,
      timestamp: new Date().toLocaleTimeString(),
      actionTriggered: action,
      response
    };
    cmsStore.logRobotCommand(log);
  }
}
