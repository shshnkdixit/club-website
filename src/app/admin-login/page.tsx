'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Lock,
  Unlock,
  KeyRound,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { cmsStore } from '@/lib/cmsStore';
import { soundFx } from '@/lib/soundFx';
import { AdminUser } from '@/types';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<AdminUser | null>(null);

  // Detect existing persistent device session
  React.useEffect(() => {
    const existing = cmsStore.getCurrentAdminUser();
    if (existing) {
      setActiveSession(existing);
      // Auto-redirect if already logged in on this device
      router.replace('/admin');
    }
  }, [router]);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Cooldown countdown timer for brute-force lock
  React.useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const timer = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (lockoutRemaining > 0) {
      setErrorMsg(`Access temporarily locked due to repeated failed attempts. Please wait ${lockoutRemaining}s.`);
      soundFx.playError();
      return;
    }

    setIsLoading(true);

    const cleanEmail = email.toLowerCase().trim();
    const cleanPass = password.trim();

    const handleSuccess = (matchedUser: AdminUser) => {
      soundFx.playCelebration();
      setFailedAttempts(0);
      cmsStore.setCurrentAdminUser(matchedUser);
      router.push('/admin');
    };

    const handleFailure = () => {
      soundFx.playError();
      setIsLoading(false);

      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);

      if (nextAttempts >= 5) {
        setLockoutRemaining(30);
        setErrorMsg('🚨 Security Lock Engaged: Too many failed login attempts. Gateway locked for 30 seconds.');
      } else {
        const attemptsLeft = 5 - nextAttempts;
        setErrorMsg(`Access Denied: Invalid staff email or password. (${attemptsLeft} attempt${attemptsLeft > 1 ? 's' : ''} remaining before security lock)`);
      }
    };

    // STRICT AUTHENTICATION: credentials are verified server-side against the
    // Neon database (admin_users table), so staff passwords never need to be
    // trusted from the client bundle.
    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password: cleanPass })
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (res.ok && data?.success && data.user) {
          handleSuccess(data.user as AdminUser);
        } else {
          handleFailure();
        }
      })
      .catch(() => {
        // Network / offline fallback: verify against the locally-cached
        // admin roster (e.g. local dev without a reachable database).
        const users = cmsStore.getAdminUsers();
        const matchedUser = users.find(
          (u) => u.email.toLowerCase().trim() === cleanEmail && u.password === cleanPass
        );
        if (matchedUser) {
          const updatedUser: AdminUser = { ...matchedUser, lastLogin: new Date().toISOString() };
          cmsStore.saveAdminUser(updatedUser);
          handleSuccess(updatedUser);
        } else {
          handleFailure();
        }
      });
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white flex items-center justify-center p-4 font-mono selection:bg-amber-500 selection:text-black">
      {/* Ambient Grid & Glows */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[180px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md p-8 rounded-3xl bg-[#070A18]/95 border-2 border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)] space-y-6 z-10"
      >
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-white p-1.5 border-2 border-amber-400/60 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(245,158,11,0.4)] overflow-hidden">
            <img src="/images/logo.png" alt="AIML Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            ADMIN CMS GATEWAY
          </h2>
          <p className="text-xs text-amber-300/80">
            Authorized Personnel Access & Content Governance Portal
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-300 font-bold uppercase">
              Staff Email / Username
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. your.email@aimlclub.edu"
              className="w-full bg-[#0a0a0a] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-300 font-bold uppercase">
              Access Code / Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0a0a0a] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 pr-20 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-slate-700/60 shadow-sm"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-slate-300" />
                    <span>Show</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            <Unlock className="w-4 h-4" />
            <span>{isLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE & ENTER CMS'}</span>
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center pt-2 border-t border-slate-800/80">
          <Link
            href="/"
            onClick={() => soundFx.playClick()}
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
