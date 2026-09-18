'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Scan, Cpu, Workflow, Play, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
import { soundFx } from '@/lib/soundFx';

export function CVSimulator() {
  const [threshold, setThreshold] = useState(0.85);
  const [fps, setFps] = useState(118);
  const [detectedObjects, setDetectedObjects] = useState([
    { id: 1, label: 'Person (Researcher)', score: 0.98, x: 22, y: 28, w: 32, h: 56, color: '#00CFFF' },
    { id: 2, label: 'NVIDIA Jetson Board', score: 0.96, x: 62, y: 48, w: 26, h: 36, color: '#00F5D4' },
    { id: 3, label: '6-DoF Robot Gripper', score: 0.91, x: 12, y: 15, w: 22, h: 24, color: '#9B5CFF' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.floor(116 + Math.random() * 6));
      // Subtle jitter to simulate live tracking
      setDetectedObjects(prev => prev.map(obj => ({
        ...obj,
        x: Math.max(5, Math.min(75, obj.x + (Math.random() - 0.5) * 1.5)),
        y: Math.max(5, Math.min(65, obj.y + (Math.random() - 0.5) * 1.5)),
        score: Math.min(0.99, Math.max(0.75, obj.score + (Math.random() - 0.5) * 0.02))
      })));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const visibleObjects = detectedObjects.filter(o => o.score >= threshold);

  return (
    <div className="bg-[#070D1F] border border-cyan-500/30 rounded-2xl p-4 font-mono text-xs text-slate-200">
      {/* HUD Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-bold text-cyan-300">NeuroVision YOLOv10-Edge Feed</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            {fps} FPS
          </span>
          <span className="text-cyan-400">LATENCY: 4.2ms</span>
        </div>
      </div>

      {/* Simulated Video Canvas */}
      <div className="relative aspect-video w-full rounded-xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center">
        {/* Background Grid & Scanline */}
        <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
        <div className="absolute inset-0 scanline pointer-events-none opacity-40" />

        {/* Ambient Camera Visual Simulation */}
        <div className="relative z-0 opacity-40 flex flex-col items-center">
          <Bot className="w-16 h-16 text-cyan-500/40 mb-2" />
          <span className="text-[10px] text-slate-400">AI LAB JETSON CAM #01 STREAM</span>
        </div>

        {/* Dynamic Bounding Boxes */}
        {visibleObjects.map(obj => (
          <motion.div
            key={obj.id}
            className="absolute rounded border-2 pointer-events-none transition-all duration-300"
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              width: `${obj.w}%`,
              height: `${obj.h}%`,
              borderColor: obj.color,
              backgroundColor: `${obj.color}15`,
              boxShadow: `0 0 12px ${obj.color}40`
            }}
          >
            {/* Box Header Tag */}
            <div
              className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-bold text-black flex items-center gap-1 whitespace-nowrap"
              style={{ backgroundColor: obj.color }}
            >
              <span>{obj.label}</span>
              <span>{(obj.score * 100).toFixed(0)}%</span>
            </div>

            {/* Corner Reticles */}
            <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-white" />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 border-white" />
            <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-2 border-l-2 border-white" />
            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-white" />
          </motion.div>
        ))}
      </div>

      {/* Interactive Controls */}
      <div className="mt-4 pt-3 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-400 shrink-0">Confidence Threshold:</span>
          <input
            type="range"
            min="0.70"
            max="0.95"
            step="0.01"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full sm:w-32 accent-cyan-400 cursor-pointer"
          />
          <span className="text-cyan-400 font-bold w-10 text-right">
            {(threshold * 100).toFixed(0)}%
          </span>
        </div>
        <div className="text-[10px] text-slate-400">
          Detected: <strong className="text-cyan-300">{visibleObjects.length}</strong> Objects
        </div>
      </div>
    </div>
  );
}

