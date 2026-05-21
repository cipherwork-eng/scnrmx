"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import PageHeader from "@/components/page-header";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  MessageSquare,
  GitFork,
  Newspaper,
  Brain,
  Gauge,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronRight,
  Send,
  Loader2,
  Copy,
  Check,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/format";

// ─── Sentiment types ─────────────────────────────────────────────

type SentimentLabel = "Very Bearish" | "Bearish" | "Neutral" | "Bullish" | "Very Bullish";

interface TokenSentiment {
  name: string;
  symbol: string;
  score: number;
  change24h: number;
  socialVolume: number;
  summary: string;
  twitterMentions: number;
  redditActivity: number;
  githubCommits: number;
  newsSentiment: number;
}

interface TrendingTopic {
  label: string;
  description: string;
  momentum: number;
  positive: boolean;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  thinking?: string;
}

// ─── Mock data ───────────────────────────────────────────────────

const FEAR_GREED_INDEX = 68;

const TOKEN_SENTIMENTS: TokenSentiment[] = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    score: 74,
    change24h: 3.2,
    socialVolume: 82,
    summary: "Institutional inflows remain strong; ETF volumes surging with sustained demand from TradFi allocators.",
    twitterMentions: 88,
    redditActivity: 71,
    githubCommits: 34,
    newsSentiment: 79,
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    score: 69,
    change24h: 1.8,
    socialVolume: 76,
    summary: "Pectra upgrade narrative gaining traction; L2 activity driving renewed developer and user engagement.",
    twitterMentions: 75,
    redditActivity: 68,
    githubCommits: 92,
    newsSentiment: 72,
  },
  {
    name: "Solana",
    symbol: "SOL",
    score: 78,
    change24h: 5.4,
    socialVolume: 91,
    summary: "DEX volume dominance continues; memecoin activity driving record on-chain metrics and user acquisition.",
    twitterMentions: 93,
    redditActivity: 84,
    githubCommits: 67,
    newsSentiment: 81,
  },
  {
    name: "Arbitrum",
    symbol: "ARB",
    score: 58,
    change24h: -1.2,
    socialVolume: 45,
    summary: "Stagnant price action despite healthy TVL growth; competing L2s capturing developer mindshare.",
    twitterMentions: 42,
    redditActivity: 38,
    githubCommits: 78,
    newsSentiment: 52,
  },
  {
    name: "Avalanche",
    symbol: "AVAX",
    score: 52,
    change24h: -2.8,
    socialVolume: 33,
    summary: "Subnet narrative fading; institutional partnerships failing to translate into sustained on-chain activity.",
    twitterMentions: 31,
    redditActivity: 28,
    githubCommits: 45,
    newsSentiment: 44,
  },
  {
    name: "Render",
    symbol: "RNDR",
    score: 82,
    change24h: 8.1,
    socialVolume: 87,
    summary: "AI narrative convergence with DePIN driving explosive interest; GPU demand thesis resonating with traders.",
    twitterMentions: 85,
    redditActivity: 72,
    githubCommits: 56,
    newsSentiment: 88,
  },
];

const TRENDING_TOPICS: TrendingTopic[] = [
  { label: "AI Agent Tokens", description: "FET, RENDER, TAO leading the AI-crypto convergence narrative", momentum: 92, positive: true },
  { label: "L2 Season", description: "Base and Scroll seeing record bridging volumes and TVL inflows", momentum: 74, positive: true },
  { label: "Memecoin Mania", description: "Solana memecoins driving retail volume; PEPE and WIF dominating social feeds", momentum: 85, positive: true },
  { label: "RWA Tokenization", description: "BlackRock BUIDL fund expanding; institutional RWA thesis strengthening", momentum: 68, positive: true },
  { label: "Restaking Wars", description: "EigenLayer TVL declining; competing protocols fragmenting the restaking narrative", momentum: 41, positive: false },
  { label: "Regulatory Clarity", description: "SEC stance softening post-election; stablecoin legislation gaining bipartisan support", momentum: 63, positive: true },
];

const TOKEN_OPTIONS = ["BTC", "ETH", "SOL", "ARB", "AVAX", "RNDR", "LINK", "AAVE", "UNI", "INJ", "TIA", "Custom"];

// ─── Helpers ─────────────────────────────────────────────────────

function getSentimentLabel(score: number): SentimentLabel {
  if (score < 20) return "Very Bearish";
  if (score < 40) return "Bearish";
  if (score < 60) return "Neutral";
  if (score < 80) return "Bullish";
  return "Very Bullish";
}

