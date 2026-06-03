import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FinanceRevenueTrendChartProps {
  data: any;
  isLoading: boolean;
}

export function FinanceRevenueTrendChart({ data, isLoading }: FinanceRevenueTrendChartProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#C9973A]" /> Revenue Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          {isLoading ? <Skeleton className="h-full w-full" /> : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.revenueTrend ?? []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={11} stroke="#999" tickFormatter={(v) => v.slice(5)} />
                <YAxis fontSize={11} stroke="#999" />
                <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#C9973A" fill="#C9973A" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
