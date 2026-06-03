import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface RoomsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
}

export function RoomsFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortByChange,
}: RoomsFiltersProps) {
  return (
    <Card className='shadow-sm border-none bg-white'>
      <CardContent className='p-6'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <Input
                placeholder='Search by room number, type or floor...'
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
          <div className='flex gap-2'>
            <Select
              value={selectedStatus}
              onValueChange={(v) => onStatusChange(v || 'ALL')}
            >
              <SelectTrigger className='w-40 bg-white'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>All Rooms</SelectItem>
                <SelectItem value='available'>Available</SelectItem>
                <SelectItem value='occupied'>Occupied</SelectItem>
                <SelectItem value='dirty'>Dirty</SelectItem>
                <SelectItem value='maintenance'>Maintenance</SelectItem>
                <SelectItem value='out_of_order'>Out of Order</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(v) => onSortByChange(v || 'roomNumber')}
            >
              <SelectTrigger className='w-40 bg-white'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='roomNumber'>Room Number</SelectItem>
                <SelectItem value='basePrice'>Price</SelectItem>
                <SelectItem value='baseCapacity'>Capacity</SelectItem>
                <SelectItem value='floor'>Floor</SelectItem>
                <SelectItem value='status'>Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
