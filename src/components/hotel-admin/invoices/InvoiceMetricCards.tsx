import { Card, CardContent } from '@/components/ui/card';
import { FileText, Banknote, ReceiptText, AlertTriangle, Clock3, type LucideIcon } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  accent: string;
}

function MetricCard({ title, value, icon: Icon, accent }: MetricCardProps) {
  return (
    <Card className="border-none bg-white shadow-sm">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold text-[#0F1B2D]">{value}</p>
        </div>
        <div className={cn('rounded-full bg-slate-100 p-3', accent)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

interface InvoiceMetricCardsProps {
  totalInvoices: number;
  paidAmount: number;
  openCount: number;
  overdueCount: number;
  outstandingAmount: number;
}

export function InvoiceMetricCards({ totalInvoices, paidAmount, openCount, overdueCount, outstandingAmount }: InvoiceMetricCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      <MetricCard title="Total Invoices" value={totalInvoices} icon={FileText} accent="text-slate-700" />
      <MetricCard title="Paid Revenue" value={formatCurrency(paidAmount)} icon={Banknote} accent="text-green-600" />
      <MetricCard title="Open Invoices" value={openCount} icon={ReceiptText} accent="text-blue-600" />
      <MetricCard title="Overdue" value={overdueCount} icon={AlertTriangle} accent="text-red-600" />
      <MetricCard title="Outstanding" value={formatCurrency(outstandingAmount)} icon={Clock3} accent="text-amber-600" />
    </div>
  );
}
