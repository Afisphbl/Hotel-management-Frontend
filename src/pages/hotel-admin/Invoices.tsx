import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  FileText, Search, ChevronLeft, ChevronRight, Download, ReceiptText, CheckCircle2, Clock3, AlertTriangle, XCircle,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  issued: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  partially_paid: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800',
  void: 'bg-slate-100 text-slate-500',
};

export function AdminInvoices() {
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const PAGE_SIZE = 15;

  useEffect(() => { setPage(1); }, [filterStatus]);

  useEffect(() => { fetchInvoices(); }, [page, filterStatus]);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      params.append('page', String(page));
      params.append('limit', String(PAGE_SIZE));
      const res = await api.get(`hotel/invoices?${params.toString()}`);
      setInvoices(res.data || res.items || []);
      if (res.meta) { setTotal(res.meta.total); setTotalPages(res.meta.totalPages); }
    } catch (err: any) {
      toast.error('Failed to load invoices: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id: string, action: string) => {
    try {
      await api.post(`hotel/invoices/${id}/${action}`);
      toast.success(`Invoice ${action} successful`);
      fetchInvoices();
    } catch (err: any) {
      toast.error(`Failed to ${action}: ${err.message}`);
    }
  };

  const filtered = invoices.filter(inv =>
    inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.booking?.guest?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Invoices</h1>
        <p className="text-sm text-muted-foreground">Manage billing and invoicing for bookings</p>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search invoices..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {['all', 'draft', 'issued', 'paid', 'overdue', 'void'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={cn("px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition capitalize",
                    filterStatus === s ? "bg-[#C9973A] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}>
                  {s === 'all' ? 'All' : s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader><CardTitle className="text-lg">Invoice Records</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Booking</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(inv => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-sm font-medium">{inv.invoiceNumber || inv.id?.slice(0, 8)}</TableCell>
                      <TableCell className="text-sm">{inv.bookingId?.slice(0, 8) || '—'}</TableCell>
                      <TableCell className="text-sm">{inv.booking?.guest?.name || inv.booking?.guest?.fullName || '—'}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(inv.amount ?? inv.subtotal ?? 0)}</TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', STATUS_STYLES[inv.status] || 'bg-gray-100')}>
                          {inv.status?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {inv.dueDate ? format(new Date(inv.dueDate), 'MMM d, yyyy') : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {inv.status === 'draft' && (
                            <Button variant="ghost" size="sm" onClick={() => handleAction(inv.id, 'issue')} title="Issue">
                              <ReceiptText className="w-4 h-4 text-blue-600" />
                            </Button>
                          )}
                          {inv.status === 'issued' && (
                            <Button variant="ghost" size="sm" onClick={() => handleAction(inv.id, 'void')} title="Void">
                              <XCircle className="w-4 h-4 text-red-600" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(inv)} title="View">
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="h-32 text-center text-muted-foreground">No invoices found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <p className="text-sm text-muted-foreground">Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, total)} of {total}</p>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <Button key={p} variant={p === page ? "default" : "outline"} size="sm"
                        className={p === page ? "bg-[#0F1B2D]" : ""} onClick={() => setPage(p)}>{p}</Button>
                    ))}
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedInvoice(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-[#0F1B2D]">Invoice Details</h2>
              <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Invoice #</p>
                  <p className="font-bold text-lg">{selectedInvoice.invoiceNumber || selectedInvoice.id?.slice(0, 8)}</p>
                </div>
                <Badge className={cn('text-sm', STATUS_STYLES[selectedInvoice.status])}>
                  {selectedInvoice.status?.replace('_', ' ')}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Booking</span><p className="font-medium">{selectedInvoice.bookingId || '—'}</p></div>
                <div><span className="text-muted-foreground">Guest</span><p className="font-medium">{selectedInvoice.booking?.guest?.name || selectedInvoice.booking?.guest?.fullName || '—'}</p></div>
                <div><span className="text-muted-foreground">Amount</span><p className="font-medium text-lg">{formatCurrency(selectedInvoice.amount ?? selectedInvoice.subtotal ?? 0)}</p></div>
                <div><span className="text-muted-foreground">Due Date</span><p className="font-medium">{selectedInvoice.dueDate ? format(new Date(selectedInvoice.dueDate), 'MMM d, yyyy') : '—'}</p></div>
                <div><span className="text-muted-foreground">Created</span><p className="font-medium">{selectedInvoice.createdAt ? format(new Date(selectedInvoice.createdAt), 'MMM d, yyyy') : '—'}</p></div>
                <div><span className="text-muted-foreground">Paid At</span><p className="font-medium">{selectedInvoice.paidAt ? format(new Date(selectedInvoice.paidAt), 'MMM d, yyyy') : '—'}</p></div>
              </div>
              {selectedInvoice.lineItems?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Line Items</p>
                  <div className="space-y-1">
                    {selectedInvoice.lineItems.map((li: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-sm bg-slate-50 px-3 py-2 rounded">
                        <span>{li.description}</span>
                        <span className="font-medium">{formatCurrency(li.total || li.unitPrice * li.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
