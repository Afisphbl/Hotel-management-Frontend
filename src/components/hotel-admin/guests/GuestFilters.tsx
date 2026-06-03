import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuestFiltersProps {
  searchTerm: string;
  onSearchTermChange: (s: string) => void;
  filter: 'all' | 'vip' | 'recent';
  onFilterChange: (f: 'all' | 'vip' | 'recent') => void;
  onSearch: () => void;
}

export function GuestFilters({ searchTerm, onSearchTermChange, filter, onFilterChange, onSearch }: GuestFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="md:col-span-3 shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, or phone..." value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)} className="pl-10"
              onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-2 flex gap-1 items-center h-full">
          <Button variant={filter === 'all' ? 'default' : 'ghost'} size="sm" className={cn("flex-1", filter === 'all' && "bg-[#0F1B2D]")} onClick={() => onFilterChange('all')}>All</Button>
          <Button variant={filter === 'vip' ? 'default' : 'ghost'} size="sm" className={cn("flex-1", filter === 'vip' && "bg-[#0F1B2D]")} onClick={() => onFilterChange('vip')}>VIP</Button>
          <Button variant={filter === 'recent' ? 'default' : 'ghost'} size="sm" className={cn("flex-1", filter === 'recent' && "bg-[#0F1B2D]")} onClick={() => onFilterChange('recent')}>Recent</Button>
        </CardContent>
      </Card>
    </div>
  );
}
