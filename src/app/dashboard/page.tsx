"use client";

import Sidebar from "@/components/sidebar";
import PageHeader from "@/components/page-header";
import StatCard from "@/components/stat-card";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Activity,
  Gauge,
  Droplets,
  Flame,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn, formatNumber, formatPercent } from "@/lib/format";

const MOCK_STATS = {
  marketCap: { value: "$2.41T", change: "+2.34%", positive: true },
  volume24h: { value: "$89.2B", change: "+12.8%", positive: true },
  btcDominance: { value: "54.2%", change: "+0.3%", positive: true },
  ethDominance: { value: "17.8%", change: "-0.2%", positive: false },
  fearGreed: { value: "72", label: "Greed", positive: true },
  activeAddresses: { value: "1.24M", change: "+5.1%", positive: true },
  gasPrice: { value: "12 gwei", change: "-8.4%", positive: true },
  defiTVL: { value: "$92.4B", change: "+1.7%", positive: true },
};

const TOP_GAINERS = [
  { name: "PEPE", symbol: "PEPE", price: "$0.0000142", change: "+28.4%", volume: "$1.2B" },
  { name: "FET", symbol: "FET", price: "$2.34", change: "+18.2%", volume: "$890M" },
  { name: "RNDR", symbol: "RNDR", price: "$10.42", change: "+15.6%", volume: "$620M" },
  { name: "ARB", symbol: "ARB", price: "$1.18", change: "+12.1%", volume: "$440M" },
  { name: "OP", symbol: "OP", price: "$2.86", change: "+10.8%", volume: "$380M" },
];

const TOP_LOSERS = [
  { name: "LUNA", symbol: "LUNA", price: "$0.62", change: "-12.4%", volume: "$180M" },
  { name: "FTM", symbol: "FTM", price: "$0.48", change: "-8.7%", volume: "$220M" },
  { name: "AXS", symbol: "AXS", price: "$7.12", change: "-7.2%", volume: "$140M" },
  { name: "SAND", symbol: "SAND", price: "$0.44", change: "-6.8%", volume: "$95M" },
  { name: "MANA", symbol: "MANA", price: "$0.38", change: "-5.9%", volume: "$78M" },
];

const DEX_VOLUMES = [
  { chain: "Ethereum", volume: "$3.2B", change: "+14.2%" },
  { chain: "Solana", volume: "$2.8B", change: "+22.1%" },
  { chain: "Base", volume: "$1.4B", change: "+31.8%" },
  { chain: "Arbitrum", volume: "$980M", change: "+8.4%" },
  { chain: "Polygon", volume: "$420M", change: "-3.2%" },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
        <PageHeader
          icon={LayoutDashboard}
          title="Dashboard"
          subtitle="Real-time crypto market overview and analytics"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard
            label="Market Cap"
            value={MOCK_STATS.marketCap.value}
            change={MOCK_STATS.marketCap.change}
            changeType="positive"
            icon={TrendingUp}
          />
          <StatCard
            label="24h Volume"
            value={MOCK_STATS.volume24h.value}
            change={MOCK_STATS.volume24h.change}
            changeType="positive"
            icon={Activity}
          />
          <StatCard
            label="BTC Dominance"
            value={MOCK_STATS.btcDominance.value}
            change={MOCK_STATS.btcDominance.change}
            changeType="positive"
            icon={Flame}
            accent="text-amber-400"
          />
          <StatCard
            label="Fear & Greed"
            value={MOCK_STATS.fearGreed.value}
            change={MOCK_STATS.fearGreed.label}
            changeType="positive"
            icon={Gauge}
            accent="text-emerald-400"
          />
          <StatCard
            label="ETH Dominance"
            value={MOCK_STATS.ethDominance.value}
            change={MOCK_STATS.ethDominance.change}
            changeType="negative"
            icon={Droplets}
            accent="text-blue-400"
          />
          <StatCard
            label="Active Addresses"
            value={MOCK_STATS.activeAddresses.value}
            change={MOCK_STATS.activeAddresses.change}
            changeType="positive"
            icon={Users}
          />
          <StatCard
            label="Gas Price"
            value={MOCK_STATS.gasPrice.value}
            change={MOCK_STATS.gasPrice.change}
            changeType="positive"
            icon={Flame}
            accent="text-orange-400"
          />
          <StatCard
            label="DeFi TVL"
            value={MOCK_STATS.defiTVL.value}
            change={MOCK_STATS.defiTVL.change}
            changeType="positive"
            icon={Droplets}
            accent="text-violet-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Top Gainers */}
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-4">
            <div className="flex items-center gap-2 mb-4">
              <ArrowUpRight size={15} className="text-emerald-400" />
              <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">Top Gainers</h3>
            </div>
            <div className="space-y-2">
              {TOP_GAINERS.map((token, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <div>
                    <div className="text-sm font-medium text-white">{token.symbol}</div>
                    <div className="text-xs text-[#505058]">{token.price}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-emerald-400">{token.change}</div>
                    <div className="text-xs text-[#505058]">{token.volume}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-4">
            <div className="flex items-center gap-2 mb-4">
              <ArrowDownRight size={15} className="text-red-400" />
              <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">Top Losers</h3>
            </div>
            <div className="space-y-2">
              {TOP_LOSERS.map((token, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <div>
                    <div className="text-sm font-medium text-white">{token.symbol}</div>
                    <div className="text-xs text-[#505058]">{token.price}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-red-400">{token.change}</div>
                    <div className="text-xs text-[#505058]">{token.volume}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DEX Volumes */}
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-4">
            <div className="flex items-center gap-2 mb-4">
              <Droplets size={15} className="text-cyan-400" />
              <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">DEX Volume by Chain</h3>
            </div>
            <div className="space-y-2">
              {DEX_VOLUMES.map((chain, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <div className="text-sm font-medium text-white">{chain.chain}</div>
                  <div className="text-right">
                    <div className="text-sm text-[#a0a0a8]">{chain.volume}</div>
                    <div className={cn(
                      "text-xs font-medium",
                      chain.change.startsWith("+") ? "text-emerald-400" : "text-red-400"
                    )}>
                      {chain.change}
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
