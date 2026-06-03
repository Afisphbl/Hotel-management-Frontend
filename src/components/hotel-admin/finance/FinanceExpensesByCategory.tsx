import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Wrench } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface FinanceExpensesByCategoryProps {
  data: any;
  isLoading: boolean;
}

export function FinanceExpensesByCategory({ data, isLoading }: FinanceExpensesByCategoryProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Wrench className="w-4 h-4 text-[#C9973A]" /> Expenses by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-32 w-full" /> : (
          <div className="space-y-3">
            {(data?.expenseByAccount ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No expenses recorded this month</p>
            ) : (
              data!.expenseByAccount.map((e: any) => (
                <div key={e.accountId} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5">
                  <span className="text-sm font-medium text-[#0F1B2D]">
                    {e.accountId === 'MAINTENANCE_EXPENSE' ? 'Maintenance' : e.accountId}
                  </span>
                  <span className="text-sm font-semibold text-red-600">{formatCurrency(e.total)}</span>
                </div>
              ))
            )}
            {(data?.recentExpenses ?? []).length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Recent Expenses</p>
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {data!.recentExpenses.map((e: any) => (
                    <div key={e.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 text-sm mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-[#0F1B2D]">{e.description || e.accountId}</p>
                        <p className="text-xs text-muted-foreground">{new Date(e.entryDate).toLocaleDateString()}</p>
                      </div>
                      <span className="font-semibold text-red-600 ml-2">{formatCurrency(e.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
