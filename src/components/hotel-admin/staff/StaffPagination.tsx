import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StaffPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function StaffPagination({ page, totalPages, total, pageSize, onPageChange }: StaffPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t">
      <p className="text-sm text-muted-foreground">
        Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            size="sm"
            className={p === page ? "bg-[#0F1B2D]" : ""}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
