"use client";

import Sidebar from "@/components/sidebar";
import PageHeader from "@/components/page-header";
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Wallet,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/format";

const PORTFOLIO = {
  totalValue: "$128,420.50",
  totalChange24h: "+$3,241.20",
  totalChangePercent: "+2.59%",
  pnl30d: "+$12,840",
  pnl30dPercent: "+11.1%",
  riskScore: "Medium",
  chainCount: 4,
};

const HOLDINGS = [
  { token: "ETH", name: "Ethereum", amount: "24.5", value: "$61,250", price: "$2,500", change24h: "+2.1%", allocation: 47.7, chain: "Ethereum" },
  { token: "SOL", name: "Solana", amount: "890", value: "$28,480", price: "$32.00", change24h: "+5.4%", allocation: 22.2, chain: "Solana" },
  { token: "USDC", name: "USD Coin", amount: "15,000", value: "$15,000", price: "$1.00", change24h: "+0.0%", allocation: 11.7, chain: "Base" },
  { token: "ARB", name: "Arbitrum", amount: "8,200", value: "$9,676", price: "$1.18", change24h: "+12.1%", allocation: 7.5, chain: "Arbitrum" },
  { token: "ENA", name: "Ethena", amount: "12,500", value: "$7,750", price: "$0.62", change24h: "-3.2%", allocation: 6.0, chain: "Ethereum" },
  { token: "RENDER", name: "Render", amount: "340", value: "$3,543", price: "$10.42", change24h: "+15.6%", allocation: 2.8, chain: "Ethereum" },
  { token: "AERO", name: "Aerodrome", amount: "2,100", value: "$2,721", price: "$1.30", change24h: "+8.2%", allocation: 2.1, chain: "Base" },
];

const RISK_FACTORS = [
  { label: "Concentration Risk", level: "high", detail: "47.7% in ETH — consider diversifying" },
  { label: "Stablecoin Ratio", level: "good", detail: "11.7% stablecoins provides downside buffer" },
  { label: "Chain Exposure", level: "medium", detail: "69.9% on Ethereum — multi-chain is recommended" },
  { label: "Impermanent Loss", level: "low", detail: "No active LP positions detected" },
];

const ALLOC_COLORS = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#f97316"];

export default function PortfolioPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
        <PageHeader
          icon={PieChart}
          title="Portfolio"
          subtitle="Multi-chain portfolio analysis and risk assessment"
          accent="text-amber-400"
          action={
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-[#808088] hover:text-white hover:border-white/[0.14] transition-colors">
              <RefreshCw size={13} />
              Refresh
            </button>
          }
        />

        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <div className="col-span-2 rounded-xl border border-white/[0.06] bg-[#111113] p-5">
            <div className="text-xs text-[#505058] mb-1">Total Value</div>
            <div className="text-2xl font-semibold text-white tracking-tight">{PORTFOLIO.totalValue}</div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs font-medium text-emerald-400">{PORTFOLIO.totalChange24h}</span>
              <span className="text-xs text-emerald-400/60">({PORTFOLIO.totalChangePercent})</span>
            </div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-4">
            <div className="text-xs text-[#505058] mb-1">30d P&L</div>
            <div className="text-lg font-semibold text-emerald-400">{PORTFOLIO.pnl30d}</div>
            <div className="text-xs text-[#505058]">{PORTFOLIO.pnl30dPercent}</div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-4">
            <div className="text-xs text-[#505058] mb-1">Risk Score</div>
            <div className="text-lg font-semibold text-amber-400">{PORTFOLIO.riskScore}</div>
            <div className="text-xs text-[#505058]">{PORTFOLIO.chainCount} chains</div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-4">
            <div className="text-xs text-[#505058] mb-1">Assets</div>
            <div className="text-lg font-semibold text-white">{HOLDINGS.length}</div>
            <div className="text-xs text-[#505058]">tokens</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Holdings Table */}
          <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-[#111113]">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">Holdings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    <th className="text-left text-[10px] font-medium text-[#505058] uppercase tracking-wider px-4 py-2.5">Asset</th>
                    <th className="text-right text-[10px] font-medium text-[#505058] uppercase tracking-wider px-4 py-2.5">Amount</th>
                    <th className="text-right text-[10px] font-medium text-[#505058] uppercase tracking-wider px-4 py-2.5">Value</th>
                    <th className="text-right text-[10px] font-medium text-[#505058] uppercase tracking-wider px-4 py-2.5 hidden sm:table-cell">24h</th>
                    <th className="text-right text-[10px] font-medium text-[#505058] uppercase tracking-wider px-4 py-2.5 hidden md:table-cell">Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {HOLDINGS.map((h, i) => (
                    <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold"
                            style={{ backgroundColor: `${ALLOC_COLORS[i]}20`, color: ALLOC_COLORS[i] }}
                          >
                            {h.token.slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{h.token}</div>
                            <div className="text-[10px] text-[#404048]">{h.chain}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-[#a0a0a8]">{h.amount}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-white">{h.value}</td>
                      <td className={cn(
                        "px-4 py-3 text-right text-xs font-medium hidden sm:table-cell",
                        h.change24h.startsWith("+") ? "text-emerald-400" : "text-red-400"
                      )}>
                        {h.change24h}
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${h.allocation}%`, backgroundColor: ALLOC_COLORS[i] }}
                            />
                          </div>
                          <span className="text-xs text-[#808088] w-10 text-right">{h.allocation}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="rounded-xl border border-white/[0.06] bg-[#111113]">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-400" />
                <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">Risk Assessment</h3>
              </div>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {RISK_FACTORS.map((risk, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[#a0a0a8]">{risk.label}</span>
                    <span className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded",
                      risk.level === "high" && "bg-red-500/10 text-red-400",
                      risk.level === "medium" && "bg-amber-500/10 text-amber-400",
                      risk.level === "good" && "bg-emerald-500/10 text-emerald-400",
                      risk.level === "low" && "bg-blue-500/10 text-blue-400",
                    )}>
                      {risk.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#505058] leading-relaxed">{risk.detail}</p>
                </div>
              ))}
            </div>

            {/* AI Suggestions */}
            <div className="px-4 py-3 border-t border-white/[0.06]">
              <div className="text-xs font-medium text-cyan-400 mb-2">AI Suggestions</div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <ChevronRight size={12} className="text-cyan-400/60 mt-0.5 flex-shrink-0" />
                  <span className="text-[11px] text-[#707078]">Consider reducing ETH exposure to under 35%</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight size={12} className="text-cyan-400/60 mt-0.5 flex-shrink-0" />
                  <span className="text-[11px] text-[#707078]">Add exposure to Base ecosystem for growth potential</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight size={12} className="text-cyan-400/60 mt-0.5 flex-shrink-0" />
                  <span className="text-[11px] text-[#707078]">Stake idle ETH for ~3.8% APY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
