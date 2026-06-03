import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ReceiptText } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface FinanceInvoiceSummaryProps {
  data: any;
  isLoading: boolean;
}

export function FinanceInvoiceSummary({ data, isLoading }: FinanceInvoiceSummaryProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <ReceiptText className="w-4 h-4 text-[#C9973A]" /> Invoice Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Pending', value: data?.pendingInvoices ?? 0, color: 'text-blue-600' },
            { label: 'Overdue', value: data?.overdueInvoices ?? 0, color: 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{s.label}</p>
              {isLoading ? <Skeleton className="mt-2 h-7 w-16" /> : (
                <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
              )}
            </div>
          ))}
        </div>
        {!isLoading && (data?.recentPayments?.length ?? 0) > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recent Payments</p>
            {data!.recentPayments.slice(0, 5).map((p: any) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 text-sm">
                <span className="text-muted-foreground capitalize">{p.method || 'manual'}</span>
                <span className="font-semibold text-[#0F1B2D]">{formatCurrency(p.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
