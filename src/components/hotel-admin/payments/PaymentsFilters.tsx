import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
}

export function PaymentsFilters({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
}: PaymentsFiltersProps) {
  return (
    <Card className='shadow-sm border-none bg-white'>
      <CardContent className='p-6'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <Input
              placeholder='Search by invoice or transaction ID...'
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className='pl-10'
            />
          </div>
          <div className='flex gap-2 overflow-x-auto pb-1 sm:pb-0'>
            {["ALL", "PENDING", "COMPLETED", "FAILED", "REFUNDED"].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => onFilterStatusChange(s)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition",
                    filterStatus === s
                      ? "bg-[#C9973A] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  )}
                >
                  {s === "ALL"
                    ? "All"
                    : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ),
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
