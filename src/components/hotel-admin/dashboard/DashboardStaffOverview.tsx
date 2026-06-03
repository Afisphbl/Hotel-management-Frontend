import { UserCheck } from 'lucide-react';
import { DashboardSection } from './DashboardSection';
import { DashboardKPI } from './DashboardKPI';
import type { DashboardData } from './types';

interface DashboardStaffOverviewProps {
  data: DashboardData | null;
  isLoading: boolean;
}

export function DashboardStaffOverview({ data, isLoading }: DashboardStaffOverviewProps) {
  const d = data;
  return (
    <DashboardSection title="Staff Overview" icon={UserCheck}>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardKPI title="Total Staff" value={d?.totalStaff ?? 0} loading={isLoading} accent="text-slate-600" />
        <DashboardKPI title="Active Staff" value={d?.activeStaff ?? 0} loading={isLoading} accent="text-green-600" />
        <DashboardKPI title="Monthly Bookings" value={d?.monthlyBookings ?? 0} loading={isLoading} accent="text-blue-600" />
      </div>
    </DashboardSection>
  );
}
