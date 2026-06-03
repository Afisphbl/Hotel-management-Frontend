import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterTab {
  value: string;
  label: string;
}

interface StaffSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (value: string) => void;
}

const filterTabs: FilterTab[] = [
  { value: 'ALL', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export function StaffSearchFilter({ searchTerm, onSearchChange, filterStatus, onFilterChange }: StaffSearchFilterProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {filterTabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => onFilterChange(tab.value)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition",
                  filterStatus === tab.value
                    ? "bg-[#C9973A] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
