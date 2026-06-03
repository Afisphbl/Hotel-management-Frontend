import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAINTENANCE_STATUS_FILTERS } from "./types";
import type { MaintenanceStatus } from "./types";

interface MaintenanceFiltersProps {
  searchTerm: string;
  filterStatus: MaintenanceStatus | "ALL";
  onSearchChange: (value: string) => void;
  onFilterChange: (value: MaintenanceStatus | "ALL") => void;
}

export function MaintenanceFilters({
  searchTerm,
  filterStatus,
  onSearchChange,
  onFilterChange,
}: MaintenanceFiltersProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {MAINTENANCE_STATUS_FILTERS.map((status) => (
              <button
                key={status}
                onClick={() => onFilterChange(status)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition",
                  filterStatus === status
                    ? "bg-[#C9973A] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                {status === "ALL"
                  ? "All"
                  : status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
