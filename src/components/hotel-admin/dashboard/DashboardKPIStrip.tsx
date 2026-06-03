import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, ArrowUpRight, ArrowDownRight, DoorClosed, DoorOpen, DollarSign } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import type { DashboardData } from './types';

function KPIBox({ title, value, icon: Icon, color = 'text-[#0F1B2D]', loading }: any) {
  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden">
      <CardContent className="p-4 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-full bg-[#F8F7F4] flex items-center justify-center">
            <Icon className={cn('w-4 h-4', color)} />
          </div>
        </div>
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{title}</p>
          {loading ? (
            <Skeleton className="h-6 w-16 mt-1" />
          ) : (
            <h4 className="text-lg font-bold text-[#0F1B2D] mt-0.5">{value}</h4>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardKPIStripProps {
  data: DashboardData | null;
  isLoading: boolean;
}

export function DashboardKPIStrip({ data, isLoading }: DashboardKPIStripProps) {
  const d = data;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KPIBox title="Occupancy" value={`${d?.occupancy ?? 0}%`} icon={TrendingUp} loading={isLoading} />
      <KPIBox title="Arrivals" value={d?.todayCheckIns ?? 0} icon={ArrowUpRight} color="text-green-600" loading={isLoading} />
      <KPIBox title="Departures" value={d?.todayCheckOuts ?? 0} icon={ArrowDownRight} color="text-red-500" loading={isLoading} />
      <KPIBox title="In-House" value={d?.occupiedRooms ?? 0} icon={DoorClosed} color="text-blue-500" loading={isLoading} />
      <KPIBox title="Available" value={d?.availableRooms ?? 0} icon={DoorOpen} loading={isLoading} />
      <KPIBox title="Rev (Today)" value={formatCurrency(d?.todayRevenue ?? 0)} icon={DollarSign} loading={isLoading} />
    </div>
  );
}
