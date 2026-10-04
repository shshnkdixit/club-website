'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ArrowLeft, 
  Cpu, 
  FileText, 
  Terminal,
  ShieldAlert,
  Zap,
  Lock,
  Bell,
  Calendar,
  Users,
  Code2,
  Check
} from 'lucide-react';
import { Github, Linkedin } from '@/components/common/Icons';
import { AIDomainId, JoinApplication, ClubMember } from '@/types';
import { cmsStore, useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

export default function JoinPage() {
  const { domains, joinConfig } = useCMSData();
  const [formData, setFormData] = useState({
    name: '',
    uid: '',
    email: '',
    phone: '',
    program: 'B.Tech Computer Science & AI',
    year: joinConfig?.academicYears?.[0] || '1st Year (Freshman)',
    department: joinConfig?.departments?.[0] || 'Computer Science & Engineering (CSE)',
    skills: '',
    aiInterests: [] as AIDomainId[],
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    statementOfPurpose: ''
  });

  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<JoinApplication | null>(null);

  // Closed admissions email notification state
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notified, setNotified] = useState(false);

  const toggleInterest = (id: AIDomainId) => {
    soundFx.playClick();
    setFormData(prev => ({
      ...prev,
      aiInterests: prev.aiInterests.includes(id)
        ? prev.aiInterests.filter(item => item !== id)
        : [...prev.aiInterests, id]
    }));
  };

  const handleCustomFieldChange = (fieldId: string, value: string) => {
    setCustomAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail.trim()) return;
    soundFx.playCelebration();
    setNotified(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    soundFx.playClick();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedMemberNumber = Math.floor(1000 + Math.random() * 9000);
      const appId = `AIML-2026-${generatedMemberNumber}`;
      const studentUid = formData.uid.trim() || `26${(formData.department || 'CSE').slice(0, 3).toUpperCase()}${generatedMemberNumber}`;

      const newApp: JoinApplication = {
        id: 'app-' + Date.now(),
        applicationId: appId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        program: formData.program,
        year: formData.year,
        department: formData.department,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : ['Python', 'AI Foundations'],
        aiInterests: formData.aiInterests,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        portfolioUrl: formData.portfolioUrl,
        statementOfPurpose: formData.statementOfPurpose || Object.entries(customAnswers).map(([k, v]) => `${k}: ${v}`).join('\n') || 'Passionate about Artificial Intelligence & Machine Learning.',
        submittedAt: new Date().toISOString(),
        status: 'Accepted'
      };

      // Also register student directly into the Member Directory!
      const newMember: ClubMember = {
        id: 'mem-' + Date.now(),
        memberId: appId,
        name: formData.name,
        uid: studentUid.toUpperCase(),
        email: formData.email,
        phone: formData.phone || '+1 (555) 000-0000',
        department: formData.department,
        year: formData.year,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : ['Python', 'Machine Learning'],
        joinedDate: new Date().toISOString().split('T')[0],
        role: 'Student Builder',
        status: 'Active',
        githubUrl: formData.githubUrl
      };

      cmsStore.addApplication(newApp);
      cmsStore.saveMember(newMember);
      setSubmittedApp(newApp);
      setIsSubmitting(false);
      soundFx.playNeuralChime();

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00CFFF', '#6C63FF', '#00F5D4', '#9B5CFF']
        });
      } catch {
        // ignore
      }
    }, 1000);
  };

  const isAdmissionsOpen = joinConfig?.admissionsOpen !== false;

  return (
    <div className="relative min-h-screen bg-transparent text-white pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 font-mono">
      {/* Background Ambience */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-600/10 blur-[170px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Top Control Bar */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => soundFx.playClick()}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Lab</span>
          </Link>

          <span className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1 rounded-full border ${
            isAdmissionsOpen 
              ? 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40' 
              : 'text-rose-300 bg-rose-950/60 border-rose-500/40'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              isAdmissionsOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
            }`} />
            {isAdmissionsOpen ? 'COHORT ENROLLMENT ACTIVE' : 'ADMISSIONS CURRENTLY PAUSED'}
          </span>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* CASE A: ADMISSIONS ARE STOPPED (FORM IS NOT VISIBLE) */}
        {/* ────────────────────────────────────────────────────────── */}
        {!isAdmissionsOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Admissions Closed Cyberpunk Hero Card */}
            <div className="p-8 sm:p-12 rounded-3xl bg-[#0a0a0a]/95 backdrop-blur-2xl border-2 border-rose-500/40 shadow-[0_0_60px_rgba(244,63,94,0.2)] text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-rose-500/20 border-2 border-rose-400 mx-auto flex items-center justify-center shadow-[0_0_35px_rgba(244,63,94,0.4)]">
                <Lock className="w-10 h-10 text-rose-400 animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950 border border-rose-500/40 text-[11px] text-rose-300 font-bold">
                  <span>● RECRUITMENT GATE OFFLINE // INTAKE CLOSED</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                  MEMBERSHIP ADMISSIONS ARE CLOSED
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm font-sans max-w-xl mx-auto leading-relaxed">
                  Thank you for your enthusiasm to join the AI/ML Club. The application window for the current intake cycle is currently paused.
                </p>
              </div>

              {/* Custom Administrator Closure Notice */}
              <div className="max-w-2xl mx-auto p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-rose-500/30 text-left space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  <span>OFFICIAL ADMISSIONS DESK DISPATCH</span>
                </div>
                <p className="text-slate-200 text-xs sm:text-sm font-sans leading-relaxed">
                  {joinConfig?.closureNotice || 'Applications for the current cohort are currently closed. The upcoming intake window will open in the next academic cycle.'}
                </p>
                {joinConfig?.nextCohortDate && (
                  <div className="pt-2 flex items-center gap-2 text-xs font-mono text-cyan-300 border-t border-slate-800">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Next Anticipated Window: <strong>{joinConfig.nextCohortDate}</strong></span>
                  </div>
                )}
              </div>

              {/* Get Notified Form */}
              <div className="max-w-md mx-auto pt-2">
                {!notified ? (
                  <form onSubmit={handleNotifySubmit} className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 block text-center">
                      Get Notified When Next Window Opens
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        required
                        value={notifyEmail}
                        onChange={e => setNotifyEmail(e.target.value)}
                        placeholder="Enter your campus email..."
                        className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-[0_0_15px_rgba(0,207,255,0.4)] flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Notify Me</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2 font-bold animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Telemetry saved! We will notify ({notifyEmail}) when admissions open.</span>
                  </div>
                )}
              </div>

              {/* Alternative CTAs */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-3 border-t border-slate-800/80">
                <Link
                  href="/projects"
                  onClick={() => soundFx.playClick()}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Explore AI Projects</span>
                </Link>
                <Link
                  href="/research"
                  onClick={() => soundFx.playClick()}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-violet-400" />
                  <span>Read Research Papers</span>
                </Link>
                <Link
                  href="/team"
                  onClick={() => soundFx.playClick()}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Meet Team Leadership</span>
                </Link>
              </div>
            </div>

            {/* Membership Perks Preview */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#070A18] border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>What Members Receive When Intake Resumes</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(joinConfig?.membershipPerks || [
                  'Access to High-Performance Cloud GPU Clusters (H100/A100)',
                  'Direct 1-on-1 Mentorship from Faculty and Industry AI Researchers',
                  'Fully Sponsored Registrations for Hackathons & AI Conferences',
                  'Exclusive Invitation to Private Networking Dinners with Tech Founders',
                  'Official Club GitHub Organization & Research Fellowship Badging'
                ]).map((perk, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ────────────────────────────────────────────────────────── */
          /* CASE B: ADMISSIONS ARE OPEN (FULLY CUSTOMIZABLE FORM) */
          /* ────────────────────────────────────────────────────────── */
          <AnimatePresence mode="wait">
            {!submittedApp ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 sm:p-10 rounded-3xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,207,255,0.15)]"
              >
                {/* Customizable Form Header */}
                <div className="border-b border-cyan-500/20 pb-6 mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-300 mb-3">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{joinConfig?.portalBadge || 'MEMBERSHIP RECRUITMENT PORTAL'}</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                    {joinConfig?.formTitle || 'APPLY TO JOIN THE AI/ML CLUB'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 font-sans mt-2 leading-relaxed">
                    {joinConfig?.formSubtitle || 'Fill out your technical background, select your AI interest tracks, and submit your research statement. Applications are reviewed on a rolling basis.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-slate-300 block mb-1 font-bold">
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1 font-bold">
                        Student UID / Roll No. <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 24BCS10245"
                        value={formData.uid}
                        onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                        className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1 font-bold">
                        University Email <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex.m@university.edu"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>

                  {/* Academic Department & Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-300 block mb-1 font-bold">Academic Department / Engineering Stream *</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                      >
                        {(joinConfig?.departments || [
                          'Computer Science & Engineering (CSE)',
                          'Artificial Intelligence & Machine Learning (AI & ML)',
                          'Data Science & Analytics',
                          'Robotics & Automation',
                          'Electronics & Communication Engineering (ECE)'
                        ]).map((dept, i) => (
                          <option key={i} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1 font-bold">Academic Standing / Year *</label>
                      <select
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                      >
                        {(joinConfig?.academicYears || [
                          '1st Year (Freshman)',
                          '2nd Year (Sophomore)',
                          '3rd Year (Junior)',
                          '4th Year (Senior)',
                          'Postgraduate / Masters',
                          'PhD Scholar'
                        ]).map((yr, i) => (
                          <option key={i} value={yr}>{yr}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Optional Phone Field */}
                  {joinConfig?.showPhoneField !== false && (
                    <div>
                      <label className="text-slate-300 block mb-1 font-bold">Contact Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 019-2834"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  )}

                  {/* AI Interests (Multi-select pills) */}
                  {joinConfig?.showDomainInterests !== false && (
                    <div>
                      <label className="text-slate-300 block mb-2 font-bold">
                        Select Your AI Research & Project Tracks (Select all that apply)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {domains.map(d => {
                          const isSelected = formData.aiInterests.includes(d.id);
                          return (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => toggleInterest(d.id)}
                              className={`p-2.5 rounded-xl border text-left font-mono transition-all flex items-center justify-between text-xs cursor-pointer ${
                                isSelected
                                  ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-[0_0_12px_rgba(0,207,255,0.3)]'
                                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <span className="truncate pr-1">{d.name}</span>
                              {isSelected ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              ) : (
                                <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Skills & Portfolio Links */}
                  {joinConfig?.showSocialLinks !== false && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-slate-300 block mb-1 font-bold">GitHub Profile URL</label>
                        <div className="relative">
                          <Github className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="url"
                            placeholder="https://github.com/username"
                            value={formData.githubUrl}
                            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1 font-bold">LinkedIn URL</label>
                        <div className="relative">
                          <Linkedin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="url"
                            placeholder="https://linkedin.com/in/username"
                            value={formData.linkedinUrl}
                            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-mono"
                          />
                        </div>
                      </div>

                      {joinConfig?.showPortfolioField !== false && (
                        <div>
                          <label className="text-slate-300 block mb-1 font-bold">Resume / Portfolio Link</label>
                          <div className="relative">
                            <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="url"
                              placeholder="https://myportfolio.dev"
                              value={formData.portfolioUrl}
                              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-mono"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Skills Text */}
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">
                      Key Technical Skills & Frameworks (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="Python, PyTorch, ROS2, OpenCV, Docker, C++, Transformers"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  {/* Statement of Purpose */}
                  {joinConfig?.showStatementOfPurpose !== false && (
                    <div>
                      <label className="text-slate-300 block mb-1 font-bold">
                        {joinConfig?.sopPrompt || 'Statement of Purpose / Why do you want to join?'} <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Describe your passion for artificial intelligence, any past projects or papers you've built, and what you hope to achieve as an AI/ML Club researcher..."
                        value={formData.statementOfPurpose}
                        onChange={(e) => setFormData({ ...formData, statementOfPurpose: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-4 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-sans text-sm leading-relaxed"
                      />
                    </div>
                  )}

                  {/* Dynamic Custom Administrator Fields */}
                  {(joinConfig?.customFields || []).map((field) => (
                    <div key={field.id} className="space-y-1">
                      <label className="text-slate-300 block mb-1 font-bold">
                        {field.label} {field.required && <span className="text-rose-400">*</span>}
                      </label>

                      {field.type === 'textarea' ? (
                        <textarea
                          rows={3}
                          required={field.required}
                          placeholder={field.placeholder || ''}
                          value={customAnswers[field.id] || ''}
                          onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-sans text-xs"
                        />
                      ) : field.type === 'select' ? (
                        <select
                          required={field.required}
                          value={customAnswers[field.id] || ''}
                          onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                        >
                          <option value="">{field.placeholder || 'Select an option...'}</option>
                          {(field.options || []).map((opt, idx) => (
                            <option key={idx} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
                          required={field.required}
                          placeholder={field.placeholder || ''}
                          value={customAnswers[field.id] || ''}
                          onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                          className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      )}

                      {field.helperText && (
                        <p className="text-[10px] text-slate-500 italic mt-0.5">{field.helperText}</p>
                      )}
                    </div>
                  ))}

                  {/* Submit Action */}
                  <div className="pt-4 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-slate-400">
                      🔒 Data is encrypted and transmitted directly to the Club Academic Review Board.
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-mono text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 disabled:opacity-50 shadow-[0_0_25px_rgba(0,207,255,0.4)] flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Zap className="w-4 h-4 animate-spin" />
                          <span>TRANSMITTING TELEMETRY...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{joinConfig?.submitButtonText || 'SUBMIT APPLICATION & ENROLL'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              /* Futuristic Confirmation HUD */
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 sm:p-12 rounded-3xl bg-[#0a0a0a]/95 backdrop-blur-2xl border border-cyan-400 shadow-[0_0_60px_rgba(0,207,255,0.3)] text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 border-2 border-cyan-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(0,207,255,0.5)]">
                  <CheckCircle2 className="w-10 h-10 text-cyan-400 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                    TRANSMISSION CONFIRMED // APPLICATION LOGGED
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                    {joinConfig?.successTitle || `WELCOME TO THE QUEUE, ${submittedApp.name.toUpperCase()}`}
                  </h2>
                  <p className="text-slate-300 text-sm font-sans max-w-md mx-auto leading-relaxed">
                    {joinConfig?.successMessage || `Your application has been received and approved. You are now officially enrolled in the AI/ML Club Directory.`}
                  </p>
                </div>

                {/* Digital Member ID Card Badge */}
                <div className="max-w-md mx-auto p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/40 text-left space-y-3 shadow-[0_0_25px_rgba(0,207,255,0.15)]">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                    <span className="text-[10px] text-cyan-400 font-bold">AI/ML CLUB APPLICANT PASS</span>
                    <span className="text-[10px] text-emerald-400 font-bold">STATUS: {submittedApp.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">APPLICANT ID:</span>
                    <span className="font-bold text-white">{submittedApp.applicationId}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">DEPARTMENT:</span>
                    <span className="text-slate-200">{submittedApp.department}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">RESEARCH TRACKS:</span>
                    <span className="text-cyan-300 font-bold">{submittedApp.aiInterests.length} Selected</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/ai-lab"
                    onClick={() => soundFx.playClick()}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <Cpu className="w-4 h-4" />
                    <span>Enter 3D AI Lab</span>
                  </Link>
                  <Link
                    href="/"
                    onClick={() => soundFx.playClick()}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 text-slate-200 hover:text-white transition-colors"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

