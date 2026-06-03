import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Search } from "lucide-react";
import { SORT_OPTIONS, PLAN_FILTER_LABELS, type PlanFilterValue, type SortValue } from "./utils";

interface HotelsFiltersProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  sortBy: SortValue;
  onSortChange: (v: SortValue) => void;
  planFilter: PlanFilterValue;
  onPlanFilterChange: (v: PlanFilterValue) => void;
}

export function HotelsFilters({
  searchQuery, onSearchChange,
  sortBy, onSortChange,
  planFilter, onPlanFilterChange,
}: HotelsFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="relative flex-1 w-full md:max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-9 bg-[#F8F7F4] border-none"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortValue)}>
          <SelectTrigger className="flex-1 md:w-44 h-9 bg-[#F8F7F4] border-none">
            <span>{SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Sort by"}</span>
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={(v) => onPlanFilterChange(v as PlanFilterValue)}>
          <SelectTrigger className="flex-1 md:w-35 h-9 bg-[#F8F7F4] border-none">
            <span>{PLAN_FILTER_LABELS[planFilter] ?? "All Plans"}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
