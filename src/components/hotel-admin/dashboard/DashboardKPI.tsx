import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface DashboardKPIProps {
  title: string;
  value: string | number;
  loading: boolean;
  accent: string;
}

export function DashboardKPI({ title, value, loading, accent }: DashboardKPIProps) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{title}</p>
      {loading ? (
        <Skeleton className="mt-2 h-7 w-20" />
      ) : (
        <p className={cn('mt-1 text-xl font-bold', accent)}>{value}</p>
      )}
    </div>
  );
}
