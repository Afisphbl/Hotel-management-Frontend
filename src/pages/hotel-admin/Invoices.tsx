import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Banknote,
  Download,
  FileText,
  Plus,
  RefreshCw,
  Search,
  ShieldX,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  ReceiptText,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { printInvoice } from '@/lib/invoice';
import { api } from '@/lib/api';
import { toast } from 'sonner';

type InvoiceStatus =
  | 'draft'
  | 'issued'
  | 'paid'
  | 'partially_paid'
  | 'overdue'
  | 'void';

type FilterValue = 'all' | InvoiceStatus;

type InvoiceLineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number;
};

type InvoiceRecord = {
  id: string;
  invoiceNumber?: string;
  bookingId: string;
  amount?: number;
  subtotal?: number;
  taxTotal?: number;
  currency?: string;
  status?: string;
  dueDate?: string;
  paidAt?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  booking?: {
    id?: string;
    totalPrice?: number;
    checkIn?: string;
    checkOut?: string;
    guest?: {
      name?: string;
      fullName?: string;
      email?: string;
      phone?: string;
    };
  };
  lineItems?: InvoiceLineItem[];
};

type PaymentRecord = {
  id: string;
  amount?: number;
  method?: string;
  status?: string;
  transactionId?: string;
  paidAt?: string;
  createdAt?: string;
};

type CreateInvoiceForm = {
  bookingId: string;
  amount: string;
  currency: string;
  dueDate: string;
  notes: string;
};

const STATUS_FILTERS: Array<{ value: FilterValue; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'issued', label: 'Issued' },
  { value: 'partially_paid', label: 'Partially Paid' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'void', label: 'Voided' },
];

const STATUS_META: Record<
  InvoiceStatus,
  { label: string; className: string; icon: LucideIcon }
> = {
  draft: {
    label: 'Draft',
    className: 'bg-slate-100 text-slate-800 border-slate-200',
    icon: FileText,
  },
  issued: {
    label: 'Issued',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: ReceiptText,
  },
  paid: {
    label: 'Paid',
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2,
  },
  partially_paid: {
    label: 'Partially Paid',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: CreditCard,
  },
  overdue: {
    label: 'Overdue',
    className: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertTriangle,
  },
  void: {
    label: 'Voided',
    className: 'bg-slate-200 text-slate-700 border-slate-300',
    icon: ShieldX,
  },
};

const PAGE_SIZE = 15;

