import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Phone, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatDate, getGuestName } from '@/lib/utils';

interface GuestTableProps {
  guests: any[];
  isLoading: boolean;
  onSelectGuest: (g: any) => void;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (p: number) => void;
  pageSize: number;
}

export function GuestTable({ guests, isLoading, onSelectGuest, page, totalPages, total, onPageChange, pageSize }: GuestTableProps) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Nationality</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={6}>
                  <Skeleton className="h-12 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : guests.length === 0 ? (
            <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No guests found</TableCell></TableRow>
          ) : (
            guests.map(g => (
              <TableRow key={g.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold", g.isVip ? "bg-[#C9973A] text-white" : "bg-[#0F1B2D] text-[#C9973A]")}>
                      {getGuestName(g).charAt(0) || 'G'}
                    </div>
                    <div className="flex flex-col">
                      <span className="flex items-center gap-2">
                        {getGuestName(g)}
                        {g.isVip && <span className="text-[10px] bg-[#C9973A]/10 text-[#C9973A] px-1.5 py-0.5 rounded font-bold uppercase">VIP</span>}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {g.email && <span className="flex items-center gap-1 text-sm"><Mail className="w-3 h-3 text-muted-foreground" /> {g.email}</span>}
                </TableCell>
                <TableCell className="text-sm">
                  {g.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-muted-foreground" /> {g.phone}</span>}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{g.nationality || '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{g.createdAt ? formatDate(g.createdAt) : '—'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onSelectGuest(g)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <p className="text-sm text-muted-foreground">Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}</p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Button key={p} variant={p === page ? "default" : "outline"} size="sm"
                className={p === page ? "bg-[#0F1B2D]" : ""} onClick={() => onPageChange(p)}>{p}</Button>
            ))}
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
