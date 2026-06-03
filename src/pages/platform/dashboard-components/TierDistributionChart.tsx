import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CreditCard } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TierDistributionChartProps {
  data: any[] | undefined;
  isLoading: boolean;
}

export function TierDistributionChart({
  data,
  isLoading,
}: TierDistributionChartProps) {
  return (
    <Card className='shadow-sm border-none bg-white'>
      <CardHeader>
        <CardTitle className='text-lg'>Hotels by Tier</CardTitle>
        <CardDescription>Subscription distribution</CardDescription>
      </CardHeader>
      <CardContent className='h-[300px]'>
        {isLoading ? (
          <div className='h-full w-full flex items-center justify-center'>
            <Skeleton className='h-40 w-40 rounded-full' />
          </div>
        ) : data && data.length > 0 && data.some((d: any) => d.value > 0) ? (
          <ResponsiveContainer width='100%' height='100%' minHeight={300}>
            <PieChart>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey='value'
              >
                {data?.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className='h-full w-full flex flex-col items-center justify-center bg-slate-50/50 rounded-[8px] p-6 text-center border border-dashed border-slate-200'>
            <CreditCard className='w-8 h-8 text-slate-400 mb-2' />
            <p className='text-sm font-medium text-slate-600'>
              No subscription data
            </p>
            <p className='text-xs text-slate-400 max-w-[220px] mt-1'>
              Create active property subscriptions to view tier metrics.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
