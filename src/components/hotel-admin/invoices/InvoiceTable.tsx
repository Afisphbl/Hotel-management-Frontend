import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { printInvoice } from '@/lib/invoice';
import { STATUS_META, PAGE_SIZE } from './types';
import { normalizeStatus, formatDate } from './utils';
import type { InvoiceRecord } from './types';

interface InvoiceTableProps {
  isLoading: boolean;
  invoices: InvoiceRecord[];
  searchTerm: string;
  selectedStatus: string;
  page: number;
  onPageChange: (page: number) => void;
  onView: (id: string) => void;
}

export function InvoiceTable({ isLoading, invoices, searchTerm, selectedStatus, page, onPageChange, onView }: InvoiceTableProps) {
  if (isLoading) {
    return (
      <Card className="border-none bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Invoice Register</CardTitle>
          <CardDescription>Review, issue, and manage invoices across the property</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const status = normalizeStatus(invoice.status);
    const matchesStatus = selectedStatus === 'all' || status === selectedStatus;
    const searchable = [
      invoice.invoiceNumber, invoice.bookingId, invoice.notes,
      invoice.booking?.guest?.name, invoice.booking?.guest?.fullName, invoice.booking?.guest?.email,
    ].filter(Boolean).join(' ').toLowerCase();
    return matchesStatus && searchable.includes(searchTerm.trim().toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PAGE_SIZE));
  const pagedInvoices = filteredInvoices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const downloadInvoice = (invoice: InvoiceRecord) => {
    const payload = JSON.stringify(invoice, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${invoice.invoiceNumber || invoice.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-none bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Invoice Register</CardTitle>
        <CardDescription>Review, issue, and manage invoices across the property</CardDescription>
      </CardHeader>
      <CardContent>
        {pagedInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold">Invoice</th>
                  <th className="px-4 py-3 text-left font-semibold">Booking</th>
                  <th className="px-4 py-3 text-left font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Due Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Created</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedInvoices.map((invoice) => {
                  const status = normalizeStatus(invoice.status);
                  const meta = STATUS_META[status];
                  return (
                    <tr key={invoice.id} className="border-b border-slate-100 transition hover:bg-slate-50/70">
                      <td className="px-4 py-4">
                        <div className="font-mono text-sm font-medium text-[#0F1B2D]">
                          {invoice.invoiceNumber || invoice.id.slice(0, 8)}
                        </div>
                        <div className="text-xs text-muted-foreground">{invoice.notes || 'No notes'}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-[#0F1B2D]">
                          {invoice.booking?.guest?.fullName || invoice.booking?.guest?.name || 'Guest booking'}
                        </div>
                        <div className="font-mono text-xs text-muted-foreground">{invoice.bookingId.slice(0, 8)}</div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-[#0F1B2D]">
                        {formatCurrency(invoice.amount || 0, invoice.currency || 'ETB')}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{formatDate(invoice.dueDate)}</td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className={cn('inline-flex items-center gap-1.5 border', meta.className)}>
                          <meta.icon className="h-3.5 w-3.5" />
                          {meta.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{formatDate(invoice.createdAt)}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => onView(invoice.id)}>View</Button>
                          <Button variant="ghost" size="sm" onClick={() => downloadInvoice(invoice)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => printInvoice(invoice)}>Print</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground">No invoices match your filters</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-2 py-4">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredInvoices.length)} of {filteredInvoices.length}
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? 'default' : 'outline'}
                    size="sm"
                    className={pageNum === page ? 'bg-[#0F1B2D]' : ''}
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
