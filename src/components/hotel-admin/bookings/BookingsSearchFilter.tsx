import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { STATUS_OPTIONS, SOURCE_OPTIONS } from './types';

interface BookingsSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedSource: string;
  onSourceChange: (source: string) => void;
  dateFrom: string;
  onDateFromChange: (date: string) => void;
  dateTo: string;
  onDateToChange: (date: string) => void;
  onClearFilters: () => void;
}

export function BookingsSearchFilter({
  searchTerm, onSearchChange,
  selectedStatus, onStatusChange,
  selectedSource, onSourceChange,
  dateFrom, onDateFromChange,
  dateTo, onDateToChange,
  onClearFilters,
}: BookingsSearchFilterProps) {
  const hasFilters = dateFrom || dateTo || selectedSource !== "ALL";

  return (
    <Card className="shadow-sm border-none bg-white">
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by guest name, email, booking ID, or room..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">Status</Label>
            <Select value={selectedStatus} onValueChange={(v) => onStatusChange(v || "ALL")}>
              <SelectTrigger className="w-[150px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">Source</Label>
            <Select value={selectedSource} onValueChange={(v) => onSourceChange(v || "ALL")}>
              <SelectTrigger className="w-[150px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">From</Label>
            <Input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} className="w-[150px]" />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">To</Label>
            <Input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} className="w-[150px]" />
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={onClearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
