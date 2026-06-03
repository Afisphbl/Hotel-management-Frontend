import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface ReportsRevenueTrendChartProps {
  data: any[];
  isLoading: boolean;
}

export function ReportsRevenueTrendChart({ data, isLoading }: ReportsRevenueTrendChartProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader><CardTitle className="text-base">Revenue Trend</CardTitle></CardHeader>
      <CardContent>
        <div className="h-64">
          {isLoading ? <Skeleton className="h-full w-full" /> : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={11} stroke="#999" />
                <YAxis fontSize={11} stroke="#999" />
                <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#C9973A" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