function getSentimentColor(score: number): string {
  if (score < 20) return "text-red-500";
  if (score < 40) return "text-orange-400";
  if (score < 60) return "text-[#808088]";
  if (score < 80) return "text-emerald-400";
  return "text-green-400";
}

function getSentimentBgColor(score: number): string {
  if (score < 20) return "bg-red-500";
  if (score < 40) return "bg-orange-400";
  if (score < 60) return "bg-[#808088]";
  if (score < 80) return "bg-emerald-400";
  return "bg-green-400";
}

function getGaugeColor(score: number): string {
  if (score < 20) return "#ef4444";
  if (score < 40) return "#fb923c";
  if (score < 60) return "#808088";
  if (score < 80) return "#34d399";
  return "#22c55e";
}

// ─── Subcomponents ───────────────────────────────────────────────

function FearGreedGauge({ score }: { score: number }) {
  const color = getGaugeColor(score);
  const label = getSentimentLabel(score);
  // Arc from 135deg to 405deg (270deg sweep)
  const angle = 135 + (score / 100) * 270;
  const radians = (angle * Math.PI) / 180;
  const cx = 120;
  const cy = 120;
  const r = 90;
  const needleX = cx + r * 0.7 * Math.cos(radians);
  const needleY = cy + r * 0.7 * Math.sin(radians);

  // Build arc segments for the gradient
  const arcSegments = useMemo(() => {
    const segments: { d: string; color: string }[] = [];
    const steps = 40;
    for (let i = 0; i < steps; i++) {
      const startAngle = 135 + (i / steps) * 270;
      const endAngle = 135 + ((i + 1) / steps) * 270;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      const frac = i / steps;
      let col = "#ef4444";
      if (frac > 0.8) col = "#22c55e";
      else if (frac > 0.6) col = "#34d399";
      else if (frac > 0.4) col = "#808088";
      else if (frac > 0.2) col = "#fb923c";
      segments.push({
        d: `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`,
        color: col,
      });
    }
    return segments;
  }, []);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-6 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        <Gauge size={15} className="text-cyan-400" />
        <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">
          Market Fear &amp; Greed Index
        </h3>
      </div>
      <svg width="240" height="160" viewBox="0 0 240 160">
        {/* Track background */}
        <path
          d={`M ${cx + r * Math.cos((135 * Math.PI) / 180)} ${cy + r * Math.sin((135 * Math.PI) / 180)} A ${r} ${r} 0 1 1 ${cx + r * Math.cos((405 * Math.PI) / 180)} ${cy + r * Math.sin((405 * Math.PI) / 180)}`}
          fill="none"
          stroke="#1a1a1e"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Gradient arc */}
        {arcSegments.map((seg, i) => (
          <path
            key={i}
            d={seg.d}
            fill="none"
            stroke={seg.color}
            strokeWidth="14"
            strokeLinecap={i === 0 || i === arcSegments.length - 1 ? "round" : "butt"}
            opacity={0.8}
          />
        ))}
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="5" fill={color} />
        {/* Score text */}
        <text x={cx} y={cy + 35} textAnchor="middle" fill="white" fontSize="28" fontWeight="600" fontFamily="Inter">
          {score}
        </text>
        <text x={cx} y={cy + 55} textAnchor="middle" fill={color} fontSize="12" fontWeight="500" fontFamily="Inter">
          {label}
        </text>
      </svg>
      <div className="flex items-center justify-between w-full max-w-[200px] mt-1">
        <span className="text-[10px] text-red-500/60">Fear</span>
        <span className="text-[10px] text-green-500/60">Greed</span>
      </div>
    </div>
  );
}

function SentimentBar({ value, label, icon: Icon, color }: { value: number; label: string; icon: React.ElementType; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon size={12} className={color} />
          <span className="text-xs text-[#808088]">{label}</span>
        </div>
        <span className="text-xs font-medium text-[#c0c0c8]">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getSentimentBgColor(value))}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────

