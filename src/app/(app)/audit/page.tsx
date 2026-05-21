"use client";

import { useState, useRef } from "react";
import PageHeader from "@/components/page-header";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  FileText,
  Lock,
  Code,
  Users,
  ExternalLink,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/format";

const CHAINS = [
  { id: "ethereum", label: "Ethereum" },
  { id: "solana", label: "Solana" },
  { id: "base", label: "Base" },
  { id: "arbitrum", label: "Arbitrum" },
  { id: "bsc", label: "BSC" },
] as const;

type ChainId = (typeof CHAINS)[number]["id"];

interface AuditResult {
  safetyScore: number;
  riskFactors: string[];
  holderAnalysis: {
    topHolderPercent: number;
    totalHolders: number;
    concentration: string;
  };
  contractChecks: {
    verified: boolean;
    proxy: boolean;
    honeypot: boolean;
    renounced: boolean;
  };
  recommendations: string[];
}

interface RecentAudit {
  address: string;
  chain: string;
  score: number;
  name: string;
  time: string;
}

const RECENT_AUDITS: RecentAudit[] = [
  {
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    chain: "Ethereum",
    score: 92,
    name: "Uniswap (UNI)",
    time: "2m ago",
  },
  {
    address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
    chain: "Ethereum",
    score: 68,
    name: "Pepe (PEPE)",
    time: "15m ago",
  },
  {
    address: "0x000000000000000000000000000000000000dEaD",
    chain: "BSC",
    score: 8,
    name: "Suspicious Token (SCAM)",
    time: "1h ago",
  },
  {
    address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    chain: "Arbitrum",
    score: 95,
    name: "Arbitrum (ARB)",
    time: "3h ago",
  },
  {
    address: "0x6De037ef9aD2725EB40118Bb1702EBb27e4Aeb24",
    chain: "Ethereum",
    score: 45,
    name: "Render (RNDR)",
    time: "5h ago",
  },
];

function SafetyScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80
      ? "#10b981"
      : score >= 60
        ? "#f59e0b"
        : score >= 40
          ? "#f97316"
          : "#ef4444";
  const label =
    score >= 80
      ? "Safe"
      : score >= 60
        ? "Moderate"
        : score >= 40
          ? "High Risk"
          : "Dangerous";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span
            className="text-3xl font-bold tracking-tight"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-[10px] text-[#606068] uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>
      <span
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}

