import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RevenueChartProps {
  data: any[] | undefined;
  isLoading: boolean;
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  return (
    <Card className='lg:col-span-2 shadow-sm border-none bg-white'>
      <CardHeader>
        <CardTitle className='text-lg'>Revenue Performance</CardTitle>
        <CardDescription>
          MRR and Booking Volume over last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className='h-[300px]'>
        {isLoading ? (
          <div className='h-full w-full flex items-center justify-center bg-muted/5 rounded-[4px]'>
            <Skeleton className='h-[200px] w-full mx-6' />
          </div>
        ) : data &&
          data.length > 0 &&
          data.some((d: any) => d.revenue > 0 || d.bookings > 0) ? (
          <ResponsiveContainer width='100%' height='100%' minHeight={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id='colorRev' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#C9973A' stopOpacity={0.3} />
                  <stop offset='95%' stopColor='#C9973A' stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray='3 3'
                vertical={false}
                stroke='#f0f0f0'
              />
              <XAxis
                dataKey='month'
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Area
                type='monotone'
                dataKey='revenue'
                stroke='#C9973A'
                fillOpacity={1}
                fill='url(#colorRev)'
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className='h-full w-full flex flex-col items-center justify-center bg-slate-50/50 rounded-[8px] p-6 text-center border border-dashed border-slate-200'>
            <TrendingUp className='w-8 h-8 text-slate-400 mb-2' />
            <p className='text-sm font-medium text-slate-600'>
              No revenue data available
            </p>
            <p className='text-xs text-slate-400 max-w-[260px] mt-1'>
              Active subscriptions and completed bookings are required to
              populate revenue metrics.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
