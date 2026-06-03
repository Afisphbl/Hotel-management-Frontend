import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertCircle, Flag } from "lucide-react";

interface FlagTableEmptyProps {
  isError: boolean;
  error?: { message?: string } | null;
  onRetry: () => void;
  hasActiveFilters: boolean;
}

export function FlagTableEmpty({
  isError,
  error,
  onRetry,
  hasActiveFilters,
}: FlagTableEmptyProps) {
  if (isError) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="py-12 text-center">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <p className="text-sm text-red-500">
              {error?.message || "Failed to load feature flags"}
            </p>
            <Button variant="outline" size="sm" onClick={onRetry}>
              Retry
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell colSpan={7} className="py-12 text-center animate-fade-in">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Flag className="w-5 h-5 text-slate-300" />
        </div>
        <p className="font-serif text-base text-slate-500">
          No feature flags found
        </p>
        <p className="text-xs text-slate-400">
          {hasActiveFilters
            ? "Try adjusting your search or filters."
            : "Add global flags to control tenant rolling options."}
        </p>
      </TableCell>
    </TableRow>
  );
}
