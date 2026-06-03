import { Wrench } from 'lucide-react';
import { DashboardSection } from './DashboardSection';
import { DashboardKPI } from './DashboardKPI';
import type { DashboardData } from './types';

interface DashboardMaintenanceSectionProps {
  data: DashboardData | null;
  isLoading: boolean;
}

export function DashboardMaintenanceSection({ data, isLoading }: DashboardMaintenanceSectionProps) {
  const d = data;
  return (
    <DashboardSection title="Maintenance" icon={Wrench}>
      <div className="grid grid-cols-2 gap-4">
        <DashboardKPI title="Rooms in Maintenance" value={d?.maintenanceRooms ?? 0} loading={isLoading} accent="text-red-600" />
        <DashboardKPI title="Total Rooms" value={d?.totalRooms ?? 0} loading={isLoading} accent="text-slate-600" />
        <DashboardKPI title="Out-of-Service %" value={d?.totalRooms ? `${Math.round(((d.maintenanceRooms) / d.totalRooms) * 100)}%` : '0%'} loading={isLoading} accent="text-orange-600" />
        <DashboardKPI title="Active Staff" value={d?.activeStaff ?? 0} loading={isLoading} accent="text-green-600" />
      </div>
    </DashboardSection>
  );
}
