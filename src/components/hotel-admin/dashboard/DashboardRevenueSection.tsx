import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardSection } from './DashboardSection';
import { DashboardKPI } from './DashboardKPI';
import type { DashboardData } from './types';

interface DashboardRevenueSectionProps {
  data: DashboardData | null;
  isLoading: boolean;
}

export function DashboardRevenueSection({ data, isLoading }: DashboardRevenueSectionProps) {
  const d = data;
  return (
    <DashboardSection title="Revenue" icon={DollarSign}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardKPI title="Today" value={formatCurrency(d?.todayRevenue ?? 0)} loading={isLoading} accent="text-green-600" />
        <DashboardKPI title="This Month" value={formatCurrency(d?.monthlyRevenue ?? 0)} loading={isLoading} accent="text-green-600" />
        <DashboardKPI title="This Year" value={formatCurrency(d?.yearlyRevenue ?? 0)} loading={isLoading} accent="text-green-700" />
        <DashboardKPI title="All Time" value={formatCurrency(d?.totalRevenue ?? 0)} loading={isLoading} accent="text-green-800" />
      </div>
      <div className="mt-4 h-52">
        {isLoading ? <Skeleton className="h-full w-full" /> : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={d?.revenueTrend ?? []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" fontSize={11} stroke="#999" tickFormatter={(v) => v.slice(5)} />
              <YAxis fontSize={11} stroke="#999" />
              <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#C9973A" fill="#C9973A" fillOpacity={0.2} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </DashboardSection>
  );
}
