import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FlagPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function FlagPagination({
  page,
  totalPages,
  total,
  onPageChange,
}: FlagPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-muted-foreground">
        Page {page} of {totalPages} ({total} total)
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-white border-none shadow-sm"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const start = Math.max(1, Math.min(page - 2, totalPages - 4));
          const n = start + i;
          if (n > totalPages) return null;
          return (
            <Button
              key={n}
              variant={n === page ? "default" : "outline"}
              size="sm"
              className={
                n === page
                  ? "bg-[#0F1B2D] hover:bg-[#1a2a3a] min-w-[32px]"
                  : "bg-white border-none shadow-sm min-w-[32px]"
              }
              onClick={() => onPageChange(n)}
            >
              {n}
            </Button>
          );
        })}
        <Button
          variant="outline"
          size="sm"
          className="bg-white border-none shadow-sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
