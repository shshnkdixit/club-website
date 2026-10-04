'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Bot,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  ArrowLeft,
  Terminal,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import Robot3DLab from '@/components/3d/Robot3DLab';
import { RobotEngine, RobotResponse } from '@/lib/robotEngine';
import { RobotActionState } from '@/types';
import { soundFx } from '@/lib/soundFx';
import { useCMSData } from '@/lib/cmsStore';

interface ChatHistoryItem {
  sender: 'user' | 'nova';
  text: string;
  telemetry?: RobotResponse['telemetry'];
  redirectUrl?: string;
  redirectLabel?: string;
  actionButtons?: RobotResponse['actionButtons'];
}

export default function AILabPage() {
  const { domains } = useCMSData();
  const [commandInput, setCommandInput] = useState('');
  const [robotAction, setRobotAction] = useState<RobotActionState>('idle');
  const [conversationHistory, setConversationHistory] = useState<ChatHistoryItem[]>([
    {
      sender: 'nova',
      text: 'NOVA Core initialized. I\'m your Neural Operations & Virtual Assistant — here to guide you through the AI/ML Club laboratory. Type a command or tap a quick trigger to begin!',
      telemetry: [
        { label: 'NOVA STATUS', value: 'ONLINE', status: 'online' },
        { label: 'AI CORE', value: 'ACTIVE', status: 'active' },
        { label: 'VISION MATRIX', value: '120 FPS', status: 'optimal' },
        { label: 'SPEECH ENGINE', value: 'SYNCED', status: 'online' }
      ]
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const actionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const MODE_DURATIONS: Record<string, number> = {
    turn_around: 9600,      // 3 full 360° panoramic spin revolutions
    fly: 10500,             // Extended aerial rocket jump & hover flight
    dancing: 12000,         // Extended cyber groove routine
    running: 10500,         // Extended high-velocity sprint
    angry: 9000,            // Extended crimson overdrive mode
    sleep: 12000,           // Extended deep regenerative sleep cycle
    combat: 10500,          // Extended 6-DoF martial arts fight routine
    matrix: 10500,          // Extended quantum overclock mode
    diagnostics: 13500,     // Full comprehensive system diagnostic sweep
    wave: 9000,             // Extended friendly multi-wave greeting
    welcome: 9000,          // Extended welcome presentation
    listening: 7500,        // Listening mode
    thinking: 7500,         // Deep neural reasoning mode
    processing: 7500,       // Neural tensor processing mode
    explaining: 13500,      // Lab walkthrough & explanation
    show_projects: 13500,   // Project demonstration
    show_events: 13500,     // Event calendar presentation
    neural_network: 13500,  // Neural topology analysis
    computer_vision: 13500, // Vision perception breakdown
    point_hologram: 13500,  // Holographic focus mode
    celebrate: 10500,       // Victory celebration
    success: 10500,         // Mission success routine
    error: 9000,            // Diagnostic error resolution
  };

  const triggerRobotAction = (action: RobotActionState, customDuration?: number) => {
    if (actionTimerRef.current) {
      clearTimeout(actionTimerRef.current);
      actionTimerRef.current = null;
    }
    setRobotAction(action);
    if (action !== 'idle') {
      const delay = customDuration || MODE_DURATIONS[action] || 10500;
      actionTimerRef.current = setTimeout(() => {
        setRobotAction('idle');
      }, delay);
    }
  };

  useEffect(() => {
    setIsMuted(soundFx.getMuted());

    // Pre-warm speech synthesis voices
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }

    // Initialize Web Speech API if supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setRobotAction('listening');
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setCommandInput(transcript);
          setIsListening(false);
          handleExecuteCommand(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
          setRobotAction('idle');
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch {
        setIsSpeechSupported(false);
      }
    } else {
      setIsSpeechSupported(false);
    }

    return () => {
      if (actionTimerRef.current) clearTimeout(actionTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  const handleExecuteCommand = (overrideText?: string) => {
    const userText = overrideText || commandInput;
    if (!userText.trim()) return;

    soundFx.playClick();
    setCommandInput('');
    setConversationHistory(prev => [...prev, { sender: 'user', text: userText }]);

    // Transition to "listening" briefly then process
    triggerRobotAction('listening', 400);

    setTimeout(() => {
      triggerRobotAction('thinking', 500);
    }, 400);

    setTimeout(() => {
      const response = RobotEngine.processCommand(userText);
      triggerRobotAction(response.action);
      RobotEngine.speak(response.text);

      const getLabel = (url?: string) => {
        if (!url) return undefined;
        if (url === '/join') return '🚀 Join the Club / Apply Now →';
        if (url === '/events') return '📅 View Upcoming Events Calendar →';
        if (url === '/projects') return '💡 Explore Club Projects Showcase →';
        if (url === '/team') return '👥 Meet Club Leadership & Team →';
        if (url === '/research') return '🔬 Open Research Lab →';
        if (url === '/#domains') return '🌐 Explore AI Domains →';
        return '🔗 Open Portal →';
      };

      setConversationHistory(prev => [
        ...prev,
        {
          sender: 'nova',
          text: response.text,
          telemetry: response.telemetry,
          redirectUrl: response.redirectUrl,
          redirectLabel: getLabel(response.redirectUrl),
          actionButtons: response.actionButtons
        }
      ]);
    }, 900);
  };

  const toggleMic = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        soundFx.playClick();
        recognitionRef.current.start();
        setIsListening(true);
        triggerRobotAction('listening');
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSelectHologram = (domainKey: string) => {
    soundFx.playHologram();
    triggerRobotAction('explaining', 5000);
    const domain = domains.find(d => d.id === domainKey);
    if (domain) {
      const speechText = `Focusing my sensors on ${domain.name}! ${domain.shortDesc}`;
      setConversationHistory(prev => [
        ...prev,
        {
          sender: 'nova',
          text: speechText,
          redirectUrl: `/#domains`,
          redirectLabel: `🌐 Explore ${domain.name} Domain →`,
          telemetry: [
            { label: 'DOMAIN', value: domain.name, status: 'active' },
            { label: 'ACTIVE PROJECTS', value: `${domain.activeProjectsCount}`, status: 'optimal' },
            { label: 'KEY TECH', value: domain.technologies.slice(0, 2).join(', '), status: 'online' }
          ]
        }
      ]);
      RobotEngine.speak(speechText);
    }
  };

  const handleSelectMode = (mode: RobotActionState, cmd: string) => {
    soundFx.playClick();
    triggerRobotAction(mode);

    const response = RobotEngine.processCommand(cmd);
    RobotEngine.speak(response.text);

    setConversationHistory(prev => [
      ...prev,
      {
        sender: 'user',
        text: cmd
      },
      {
        sender: 'nova',
        text: response.text,
        telemetry: response.telemetry,
        redirectUrl: response.redirectUrl,
        redirectLabel: response.redirectUrl === '/join' ? '🚀 Join the Club / Apply Now →' : undefined
      }
    ]);
  };

  const robotModes: { label: string; mode: RobotActionState; cmd: string; color: string }[] = [
    { label: '🔄 Turn 360°', mode: 'turn_around', cmd: 'Turn around', color: 'border-yellow-500/40 text-yellow-300 hover:bg-yellow-950/40 hover:border-yellow-400' },
    { label: '🚀 Fly & Jump', mode: 'fly', cmd: 'Fly high', color: 'border-sky-500/40 text-sky-300 hover:bg-sky-950/40 hover:border-sky-400' },
    { label: '🕺 Dance', mode: 'dancing', cmd: 'Dance mode', color: 'border-fuchsia-500/40 text-fuchsia-300 hover:bg-fuchsia-950/40 hover:border-fuchsia-400' },
    { label: '🏃 Sprint', mode: 'running', cmd: 'Run fast', color: 'border-amber-500/40 text-amber-300 hover:bg-amber-950/40 hover:border-amber-400' },
    { label: '😡 Angry', mode: 'angry', cmd: 'Angry mode', color: 'border-rose-500/40 text-rose-300 hover:bg-rose-950/40 hover:border-rose-400' },
    { label: '😴 Sleep', mode: 'sleep', cmd: 'Sleep mode', color: 'border-indigo-500/40 text-indigo-300 hover:bg-indigo-950/40 hover:border-indigo-400' },
    { label: '🥋 Combat', mode: 'combat', cmd: 'Combat mode', color: 'border-orange-500/40 text-orange-300 hover:bg-orange-950/40 hover:border-orange-400' },
    { label: '🧠 Matrix', mode: 'matrix', cmd: 'Matrix mode', color: 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40 hover:border-emerald-400' },
    { label: '⚡ Diagnostics', mode: 'diagnostics', cmd: 'Run diagnostics', color: 'border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 hover:border-cyan-400' },
    { label: '👋 Wave', mode: 'wave', cmd: 'Hello', color: 'border-teal-500/40 text-teal-300 hover:bg-teal-950/40 hover:border-teal-400' },
  ];

  const quickCommands = [
    { label: '🤖 Who is NOVA?', cmd: 'Who are you?' },
    { label: '🗺️ Roadmap', cmd: 'Show curriculum roadmap' },
    { label: '📚 Knowledge Vault', cmd: 'What study resources do you recommend?' },
    { label: '🧩 Quests & POTW', cmd: 'What is the coding challenge of the week?' },
    { label: '🚀 Show Projects', cmd: 'Show projects' },
    { label: '📅 Events', cmd: 'Show upcoming events' },
    { label: '✨ How to Join?', cmd: 'How can I join the club?' },
  ];

  return (
    <div className="relative min-h-screen lg:h-screen lg:max-h-screen bg-[#030712] text-white flex flex-col font-mono overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid-bg opacity-25 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-cyan-600/8 blur-[180px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 px-4 sm:px-8 py-2.5 border-b border-cyan-500/25 bg-[#070D1F]/92 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => soundFx.playClick()}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Lab</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold text-sm sm:text-base tracking-wider text-cyan-300">
              NOVA AI LAB
            </span>
            <span className="hidden md:inline text-[10px] text-slate-400 font-normal">// Neural Operations & Virtual Assistant</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-cyan-500/30 text-[11px]">
            <span className="text-slate-400">STATE:</span>
            <strong className="uppercase text-emerald-400">{robotAction}</strong>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const m = soundFx.toggleMute();
              setIsMuted(m);
            }}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 relative z-10 overflow-hidden min-h-0">
        {/* 3D Robot Stage */}
        <div className="lg:col-span-7 xl:col-span-8 relative flex flex-col justify-between p-3 sm:p-4 overflow-hidden">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] shrink-0">
            <span className="px-2 py-0.5 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-bold">
              NOVA // HUMANOID #01
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300">
              6-DoF ACTIVE
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
              AUTONOMOUS KINEMATICS
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-violet-950/60 border border-violet-500/30 text-violet-300 hidden sm:inline-flex">
              AI MODES: 10 ACTIVE
            </span>
          </div>

          {/* 3D Canvas */}
          <div className="flex-1 w-full relative flex items-center justify-center min-h-[300px] my-1">
            <Robot3DLab actionState={robotAction} onSelectHologram={handleSelectHologram} />
          </div>

          {/* Interactive Robot Modes & Action Triggers */}
          <div className="relative z-20 space-y-2 shrink-0 pt-1">
            {/* Robot Modes Palette */}
            <div>
              <span className="text-[10px] text-cyan-400/90 font-bold uppercase tracking-wider block mb-1">
                🤖 ROBOT MODES & BEHAVIORS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {robotModes.map(rm => {
                  const isActive = robotAction === rm.mode;
                  return (
                    <button
                      key={rm.label}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelectMode(rm.mode, rm.cmd);
                      }}
                      className={`px-2.5 py-1 rounded-xl bg-[#0a0a0a]/90 border text-[11px] font-bold transition-all shadow-[0_0_10px_rgba(0,0,0,0.4)] transform hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                        isActive
                          ? 'ring-2 ring-cyan-400 bg-cyan-950/80 ' + rm.color
                          : rm.color
                      }`}
                    >
                      {rm.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Queries */}
            <div className="hidden sm:block">
              <div className="flex flex-wrap gap-1.5">
                {quickCommands.map(qc => (
                  <button
                    key={qc.label}
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleExecuteCommand(qc.cmd); }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 text-[10px] font-medium transition-all cursor-pointer"
                  >
                    {qc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Panel */}
        <div className="lg:col-span-5 xl:col-span-4 border-t lg:border-t-0 lg:border-l border-cyan-500/20 bg-[#070D1F]/95 backdrop-blur-xl flex flex-col justify-between h-[380px] lg:h-full overflow-hidden">
          {/* Terminal Header */}
          <div className="p-2.5 border-b border-cyan-500/20 flex items-center justify-between bg-slate-900/60 shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
              <Terminal className="w-4 h-4" />
              <span>NOVA TERMINAL</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                soundFx.playClick();
                setConversationHistory([{
                  sender: 'nova',
                  text: 'Terminal cleared. NOVA ready for new instructions!',
                  telemetry: [{ label: 'STATUS', value: 'READY', status: 'optimal' }]
                }]);
              }}
              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              title="Clear Log"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Conversation Feed */}
          <div ref={chatContainerRef} className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs overscroll-contain">
            {conversationHistory.map((item, idx) => {
              const isUser = item.sender === 'user';
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-400 mb-0.5 flex items-center justify-between w-full max-w-[92%]">
                    {isUser ? (
                      <span>YOU [RESEARCHER]</span>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-cyan-400 font-bold flex items-center gap-1">
                          <Bot className="w-3 h-3" /> NOVA
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            soundFx.playClick();
                            setRobotAction('explaining');
                            const telSummary = item.telemetry && item.telemetry.length > 0
                              ? ' ' + item.telemetry.map(t => `${t.label}: ${t.value}`).join('. ')
                              : '';
                            RobotEngine.speak(item.text + telSummary, () => setRobotAction('explaining'), () => setRobotAction('idle'));
                          }}
                          className="text-[9px] text-cyan-400/80 hover:text-cyan-200 flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/25 transition-all cursor-pointer"
                          title="Read message and telemetry aloud"
                        >
                          <Volume2 className="w-2.5 h-2.5" /> Read Aloud
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={`p-3 rounded-2xl max-w-[92%] font-sans text-xs leading-relaxed border ${
                    isUser
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-100 rounded-tr-none'
                      : 'bg-slate-900/90 border-slate-700/80 text-slate-200 rounded-tl-none shadow-[0_0_12px_rgba(0,0,0,0.4)]'
                  }`}>
                    {item.text}

                    {item.telemetry && item.telemetry.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-700/80 font-mono text-[10px] space-y-0.5">
                        <span className="text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                          TELEMETRY:
                        </span>
                        {item.telemetry.map(tel => (
                          <div key={tel.label} className="flex items-center justify-between p-1 rounded bg-slate-950/80 border border-slate-800">
                            <span className="text-slate-400">{tel.label}:</span>
                            <strong className={
                              tel.status === 'warning' ? 'text-amber-400' :
                              tel.status === 'optimal' ? 'text-emerald-400' : 'text-cyan-300'
                            }>{tel.value}</strong>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Interactive Portal Links & Action Buttons */}
                    {item.actionButtons && item.actionButtons.length > 0 ? (
                      <div className="mt-3 pt-2.5 border-t border-cyan-500/25 flex flex-wrap gap-2">
                        {item.actionButtons.map((btn, bIdx) => (
                          <Link
                            key={bIdx}
                            href={btn.url}
                            onClick={() => soundFx.playClick()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/35 hover:to-blue-600/35 border border-cyan-400/50 hover:border-cyan-300 text-cyan-200 hover:text-white font-mono text-[11px] font-bold transition-all shadow-[0_0_10px_rgba(0,207,255,0.2)] hover:shadow-[0_0_18px_rgba(0,207,255,0.4)] transform hover:scale-[1.02] active:scale-95 group"
                          >
                            <span>{btn.label}</span>
                            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
                          </Link>
                        ))}
                      </div>
                    ) : item.redirectUrl ? (
                      <div className="mt-2.5 pt-2 border-t border-cyan-500/25">
                        <Link
                          href={item.redirectUrl}
                          onClick={() => soundFx.playClick()}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/25 to-blue-600/25 hover:from-cyan-500/40 hover:to-blue-600/40 border border-cyan-400/60 hover:border-cyan-300 text-cyan-200 hover:text-white font-mono text-[11px] font-bold transition-all shadow-[0_0_12px_rgba(0,207,255,0.25)] hover:shadow-[0_0_22px_rgba(0,207,255,0.5)] transform hover:scale-[1.02] active:scale-95 group"
                        >
                          <span>{item.redirectLabel || '🚀 Open Portal →'}</span>
                          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Input */}
          <div className="p-2.5 border-t border-cyan-500/20 bg-slate-950/90 shrink-0">
            <form
              onSubmit={(e) => { e.preventDefault(); handleExecuteCommand(); }}
              className="flex items-center gap-2"
            >
              {isSpeechSupported && (
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`p-2 rounded-xl border transition-all ${
                    isListening
                      ? 'bg-rose-500/30 border-rose-400 text-rose-300 animate-pulse'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-cyan-300'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder={isListening ? 'Listening...' : 'Ask NOVA anything...'}
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
              />

              <button
                type="submit"
                disabled={!commandInput.trim()}
                className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-bold transition-all shadow-[0_0_15px_rgba(0,207,255,0.4)] cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
