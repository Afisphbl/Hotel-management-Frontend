import { Clock } from "lucide-react";

interface UsageComingSoonProps {
  title: string;
  description: string;
}

export function UsageComingSoon({ title, description }: UsageComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 h-full min-h-[300px]">
      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 border border-slate-100">
        <Clock className="w-6 h-6 text-[#C9973A] animate-pulse" />
      </div>
      <h3 className="text-sm font-bold text-[#0F1B2D] uppercase tracking-widest">{title}</h3>
      <p className="text-xs text-slate-400 mt-2 max-w-[200px] leading-relaxed">
        {description}
      </p>
      <div className="mt-4 px-3 py-1 bg-slate-100 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
        In Development
      </div>
    </div>
  );
}
