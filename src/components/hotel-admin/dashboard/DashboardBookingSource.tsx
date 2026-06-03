import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DashboardData } from './types';

interface DashboardBookingSourceProps {
  data: DashboardData | null;
}

export function DashboardBookingSource({ data }: DashboardBookingSourceProps) {
  const d = data;
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Bookings by Source</CardTitle>
        <CardDescription>Direct vs OTA distribution</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] relative">
        <div className="h-full w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={d?.bookingSource ?? []}
                cx="40%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {(d?.bookingSource ?? []).map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={(d?.bookingSource ?? [])[index]?.color} />
                ))}
              </Pie>
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{
                  paddingLeft: '20px',
                  fontSize: '11px',
                  lineHeight: '24px',
                }}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
