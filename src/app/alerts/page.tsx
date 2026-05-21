"use client";

import Sidebar from "@/components/sidebar";
import PageHeader from "@/components/page-header";
import {
  Bell,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Wallet,
  TrendingUp,
  Shield,
  Gift,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/format";
import { useState } from "react";

interface Alert {
  id: number;
  type: string;
  label: string;
  condition: string;
  icon: typeof Wallet;
  color: string;
  active: boolean;
  triggered: number;
  created: string;
}

const INITIAL_ALERTS: Alert[] = [
  { id: 1, type: "whale", label: "ETH Whale Accumulation", condition: "Any wallet buys > 1000 ETH", icon: Wallet, color: "text-purple-400 bg-purple-500/10", active: true, triggered: 3, created: "2 days ago" },
  { id: 2, type: "price", label: "BTC Price Alert", condition: "BTC crosses above $110,000", icon: TrendingUp, color: "text-amber-400 bg-amber-500/10", active: true, triggered: 0, created: "1 week ago" },
  { id: 3, type: "safety", label: "Token Safety Change", condition: "Safety score drops below 50 for ENA", icon: Shield, color: "text-emerald-400 bg-emerald-500/10", active: true, triggered: 1, created: "3 days ago" },
  { id: 4, type: "airdrop", label: "Airdrop Eligibility", condition: "New eligibility for wallets with > 100 txs", icon: Gift, color: "text-violet-400 bg-violet-500/10", active: false, triggered: 5, created: "2 weeks ago" },
  { id: 5, type: "whale", label: "SOL Whale Transfer", condition: "Transfer > 50,000 SOL to exchange", icon: Wallet, color: "text-purple-400 bg-purple-500/10", active: true, triggered: 7, created: "5 days ago" },
  { id: 6, type: "price", label: "ETH/BTC Ratio", condition: "ETH/BTC drops below 0.045", icon: TrendingUp, color: "text-amber-400 bg-amber-500/10", active: true, triggered: 0, created: "1 day ago" },
];

const TRIGGERED_HISTORY = [
  { alert: "ETH Whale Accumulation", message: "0x28C6...d60 bought 2,450 ETH ($6.12M)", time: "12 min ago", severity: "high" },
  { alert: "SOL Whale Transfer", message: "Jump Trading moved 45,000 SOL to Binance", time: "28 min ago", severity: "medium" },
  { alert: "Token Safety Change", message: "ENA safety score dropped to 68 (from 82)", time: "2 hours ago", severity: "high" },
  { alert: "Airdrop Eligibility", message: "EigenLayer Season 2 — 3 of your wallets eligible", time: "6 hours ago", severity: "info" },
  { alert: "SOL Whale Transfer", message: "0x56Ed...7F21 moved 120,000 SOL to Coinbase", time: "1 day ago", severity: "medium" },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  const toggleAlert = (id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const deleteAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
        <PageHeader
          icon={Bell}
          title="Alerts"
          subtitle="Custom alerts for whale movements, prices, and safety changes"
          accent="text-rose-400"
          action={
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-400 text-xs font-medium hover:bg-rose-600/30 transition-colors">
              <Plus size={13} />
              New Alert
            </button>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-4">
            <div className="text-xs text-[#505058] mb-1">Active Alerts</div>
            <div className="text-lg font-semibold text-white">{alerts.filter((a) => a.active).length}</div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-4">
            <div className="text-xs text-[#505058] mb-1">Triggered Today</div>
            <div className="text-lg font-semibold text-amber-400">4</div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-4">
            <div className="text-xs text-[#505058] mb-1">Total Triggered</div>
            <div className="text-lg font-semibold text-[#a0a0a8]">{alerts.reduce((sum, a) => sum + a.triggered, 0)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Alert List */}
          <div className="lg:col-span-3 rounded-xl border border-white/[0.06] bg-[#111113]">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">Alert Rules</h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {alerts.map((alert) => {
                const Icon = alert.icon;
                return (
                  <div key={alert.id} className="px-4 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                    <div className={cn("flex items-center justify-center w-8 h-8 rounded-lg", alert.color)}>
                      <Icon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{alert.label}</span>
                        {alert.triggered > 0 && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/[0.06] text-[#808088]">
                            {alert.triggered}x
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#505058] truncate">{alert.condition}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock size={10} className="text-[#404048]" />
                        <span className="text-[10px] text-[#404048]">{alert.created}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className={cn(
                          "transition-colors",
                          alert.active ? "text-cyan-400" : "text-[#404048]"
                        )}
                      >
                        {alert.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                      </button>
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="text-[#303038] hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trigger History */}
          <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-[#111113]">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">Recent Triggers</h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {TRIGGERED_HISTORY.map((event, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                      event.severity === "high" && "bg-red-400",
                      event.severity === "medium" && "bg-amber-400",
                      event.severity === "info" && "bg-cyan-400",
                    )} />
                    <div>
                      <div className="text-xs font-medium text-[#a0a0a8]">{event.alert}</div>
                      <p className="text-[11px] text-[#505058] mt-0.5 leading-relaxed">{event.message}</p>
                      <span className="text-[10px] text-[#404048] mt-1 block">{event.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
