import { Info } from "lucide-react";

interface AdminInfoCardProps {
  className?: string;
}

export function AdminInfoCard({ className = "" }: AdminInfoCardProps) {
  return (
    <div className={`flex items-start gap-3 p-4 bg-slate-100 rounded-xl border border-slate-200 ${className}`}>
      <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
      <div className="text-xs text-slate-500 space-y-1">
        <p className="font-bold text-slate-700 uppercase tracking-widest text-[9px]">
          Administrative Policy
        </p>
        <p>
          Super Admins provide high-level support and emergency oversight.
          Normal staff management (hiring, role assignments) should be
          performed by the Hotel Owner via the tenant dashboard.
        </p>
      </div>
    </div>
  );
}