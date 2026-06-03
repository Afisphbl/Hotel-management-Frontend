import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DashboardData } from './types';

interface DashboardRevenue30dProps {
  data: DashboardData | null;
}

export function DashboardRevenue30d({ data }: DashboardRevenue30dProps) {
  const d = data;
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Revenue 30d</CardTitle>
        <CardDescription>Daily revenue performance</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px]">
        {(d?.revenue30d ?? []).length > 0 ? (
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <BarChart data={d?.revenue30d ?? []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="revenue" fill="#C9973A" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Skeleton className="h-[180px] w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
