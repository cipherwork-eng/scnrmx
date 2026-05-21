import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/format";

interface Props {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  accent?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ icon: Icon, title, subtitle, accent = "text-cyan-400", action }: Props) {
  return (
    <div className="flex items-start justify-between mb-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06]", accent)}>
          <Icon size={18} />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">{title}</h1>
          {subtitle && <p className="text-xs text-[#606068] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
