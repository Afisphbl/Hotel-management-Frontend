import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle,
  Clock,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function InvoicesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchInvoices();
  }, [selectedStatus]);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      
      const response = await fetch(`/api/hotel/invoices?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setInvoices(data.data || []);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.bookingId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statuses = [
    { value: 'ALL', label: 'All Invoices' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'ISSUED', label: 'Issued' },
    { value: 'PAID', label: 'Paid' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  const totalAmount = invoices
    .filter(i => i.status === 'PAID')
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Invoices</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage and track your invoices</p>
        </div>
        <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <Plus className="w-4 h-4 mr-2" /> New Invoice
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Total Invoices</p>
              <h3 className="text-3xl font-bold text-[#0F1B2D] mt-2">{invoices.length}</h3>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Total Paid</p>
              <h3 className="text-3xl font-bold text-green-600 mt-2">${totalAmount.toFixed(2)}</h3>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Pending</p>
              <h3 className="text-3xl font-bold text-orange-600 mt-2">
                {invoices.filter(i => i.status === 'ISSUED').length}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by invoice number or booking ID..."
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

      {/* Invoices Table */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Invoice List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : filteredInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Invoice #</th>
                    <th className="text-left py-3 px-4 font-semibold">Booking ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Due Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map(invoice => (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-3 px-4 font-mono text-[#0F1B2D]">{invoice.invoiceNumber}</td>
                      <td className="py-3 px-4 text-xs font-mono">{invoice.bookingId?.slice(0, 8)}</td>
                      <td className="py-3 px-4 font-semibold text-[#0F1B2D]">${invoice.amount?.toFixed(2) || '0.00'}</td>
                      <td className="py-3 px-4 text-sm">{invoice.issueDate}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{invoice.dueDate}</td>
                      <td className="py-3 px-4">
                        <InvoiceStatusBadge status={invoice.status} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" title="Download">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-12 text-muted-foreground">No invoices found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InvoiceStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string }> = {
    'DRAFT': { bg: 'bg-gray-100', text: 'text-gray-800' },
    'ISSUED': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'PAID': { bg: 'bg-green-100', text: 'text-green-800' },
    'CANCELLED': { bg: 'bg-red-100', text: 'text-red-800' }
  };

  const config = statusConfig[status] || statusConfig['DRAFT'];

  return (
    <span className={cn('px-3 py-1 rounded-full text-xs font-medium', config.bg, config.text)}>
      {status}
    </span>
  );
}