export function RoboticsArmSimulator() {
  const [baseAngle, setBaseAngle] = useState(45);
  const [shoulderAngle, setShoulderAngle] = useState(-30);
  const [elbowAngle, setElbowAngle] = useState(60);
  const [wristAngle, setWristAngle] = useState(15);
  const [gripperClosed, setGripperClosed] = useState(false);

  // Compute simulated forward kinematics end-effector coordinates
  const rad = (d: number) => (d * Math.PI) / 180;
  const l1 = 150, l2 = 120, l3 = 60;
  const x = Math.round(Math.cos(rad(baseAngle)) * (l1 * Math.cos(rad(shoulderAngle)) + l2 * Math.cos(rad(shoulderAngle + elbowAngle))));
  const y = Math.round(Math.sin(rad(baseAngle)) * (l1 * Math.cos(rad(shoulderAngle)) + l2 * Math.cos(rad(shoulderAngle + elbowAngle))));
  const z = Math.round(l1 * Math.sin(rad(shoulderAngle)) + l2 * Math.sin(rad(shoulderAngle + elbowAngle)) + l3 * Math.sin(rad(shoulderAngle + elbowAngle + wristAngle)));

  const handleReset = () => {
    soundFx.playClick();
    setBaseAngle(0);
    setShoulderAngle(0);
    setElbowAngle(45);
    setWristAngle(0);
    setGripperClosed(false);
  };

  return (
    <div className="bg-[#070D1F] border border-rose-500/30 rounded-2xl p-4 font-mono text-xs text-slate-200">
      <div className="flex items-center justify-between border-b border-rose-500/20 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-rose-400 animate-pulse" />
          <span className="font-bold text-rose-300">SynapseArm 6-DoF Kinematics Controller</span>
        </div>
        <button
          onClick={handleReset}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-[10px]"
        >
          <RefreshCw className="w-3 h-3" /> Reset Joints
        </button>
      </div>

      {/* 2D Kinematic Coordinate View */}
      <div className="relative h-44 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 cyber-grid-bg opacity-30" />
        
        {/* Visual Arm SVG representation */}
        <svg viewBox="0 0 400 200" className="w-full h-full">
          {/* Base */}
          <rect x="180" y="170" width="40" height="15" fill="#334155" rx="3" />
          <circle cx="200" cy="170" r="10" fill="#F43F5E" />
          
          {/* Shoulder -> Elbow */}
          <line
            x1="200"
            y1="170"
            x2={200 + Math.sin(rad(shoulderAngle)) * 70}
            y2={170 - Math.cos(rad(shoulderAngle)) * 70}
            stroke="#00CFFF"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle
            cx={200 + Math.sin(rad(shoulderAngle)) * 70}
            cy={170 - Math.cos(rad(shoulderAngle)) * 70}
            r="8"
            fill="#6C63FF"
          />

          {/* Elbow -> Wrist */}
          <line
            x1={200 + Math.sin(rad(shoulderAngle)) * 70}
            y1={170 - Math.cos(rad(shoulderAngle)) * 70}
            x2={200 + Math.sin(rad(shoulderAngle)) * 70 + Math.sin(rad(shoulderAngle + elbowAngle)) * 60}
            y2={170 - Math.cos(rad(shoulderAngle)) * 70 - Math.cos(rad(shoulderAngle + elbowAngle)) * 60}
            stroke="#9B5CFF"
            strokeWidth="6"
            strokeLinecap="round"
          />
          
          {/* End Effector */}
          <circle
            cx={200 + Math.sin(rad(shoulderAngle)) * 70 + Math.sin(rad(shoulderAngle + elbowAngle)) * 60}
            cy={170 - Math.cos(rad(shoulderAngle)) * 70 - Math.cos(rad(shoulderAngle + elbowAngle)) * 60}
            r="6"
            fill={gripperClosed ? '#10B981' : '#F59E0B'}
          />
        </svg>

        {/* Live End-Effector Telemetry Box */}
        <div className="absolute top-2 left-2 p-2 rounded-lg bg-slate-900/80 border border-slate-700 text-[10px] space-y-0.5">
          <p className="text-rose-400 font-bold">END-EFFECTOR (mm)</p>
          <p>X: <span className="text-cyan-300">{x}</span> | Y: <span className="text-cyan-300">{y}</span> | Z: <span className="text-cyan-300">{z}</span></p>
          <p>GRIPPER: <span className={gripperClosed ? 'text-emerald-400' : 'text-amber-400'}>{gripperClosed ? 'CLAMPED' : 'OPEN'}</span></p>
        </div>
      </div>

      {/* Joint Sliders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-2 border-t border-rose-500/20 text-[10px]">
        <div>
          <label className="text-slate-400 block mb-1">Base: {baseAngle}°</label>
          <input
            type="range"
            min="-90"
            max="90"
            value={baseAngle}
            onChange={(e) => setBaseAngle(parseInt(e.target.value))}
            className="w-full accent-rose-400"
          />
        </div>
        <div>
          <label className="text-slate-400 block mb-1">Shoulder: {shoulderAngle}°</label>
          <input
            type="range"
            min="-60"
            max="60"
            value={shoulderAngle}
            onChange={(e) => setShoulderAngle(parseInt(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>
        <div>
          <label className="text-slate-400 block mb-1">Elbow: {elbowAngle}°</label>
          <input
            type="range"
            min="0"
            max="120"
            value={elbowAngle}
            onChange={(e) => setElbowAngle(parseInt(e.target.value))}
            className="w-full accent-violet-400"
          />
        </div>
        <div>
          <label className="text-slate-400 block mb-1">Gripper State</label>
          <button
            onClick={() => {
              soundFx.playClick();
              setGripperClosed(!gripperClosed);
            }}
            className={`w-full py-1 rounded text-center font-bold border transition-colors ${
              gripperClosed
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            {gripperClosed ? 'GRIP' : 'RELEASE'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function NeuralWeightsSimulator() {
  const [inputVal, setInputVal] = useState([1.0, 0.5, -0.2]);
  const [loss, setLoss] = useState(0.014);

  const triggerStep = () => {
    soundFx.playNeuralChime();
    setInputVal([
      parseFloat((Math.random() * 2 - 1).toFixed(2)),
      parseFloat((Math.random() * 2 - 1).toFixed(2)),
      parseFloat((Math.random() * 2 - 1).toFixed(2))
    ]);
    setLoss(parseFloat((Math.random() * 0.03 + 0.002).toFixed(4)));
  };

  return (
    <div className="bg-[#070D1F] border border-violet-500/30 rounded-2xl p-4 font-mono text-xs text-slate-200">
      <div className="flex items-center justify-between border-b border-violet-500/20 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-violet-400 animate-pulse" />
          <span className="font-bold text-violet-300">DeepSynapse: Weight Propagation</span>
        </div>
        <button
          onClick={triggerStep}
          className="px-2.5 py-1 rounded bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500 text-violet-200 flex items-center gap-1 text-[10px]"
        >
          <Play className="w-3 h-3" /> Step Forward Pass
        </button>
      </div>

      <div className="relative h-44 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-around p-4">
        {/* Layer 1 (Inputs) */}
        <div className="flex flex-col gap-3 items-center">
          <span className="text-[10px] text-cyan-400">Input X</span>
          {inputVal.map((v, i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-[10px] text-cyan-300 animate-pulse">
              {v}
            </div>
          ))}
        </div>

        {/* Synapse Lines */}
        <div className="text-slate-600 text-sm">➔ [W1] ➔</div>

        {/* Hidden Layer */}
        <div className="flex flex-col gap-2 items-center">
          <span className="text-[10px] text-violet-400">Hidden H</span>
          {[0.82, -0.41, 0.95, 0.12].map((v, i) => (
            <div key={i} className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-400 flex items-center justify-center text-[9px] text-violet-300">
              {v}
            </div>
          ))}
        </div>

        <div className="text-slate-600 text-sm">➔ [W2] ➔</div>

        {/* Output Layer */}
        <div className="flex flex-col gap-3 items-center">
          <span className="text-[10px] text-emerald-400">Softmax Y</span>
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xs font-bold text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
            0.98
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-violet-500/20 text-[11px]">
        <span className="text-slate-400">Loss: <strong className="text-emerald-400">{loss} MSE</strong></span>
        <span className="text-slate-400">Optimizer: <strong className="text-cyan-400">AdamW (lr=3e-4)</strong></span>
      </div>
    </div>
  );
}

