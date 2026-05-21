"use client";

import Sidebar from "@/components/sidebar";
import PageHeader from "@/components/page-header";
import {
  Gift,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Fuel,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/format";

const AIRDROPS = [
  {
    protocol: "EigenLayer",
    status: "eligible",
    estimated: "$1,200 — $4,500",
    deadline: "Ongoing (Season 2)",
    requirements: ["Restaked > 1 ETH", "Active for > 30 days", "Delegated to operator"],
    metRequirements: 3,
    totalRequirements: 3,
    gasEstimate: "$12-25",
    chain: "Ethereum",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    protocol: "zkSync",
    status: "eligible",
    estimated: "$800 — $3,200",
    deadline: "TBA",
    requirements: ["Bridge > 0.5 ETH", "> 20 transactions", "Used > 5 dApps"],
    metRequirements: 2,
    totalRequirements: 3,
    gasEstimate: "$2-5",
    chain: "zkSync Era",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    protocol: "LayerZero",
    status: "partial",
    estimated: "$500 — $2,000",
    deadline: "Completed (check eligibility)",
    requirements: ["Cross-chain transfer", "> 10 bridge txs", "Used Stargate Finance"],
    metRequirements: 1,
    totalRequirements: 3,
    gasEstimate: "$5-15",
    chain: "Multi-chain",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    protocol: "Starknet",
    status: "not-eligible",
    estimated: "$300 — $1,500",
    deadline: "Completed",
    requirements: ["Bridge to Starknet", "> 10 transactions", "Used DeFi on Starknet"],
    metRequirements: 0,
    totalRequirements: 3,
    gasEstimate: "$1-3",
    chain: "Starknet",
    color: "text-red-400 bg-red-500/10 border-red-500/20",
  },
  {
    protocol: "Scroll",
    status: "eligible",
    estimated: "$400 — $1,800",
    deadline: "Ongoing",
    requirements: ["Bridge ETH to Scroll", "> 5 transactions", "LP on native DEX"],
    metRequirements: 2,
    totalRequirements: 3,
    gasEstimate: "$3-8",
    chain: "Scroll",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    protocol: "Linea",
    status: "partial",
    estimated: "$200 — $900",
    deadline: "Ongoing (LXP Program)",
    requirements: ["Bridge to Linea", "LXP > 100", "Daily check-in"],
    metRequirements: 1,
    totalRequirements: 3,
    gasEstimate: "$2-4",
    chain: "Linea",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
];

const SUMMARY = {
  totalEligible: 3,
  totalPartial: 2,
  totalNotEligible: 1,
  estimatedTotal: "$2,400 — $9,500",
  totalGasNeeded: "$25 — $60",
};

export default function AirdropsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
        <PageHeader
          icon={Gift}
          title="Airdrop Scanner"
          subtitle="Check eligibility, track farming progress, and estimate ROI"
          accent="text-violet-400"
        />

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-4">
            <div className="text-xs text-[#505058] mb-1">Eligible</div>
            <div className="text-lg font-semibold text-emerald-400">{SUMMARY.totalEligible}</div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-4">
            <div className="text-xs text-[#505058] mb-1">Partial</div>
            <div className="text-lg font-semibold text-amber-400">{SUMMARY.totalPartial}</div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-4">
            <div className="text-xs text-[#505058] mb-1">Not Eligible</div>
            <div className="text-lg font-semibold text-red-400">{SUMMARY.totalNotEligible}</div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-4">
            <div className="text-xs text-[#505058] mb-1">Est. Value</div>
            <div className="text-sm font-semibold text-violet-400">{SUMMARY.estimatedTotal}</div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-4">
            <div className="text-xs text-[#505058] mb-1">Gas Needed</div>
            <div className="text-sm font-semibold text-[#a0a0a8]">{SUMMARY.totalGasNeeded}</div>
          </div>
        </div>

        {/* Airdrop Cards */}
        <div className="space-y-3">
          {AIRDROPS.map((airdrop, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/[0.06] bg-[#111113] p-5 hover:border-white/[0.1] transition-colors animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-semibold text-white">{airdrop.protocol}</h3>
                    <span className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full border",
                      airdrop.color
                    )}>
                      {airdrop.status === "eligible" ? "Eligible" : airdrop.status === "partial" ? "Partial" : "Not Eligible"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#505058]">
                    <span>{airdrop.chain}</span>
                    <span className="text-[#303038]">|</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {airdrop.deadline}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{airdrop.estimated}</div>
                  <div className="flex items-center gap-1 text-xs text-[#505058] justify-end">
                    <Fuel size={10} />
                    <span>Gas: {airdrop.gasEstimate}</span>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {airdrop.requirements.map((req, j) => {
                  const met = j < airdrop.metRequirements;
                  return (
                    <div key={j} className="flex items-center gap-2 py-1.5">
                      {met ? (
                        <CheckCircle size={13} className="text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle size={13} className="text-[#404048] flex-shrink-0" />
                      )}
                      <span className={cn(
                        "text-xs",
                        met ? "text-[#a0a0a8]" : "text-[#505058]"
                      )}>
                        {req}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      airdrop.status === "eligible" && "bg-emerald-400",
                      airdrop.status === "partial" && "bg-amber-400",
                      airdrop.status === "not-eligible" && "bg-red-400",
                    )}
                    style={{ width: `${(airdrop.metRequirements / airdrop.totalRequirements) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-[#505058]">
                  {airdrop.metRequirements}/{airdrop.totalRequirements}
                </span>
                <button className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                  <span>Details</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
