"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  LayoutDashboard,
  Wallet,
  Search,
  PieChart,
  Bell,
  Gift,
  Shield,
  Brain,
  ChevronLeft,
  ChevronRight,
  Hexagon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/format";

const NAV_ITEMS = [
  { href: "/chat", label: "AI Agent", icon: MessageSquare, accent: "text-cyan-400" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, accent: "text-blue-400" },
  { href: "/whales", label: "Whale Tracker", icon: Wallet, accent: "text-purple-400" },
  { href: "/tokens", label: "Token Explorer", icon: Search, accent: "text-emerald-400" },
  { href: "/audit", label: "Contract Audit", icon: Shield, accent: "text-sky-400" },
  { href: "/sentiment", label: "Sentiment", icon: Brain, accent: "text-indigo-400" },
  { href: "/portfolio", label: "Portfolio", icon: PieChart, accent: "text-amber-400" },
  { href: "/alerts", label: "Alerts", icon: Bell, accent: "text-rose-400" },
  { href: "/airdrops", label: "Airdrop Scanner", icon: Gift, accent: "text-violet-400" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-white/[0.06] bg-[#0c0c0e] transition-all duration-300 h-screen sticky top-0",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06]">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10">
            <Hexagon size={18} className="text-cyan-400" />
          </div>
          {!collapsed && (
            <span className="text-[15px] font-semibold tracking-tight text-white">
              ScnrMx
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-white/[0.06] text-white"
                    : "text-[#707078] hover:text-[#b0b0b8] hover:bg-white/[0.03]"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  size={18}
                  className={cn(
                    "flex-shrink-0",
                    isActive ? item.accent : "text-[#505058]"
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-10 border-t border-white/[0.06] text-[#505058] hover:text-[#909098] transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] bg-[#0c0c0e]/95 backdrop-blur-sm px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors",
                  isActive ? "text-white" : "text-[#505058]"
                )}
              >
                <Icon size={18} className={isActive ? item.accent : ""} />
                <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