export function AgentGraphSimulator() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { id: 1, title: 'Planner Agent', desc: 'Decomposes task into sub-goals' },
    { id: 2, title: 'Tool Dispatcher', desc: 'Invokes Python REPL & Vector Search' },
    { id: 3, title: 'Critique & Verify', desc: 'Audits output against ground truth' },
    { id: 4, title: 'Episodic Memory', desc: 'Persists findings to vector store' }
  ];

  const handleNext = () => {
    soundFx.playClick();
    setActiveStep(prev => (prev >= 4 ? 1 : prev + 1));
  };

  return (
    <div className="bg-[#070D1F] border border-pink-500/30 rounded-2xl p-4 font-mono text-xs text-slate-200">
      <div className="flex items-center justify-between border-b border-pink-500/20 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Workflow className="w-4 h-4 text-pink-400 animate-pulse" />
          <span className="font-bold text-pink-300">SwarmNexus Multi-Agent Orchestrator</span>
        </div>
        <button
          onClick={handleNext}
          className="px-2.5 py-1 rounded bg-pink-600/30 hover:bg-pink-600/50 border border-pink-500 text-pink-200 flex items-center gap-1 text-[10px]"
        >
          <Play className="w-3 h-3" /> Step Agent Loop
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 my-2">
        {steps.map(s => {
          const isActive = activeStep === s.id;
          return (
            <div
              key={s.id}
              className={`p-3 rounded-xl border transition-all ${
                isActive
                  ? 'bg-pink-500/20 border-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-pink-400">NODE #{s.id}</span>
                {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 animate-bounce" />}
              </div>
              <h5 className="font-bold text-xs mb-1 text-slate-100">{s.title}</h5>
              <p className="text-[10px] text-slate-300 leading-tight">{s.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-pink-500/20 text-[10px] text-slate-400 flex items-center justify-between">
        <span>Consensus Status: <strong className="text-emerald-400">SYNCED (99.2%)</strong></span>
        <span>Protocol: <strong>LangGraph / JSON-RPC</strong></span>
      </div>
    </div>
  );
}
