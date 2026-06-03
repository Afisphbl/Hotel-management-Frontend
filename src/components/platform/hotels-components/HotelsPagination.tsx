import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HotelsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  visibleCount: number;
  onPageChange: (page: number) => void;
}

export function HotelsPagination({
  currentPage, totalPages, totalItems, visibleCount, onPageChange,
}: HotelsPaginationProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-8">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-9 px-4 border-slate-200 text-[#0F1B2D] hover:bg-[#0F1B2D] hover:text-white transition-colors"
        >
          Previous
        </Button>

        <div className="hidden md:flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((page, i, arr) => (
              <React.Fragment key={page}>
                {i > 0 && arr[i - 1] !== page - 1 && (
                  <span className="px-2 text-slate-400">...</span>
                )}
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className={cn(
                    "h-9 w-9 p-0 font-medium transition-all",
                    currentPage === page
                      ? "bg-[#0F1B2D] text-white hover:bg-[#1a2a3a]"
                      : "border-slate-200 text-[#0F1B2D] hover:border-[#0F1B2D] hover:bg-[#0F1B2D]/5",
                  )}
                >
                  {page}
                </Button>
              </React.Fragment>
            ))}
        </div>

        <div className="md:hidden flex items-center px-4 font-medium text-sm text-[#0F1B2D]">
          Page {currentPage} of {totalPages || 1}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="h-9 px-4 border-slate-200 text-[#0F1B2D] hover:bg-[#0F1B2D] hover:text-white transition-colors"
        >
          Next
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
        Showing {visibleCount} of {totalItems} properties
      </p>
    </div>
  );
}
