"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  LayoutDashboard,
  Wallet,
  Search,
  PieChart,
  Bell,
  Gift,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Hexagon,
  Globe,
  BarChart3,
  Activity,
  Blocks,
  Code2,
  BrainCircuit,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Accent map                                                         */
/* ------------------------------------------------------------------ */

const ACCENT: Record<string, { bg: string; text: string; border: string }> = {
  cyan:    { bg: "bg-cyan-500/10",    text: "text-cyan-400",    border: "border-cyan-500/20" },
  blue:    { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20" },
  purple:  { bg: "bg-purple-500/10",  text: "text-purple-400",  border: "border-purple-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  amber:   { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20" },
  rose:    { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/20" },
  violet:  { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/20" },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: "AI Agent",
    desc: "Ask questions in natural language and get real-time blockchain intelligence powered by AI.",
    icon: MessageSquare,
    href: "/chat",
    accent: "cyan",
  },
  {
    title: "Dashboard",
    desc: "Unified analytics view across all chains with live metrics and trend visualization.",
    icon: LayoutDashboard,
    href: "/dashboard",
    accent: "blue",
  },
  {
    title: "Whale Tracker",
    desc: "Monitor smart money movements. Track wallets, detect accumulation, and spot exits early.",
    icon: Wallet,
    href: "/whales",
    accent: "purple",
  },
  {
    title: "Token Explorer",
    desc: "Deep token analysis with safety scores, holder distribution, and contract risk assessment.",
    icon: Search,
    href: "/tokens",
    accent: "emerald",
  },
  {
    title: "Portfolio",
    desc: "Track your holdings across chains with real-time PnL, allocation breakdowns, and history.",
    icon: PieChart,
    href: "/portfolio",
    accent: "amber",
  },
  {
    title: "Alerts",
    desc: "Custom alerts for whale moves, price action, contract changes, and on-chain anomalies.",
    icon: Bell,
    href: "/alerts",
    accent: "rose",
  },
  {
    title: "Airdrop Scanner",
    desc: "Discover and track upcoming airdrops. Check eligibility and maximize your claims.",
    icon: Gift,
    href: "/airdrops",
    accent: "violet",
  },
];

const STATS = [
  { value: 10, suffix: "+", label: "Chains Supported" },
  { value: 500, suffix: "+", label: "Whale Wallets Tracked" },
  { value: 1, suffix: "M+", label: "Tokens Analyzed" },
  { value: 24, suffix: "/7", label: "Real-Time Monitoring" },
];

const STEPS = [
  {
    step: "01",
    title: "Ask",
    desc: "Type a natural language question about any blockchain, token, or wallet.",
    icon: MessageSquare,
  },
  {
    step: "02",
    title: "Analyze",
    desc: "The AI engine processes on-chain data across multiple sources in real time.",
    icon: BrainCircuit,
  },
  {
    step: "03",
    title: "Act",
    desc: "Receive structured, actionable insights you can use to make informed decisions.",
    icon: TrendingUp,
  },
];

const TECH = [
  { label: "Next.js 16", icon: Blocks },
  { label: "React 19", icon: Code2 },
  { label: "TypeScript", icon: () => <span className="text-sm font-bold text-blue-400">TS</span> },
  { label: "Tailwind 4", icon: () => <span className="text-sm font-bold text-cyan-400">Tw</span> },
  { label: "AI Engine", icon: BrainCircuit },
];

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */

function useCountUp(target: number, duration = 1600, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let frame: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const elapsed = now - t0;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target, duration]);
  return count;
}

/* ------------------------------------------------------------------ */
/*  Intersection observer hook                                         */
/* ------------------------------------------------------------------ */

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/*  Stat counter component                                             */
/* ------------------------------------------------------------------ */

