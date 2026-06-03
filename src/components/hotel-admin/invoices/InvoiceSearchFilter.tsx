import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_FILTERS } from './types';
import type { FilterValue } from './types';

interface InvoiceSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: FilterValue;
  onStatusChange: (value: FilterValue) => void;
}

export function InvoiceSearchFilter({ searchTerm, onSearchChange, selectedStatus, onStatusChange }: InvoiceSearchFilterProps) {
  return (
    <Card className="border-none bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search invoice number, booking ID, guest, or notes"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => onStatusChange(filter.value)}
                className={cn(
                  'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition',
                  selectedStatus === filter.value
                    ? 'bg-[#C9973A] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
