import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DollarSign, Search, ChevronLeft, ChevronRight, CheckCircle, Clock, AlertCircle, RefreshCw, Banknote,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-purple-100 text-purple-800',
};

export function AdminPayments() {
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const PAGE_SIZE = 15;

  useEffect(() => { setPage(1); }, [filterStatus]);

  useEffect(() => { fetchPayments(); }, [page, filterStatus]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'ALL') params.append('status', filterStatus);
      params.append('page', String(page));
      params.append('limit', String(PAGE_SIZE));
      const res = await api.get(`hotel/payments?${params.toString()}`);
      setPayments(res.data || res.items || []);
      if (res.meta) { setTotal(res.meta.total); setTotalPages(res.meta.totalPages); }
    } catch (err: any) {
      toast.error('Failed to load payments: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const totalRevenue = payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + (p.amount || 0), 0);

  const filtered = payments.filter(p =>
    p.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Payments</h1>
        <p className="text-sm text-muted-foreground">Track and manage financial transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Total Collected</p>
                {isLoading ? <Skeleton className="mt-2 h-7 w-24" /> : (
                  <h3 className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalRevenue)}</h3>
                )}
              </div>
              <DollarSign className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Total Transactions</p>
                {isLoading ? <Skeleton className="mt-2 h-7 w-16" /> : (
                  <h3 className="text-2xl font-bold text-[#0F1B2D] mt-1">{payments.length}</h3>
                )}
              </div>
              <Banknote className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Pending</p>
                {isLoading ? <Skeleton className="mt-2 h-7 w-16" /> : (
                  <h3 className="text-2xl font-bold text-yellow-600 mt-1">
                    {payments.filter(p => p.status === 'PENDING').length}
                  </h3>
                )}
              </div>
              <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by invoice or transaction ID..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {['ALL', 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={cn("px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition",
                    filterStatus === s ? "bg-[#C9973A] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}>
                  {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader><CardTitle className="text-lg">Transaction History</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
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
                  {filtered.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-sm">{p.transactionId || p.id?.slice(0, 10)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.invoiceId?.slice(0, 8) || '—'}</TableCell>
                      <TableCell className="text-sm capitalize">{p.method || '—'}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(p.amount || 0)}</TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', STATUS_STYLES[p.status] || 'bg-gray-100')}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No payments found</TableCell></TableRow>
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
    </div>
  );
}
