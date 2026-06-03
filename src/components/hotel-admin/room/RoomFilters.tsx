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
import { ROOM_STATUS_OPTIONS, type RoomStatus } from "./types";

interface RoomFiltersProps {
  searchTerm: string;
  selectedStatus: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string | null) => void;
  onSortChange: (value: string | null) => void;
}

export function RoomFilters({
  searchTerm,
  selectedStatus,
  sortBy,
  onSearchChange,
  onStatusChange,
  onSortChange,
}: RoomFiltersProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={selectedStatus} onValueChange={(value) => onStatusChange(value)}>
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Rooms</SelectItem>
                {ROOM_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value as RoomStatus}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => onSortChange(value)}>
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roomNumber">Room Number</SelectItem>
                <SelectItem value="basePrice">Price</SelectItem>
                <SelectItem value="baseCapacity">Capacity</SelectItem>
                <SelectItem value="floor">Floor</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
