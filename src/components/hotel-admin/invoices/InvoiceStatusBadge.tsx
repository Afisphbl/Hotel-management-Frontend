import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { STATUS_META } from './types';
import type { InvoiceStatus } from './types';

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const meta = STATUS_META[status] || STATUS_META.draft;
  return (
    <Badge variant="outline" className={cn('border', meta.className)}>
      {meta.label}
    </Badge>
  );
}
