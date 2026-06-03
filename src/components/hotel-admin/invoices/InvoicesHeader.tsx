import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvoicesHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
  onCreate: () => void;
}

export function InvoicesHeader({ isRefreshing, onRefresh, onCreate }: InvoicesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Invoices</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage billing, invoicing, and receivables across the property
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="border-[#C9973A] text-[#C9973A] hover:bg-[#C9973A] hover:text-white"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={cn('mr-2 h-4 w-4', isRefreshing && 'animate-spin')} />
          Refresh
        </Button>
        <Button className="bg-[#0F1B2D] hover:bg-[#1a2a3a]" onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>
    </div>
  );
}
