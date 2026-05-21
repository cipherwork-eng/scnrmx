"use client";

import Sidebar from "@/components/sidebar";
import PageHeader from "@/components/page-header";
import {
  Search,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Users,
  Droplets,
  Lock,
  Code,
} from "lucide-react";
import { cn } from "@/lib/format";
import { useState } from "react";

const MOCK_TOKENS = [
  {
    name: "Uniswap",
    symbol: "UNI",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    safety: 92,
    price: "$12.42",
    change24h: "+3.2%",
    marketCap: "$7.4B",
    holders: "412K",
    liquidity: "$180M",
    chain: "Ethereum",
    verified: true,
    honeypot: false,
    proxy: false,
    renounced: true,
    auditStatus: "Audited (OpenZeppelin)",
  },
  {
    name: "Pepe",
    symbol: "PEPE",
    address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
    safety: 68,
    price: "$0.0000142",
    change24h: "+28.4%",
    marketCap: "$5.9B",
    holders: "284K",
    liquidity: "$42M",
    chain: "Ethereum",
    verified: true,
    honeypot: false,
    proxy: false,
    renounced: true,
    auditStatus: "Not audited",
  },
  {
    name: "Arbitrum",
    symbol: "ARB",
    address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    safety: 95,
    price: "$1.18",
    change24h: "+12.1%",
    marketCap: "$4.2B",
    holders: "890K",
    liquidity: "$220M",
    chain: "Arbitrum",
    verified: true,
    honeypot: false,
    proxy: true,
    renounced: false,
    auditStatus: "Audited (Trail of Bits)",
  },
  {
    name: "Render",
    symbol: "RNDR",
    address: "0x6De037ef9aD2725EB40118Bb1702EBb27e4Aeb24",
    safety: 87,
    price: "$10.42",
    change24h: "+15.6%",
    marketCap: "$4.1B",
    holders: "156K",
    liquidity: "$95M",
    chain: "Ethereum",
    verified: true,
    honeypot: false,
    proxy: false,
    renounced: true,
    auditStatus: "Audited (Certik)",
  },
  {
    name: "Suspicious Token",
    symbol: "SCAM",
    address: "0x000000000000000000000000000000000000dEaD",
    safety: 8,
    price: "$0.0000001",
    change24h: "+999%",
    marketCap: "$50K",
    holders: "23",
    liquidity: "$2K",
    chain: "BSC",
    verified: false,
    honeypot: true,
    proxy: true,
    renounced: false,
    auditStatus: "Not audited",
  },
];

function SafetyRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="68" height="68" className="-rotate-90">
        <circle cx="34" cy="34" r={radius} stroke="rgba(255,255,255,0.04)" strokeWidth="4" fill="none" />
        <circle
          cx="34"
          cy="34"
          r={radius}
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <span className="absolute text-sm font-semibold" style={{ color }}>{score}</span>
    </div>
  );
}

export default function TokensPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<typeof MOCK_TOKENS[0] | null>(MOCK_TOKENS[0]);

  const filtered = MOCK_TOKENS.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.symbol.toLowerCase().includes(query.toLowerCase()) ||
      t.address.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
        <PageHeader
          icon={Search}
          title="Token Explorer"
          subtitle="Analyze tokens with safety scoring and holder analytics"
          accent="text-emerald-400"
        />

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex items-center gap-2 bg-[#111113] border border-white/[0.08] rounded-lg px-4 py-2.5 focus-within:border-white/[0.14] transition-colors">
            <Search size={15} className="text-[#404048]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, symbol, or contract address..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[#404048] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Token List */}
          <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-[#111113]">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">Tokens</h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {filtered.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => setSelected(token)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.02] transition-colors",
                    selected?.symbol === token.symbol && "bg-white/[0.03]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-xs font-semibold text-[#808088]">
                      {token.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{token.name}</div>
                      <div className="text-xs text-[#505058]">{token.symbol} · {token.chain}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#a0a0a8]">{token.price}</div>
                    <div className={cn(
                      "text-xs font-medium",
                      token.change24h.startsWith("+") ? "text-emerald-400" : "text-red-400"
                    )}>
                      {token.change24h}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Token Detail */}
          {selected && (
            <div className="lg:col-span-3 space-y-4">
              {/* Header Card */}
              <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selected.name}</h2>
                    <p className="text-xs text-[#505058] mt-0.5">
                      {selected.symbol} · {selected.chain}
                    </p>
                    <p className="text-[10px] font-mono text-[#404048] mt-1">{selected.address}</p>
                  </div>
                  <SafetyRing score={selected.safety} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs text-[#505058] mb-0.5">Price</div>
                    <div className="text-sm font-medium text-white">{selected.price}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#505058] mb-0.5">Market Cap</div>
                    <div className="text-sm font-medium text-white">{selected.marketCap}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#505058] mb-0.5">24h Change</div>
                    <div className={cn(
                      "text-sm font-medium",
                      selected.change24h.startsWith("+") ? "text-emerald-400" : "text-red-400"
                    )}>
                      {selected.change24h}
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Checks */}
              <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-5">
                <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider mb-4">Safety Analysis</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Contract Verified", value: selected.verified, icon: Code },
                    { label: "Not a Honeypot", value: !selected.honeypot, icon: Shield },
                    { label: "Non-Proxy Contract", value: !selected.proxy, icon: Lock },
                    { label: "Ownership Renounced", value: selected.renounced, icon: CheckCircle },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-2.5 py-2">
                      <Icon size={14} className={value ? "text-emerald-400/60" : "text-red-400/60"} />
                      <span className="text-xs text-[#808088]">{label}</span>
                      {value ? (
                        <CheckCircle size={13} className="text-emerald-400 ml-auto" />
                      ) : (
                        <XCircle size={13} className="text-red-400 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/[0.04]">
                  <div className="flex items-center gap-2 text-xs">
                    <Shield size={13} className="text-[#505058]" />
                    <span className="text-[#606068]">Audit Status:</span>
                    <span className={cn(
                      "font-medium",
                      selected.auditStatus.startsWith("Audited") ? "text-emerald-400" : "text-amber-400"
                    )}>
                      {selected.auditStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Holder & Liquidity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users size={14} className="text-cyan-400" />
                    <span className="text-xs font-medium text-[#606068] uppercase tracking-wider">Holders</span>
                  </div>
                  <div className="text-xl font-semibold text-white">{selected.holders}</div>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Droplets size={14} className="text-blue-400" />
                    <span className="text-xs font-medium text-[#606068] uppercase tracking-wider">Liquidity</span>
                  </div>
                  <div className="text-xl font-semibold text-white">{selected.liquidity}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
