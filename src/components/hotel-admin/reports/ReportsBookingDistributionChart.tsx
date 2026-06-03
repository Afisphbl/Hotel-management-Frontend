import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#C9973A', '#0F1B2D', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

interface ReportsBookingDistributionChartProps {
  data: any[];
  isLoading: boolean;
}

export function ReportsBookingDistributionChart({ data, isLoading }: ReportsBookingDistributionChartProps) {
  const chartData = (data || []).length > 0 ? data : [{ name: 'No Data', value: 1 }];

  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader><CardTitle className="text-base">Booking Distribution</CardTitle></CardHeader>
      <CardContent>
        <div className="h-64">
          {isLoading ? <Skeleton className="h-full w-full" /> : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%" cy="50%" outerRadius={80} dataKey="value"
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(data || []).length > 0
                    ? chartData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)
                    : <Cell fill="#e5e7eb" />}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