function StatCounter({ value, suffix, label, inView }: { value: number; suffix: string; label: string; inView: boolean }) {
  const count = useCountUp(value, 1600, inView);
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl font-semibold tracking-tight text-white">
        {count}
        <span className="text-cyan-400">{suffix}</span>
      </span>
      <span className="text-sm text-[#a0a0a8]">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function Home() {
  const statsRef = useInView(0.3);

  return (
    <main className="min-h-screen bg-[#09090b] text-[#f0f0f2]">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Mesh / dot grid background */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <div
            className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 opacity-20"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(6,182,212,0.25) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-32 text-center">
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-[#111113] px-4 py-1.5 text-xs text-[#a0a0a8]">
            <Hexagon className="h-3.5 w-3.5 text-cyan-400" />
            Blockchain Intelligence Platform
          </div>

          <h1 className="animate-fade-in stagger-1 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            On-Chain Intelligence,
            <br />
            <span className="text-cyan-400">Reimagined</span>
          </h1>

          <p className="animate-fade-in stagger-2 mt-6 max-w-2xl text-lg leading-relaxed text-[#a0a0a8]">
            Ask the blockchain anything. ScnrMx is an AI-powered analytics platform that transforms
            raw on-chain data into clear, actionable intelligence through natural language.
          </p>

          <div className="animate-fade-in stagger-3 mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-cyan-400"
            >
              <MessageSquare className="h-4 w-4" />
              Launch AI Agent
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-[#111113] px-6 py-3 text-sm font-medium text-[#f0f0f2] transition-colors hover:bg-[#1a1a1e]"
            >
              <LayoutDashboard className="h-4 w-4" />
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────────── */}
      <section ref={statsRef.ref} className="border-y border-white/[0.06] bg-[#111113]">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
          {STATS.map((s) => (
            <StatCounter key={s.label} {...s} inView={statsRef.inView} />
          ))}
        </div>
      </section>

      {/* ── About ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-28">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="animate-fade-in text-xs font-medium uppercase tracking-widest text-cyan-400">
              What is ScnrMx
            </p>
            <h2 className="animate-fade-in stagger-1 mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Blockchain analytics
              <br />
              that speaks your language
            </h2>
            <p className="animate-fade-in stagger-2 mt-5 max-w-lg leading-relaxed text-[#a0a0a8]">
              ScnrMx combines AI-powered natural language processing with deep on-chain data indexing.
              Ask questions in plain English, track smart money across chains, evaluate token safety
              in seconds, and receive real-time alerts on the movements that matter.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Zap, title: "Natural Language Queries", desc: "Ask anything about on-chain activity without writing a single query." },
              { icon: TrendingUp, title: "Smart Money Tracking", desc: "Follow whale wallets, detect accumulation, and spot distribution patterns." },
              { icon: Shield, title: "Token Safety Scoring", desc: "Automated risk assessment for contracts, liquidity, and holder concentration." },
              { icon: Activity, title: "Real-Time Monitoring", desc: "Continuous indexing across 10+ chains with sub-second latency." },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`animate-fade-in stagger-${(i + 1) as 1 | 2 | 3 | 4} rounded-xl border border-white/[0.06] bg-[#111113] p-5`}
              >
                <item.icon className="h-5 w-5 text-cyan-400" />
                <h3 className="mt-3 text-sm font-semibold">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#a0a0a8]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-[#111113]">
        <div className="mx-auto max-w-5xl px-6 py-28">
          <div className="text-center">
            <p className="animate-fade-in text-xs font-medium uppercase tracking-widest text-cyan-400">
              Features
            </p>
            <h2 className="animate-fade-in stagger-1 mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to navigate on-chain
            </h2>
            <p className="animate-fade-in stagger-2 mx-auto mt-4 max-w-xl text-[#a0a0a8]">
              Seven integrated modules covering every aspect of blockchain intelligence,
              from AI conversations to portfolio management.
            </p>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const a = ACCENT[f.accent];
              return (
                <Link
                  key={f.title}
                  href={f.href}
                  className={`animate-fade-in stagger-${(Math.min(i + 1, 7)) as 1 | 2 | 3 | 4 | 5 | 6 | 7} group flex flex-col rounded-xl border border-white/[0.06] bg-[#09090b] p-6 transition-colors hover:border-white/[0.1]`}
                >
                  <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${a.bg} ${a.border} border`}>
                    <f.icon className={`h-4 w-4 ${a.text}`} />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold">{f.title}</h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-[#a0a0a8]">{f.desc}</p>
                  <span className={`mt-4 inline-flex items-center gap-1 text-xs font-medium ${a.text} transition-colors`}>
                    Open
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-28">
        <div className="text-center">
          <p className="animate-fade-in text-xs font-medium uppercase tracking-widest text-cyan-400">
            How It Works
          </p>
          <h2 className="animate-fade-in stagger-1 mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            From question to insight in three steps
          </h2>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={s.step}
              className={`animate-fade-in stagger-${(i + 1) as 1 | 2 | 3} relative flex flex-col items-center text-center`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.06] bg-[#111113]">
                <s.icon className="h-6 w-6 text-cyan-400" />
              </div>
              <span className="mt-4 font-mono text-xs text-[#606068]">{s.step}</span>
              <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#a0a0a8]">{s.desc}</p>

              {/* Connector arrow */}
              {i < STEPS.length - 1 && (
                <div className="absolute right-0 top-7 hidden w-full translate-x-1/2 sm:block">
                  <ArrowRight className="mx-auto h-5 w-5 text-[#606068]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ──────────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-[#111113]">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="animate-fade-in text-center text-xs font-medium uppercase tracking-widest text-cyan-400">
            Built With
          </p>
          <div className="animate-fade-in stagger-1 mt-8 flex flex-wrap items-center justify-center gap-3">
            {TECH.map((t) => (
              <div
                key={t.label}
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#09090b] px-4 py-2 text-sm text-[#a0a0a8]"
              >
                <t.icon className="h-4 w-4 text-cyan-400" />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] bg-[#09090b]">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-[#606068]">
            <Hexagon className="h-4 w-4 text-cyan-400" />
            ScnrMx
          </div>
          <p className="text-xs text-[#606068]">Built by CipherWork</p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#a0a0a8] transition-colors hover:text-white"
          >
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
