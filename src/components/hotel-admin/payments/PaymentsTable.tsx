import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-purple-100 text-purple-800",
  partially_refunded: "bg-purple-100 text-purple-800",
};

interface PaymentsTableProps {
  isLoading: boolean;
  payments: any[];
  searchTerm: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetail: (payment: any) => void;
}

export function PaymentsTable({
  isLoading,
  payments,
  searchTerm,
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onViewDetail,
}: PaymentsTableProps) {
  const filtered = payments.filter(
    (p) =>
      p.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card className='shadow-sm border-none bg-white'>
      <CardHeader>
        <CardTitle className='text-lg'>Transaction History</CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        {isLoading ? (
          <div className='p-6 space-y-3'>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className='h-16 w-full' />
              ))}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow
                    key={p.id}
                    className='cursor-pointer hover:bg-muted/50'
                    onClick={() => onViewDetail(p)}
                  >
                    <TableCell className='font-mono text-sm'>
                      {p.transactionId || p.id?.slice(0, 10)}
                    </TableCell>
                    <TableCell className='text-sm text-muted-foreground'>
                      {p.invoiceId?.slice(0, 8) || "—"}
                    </TableCell>
                    <TableCell className='text-sm capitalize'>
                      {p.method || "—"}
                    </TableCell>
                    <TableCell className='font-medium'>
                      {formatCurrency(p.amount || 0)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-xs",
                          STATUS_STYLES[p.status] || "bg-gray-100",
                        )}
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-sm text-muted-foreground'>
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className='h-32 text-center text-muted-foreground'
                    >
                      No payments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className='flex items-center justify-between px-6 py-4 border-t'>
                <p className='text-sm text-muted-foreground'>
                  Showing {(page - 1) * pageSize + 1}-
                  {Math.min(page * pageSize, total)} of {total}
                </p>
                <div className='flex items-center gap-1'>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                  >
                    <ChevronLeft className='w-4 h-4' />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        size='sm'
                        className={p === page ? "bg-[#0F1B2D]" : ""}
                        onClick={() => onPageChange(p)}
                      >
                        {p}
                      </Button>
                    ),
                  )}
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                  >
                    <ChevronRight className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
