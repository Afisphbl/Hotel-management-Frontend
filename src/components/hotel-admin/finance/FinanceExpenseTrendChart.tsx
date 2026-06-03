import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FinanceExpenseTrendChartProps {
  data: any;
  isLoading: boolean;
}

export function FinanceExpenseTrendChart({ data, isLoading }: FinanceExpenseTrendChartProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-red-500" /> Expense Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          {isLoading ? <Skeleton className="h-full w-full" /> : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.expenseTrend ?? []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={11} stroke="#999" tickFormatter={(v) => v.slice(5)} />
                <YAxis fontSize={11} stroke="#999" />
                <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), 'Expenses']} />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
