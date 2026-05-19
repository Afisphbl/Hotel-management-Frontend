
import { Badge } from '@/components/ui/badge';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusMap: Record<string, { label: string, variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
  confirmed: { label: 'Confirmed', variant: 'default', className: 'bg-green-600 hover:bg-green-700' },
  checked_in: { label: 'In House', variant: 'default', className: 'bg-blue-600 hover:bg-blue-700' },
  checked_out: { label: 'Checked Out', variant: 'secondary', className: '' },
  cancelled: { label: 'Cancelled', variant: 'destructive', className: '' },
  hold: { label: 'On Hold', variant: 'outline', className: 'border-amber-500 text-amber-500' },
  no_show: { label: 'No Show', variant: 'destructive', className: 'bg-red-800' },
  active: { label: 'Active', variant: 'default', className: 'bg-green-600' },
  inactive: { label: 'Inactive', variant: 'secondary', className: '' },
  suspended: { label: 'Suspended', variant: 'destructive', className: '' },
  critical: { label: 'Critical', variant: 'destructive', className: 'animate-pulse' },
  high: { label: 'High', variant: 'destructive', className: 'bg-orange-600' },
  medium: { label: 'Medium', variant: 'outline', className: 'border-yellow-500 text-yellow-500' },
  low: { label: 'Low', variant: 'secondary', className: '' },
  open: { label: 'Open', variant: 'outline', className: 'border-blue-500 text-blue-500' },
  in_progress: { label: 'In Progress', variant: 'outline', className: 'border-blue-700 text-blue-700' },
  resolved: { label: 'Resolved', variant: 'default', className: 'bg-green-600' },
  closed: { label: 'Closed', variant: 'secondary', className: '' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusMap[status.toLowerCase()] || { label: status, variant: 'outline', className: '' };
  
  return (
    <Badge 
      variant={config.variant} 
      className={cn("capitalize px-2 py-0.5", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
