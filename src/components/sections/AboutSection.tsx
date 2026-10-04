'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FlaskConical, Hammer, FileCode, Rocket, Users, Briefcase, Award, Sparkles, ArrowRight } from 'lucide-react';
import { useCMSData } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';

export default function AboutSection() {
  const { settings } = useCMSData();
  const [activeStage, setActiveStage] = useState(0);

  const timelineStages = [
    {
      title: 'LEARN',
      subtitle: 'Foundations & Mathematical Intuition',
      desc: 'Master tensor mathematics, gradient calculus, backpropagation, and core machine learning paradigms through weekly peer-led workshops.',
      icon: BookOpen,
      color: '#00CFFF',
      skills: ['Linear Algebra', 'PyTorch Basics', 'Gradient Descent', 'Statistical Learning']
    },
    {
      title: 'EXPERIMENT',
      subtitle: 'Simulations & Model Prototyping',
      desc: 'Form study squads to reproduce landmark AI papers, test custom loss functions, and benchmark algorithms on compute clusters.',
      icon: FlaskConical,
      color: '#00F5D4',
      skills: ['Jupyter Workbenches', 'CUDA Optimization', 'Hyperparameter Tuning', 'WandB']
    },
    {
      title: 'BUILD',
      subtitle: 'Hardware & Edge Deployment',
      desc: 'Deploy deep vision models and kinematics control policies to NVIDIA Jetson edge micro-controllers and robotic platforms.',
      icon: Hammer,
      color: '#6C63FF',
      skills: ['ROS2 Humble', 'TensorRT', 'Embedded C++', 'Micro-Sensors']
    },
    {
      title: 'RESEARCH',
      subtitle: 'Peer-Reviewed Scholarly Inquiry',
      desc: 'Collaborate with faculty mentors to author and publish novel findings in CVPR, ICRA, and NeurIPS student workshops.',
      icon: FileCode,
      color: '#9B5CFF',
      skills: ['Paper Writing', 'LaTeX', 'Ablation Studies', 'Reproducibility']
    },
    {
      title: 'INNOVATE',
      subtitle: 'Hackathons & Startup Incubators',
      desc: 'Compete in national 36-hour hackathons, win cash grants, and spin off autonomous AI venture prototypes.',
      icon: Rocket,
      color: '#EC4899',
      skills: ['Venture Pitching', 'Multi-Agent Swarms', 'Production APIS', 'Scalability']
    }
  ];

  return (
    <section id="about" className="relative py-24 sm:py-32 bg-transparent overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 cyber-dots-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-violet-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>COMMUNITY DNA & METHODOLOGY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            WHERE CURIOSITY BECOMES{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              INTELLIGENCE
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
            The AI/ML Club is a student-driven technology and research community focused on learning, experimentation, cutting-edge hardware prototyping, and scientific innovation in artificial intelligence.
          </p>
        </div>

        {/* Dynamic Animated Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {[
            { label: 'Active Members', value: `${settings.stats.members}+`, desc: 'Undergrad & Grad Innovators', icon: Users, color: 'border-cyan-500/30 text-cyan-400' },
            { label: 'Completed Projects', value: `${settings.stats.projects}+`, desc: 'Robotics, CV, and LLMs', icon: Briefcase, color: 'border-violet-500/30 text-violet-400' },
            { label: 'Workshops Hosted', value: `${settings.stats.workshops}+`, desc: 'Hands-on Technical Labs', icon: BookOpen, color: 'border-teal-500/30 text-teal-400' },
            { label: 'Hackathons Won', value: `${settings.stats.hackathons}+`, desc: 'National Accolades & Trophies', icon: Award, color: 'border-pink-500/30 text-pink-400' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-6 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-md border ${stat.color} shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(0,207,255,0.15)] transition-all font-mono group`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</span>
                  <Icon className="w-5 h-5 opacity-75 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {stat.value}
                </div>
                <p className="text-[11px] text-slate-400 font-sans">{stat.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive 3D Evolution Timeline: Learn -> Experiment -> Build -> Research -> Innovate */}
        <div className="rounded-3xl bg-[#070D1F]/90 border border-cyan-500/25 p-6 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/15 pb-6 mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-2">
                <span className="text-cyan-400">&gt;</span> THE STUDENT RESEARCH PIPELINE
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
                How our members progress from beginner coders to publishing AI researchers.
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-800/50 self-start md:self-auto">
              STAGE 0{activeStage + 1} OF 05
            </div>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-5 gap-2 mb-8">
            {timelineStages.map((stg, i) => {
              const isSelected = activeStage === i;
              return (
                <button
                  key={stg.title}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveStage(i);
                  }}
                  onMouseEnter={() => soundFx.playHover()}
                  className={`p-2.5 sm:p-4 rounded-xl border text-center font-mono transition-all flex flex-col items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,207,255,0.3)]'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[10px] sm:text-xs font-bold tracking-wider">
                    0{i + 1}. {stg.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detail Panel */}
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-slate-800"
          >
            <div className="lg:col-span-8 space-y-3 font-mono">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
                <span>STAGE 0{activeStage + 1}</span>
                <span>•</span>
                <span style={{ color: timelineStages[activeStage].color }}>
                  {timelineStages[activeStage].subtitle}
                </span>
              </div>

              <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                {timelineStages[activeStage].title}: {timelineStages[activeStage].subtitle}
              </h4>

              <p className="text-slate-300 text-sm font-sans leading-relaxed">
                {timelineStages[activeStage].desc}
              </p>

              {/* Skills Tags */}
              <div className="pt-2 flex flex-wrap gap-2">
                {timelineStages[activeStage].skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300"
                  >
                    #{skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(0,207,255,0.25)]"
                style={{ backgroundColor: `${timelineStages[activeStage].color}20`, border: `1px solid ${timelineStages[activeStage].color}` }}
              >
                {React.createElement(timelineStages[activeStage].icon, {
                  className: 'w-8 h-8',
                  style: { color: timelineStages[activeStage].color }
                })}
              </div>
              <span className="text-xs font-mono font-bold text-white mb-1">
                Phase Objective
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Verified milestones & portfolio contribution
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
