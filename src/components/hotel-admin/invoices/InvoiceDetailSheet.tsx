import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { RefreshCw, Download } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { printInvoice } from '@/lib/invoice';
import { STATUS_META } from './types';
import { normalizeStatus, formatDateTime } from './utils';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { InfoBlock } from './InfoBlock';
import type { InvoiceRecord, PaymentRecord } from './types';

interface InvoiceDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceRecord | null;
  payments: PaymentRecord[];
  refunds: any[];
  loading: boolean;
  actionLoading: string | null;
  onRefresh: () => void;
  onDownload: (invoice: InvoiceRecord) => void;
  onUpdateStatus: (invoiceId: string, action: 'issue' | 'paid' | 'overdue' | 'void') => void;
}

export function InvoiceDetailSheet({
  open, onOpenChange, invoice, payments, refunds, loading, actionLoading,
  onRefresh, onDownload, onUpdateStatus,
}: InvoiceDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl font-serif">Invoice Details</SheetTitle>
          <SheetDescription>Review billing details, payments, and admin actions</SheetDescription>
        </SheetHeader>

        {loading || !invoice ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : (
          <div className="space-y-6 p-4">
            <Card className="border-none bg-slate-50 shadow-none">
              <CardContent className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Invoice Number</p>
                  <p className="mt-1 font-mono text-lg font-semibold text-[#0F1B2D]">
                    {invoice.invoiceNumber || invoice.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Status</p>
                  <div className="mt-2">
                    <InvoiceStatusBadge status={normalizeStatus(invoice.status)} />
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Booking ID</p>
                  <p className="mt-1 font-mono text-sm text-[#0F1B2D]">{invoice.bookingId}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Amount</p>
                  <p className="mt-1 text-lg font-semibold text-[#0F1B2D]">
                    {formatCurrency(invoice.amount || 0, invoice.currency || 'ETB')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoBlock label="Created" value={formatDateTime(invoice.createdAt)} />
              <InfoBlock label="Due Date" value={formatDateTime(invoice.dueDate)} />
              <InfoBlock label="Paid At" value={formatDateTime(invoice.paidAt)} />
              <InfoBlock label="Subtotal" value={formatCurrency(invoice.subtotal || 0, invoice.currency || 'ETB')} />
              <InfoBlock label="Tax" value={formatCurrency(invoice.taxTotal || 0, invoice.currency || 'ETB')} />
              <InfoBlock label="Outstanding" value={formatCurrency(invoice.amount || 0, invoice.currency || 'ETB')} />
            </div>

            <Card className="border-none bg-white shadow-sm">
              <CardHeader><CardTitle className="text-base">Line Items</CardTitle></CardHeader>
              <CardContent>
                {invoice.lineItems?.length ? (
                  <div className="space-y-3">
                    {invoice.lineItems.map((item, index) => (
                      <div key={`${item.description}-${index}`} className="flex items-start justify-between gap-4 rounded-lg bg-slate-50 p-3">
                        <div>
                          <p className="font-medium text-[#0F1B2D]">{item.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} x {formatCurrency(item.unitPrice, invoice.currency || 'ETB')}
                            {typeof item.taxRate === 'number' ? ` • Tax ${item.taxRate}%` : ''}
                          </p>
                        </div>
                        <p className="font-semibold text-[#0F1B2D]">
                          {formatCurrency(item.total, invoice.currency || 'ETB')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No line items recorded yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-none bg-white shadow-sm">
              <CardHeader><CardTitle className="text-base">Payment History</CardTitle></CardHeader>
              <CardContent>
                {payments.length ? (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                        <div>
                          <p className="font-medium text-[#0F1B2D]">
                            {payment.transactionId || payment.id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payment.method || 'manual'} • {payment.status || 'pending'} •{' '}
                            {formatDateTime(payment.createdAt || payment.paidAt)}
                          </p>
                        </div>
                        <p className="font-semibold text-[#0F1B2D]">
                          {formatCurrency(payment.amount || 0, invoice.currency || 'ETB')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No payment records found.</p>
                )}
              </CardContent>
            </Card>

            {refunds.length > 0 && (
              <Card className="border-none bg-white shadow-sm">
                <CardHeader><CardTitle className="text-base text-red-700">Refund History</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {refunds.map((refund: any) => (
                      <div key={refund.id} className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                        <div>
                          <p className="font-medium text-[#0F1B2D]">
                            -{formatCurrency(Number(refund.amount), invoice.currency || 'ETB')}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {refund.reason?.replace(/_/g, ' ')} • {refund.status} •{' '}
                            {formatDateTime(refund.processedAt || refund.createdAt)}
                          </p>
                          {refund.notes && <p className="text-xs text-muted-foreground mt-0.5">{refund.notes}</p>}
                        </div>
                        <span className="text-xs font-medium text-red-600">Refund</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {invoice.notes && (
              <Card className="border-none bg-white shadow-sm">
                <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm text-slate-700">{invoice.notes}</p>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button variant="outline" onClick={onRefresh} disabled={actionLoading !== null}>
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
              </Button>
              <Button variant="outline" onClick={() => onDownload(invoice)} disabled={actionLoading !== null}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <Button variant="outline" onClick={() => printInvoice(invoice)} disabled={actionLoading !== null}>
                Print
              </Button>
              {normalizeStatus(invoice.status) === 'draft' && (
                <Button className="bg-[#0F1B2D] hover:bg-[#1a2a3a]" onClick={() => onUpdateStatus(invoice.id, 'issue')} disabled={actionLoading !== null}>
                  Issue Invoice
                </Button>
              )}
              {normalizeStatus(invoice.status) !== 'paid' && normalizeStatus(invoice.status) !== 'void' && (
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => onUpdateStatus(invoice.id, 'paid')} disabled={actionLoading !== null}>
                  Mark Paid
                </Button>
              )}
              {normalizeStatus(invoice.status) === 'issued' && (
                <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" onClick={() => onUpdateStatus(invoice.id, 'overdue')} disabled={actionLoading !== null}>
                  Mark Overdue
                </Button>
              )}
              {normalizeStatus(invoice.status) !== 'paid' && normalizeStatus(invoice.status) !== 'void' && (
                <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" onClick={() => onUpdateStatus(invoice.id, 'void')} disabled={actionLoading !== null}>
                  Void
                </Button>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
