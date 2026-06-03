import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HousekeepingSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (status: string) => void;
}

export function HousekeepingSearchFilter({ searchTerm, onSearchChange, filterStatus, onFilterChange }: HousekeepingSearchFilterProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search tasks..." value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {['ALL', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].map(s => (
              <button key={s} onClick={() => onFilterChange(s)}
                className={cn("px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition",
                  filterStatus === s ? "bg-[#C9973A] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}>
                {s === 'ALL' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
