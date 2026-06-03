import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserTableEmptyProps {
  onResetFilters: () => void;
}

export function UserTableEmpty({ onResetFilters }: UserTableEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Database className="w-12 h-12 text-slate-200 mb-4" />
      <h3 className="text-lg font-serif text-slate-400">
        No users found matching your criteria
      </h3>
      <p className="text-sm text-slate-300 mt-1">
        Try adjusting your search or filters.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-6"
        onClick={onResetFilters}
      >
        Reset Filters
      </Button>
    </div>
  );
}