function ScoreRingSmall({ score }: { score: number }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80
      ? "#10b981"
      : score >= 60
        ? "#f59e0b"
        : score >= 40
          ? "#f97316"
          : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="40" height="40" className="-rotate-90">
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <span
        className="absolute text-[10px] font-semibold"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

export default function AuditPage() {
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState<ChainId>("ethereum");
  const [isLoading, setIsLoading] = useState(false);
  const [thinking, setThinking] = useState("");
  const [showThinking, setShowThinking] = useState(false);
  const [content, setContent] = useState("");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [hasAudited, setHasAudited] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const runAudit = async () => {
    if (!address.trim() || isLoading) return;

    setIsLoading(true);
    setThinking("");
    setContent("");
    setAuditResult(null);
    setHasAudited(false);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Run a full smart contract security audit on the following contract:\n\nChain: ${chain}\nAddress: ${address.trim()}\n\nProvide a structured audit with:\n1. Safety score (0-100)\n2. Risk factors\n3. Holder analysis\n4. Contract checks (verified, proxy, honeypot, renounced)\n5. Recommendations`,
            },
          ],
          context: "audit",
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";
      let assistantThinking = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let lastEventType = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            lastEventType = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            try {
              const json = JSON.parse(line.slice(6));
              if (lastEventType === "thinking") {
                assistantThinking += json.text || "";
              } else {
                assistantContent += json.text || json.content || "";
              }
            } catch {
              // Skip malformed data
            }
          }
        }

        setThinking(assistantThinking);
        setContent(assistantContent);
      }

      if (!assistantContent && !assistantThinking) {
        setContent(
          "The AI agent is connected but returned no data. Please verify the backend API configuration."
        );
      }

      // Parse structured result from the content (mock a structured result for display)
      setAuditResult(parseAuditResult(assistantContent, address.trim()));
      setHasAudited(true);
    } catch {
      setContent(
        "Unable to connect to the AI agent. Please verify the API configuration is set up correctly."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const parseAuditResult = (text: string, addr: string): AuditResult => {
    // Extract safety score from AI response or provide a structured fallback
    const scoreMatch = text.match(/(?:safety|score|rating)[\s:]*(\d{1,3})/i);
    const score = scoreMatch ? Math.min(100, parseInt(scoreMatch[1], 10)) : 0;

    return {
      safetyScore: score,
      riskFactors: extractBulletItems(text, "risk"),
      holderAnalysis: {
        topHolderPercent: 0,
        totalHolders: 0,
        concentration: "Unknown",
      },
      contractChecks: {
        verified: text.toLowerCase().includes("verified"),
        proxy: text.toLowerCase().includes("proxy"),
        honeypot: text.toLowerCase().includes("honeypot"),
        renounced: text.toLowerCase().includes("renounced"),
      },
      recommendations: extractBulletItems(text, "recommend"),
    };
  };

  const extractBulletItems = (text: string, keyword: string): string[] => {
    const lines = text.split("\n");
    let capturing = false;

    const result: string[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().includes(keyword)) {
        capturing = true;
        continue;
      }
      if (capturing && (trimmed.startsWith("-") || trimmed.startsWith("*") || /^\d+\./.test(trimmed))) {
        result.push(trimmed.replace(/^[-*\d.]+\s*/, ""));
      } else if (capturing && trimmed === "") {
        if (result.length > 0) break;
      }
    }
    return result.length > 0 ? result : [];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runAudit();
    }
  };

  const scoreColor = (score: number) =>
    score >= 80
      ? "text-emerald-400"
      : score >= 60
        ? "text-amber-400"
        : score >= 40
          ? "text-orange-400"
          : "text-red-400";

  const scoreBg = (score: number) =>
    score >= 80
      ? "bg-emerald-500/10 border-emerald-500/20"
      : score >= 60
        ? "bg-amber-500/10 border-amber-500/20"
        : score >= 40
          ? "bg-orange-500/10 border-orange-500/20"
          : "bg-red-500/10 border-red-500/20";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        <PageHeader
          icon={Shield}
          title="Contract Audit"
          subtitle="AI-powered smart contract security analysis"
          accent="text-cyan-400"
        />

        {/* Input Section */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Chain Selector */}
            <div className="flex-shrink-0">
              <select
                value={chain}
                onChange={(e) => setChain(e.target.value as ChainId)}
                className="h-10 px-3 bg-[#1a1a1e] border border-white/[0.08] rounded-lg text-sm text-white outline-none focus:border-white/[0.14] transition-colors appearance-none cursor-pointer"
              >
                {CHAINS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Address Input */}
            <div className="flex-1 flex items-center gap-2 bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-4 focus-within:border-white/[0.14] transition-colors">
              <Search size={15} className="text-[#404048] flex-shrink-0" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter contract address (0x...)"
                className="flex-1 h-10 bg-transparent text-sm text-white placeholder:text-[#404048] outline-none"
              />
            </div>

            {/* Run Audit Button */}
            <button
              onClick={runAudit}
              disabled={!address.trim() || isLoading}
              className={cn(
                "flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-sm font-medium transition-colors flex-shrink-0",
                address.trim() && !isLoading
                  ? "bg-cyan-600 text-white hover:bg-cyan-500"
                  : "bg-white/[0.04] text-[#404048] cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Shield size={14} />
                  <span>Run Audit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Area */}
        {isLoading && !hasAudited ? (
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20" />
                <Loader2
                  size={28}
                  className="text-cyan-400 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-white font-medium">
                  Analyzing contract on{" "}
                  {CHAINS.find((c) => c.id === chain)?.label}
                </p>
                <p className="text-xs text-[#505058] mt-1">
                  Running security checks, holder analysis, and code review...
                </p>
              </div>
              {/* Streaming thinking indicator */}
              {thinking && (
                <div className="w-full max-w-md mt-2">
                  <div className="text-xs text-[#505058] font-mono leading-relaxed max-h-32 overflow-y-auto p-3 rounded-lg bg-[#0a0a0c] border border-white/[0.04]">
                    {thinking.slice(-300)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : hasAudited ? (
          <div ref={resultsRef} className="space-y-4 animate-fade-in">
            {/* Thinking Collapsible */}
            {thinking && (
              <div className="rounded-xl border border-white/[0.06] bg-[#111113]">
                <button
                  onClick={() => setShowThinking((prev) => !prev)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/[0.02] transition-colors rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-[#505058]" />
                    <span className="text-xs font-medium text-[#606068]">
                      AI Reasoning Process
                    </span>
                  </div>
                  {showThinking ? (
                    <ChevronDown size={14} className="text-[#505058]" />
                  ) : (
                    <ChevronRight size={14} className="text-[#505058]" />
                  )}
                </button>
                {showThinking && (
                  <div className="px-5 pb-4 border-t border-white/[0.04]">
                    <pre className="mt-3 text-xs text-[#505058] font-mono leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                      {thinking}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Audit Score + Contract Checks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Safety Score Card */}
              <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-6 flex flex-col items-center justify-center">
                <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider mb-5 self-start">
                  Safety Score
                </h3>
                <SafetyScoreRing
                  score={auditResult?.safetyScore ?? 0}
                  size={140}
                />
                <p className="text-xs text-[#505058] mt-4 text-center max-w-xs">
                  AI analysis of contract security, holder distribution, and code
                  integrity
                </p>
              </div>

              {/* Contract Checks */}
              <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-5">
                <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider mb-4">
                  Contract Checks
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      label: "Source Verified",
                      value: auditResult?.contractChecks.verified ?? false,
                      icon: Code,
                    },
                    {
                      label: "Proxy Contract",
                      value: auditResult?.contractChecks.proxy ?? false,
                      icon: Lock,
                      inverted: true,
                    },
                    {
                      label: "Honeypot Detected",
                      value: auditResult?.contractChecks.honeypot ?? false,
                      icon: AlertTriangle,
                      inverted: true,
                    },
                    {
                      label: "Ownership Renounced",
                      value: auditResult?.contractChecks.renounced ?? false,
                      icon: CheckCircle,
                    },
                  ].map(({ label, value, icon: Icon, inverted }) => {
                    const isGood = inverted ? !value : value;
                    return (
                      <div
                        key={label}
                        className="flex items-center gap-3 py-1.5"
                      >
                        <Icon
                          size={14}
                          className={
                            isGood ? "text-emerald-400/60" : "text-red-400/60"
                          }
                        />
                        <span className="text-xs text-[#808088] flex-1">
                          {label}
                        </span>
                        {value ? (
                          <CheckCircle
                            size={14}
                            className={cn(
                              inverted ? "text-red-400" : "text-emerald-400"
                            )}
                          />
                        ) : (
                          <XCircle
                            size={14}
                            className={cn(
                              inverted ? "text-emerald-400" : "text-red-400"
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            {auditResult &&
              auditResult.riskFactors.length > 0 && (
                <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle size={14} className="text-amber-400" />
                    <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">
                      Risk Factors
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {auditResult.riskFactors.map((risk, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 py-2 px-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/10"
                      >
                        <AlertTriangle
                          size={12}
                          className="text-amber-400/70 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-xs text-[#a0a0a8] leading-relaxed">
                          {risk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Holder Analysis */}
            {auditResult && (
              <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={14} className="text-cyan-400" />
                  <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">
                    Holder Analysis
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-[#505058] mb-1">
                      Top Holder %
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {auditResult.holderAnalysis.topHolderPercent > 0
                        ? `${auditResult.holderAnalysis.topHolderPercent}%`
                        : "--"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#505058] mb-1">
                      Total Holders
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {auditResult.holderAnalysis.totalHolders > 0
                        ? auditResult.holderAnalysis.totalHolders.toLocaleString()
                        : "--"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#505058] mb-1">
                      Concentration
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {auditResult.holderAnalysis.concentration}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {auditResult &&
              auditResult.recommendations.length > 0 && (
                <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={14} className="text-emerald-400" />
                    <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">
                      Recommendations
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {auditResult.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 py-2 px-3 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/10"
                      >
                        <CheckCircle
                          size={12}
                          className="text-emerald-400/70 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-xs text-[#a0a0a8] leading-relaxed">
                          {rec}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Raw AI Response */}
            {content && (
              <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={14} className="text-[#505058]" />
                  <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">
                    Full Analysis
                  </h3>
                </div>
                <div className="text-sm text-[#c0c0c8] leading-relaxed whitespace-pre-wrap">
                  {content}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-5">
                <Shield size={24} className="text-cyan-400" />
              </div>
              <h2 className="text-base font-semibold text-white mb-2 tracking-tight">
                AI Contract Auditor
              </h2>
              <p className="text-xs text-[#606068] max-w-sm leading-relaxed mb-6">
                Enter a contract address to run a comprehensive security audit
                powered by AI. Checks include code verification, honeypot
                detection, holder analysis, and more.
              </p>
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                {[
                  {
                    icon: Code,
                    label: "Code Review",
                    color: "text-cyan-400",
                  },
                  {
                    icon: Lock,
                    label: "Proxy Detection",
                    color: "text-purple-400",
                  },
                  {
                    icon: AlertTriangle,
                    label: "Honeypot Check",
                    color: "text-amber-400",
                  },
                  {
                    icon: Users,
                    label: "Holder Analysis",
                    color: "text-emerald-400",
                  },
                ].map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                  >
                    <Icon size={13} className={color} />
                    <span className="text-[11px] text-[#707078]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Audits Sidebar */}
      <div className="lg:col-span-1">
        <div className="rounded-xl border border-white/[0.06] bg-[#111113] sticky top-6">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">
              Recent Audits
            </h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {RECENT_AUDITS.map((audit) => (
              <button
                key={audit.address}
                onClick={() => {
                  setAddress(audit.address);
                  const chainMap: Record<string, ChainId> = {
                    Ethereum: "ethereum",
                    Solana: "solana",
                    Base: "base",
                    Arbitrum: "arbitrum",
                    BSC: "bsc",
                  };
                  setChain(chainMap[audit.chain] || "ethereum");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
              >
                <ScoreRingSmall score={audit.score} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">
                    {audit.name}
                  </div>
                  <div className="text-[10px] text-[#404048] font-mono truncate mt-0.5">
                    {audit.address.slice(0, 6)}...{audit.address.slice(-4)}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-[#505058]">
                      {audit.chain}
                    </span>
                    <span className="text-[10px] text-[#303038]">
                      {audit.time}
                    </span>
                  </div>
                </div>
                <ExternalLink size={11} className="text-[#303038] flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