export function AdminInvoices() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<FilterValue>('all');
  const [page, setPage] = useState(1);
  const [activeInvoice, setActiveInvoice] = useState<InvoiceRecord | null>(null);
  const [activePayments, setActivePayments] = useState<PaymentRecord[]>([]);
  const [activeRefunds, setActiveRefunds] = useState<any[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateInvoiceForm>({
    bookingId: '',
    amount: '',
    currency: 'ETB',
    dueDate: '',
    notes: '',
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [selectedStatus, searchTerm]);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('hotel/invoices?limit=200');
      setInvoices((res.data || res.items || []).map(normalizeInvoice));
    } catch (err: any) {
      toast.error('Failed to load invoices: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshInvoices = async () => {
    try {
      setIsRefreshing(true);
      await fetchInvoices();
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const status = normalizeStatus(invoice.status);
      const matchesStatus =
        selectedStatus === 'all' || status === selectedStatus;
      const searchable = [
        invoice.invoiceNumber,
        invoice.bookingId,
        invoice.notes,
        invoice.booking?.guest?.name,
        invoice.booking?.guest?.fullName,
        invoice.booking?.guest?.email,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return (
        matchesStatus && searchable.includes(searchTerm.trim().toLowerCase())
      );
    });
  }, [invoices, searchTerm, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PAGE_SIZE));
  const pagedInvoices = filteredInvoices.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const metrics = useMemo(() => {
    const totalInvoices = invoices.length;
    const paidAmount = invoices
      .filter((invoice) => normalizeStatus(invoice.status) === 'paid')
      .reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
    const overdueCount = invoices.filter(
      (invoice) => normalizeStatus(invoice.status) === 'overdue',
    ).length;
    const openCount = invoices.filter((invoice) => {
      const status = normalizeStatus(invoice.status);
      return status === 'issued' || status === 'partially_paid';
    }).length;
    const outstandingAmount = invoices
      .filter((invoice) => {
        const status = normalizeStatus(invoice.status);
        return status === 'issued' || status === 'partially_paid' || status === 'overdue';
      })
      .reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
    const draftCount = invoices.filter(
      (invoice) => normalizeStatus(invoice.status) === 'draft',
    ).length;

    return {
      totalInvoices,
      paidAmount,
      overdueCount,
      openCount,
      outstandingAmount,
      draftCount,
    };
  }, [invoices]);

  const openInvoiceDetails = async (invoiceId: string) => {
    setIsDetailOpen(true);
    setDetailLoading(true);
    setActivePayments([]);
    setActiveRefunds([]);

    try {
      const [invoiceResponse, paymentsResponse, refundsResponse] = await Promise.all([
        api.get(`hotel/invoices/${invoiceId}`),
        api.get(`hotel/payments?invoiceId=${invoiceId}&limit=20`).catch(() => ({ data: [] })),
        api.get(`finance/refunds?invoiceId=${invoiceId}&limit=20`).catch(() => ({ data: [] })),
      ]);

      const detailInvoice = normalizeInvoice(invoiceResponse.data || invoiceResponse);
      setActiveInvoice(detailInvoice);
      setActivePayments(
        ((paymentsResponse as any)?.data || []).map((payment: PaymentRecord) => ({
          ...payment,
          status: payment.status ? payment.status.toLowerCase() : payment.status,
        })),
      );
      setActiveRefunds((refundsResponse as any)?.data || []);
    } catch (error) {
      console.error('Failed to load invoice details:', error);
      toast.error('Failed to load invoice details');
      setIsDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  const submitCreateInvoice = async () => {
    if (!createForm.bookingId.trim()) {
      toast.error('Booking ID is required');
      return;
    }
    if (!UUID_RE.test(createForm.bookingId.trim())) {
      toast.error('Booking ID must be a valid UUID (e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)');
      return;
    }

    try {
      setActionLoading('create');
      await api.post('finance/invoices', {
        bookingId: createForm.bookingId.trim(),
        amount: createForm.amount ? Number(createForm.amount) : undefined,
        currency: createForm.currency || 'ETB',
        dueDate: createForm.dueDate
          ? new Date(`${createForm.dueDate}T00:00:00.000Z`).toISOString()
          : undefined,
        notes: createForm.notes || undefined,
      });

      toast.success('Invoice created');
      setIsCreateOpen(false);
      setCreateForm({
        bookingId: '',
        amount: '',
        currency: 'ETB',
        dueDate: '',
        notes: '',
      });
      await refreshInvoices();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create invoice');
    } finally {
      setActionLoading(null);
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, action: 'issue' | 'paid' | 'overdue' | 'void') => {
    try {
      setActionLoading(`${invoiceId}:${action}`);
      await api.post(`finance/invoices/${invoiceId}/${action}`);

      toast.success('Invoice updated');
      await refreshInvoices();
      if (activeInvoice?.id === invoiceId) {
        await openInvoiceDetails(invoiceId);
      }
    } catch (error: any) {
      toast.error(error?.message || `Failed to ${action} invoice`);
    } finally {
      setActionLoading(null);
    }
  };

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
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Invoices</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage billing, invoicing, and receivables across the property
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-[#C9973A] text-[#C9973A] hover:bg-[#C9973A] hover:text-white"
            onClick={refreshInvoices}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn('mr-2 h-4 w-4', isRefreshing && 'animate-spin')} />
            Refresh
          </Button>
          <Button
            className="bg-[#0F1B2D] hover:bg-[#1a2a3a]"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Total Invoices"
          value={metrics.totalInvoices}
          icon={FileText}
          accent="text-slate-700"
        />
        <MetricCard
          title="Paid Revenue"
          value={formatCurrency(metrics.paidAmount)}
          icon={Banknote}
          accent="text-green-600"
        />
        <MetricCard
          title="Open Invoices"
          value={metrics.openCount}
          icon={ReceiptText}
          accent="text-blue-600"
        />
        <MetricCard
          title="Overdue"
          value={metrics.overdueCount}
          icon={AlertTriangle}
          accent="text-red-600"
        />
        <MetricCard
          title="Outstanding"
          value={formatCurrency(metrics.outstandingAmount)}
          icon={Clock3}
          accent="text-amber-600"
        />
      </div>

      <Card className="border-none bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search invoice number, booking ID, guest, or notes"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedStatus(filter.value)}
                  className={cn(
                    'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition',
                    selectedStatus === filter.value
                      ? 'bg-[#C9973A] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Invoice Register</CardTitle>
          <CardDescription>
            Review, issue, and manage invoices across the property
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : pagedInvoices.length > 0 ? (
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
                      <tr
                        key={invoice.id}
                        className="border-b border-slate-100 transition hover:bg-slate-50/70"
                      >
                        <td className="px-4 py-4">
                          <div className="font-mono text-sm font-medium text-[#0F1B2D]">
                            {invoice.invoiceNumber || invoice.id.slice(0, 8)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {invoice.notes || 'No notes'}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-[#0F1B2D]">
                            {invoice.booking?.guest?.fullName ||
                              invoice.booking?.guest?.name ||
                              'Guest booking'}
                          </div>
                          <div className="font-mono text-xs text-muted-foreground">
                            {invoice.bookingId.slice(0, 8)}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-semibold text-[#0F1B2D]">
                          {formatCurrency(invoice.amount || 0, invoice.currency || 'ETB')}
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {formatDate(invoice.dueDate)}
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            variant="outline"
                            className={cn('inline-flex items-center gap-1.5 border', meta.className)}
                          >
                            <meta.icon className="h-3.5 w-3.5" />
                            {meta.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {formatDate(invoice.createdAt)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openInvoiceDetails(invoice.id)}
                            >
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadInvoice(invoice)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => printInvoice(invoice)}
                            >
                              Print
                            </Button>
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
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
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
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="text-xl font-serif">Invoice Details</SheetTitle>
            <SheetDescription>
              Review billing details, payments, and admin actions
            </SheetDescription>
          </SheetHeader>

          {detailLoading || !activeInvoice ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-6 p-4">
              <Card className="border-none bg-slate-50 shadow-none">
                <CardContent className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Invoice Number
                    </p>
                    <p className="mt-1 font-mono text-lg font-semibold text-[#0F1B2D]">
                      {activeInvoice.invoiceNumber || activeInvoice.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Status
                    </p>
                    <div className="mt-2">
                      <InvoiceStatusBadge status={normalizeStatus(activeInvoice.status)} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Booking ID
                    </p>
                    <p className="mt-1 font-mono text-sm text-[#0F1B2D]">
                      {activeInvoice.bookingId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Amount
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#0F1B2D]">
                      {formatCurrency(activeInvoice.amount || 0, activeInvoice.currency || 'ETB')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoBlock label="Created" value={formatDateTime(activeInvoice.createdAt)} />
                <InfoBlock label="Due Date" value={formatDateTime(activeInvoice.dueDate)} />
                <InfoBlock label="Paid At" value={formatDateTime(activeInvoice.paidAt)} />
                <InfoBlock
                  label="Subtotal"
                  value={formatCurrency(activeInvoice.subtotal || 0, activeInvoice.currency || 'ETB')}
                />
                <InfoBlock
                  label="Tax"
                  value={formatCurrency(activeInvoice.taxTotal || 0, activeInvoice.currency || 'ETB')}
                />
                <InfoBlock
                  label="Outstanding"
                  value={formatCurrency(
                    activeInvoice.amount || 0,
                    activeInvoice.currency || 'ETB',
                  )}
                />
              </div>

              <Card className="border-none bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Line Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {activeInvoice.lineItems?.length ? (
                    <div className="space-y-3">
                      {activeInvoice.lineItems.map((item, index) => (
                        <div
                          key={`${item.description}-${index}`}
                          className="flex items-start justify-between gap-4 rounded-lg bg-slate-50 p-3"
                        >
                          <div>
                            <p className="font-medium text-[#0F1B2D]">{item.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} x {formatCurrency(item.unitPrice, activeInvoice.currency || 'ETB')}
                              {typeof item.taxRate === 'number' ? ` • Tax ${item.taxRate}%` : ''}
                            </p>
                          </div>
                          <p className="font-semibold text-[#0F1B2D]">
                            {formatCurrency(item.total, activeInvoice.currency || 'ETB')}
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
                <CardHeader>
                  <CardTitle className="text-base">Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {activePayments.length ? (
                    <div className="space-y-3">
                      {activePayments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                        >
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
                            {formatCurrency(payment.amount || 0, activeInvoice.currency || 'ETB')}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No payment records found.</p>
                  )}
                </CardContent>
              </Card>

              {activeRefunds.length > 0 && (
                <Card className="border-none bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base text-red-700">Refund History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activeRefunds.map((refund) => (
                        <div
                          key={refund.id}
                          className="flex items-center justify-between rounded-lg bg-red-50 p-3"
                        >
                          <div>
                            <p className="font-medium text-[#0F1B2D]">
                              -{formatCurrency(Number(refund.amount), activeInvoice.currency || 'ETB')}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {refund.reason?.replace(/_/g, ' ')} • {refund.status} •{' '}
                              {formatDateTime(refund.processedAt || refund.createdAt)}
                            </p>
                            {refund.notes && (
                              <p className="text-xs text-muted-foreground mt-0.5">{refund.notes}</p>
                            )}
                          </div>
                          <span className="text-xs font-medium text-red-600">Refund</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeInvoice.notes && (
                <Card className="border-none bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm text-slate-700">
                      {activeInvoice.notes}
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-wrap gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => openInvoiceDetails(activeInvoice.id)}
                  disabled={actionLoading !== null}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadInvoice(activeInvoice)}
                  disabled={actionLoading !== null}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => printInvoice(activeInvoice)}
                  disabled={actionLoading !== null}
                >
                  Print
                </Button>
                {normalizeStatus(activeInvoice.status) === 'draft' && (
                  <Button
                    className="bg-[#0F1B2D] hover:bg-[#1a2a3a]"
                    onClick={() => updateInvoiceStatus(activeInvoice.id, 'issue')}
                    disabled={actionLoading !== null}
                  >
                    Issue Invoice
                  </Button>
                )}
                {normalizeStatus(activeInvoice.status) !== 'paid' &&
                  normalizeStatus(activeInvoice.status) !== 'void' && (
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => updateInvoiceStatus(activeInvoice.id, 'paid')}
                      disabled={actionLoading !== null}
                    >
                      Mark Paid
                    </Button>
                  )}
                {normalizeStatus(activeInvoice.status) === 'issued' && (
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => updateInvoiceStatus(activeInvoice.id, 'overdue')}
                    disabled={actionLoading !== null}
                  >
                    Mark Overdue
                  </Button>
                )}
                {normalizeStatus(activeInvoice.status) !== 'paid' &&
                  normalizeStatus(activeInvoice.status) !== 'void' && (
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      onClick={() => updateInvoiceStatus(activeInvoice.id, 'void')}
                      disabled={actionLoading !== null}
                    >
                      Void
                    </Button>
                  )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="text-xl font-serif">Create Invoice</SheetTitle>
            <SheetDescription>
              Generate a new invoice from a booking
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0F1B2D]">Booking ID</label>
              <Input
                value={createForm.bookingId}
                onChange={(event) =>
                  setCreateForm({ ...createForm, bookingId: event.target.value })
                }
                placeholder="Booking UUID"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#0F1B2D]">Amount</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={createForm.amount}
                  onChange={(event) =>
                    setCreateForm({ ...createForm, amount: event.target.value })
                  }
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#0F1B2D]">Currency</label>
                <Input
                  value={createForm.currency}
                  onChange={(event) =>
                    setCreateForm({ ...createForm, currency: event.target.value })
                  }
                  placeholder="ETB"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0F1B2D]">Due Date</label>
              <Input
                type="date"
                value={createForm.dueDate}
                onChange={(event) =>
                  setCreateForm({ ...createForm, dueDate: event.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0F1B2D]">Notes</label>
              <textarea
                value={createForm.notes}
                onChange={(event) =>
                  setCreateForm({ ...createForm, notes: event.target.value })
                }
                placeholder="Optional billing notes"
                className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                className="bg-[#0F1B2D] hover:bg-[#1a2a3a]"
                onClick={submitCreateInvoice}
                disabled={actionLoading === 'create'}
              >
                {actionLoading === 'create' ? 'Creating...' : 'Create Invoice'}
              </Button>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  accent,
}: {
  title: string;
  value: number | string;
  icon: LucideIcon;
  accent: string;
}) {
  return (
    <Card className="border-none bg-white shadow-sm">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-[#0F1B2D]">{value}</p>
        </div>
        <div className={cn('rounded-full bg-slate-100 p-3', accent)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const meta = STATUS_META[status] || STATUS_META.draft;
  return (
    <Badge variant="outline" className={cn('border', meta.className)}>
      {meta.label}
    </Badge>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-[#0F1B2D]">{value}</p>
    </div>
  );
}

function normalizeStatus(status?: string): InvoiceStatus {
  const value = String(status || 'draft').toLowerCase();
  if (value in STATUS_META) return value as InvoiceStatus;
  return 'draft';
}

function normalizeInvoice(invoice: InvoiceRecord): InvoiceRecord {
  const booking = invoice.booking;
  let guest = booking?.guest;

  if (guest && !guest.fullName && !guest.name) {
    const firstName = (guest as any).firstName || '';
    const lastName = (guest as any).lastName || '';
    guest.fullName = `${firstName} ${lastName}`.trim() || 'Guest';
  }

  return {
    ...invoice,
    status: normalizeStatus(invoice.status),
    amount: toNumber(invoice.amount),
    subtotal: toNumber(invoice.subtotal),
    taxTotal: toNumber(invoice.taxTotal),
    booking: booking
      ? {
          ...booking,
          guest,
          totalPrice: toNumber(booking.totalPrice),
        }
      : booking,
    lineItems: (invoice.lineItems || []).map((item) => ({
      ...item,
      quantity: toNumber(item.quantity),
      unitPrice: toNumber(item.unitPrice),
      total: toNumber(item.total),
      taxRate: typeof item.taxRate === 'number' ? item.taxRate : undefined,
    })),
  };
}

function toNumber(value: unknown) {
  const parsed = Number(value || 0);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatDate(date?: string) {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM d, yyyy');
}

function formatDateTime(date?: string) {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM d, yyyy h:mm a');
}
