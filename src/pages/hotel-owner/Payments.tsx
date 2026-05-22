import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DollarSign, 
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function PaymentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchPayments();
  }, [selectedStatus]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      
      const response = await fetch(`/api/hotel/payments?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setPayments(data.data || []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statuses = [
    { value: 'ALL', label: 'All Payments' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'REFUNDED', label: 'Refunded' }
  ];

  const totalRevenue = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Payments</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage payments, refunds, and financial transactions</p>
        </div>
        <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <Plus className="w-4 h-4 mr-2" /> Process Payment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Total Revenue</p>
                <h3 className="text-2xl font-bold text-[#0F1B2D] mt-1">${totalRevenue.toFixed(2)}</h3>
              </div>
              <DollarSign className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Pending Payments</p>
                <h3 className="text-2xl font-bold text-[#0F1B2D] mt-1">{payments.filter(p => p.status === 'PENDING').length}</h3>
              </div>
              <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Failed Payments</p>
                <h3 className="text-2xl font-bold text-[#0F1B2D] mt-1">{payments.filter(p => p.status === 'FAILED').length}</h3>
              </div>
              <AlertCircle className="w-12 h-12 text-red-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by invoice or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {statuses.map(status => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition",
                    selectedStatus === status.value
                      ? "bg-[#C9973A] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="space-y-3">
                {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : filteredPayments.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Transaction ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Invoice</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Method</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map(payment => (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-3 px-4 text-xs font-mono text-[#0F1B2D]">{payment.transactionId?.slice(0, 8)}</td>
                      <td className="py-3 px-4 text-xs font-mono text-[#0F1B2D]">{payment.invoiceId?.slice(0, 8)}</td>
                      <td className="py-3 px-4 font-semibold text-[#0F1B2D]">${payment.amount?.toFixed(2) || '0.00'}</td>
                      <td className="py-3 px-4 text-sm capitalize">{payment.method || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <PaymentStatusBadge status={payment.status} />
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{payment.date}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center py-12 text-muted-foreground">No payments found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; icon: any }> = {
    'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
    'COMPLETED': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    'FAILED': { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle },
    'REFUNDED': { bg: 'bg-blue-100', text: 'text-blue-800', icon: RefreshCw }
  };

  const config = statusConfig[status] || statusConfig['PENDING'];
  const Icon = config.icon;

  return (
    <div className={cn('flex items-center gap-1 px-2 py-1 rounded text-xs font-medium w-fit', config.bg, config.text)}>
      <Icon className="w-3 h-3" />
      {status}
    </div>
  );
}
