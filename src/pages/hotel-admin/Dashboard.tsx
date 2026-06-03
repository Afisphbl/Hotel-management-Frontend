import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  DashboardHeader, DashboardKPIStrip, DashboardRevenueSection,
  DashboardHousekeepingSection, DashboardMaintenanceSection,
  DashboardGuestsBookings, DashboardRoomAvailability, DashboardLiveActivity,
  DashboardRevenue30d, DashboardBookingSource, DashboardStaffOverview,
} from '@/components/hotel-admin/dashboard';
import type { DashboardData } from '@/components/hotel-admin/dashboard';

export function AdminDashboard() {
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/v1/hotel/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        setData(json.data ?? null);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [token]);

  return (
    <div className="space-y-8 pb-10">
      <DashboardHeader />
      <DashboardKPIStrip data={data} isLoading={isLoading} />
      <DashboardRevenueSection data={data} isLoading={isLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardHousekeepingSection data={data} isLoading={isLoading} />
        <DashboardMaintenanceSection data={data} isLoading={isLoading} />
      </div>
      <DashboardGuestsBookings data={data} isLoading={isLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <DashboardRoomAvailability data={data} />
        <DashboardLiveActivity data={data} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardRevenue30d data={data} />
        <DashboardBookingSource data={data} />
      </div>
      <DashboardStaffOverview data={data} isLoading={isLoading} />
    </div>
  );
}
