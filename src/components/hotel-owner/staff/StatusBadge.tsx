import { cn } from '@/lib/utils';

const statusConfig: Record<string, { bg: string; text: string }> = {
  'ACTIVE': { bg: 'bg-green-100', text: 'text-green-800' },
  'INACTIVE': { bg: 'bg-gray-100', text: 'text-gray-800' },
  'PENDING': { bg: 'bg-orange-100', text: 'text-orange-800' },
};

export function StatusBadge({ status, label }: { status: string; label: string }) {
  const c = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  return <span className={cn('px-3 py-1 rounded-full text-xs font-medium', c.bg, c.text)}>{label}</span>;
}
