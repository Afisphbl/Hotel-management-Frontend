import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  InvoicesHeader,
  InvoiceMetricCards,
  InvoiceSearchFilter,
  InvoiceTable,
  InvoiceDetailSheet,
  InvoiceCreateSheet,
  normalizeInvoice,
  normalizeStatus,
} from '@/components/hotel-admin/invoices';
import type { InvoiceRecord, PaymentRecord, CreateInvoiceForm, FilterValue } from '@/components/hotel-admin/invoices';

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
    bookingId: '', amount: '', currency: 'ETB', dueDate: '', notes: '',
  });

  useEffect(() => { fetchInvoices(); }, []);

  useEffect(() => { setPage(1); }, [selectedStatus, searchTerm]);

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

  const metrics = useMemo(() => {
    const totalInvoices = invoices.length;
    const paidAmount = invoices
      .filter((inv) => normalizeStatus(inv.status) === 'paid')
      .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    const overdueCount = invoices.filter((inv) => normalizeStatus(inv.status) === 'overdue').length;
    const openCount = invoices.filter((inv) => {
      const s = normalizeStatus(inv.status);
      return s === 'issued' || s === 'partially_paid';
    }).length;
    const outstandingAmount = invoices
      .filter((inv) => { const s = normalizeStatus(inv.status); return s === 'issued' || s === 'partially_paid' || s === 'overdue'; })
      .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    return { totalInvoices, paidAmount, overdueCount, openCount, outstandingAmount };
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
      setActiveInvoice(normalizeInvoice(invoiceResponse.data || invoiceResponse));
      setActivePayments(
        ((paymentsResponse as any)?.data || []).map((p: PaymentRecord) => ({
          ...p, status: p.status ? p.status.toLowerCase() : p.status,
        })),
      );
      setActiveRefunds((refundsResponse as any)?.data || []);
    } catch (error) {
      toast.error('Failed to load invoice details');
      setIsDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  const submitCreateInvoice = async () => {
    if (!createForm.bookingId.trim()) { toast.error('Booking ID is required'); return; }
    if (!UUID_RE.test(createForm.bookingId.trim())) { toast.error('Booking ID must be a valid UUID'); return; }
    try {
      setActionLoading('create');
      await api.post('finance/invoices', {
        bookingId: createForm.bookingId.trim(),
        amount: createForm.amount ? Number(createForm.amount) : undefined,
        currency: createForm.currency || 'ETB',
        dueDate: createForm.dueDate ? new Date(`${createForm.dueDate}T00:00:00.000Z`).toISOString() : undefined,
        notes: createForm.notes || undefined,
      });
      toast.success('Invoice created');
      setIsCreateOpen(false);
      setCreateForm({ bookingId: '', amount: '', currency: 'ETB', dueDate: '', notes: '' });
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
      if (activeInvoice?.id === invoiceId) await openInvoiceDetails(invoiceId);
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
      <InvoicesHeader isRefreshing={isRefreshing} onRefresh={refreshInvoices} onCreate={() => setIsCreateOpen(true)} />

      <InvoiceMetricCards
        totalInvoices={metrics.totalInvoices}
        paidAmount={metrics.paidAmount}
        openCount={metrics.openCount}
        overdueCount={metrics.overdueCount}
        outstandingAmount={metrics.outstandingAmount}
      />

      <InvoiceSearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={(v) => setSelectedStatus(v as FilterValue)}
      />

      <InvoiceTable
        isLoading={isLoading}
        invoices={invoices}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        page={page}
        onPageChange={setPage}
        onView={openInvoiceDetails}
      />

      <InvoiceDetailSheet
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        invoice={activeInvoice}
        payments={activePayments}
        refunds={activeRefunds}
        loading={detailLoading}
        actionLoading={actionLoading}
        onRefresh={() => activeInvoice && openInvoiceDetails(activeInvoice.id)}
        onDownload={downloadInvoice}
        onUpdateStatus={updateInvoiceStatus}
      />

      <InvoiceCreateSheet
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        form={createForm}
        onFormChange={setCreateForm}
        isSaving={actionLoading === 'create'}
        onSubmit={submitCreateInvoice}
      />
    </div>
  );
}
