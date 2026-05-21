"use client";

import Link from "next/link";
import {
  MessageSquare,
  LayoutDashboard,
  Wallet,
  Search,
  PieChart,
  Bell,
  Gift,
  Hexagon,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";

const FEATURES = [
  {
    href: "/chat",
    icon: MessageSquare,
    title: "AI Agent",
    desc: "Ask the blockchain anything in natural language. Powered by advanced reasoning AI.",
    accent: "cyan",
  },
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    title: "Dashboard",
    desc: "Real-time market overview with fear index, dominance metrics, and volume aggregations.",
    accent: "blue",
  },
  {
    href: "/whales",
    icon: Wallet,
    title: "Whale Tracker",
    desc: "Monitor smart money movements, detect coordinated buys, and track accumulation patterns.",
    accent: "purple",
  },
  {
    href: "/tokens",
    icon: Search,
    title: "Token Explorer",
    desc: "Deep token analysis with safety scoring, holder analytics, and honeypot detection.",
    accent: "emerald",
  },
  {
    href: "/portfolio",
    icon: PieChart,
    title: "Portfolio",
    desc: "Multi-chain portfolio analysis with risk assessment and AI rebalancing suggestions.",
    accent: "amber",
  },
  {
    href: "/alerts",
    icon: Bell,
    title: "Alerts",
    desc: "Custom alerts for whale movements, price targets, and safety score changes.",
    accent: "rose",
  },
  {
    href: "/airdrops",
    icon: Gift,
    title: "Airdrop Scanner",
    desc: "Multi-protocol eligibility checker with farming progress and ROI estimation.",
    accent: "violet",
  },
];

const ACCENT_MAP: Record<string, { bg: string; text: string; border: string }> = {
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(6,182,212,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,rgba(139,92,246,0.04),transparent)]" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16">
          {/* Logo + Badge */}
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Hexagon size={22} className="text-cyan-400" />
            </div>
            <span className="text-sm font-medium text-[#606068] uppercase tracking-widest">
              ScnrMx
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.1] mb-5 animate-fade-in stagger-1">
            On-Chain Intelligence,
            <br />
            <span className="text-[#707078]">Reimagined.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#808088] max-w-xl leading-relaxed mb-10 animate-fade-in stagger-2">
            AI-powered blockchain analytics platform. Ask complex on-chain questions in
            plain English and get actionable, data-backed insights in real-time.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 animate-fade-in stagger-3">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-500 transition-colors"
            >
              Launch AI Agent
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/[0.08] text-[#a0a0a8] text-sm font-medium hover:text-white hover:border-white/[0.14] transition-colors"
            >
              View Dashboard
            </Link>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/[0.06] animate-fade-in stagger-4">
            {[
              { label: "Chains Supported", value: "5+", icon: Zap },
              { label: "Safety Checks", value: "12", icon: Shield },
              { label: "AI Reasoning", value: "Real-time", icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon size={16} className="text-[#505058]" />
                <div>
                  <div className="text-sm font-semibold text-white">{value}</div>
                  <div className="text-xs text-[#606068]">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="mb-10">
          <h2 className="text-xs font-medium text-[#606068] uppercase tracking-widest mb-2">
            Capabilities
          </h2>
          <p className="text-lg font-medium text-white">Everything you need to navigate on-chain data.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-xl overflow-hidden">
          {FEATURES.map((feat) => {
            const a = ACCENT_MAP[feat.accent];
            const Icon = feat.icon;
            return (
              <Link
                key={feat.href}
                href={feat.href}
                className="group bg-[#09090b] p-6 hover:bg-[#0f0f12] transition-colors"
              >
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${a.bg} ${a.text} mb-4`}>
                  <Icon size={16} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#606068] leading-relaxed">{feat.desc}</p>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#404048]">
            <Hexagon size={14} className="text-cyan-400/40" />
            <span>ScnrMx</span>
            <span className="text-[#303038]">/</span>
            <span>Built by CipherWork</span>
          </div>
          <div className="text-xs text-[#404048]">
            Powered by MiMo v2.5 Pro
          </div>
        </footer>
      </div>
    </div>
  );
}
