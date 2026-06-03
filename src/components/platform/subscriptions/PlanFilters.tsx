import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

const PLAN_TYPES = ["all", "BASIC", "PROFESSIONAL", "ENTERPRISE"] as const;

interface PlanFiltersProps {
  searchQuery: string;
  planFilter: string;
  onSearchChange: (value: string) => void;
  onPlanFilterChange: (value: string) => void;
}

export function PlanFilters({ searchQuery, planFilter, onSearchChange, onPlanFilterChange }: PlanFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search plans..."
          className="pl-9 h-9 text-sm"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <Button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg self-start">
        {PLAN_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onPlanFilterChange(type)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              planFilter === type
                ? "bg-white text-[#0F1B2D] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {type === "all" ? "All" : type === "PROFESSIONAL" ? "Pro" : type.charAt(0) + type.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