export default function SentimentPage() {
  // Deep analysis state
  const [selectedToken, setSelectedToken] = useState("BTC");
  const [customToken, setCustomToken] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showThinking, setShowThinking] = useState<Record<number, boolean>>({});
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const analyzeToken = async () => {
    const token = selectedToken === "Custom" ? customToken.trim() : selectedToken;
    if (!token || isLoading) return;

    const prompt = `Provide a deep sentiment analysis for ${token}. Cover social media sentiment, on-chain metrics, recent news impact, and your overall sentiment outlook. Include specific risk factors and catalysts.`;

    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setIsLoading(true);
    setDropdownOpen(false);

    setMessages((prev) => [...prev, { role: "assistant", content: "", thinking: "" }]);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: prompt }],
          context: "sentiment",
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

        for (const line of lines) {
          if (line.startsWith("event: thinking")) {
            // next data line is thinking
          } else if (line.startsWith("event: content")) {
            // next data line is content
          } else if (line.startsWith("data: ")) {
            try {
              const json = JSON.parse(line.slice(6));
              const lastEvent = lines[lines.indexOf(line) - 1];
              if (lastEvent?.startsWith("event: thinking")) {
                assistantThinking += json.text || "";
              } else {
                assistantContent += json.text || json.content || "";
              }
            } catch {
              // Skip malformed data
            }
          }
        }

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantContent,
            thinking: assistantThinking || undefined,
          };
          return updated;
        });
      }

      if (!assistantContent && !assistantThinking) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: `Deep sentiment analysis for ${token} is ready. The AI agent will provide comprehensive social signals, on-chain metrics, and market outlook once the backend is configured.`,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Unable to connect to the AI agent. Please verify the API configuration is set up correctly.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
        <PageHeader
          icon={Brain}
          title="Market Sentiment"
          subtitle="AI-powered sentiment analysis across social signals, on-chain data, and market narratives"
        />

        {/* Row 1: Fear/Greed Gauge + Market Overview Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
          <FearGreedGauge score={FEAR_GREED_INDEX} />

          {/* Market Sentiment Summary Cards */}
          <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-[#111113] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={15} className="text-cyan-400" />
              <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">Market Pulse</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Social Volume", value: "1.24M", change: "+18.4%", positive: true, icon: MessageSquare },
                { label: "News Sentiment", value: "72/100", change: "+5.2", positive: true, icon: Newspaper },
                { label: "Dev Activity", value: "2,847", change: "+3.1%", positive: true, icon: GitFork },
                { label: "Trend Score", value: "81/100", change: "+12.8", positive: true, icon: TrendingUp },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <stat.icon size={12} className="text-[#505058]" />
                    <span className="text-[10px] text-[#505058] uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <div className="text-lg font-semibold text-white tracking-tight">{stat.value}</div>
                  <div className={cn("text-xs font-medium flex items-center gap-1",
                    stat.positive ? "text-emerald-400" : "text-red-400"
                  )}>
                    {stat.positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Token Sentiment Cards */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-cyan-400" />
            <h2 className="text-sm font-semibold text-white tracking-tight">Token Sentiment</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TOKEN_SENTIMENTS.map((token) => (
              <div
                key={token.symbol}
                className="rounded-xl border border-white/[0.06] bg-[#111113] p-4 hover:border-white/[0.1] transition-colors"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-medium text-white">{token.name}</div>
                    <div className="text-xs text-[#505058]">{token.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className={cn("text-lg font-semibold", getSentimentColor(token.score))}>
                      {token.score}
                    </div>
                    <div className={cn("text-[10px] font-medium", getSentimentColor(token.score))}>
                      {getSentimentLabel(token.score)}
                    </div>
                  </div>
                </div>

                {/* Sentiment bar */}
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-3">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", getSentimentBgColor(token.score))}
                    style={{ width: `${token.score}%` }}
                  />
                </div>

                {/* 24h change + social volume */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    {token.change24h >= 0 ? (
                      <TrendingUp size={12} className="text-emerald-400" />
                    ) : (
                      <TrendingDown size={12} className="text-red-400" />
                    )}
                    <span className={cn(
                      "text-xs font-medium",
                      token.change24h >= 0 ? "text-emerald-400" : "text-red-400"
                    )}>
                      {token.change24h >= 0 ? "+" : ""}{token.change24h}%
                    </span>
                    <span className="text-[10px] text-[#404048]">24h</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare size={11} className="text-[#505058]" />
                    <span className="text-xs text-[#808088]">{token.socialVolume}%</span>
                  </div>
                </div>

                {/* Social signals */}
                <div className="space-y-1.5 mb-3">
                  <SentimentBar value={token.twitterMentions} label="Twitter" icon={MessageSquare} color="text-sky-400" />
                  <SentimentBar value={token.redditActivity} label="Reddit" icon={Flame} color="text-orange-400" />
                  <SentimentBar value={token.githubCommits} label="GitHub" icon={GitFork} color="text-[#a0a0a8]" />
                  <SentimentBar value={token.newsSentiment} label="News" icon={Newspaper} color="text-violet-400" />
                </div>

                {/* AI summary */}
                <p className="text-xs text-[#707078] leading-relaxed border-t border-white/[0.04] pt-3">
                  {token.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Trending Topics + Deep Analysis side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Trending Topics */}
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Flame size={15} className="text-amber-400" />
              <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">Trending Narratives</h3>
            </div>
            <div className="space-y-3">
              {TRENDING_TOPICS.map((topic, i) => (
                <div key={i} className="space-y-1.5 pb-3 border-b border-white/[0.04] last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{topic.label}</span>
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      topic.positive ? "text-emerald-400" : "text-red-400"
                    )}>
                      {topic.positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                      {topic.momentum}
                    </div>
                  </div>
                  <p className="text-xs text-[#505058] leading-relaxed">{topic.description}</p>
                  <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        topic.positive ? "bg-emerald-400" : "bg-red-400"
                      )}
                      style={{ width: `${topic.momentum}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deep Analysis */}
          <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-[#111113] flex flex-col min-h-[500px]">
            <div className="flex items-center gap-2 p-5 pb-0 mb-4">
              <Brain size={15} className="text-cyan-400" />
              <h3 className="text-xs font-medium text-[#606068] uppercase tracking-wider">Deep Sentiment Analysis</h3>
            </div>

            {/* Token selector */}
            <div className="px-5 mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.08] bg-[#1a1a1e] text-sm text-white hover:border-white/[0.14] transition-colors min-w-[120px]"
                  >
                    {selectedToken}
                    <ChevronDown size={14} className="text-[#505058] ml-auto" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full rounded-lg border border-white/[0.08] bg-[#1a1a1e] py-1 z-10 shadow-lg max-h-48 overflow-y-auto">
                      {TOKEN_OPTIONS.map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setSelectedToken(t);
                            setDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-1.5 text-sm hover:bg-white/[0.06] transition-colors",
                            selectedToken === t ? "text-cyan-400" : "text-[#c0c0c8]"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedToken === "Custom" && (
                  <input
                    type="text"
                    value={customToken}
                    onChange={(e) => setCustomToken(e.target.value.toUpperCase())}
                    placeholder="Enter token symbol..."
                    className="flex-1 px-3 py-2 rounded-lg border border-white/[0.08] bg-[#1a1a1e] text-sm text-white placeholder:text-[#404048] outline-none focus:border-white/[0.14] transition-colors"
                  />
                )}

                <button
                  onClick={analyzeToken}
                  disabled={isLoading || (selectedToken === "Custom" && !customToken.trim())}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    !isLoading
                      ? "bg-cyan-600 text-white hover:bg-cyan-500"
                      : "bg-white/[0.04] text-[#404048]"
                  )}
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  Analyze
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-5 pb-5">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-4">
                    <Brain size={20} className="text-[#505058]" />
                  </div>
                  <p className="text-sm text-[#505058] mb-1">No analysis yet</p>
                  <p className="text-xs text-[#404048]">Select a token and click Analyze to get AI-powered sentiment insights</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={cn("animate-fade-in", msg.role === "user" ? "flex justify-end" : "")}>
                      {msg.role === "user" ? (
                        <div className="max-w-[85%] px-4 py-2.5 rounded-xl bg-cyan-600/15 border border-cyan-500/20 text-sm text-[#e0e0e8]">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="group">
                          {/* Thinking block */}
                          {msg.thinking && (
                            <div className="mb-3">
                              <button
                                onClick={() => setShowThinking((prev) => ({ ...prev, [i]: !prev[i] }))}
                                className="flex items-center gap-2 text-xs text-[#505058] hover:text-[#707078] transition-colors mb-2"
                              >
                                {showThinking[i] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                <span>Reasoning process</span>
                              </button>
                              {showThinking[i] && (
                                <div className="pl-4 border-l border-white/[0.06] text-xs text-[#505058] font-mono leading-relaxed whitespace-pre-wrap mb-2">
                                  {msg.thinking}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Content */}
                          <div className="text-sm text-[#c0c0c8] leading-relaxed whitespace-pre-wrap">
                            {msg.content || (
                              <div className="flex items-center gap-1.5 text-[#505058]">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40 thinking-dot" />
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40 thinking-dot" />
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40 thinking-dot" />
                              </div>
                            )}
                          </div>

                          {/* Copy button */}
                          {msg.content && (
                            <button
                              onClick={() => copyToClipboard(msg.content, i)}
                              className="mt-2 flex items-center gap-1.5 text-xs text-[#404048] hover:text-[#707078] opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {copiedIdx === i ? <Check size={12} /> : <Copy size={12} />}
                              <span>{copiedIdx === i ? "Copied" : "Copy"}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/[0.04]">
              <p className="text-[10px] text-[#303038] text-center">
                AI-powered analysis — not financial advice. Always DYOR.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
