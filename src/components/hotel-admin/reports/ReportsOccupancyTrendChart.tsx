import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ReportsOccupancyTrendChartProps {
  data: any[];
  isLoading: boolean;
}

export function ReportsOccupancyTrendChart({
  data,
  isLoading,
}: ReportsOccupancyTrendChartProps) {
  return (
    <Card className='shadow-sm border-none bg-white'>
      <CardHeader>
        <CardTitle className='text-base'>Occupancy Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-64'>
          {isLoading ? (
            <Skeleton className='h-full w-full' />
          ) : (
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={data || []}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='#f0f0f0'
                />
                <XAxis dataKey='date' fontSize={11} stroke='#999' />
                <YAxis fontSize={11} stroke='#999' unit='%' />
                <Tooltip formatter={(v: unknown) => [`${v}%`, "Occupancy"]} />
                <Bar dataKey='occupancy' fill='#0F1B2D' radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
