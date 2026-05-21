"use client";

import PageHeader from "@/components/page-header";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  ExternalLink,
} from "lucide-react";
import { formatAddress, cn } from "@/lib/format";

const WHALE_TXS = [
  { from: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18", to: "Binance Hot Wallet", token: "ETH", amount: "2,450 ETH", value: "$6.12M", type: "deposit", time: "2 min ago", chain: "Ethereum" },
  { from: "0x28C6c06298d514Db089934071355E5743bf21d60", to: "0xf2d5...E34A", token: "USDC", amount: "1,200,000 USDC", value: "$1.2M", type: "transfer", time: "5 min ago", chain: "Base" },
  { from: "Wintermute", to: "0x8E3b...4c2F", token: "ARB", amount: "890,000 ARB", value: "$1.05M", type: "buy", time: "8 min ago", chain: "Arbitrum" },
  { from: "0x56Ed...7F21", to: "Uniswap V3", token: "ENA", amount: "3,200,000 ENA", value: "$2.88M", type: "buy", time: "12 min ago", chain: "Ethereum" },
  { from: "Jump Trading", to: "0x1a2B...9C3D", token: "SOL", amount: "45,000 SOL", value: "$7.2M", type: "transfer", time: "15 min ago", chain: "Solana" },
  { from: "0xDEF...123", to: "Curve Pool", token: "stETH", amount: "12,500 stETH", value: "$31.2M", type: "deposit", time: "18 min ago", chain: "Ethereum" },
  { from: "Alameda Research", to: "0x456...789", token: "FTT", amount: "500,000 FTT", value: "$620K", type: "sell", time: "22 min ago", chain: "Ethereum" },
  { from: "0xBob...456", to: "Binance", token: "AVAX", amount: "120,000 AVAX", value: "$4.32M", type: "deposit", time: "25 min ago", chain: "Avalanche" },
];

const TOP_WALLETS = [
  { address: "0x28C6c06298d514Db089934071355E5743bf21d60", label: "Binance Cold", pnl: "+$42.3M", winRate: "78%", chains: 4 },
  { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18", label: "Wintermute", pnl: "+$38.1M", winRate: "82%", chains: 6 },
  { address: "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8", label: "Jump Trading", pnl: "+$29.8M", winRate: "71%", chains: 5 },
  { address: "0xf2d5E34AbCdEf1234567890AbCdEf1234567890", label: "Unknown Whale", pnl: "+$18.4M", winRate: "68%", chains: 3 },
  { address: "0x56Ed7F21ABcDeF123456789AbCdEf12345678901", label: "Paradigm", pnl: "+$15.2M", winRate: "74%", chains: 4 },
];

export default function WhalesPage() {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
        <PageHeader
          icon={Wallet}
          title="Whale Tracker"
          subtitle="Monitor smart money movements in real-time"
          accent="text-purple-400"
          action={
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-[#808088] hover:text-white hover:border-white/[0.14] transition-colors">
              <Filter size={13} />
              Filters
            </button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transaction Feed */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-white/[0.06] bg-[#111113]">
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">Live Transactions</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                    <span className="text-[10px] text-[#505058]">Live</span>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {WHALE_TXS.map((tx, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-white/[0.02] transition-colors animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-md",
                          tx.type === "buy" && "bg-emerald-500/10",
                          tx.type === "sell" && "bg-red-500/10",
                          tx.type === "deposit" && "bg-amber-500/10",
                          tx.type === "transfer" && "bg-blue-500/10"
                        )}>
                          {tx.type === "buy" ? (
                            <ArrowUpRight size={12} className="text-emerald-400" />
                          ) : tx.type === "sell" ? (
                            <ArrowDownRight size={12} className="text-red-400" />
                          ) : (
                            <ExternalLink size={12} className="text-[#606068]" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {tx.from.length > 20 ? formatAddress(tx.from.startsWith("0x") ? tx.from : "0x0000000000000000000000000000000000000000") : tx.from}
                            <span className="text-[#505058] mx-1">→</span>
                            {tx.to.length > 20 ? formatAddress(tx.to.startsWith("0x") ? tx.to : "0x0000000000000000000000000000000000000001") : tx.to}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={cn(
                              "text-[10px] font-medium px-1.5 py-0.5 rounded",
                              tx.type === "buy" && "bg-emerald-500/10 text-emerald-400",
                              tx.type === "sell" && "bg-red-500/10 text-red-400",
                              tx.type === "deposit" && "bg-amber-500/10 text-amber-400",
                              tx.type === "transfer" && "bg-blue-500/10 text-blue-400"
                            )}>
                              {tx.type}
                            </span>
                            <span className="text-[10px] text-[#404048]">{tx.chain}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">{tx.amount}</div>
                        <div className="text-xs text-[#606068]">{tx.value}</div>
                        <div className="text-[10px] text-[#404048] mt-0.5">{tx.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Wallets */}
          <div className="rounded-xl border border-white/[0.06] bg-[#111113]">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">Top Performing Wallets</h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {TOP_WALLETS.map((w, i) => (
                <div key={i} className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-white">{w.label}</span>
                    <span className="text-xs font-medium text-emerald-400">{w.pnl}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#404048]">{formatAddress(w.address, 4)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#505058]">Win: {w.winRate}</span>
                      <span className="text-[10px] text-[#404048]">{w.chains} chains</span>
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
