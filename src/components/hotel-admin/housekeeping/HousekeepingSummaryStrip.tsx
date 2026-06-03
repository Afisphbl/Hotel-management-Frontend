import { RotateCw, Brush, Search, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Summary {
  dirty: number;
  cleaning: number;
  inspecting: number;
  clean: number;
  total: number;
  pendingActive: number;
  completed: number;
}

interface HousekeepingSummaryStripProps {
  summary: Summary;
}

export function HousekeepingSummaryStrip({ summary }: HousekeepingSummaryStripProps) {
  const stats = [
    { label: 'Dirty', count: summary.dirty, color: 'text-red-500', icon: RotateCw },
    { label: 'Cleaning', count: summary.cleaning, color: 'text-blue-500', icon: Brush },
    { label: 'Inspecting', count: summary.inspecting, color: 'text-amber-500', icon: Search },
    { label: 'Clean', count: summary.clean, color: 'text-green-500', icon: CheckCircle },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border-b-2 border-transparent hover:border-[#C9973A] transition-all group">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-serif text-[#0F1B2D]">{stat.count}</p>
          </div>
          <stat.icon className={cn("w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity", stat.color)} />
        </div>
      ))}
    </div>
  );
}
