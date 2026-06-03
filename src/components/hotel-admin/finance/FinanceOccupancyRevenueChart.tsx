import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FinanceOccupancyRevenueChartProps {
  data: any;
  isLoading: boolean;
}

export function FinanceOccupancyRevenueChart({ data, isLoading }: FinanceOccupancyRevenueChartProps) {
  const chartData = data?.revenueTrend?.map((r: any, i: number) => ({
    ...r,
    occupancy: data?.occupancyTrend[i]?.occupancy ?? 0
  })) ?? [];

  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#C9973A]" /> Occupancy vs Revenue Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {isLoading ? <Skeleton className="h-full w-full" /> : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={11} stroke="#999" tickFormatter={(v) => v.slice(5)} />
                <YAxis yAxisId="left" fontSize={11} stroke="#999" />
                <YAxis yAxisId="right" orientation="right" fontSize={11} stroke="#999" unit="%" />
                <Tooltip formatter={(v: unknown, name: unknown) => name === 'occupancy' ? [`${v}%`, 'Occupancy'] : [formatCurrency(Number(v)), 'Revenue']} />
                <Bar yAxisId="left" dataKey="revenue" fill="#0F1B2D" radius={[4, 4, 0, 0]} barSize={20} />
                <Line yAxisId="right" type="monotone" dataKey="occupancy" stroke="#C9973A" strokeWidth={3} dot={{ r: 4, fill: '#C9973A' }} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
