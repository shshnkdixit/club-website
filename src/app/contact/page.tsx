'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle2, ArrowLeft, Radio, MessageSquare, Phone, MapPin, Building2, Terminal } from 'lucide-react';
import { ContactMessage } from '@/types';
import { cmsStore } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    programOrCompany: '',
    purpose: 'Collaboration' as ContactMessage['purpose'],
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'transmitting' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    soundFx.playClick();
    setStatus('transmitting');

    setTimeout(() => {
      const msg: ContactMessage = {
        id: 'msg-' + Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        programOrCompany: formData.programOrCompany,
        purpose: formData.purpose,
        message: formData.message,
        submittedAt: new Date().toISOString(),
        read: false
      };

      cmsStore.addMessage(msg);
      setStatus('sent');
      soundFx.playNeuralChime();
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-transparent text-white pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 font-mono">
      {/* Background Ambience */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-600/10 blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => soundFx.playClick()}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Lab</span>
          </Link>

          <span className="text-xs text-cyan-400 font-bold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            TRANSMISSION FREQUENCY OPEN
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Col: Contact Info & Lab Coordinates */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#0a0a0a]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-300">
                <Terminal className="w-3.5 h-3.5" />
                <span>LABORATORY DISPATCH</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                CONNECT TO THE AI NETWORK
              </h2>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Whether you are an industry partner looking to sponsor compute clusters, a faculty researcher seeking collaborative pipelines, or a student inquiring about hackathons, our transmission lines are open.
              </p>

              <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>contact@aiml-club.university.edu</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Turing Hall, Room 402 (Robotics Wing)</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Building2 className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>Department of Computer Science & AI</span>
                </div>
              </div>
            </div>

            {/* Operating Status Box */}
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs space-y-1 text-slate-300">
              <span className="text-[10px] text-cyan-400 font-bold uppercase block">RESPONSE PROTOCOL</span>
              <p className="text-[11px] font-sans">
                Laboratory Coordinators respond to verified academic & industry inquiries within 24 hours.
              </p>
            </div>
          </div>

          {/* Right Col: Holographic Transmission Form */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {status !== 'sent' ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 sm:p-8 rounded-3xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_40px_rgba(0,207,255,0.15)]"
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>TRANSMISSION TERMINAL</span>
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="text-slate-300 block mb-1 font-bold">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. Elena Rostova / Student Lead"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 block mb-1 font-bold">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="name@organization.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 block mb-1 font-bold">Phone (Optional)</label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 012-3456"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 block mb-1 font-bold">Inquiry Purpose</label>
                        <select
                          value={formData.purpose}
                          onChange={(e) => setFormData({ ...formData, purpose: e.target.value as any })}
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
                        >
                          <option value="Collaboration">Research Collaboration</option>
                          <option value="Sponsorship">Compute / Lab Sponsorship</option>
                          <option value="Workshop">Guest Lecture / Workshop</option>
                          <option value="Join Club">Membership Inquiry</option>
                          <option value="General Inquiry">General Query</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1 font-bold">Affiliation / Program</label>
                        <input
                          type="text"
                          placeholder="e.g. NVIDIA Research / Stanford"
                          value={formData.programOrCompany}
                          onChange={(e) => setFormData({ ...formData, programOrCompany: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1 font-bold">Message *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Detail your inquiry or collaboration proposal..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'transmitting'}
                      className="w-full py-3 rounded-xl font-mono text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 disabled:opacity-50 shadow-[0_0_20px_rgba(0,207,255,0.4)] flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {status === 'transmitting' ? (
                        <>
                          <Radio className="w-4 h-4 animate-spin" />
                          <span>TRANSMISSION INITIATED...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>SEND DISPATCH</span>
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 sm:p-12 rounded-3xl bg-[#0a0a0a]/95 border border-cyan-400 text-center space-y-4 shadow-[0_0_50px_rgba(0,207,255,0.3)]"
                >
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">MESSAGE RECEIVED</h3>
                  <p className="text-slate-300 text-sm font-sans max-w-sm mx-auto">
                    Your transmission has been routed to the AI/ML Club Lead Coordinators.
                  </p>
                  <button
                    onClick={() => {
                      setStatus('idle');
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        programOrCompany: '',
                        purpose: 'Collaboration',
                        message: ''
                      });
                    }}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                  >
                    Send Another Transmission
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
