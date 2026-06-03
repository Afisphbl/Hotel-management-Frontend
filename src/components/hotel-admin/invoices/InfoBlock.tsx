import { cn } from '@/lib/utils';

interface InfoBlockProps {
  label: string;
  value: string;
  className?: string;
}

export function InfoBlock({ label, value, className }: InfoBlockProps) {
  return (
    <div className={cn('rounded-lg bg-slate-50 p-3', className)}>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-[#0F1B2D]">{value}</p>
    </div>
  );
}
