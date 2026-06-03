import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardList } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardSection } from './DashboardSection';
import { DashboardKPI } from './DashboardKPI';
import type { DashboardData } from './types';

interface DashboardHousekeepingSectionProps {
  data: DashboardData | null;
  isLoading: boolean;
}

export function DashboardHousekeepingSection({ data, isLoading }: DashboardHousekeepingSectionProps) {
  const d = data;
  return (
    <DashboardSection title="Housekeeping Status" icon={ClipboardList}>
      <div className="grid grid-cols-2 gap-4">
        <DashboardKPI title="Available Rooms" value={d?.availableRooms ?? 0} loading={isLoading} accent="text-green-600" />
        <DashboardKPI title="Occupied" value={d?.occupiedRooms ?? 0} loading={isLoading} accent="text-blue-600" />
        <DashboardKPI title="Dirty / Needs Cleaning" value={d?.dirtyRooms ?? 0} loading={isLoading} accent="text-yellow-600" />
        <DashboardKPI title="Occupancy Rate" value={`${d?.occupancy ?? 0}%`} loading={isLoading} accent="text-purple-600" />
      </div>
      <div className="mt-4 h-40">
        {isLoading ? <Skeleton className="h-full w-full" /> : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={d?.occupancyTrend ?? []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" fontSize={11} stroke="#999" tickFormatter={(v) => v.slice(5)} />
              <YAxis fontSize={11} stroke="#999" unit="%" />
              <Tooltip formatter={(v: unknown) => [`${Number(v)}%`, 'Occupancy']} />
              <Area type="monotone" dataKey="occupancy" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </DashboardSection>
  );
}
