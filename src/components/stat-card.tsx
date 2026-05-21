import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/format";

interface Props {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  accent?: string;
  className?: string;
}

export default function StatCard({ label, value, change, changeType = "neutral", icon: Icon, accent = "text-cyan-400", className }: Props) {
  return (
    <div className={cn(
      "rounded-xl border border-white/[0.06] bg-[#111113] p-4 hover:border-white/[0.1] transition-colors",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[#606068] uppercase tracking-wider">{label}</span>
        {Icon && <Icon size={15} className={accent} />}
      </div>
      <div className="text-xl font-semibold text-white tracking-tight">{value}</div>
      {change && (
        <div className={cn(
          "text-xs font-medium mt-1.5",
          changeType === "positive" && "text-emerald-400",
          changeType === "negative" && "text-red-400",
          changeType === "neutral" && "text-[#606068]"
        )}>
          {change}
        </div>
      )}
    </div>
  );
}
