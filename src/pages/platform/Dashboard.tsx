import {
  usePlatformKPIs,
  usePlatformRevenueChart,
  usePlatformHotelsByTier,
  usePlatformAuditLogs,
} from "@/hooks/usePlatformData";
import { Hotel, CreditCard, DollarSign, Calendar, Users } from "lucide-react";
import { DashboardError } from "@/components/platform/dashboard-components/DashboardError";
import { DashboardHeader } from "@/components/platform/dashboard-components/DashboardHeader";
import { KPICard } from "@/components/platform/dashboard-components/KPICard";
import { RevenueChart } from "@/components/platform/dashboard-components/RevenueChart";
import { TierDistributionChart } from "@/components/platform/dashboard-components/TierDistributionChart";
import { AuditLogsTable } from "@/components/platform/dashboard-components/AuditLogsTable";

export function PlatformDashboard() {
  const {
    data: kpis,
    isLoading: kpisLoading,
    isError,
    error,
    refetch: refetchKpis,
  } = usePlatformKPIs();
  const { data: revData, isLoading: revLoading } = usePlatformRevenueChart();
  const { data: tierData, isLoading: tierLoading } = usePlatformHotelsByTier();
  const { data: logs, isLoading: logsLoading } = usePlatformAuditLogs();

  if (isError) {
    return <DashboardError error={error} refetch={refetchKpis} />;
  }

  return (
    <div className='space-y-8'>
      <DashboardHeader />

      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
        <KPICard
          title='Total Hotels'
          value={kpis?.totalHotels}
          icon={Hotel}
          trend={kpis?.hotelsGrowth}
          loading={kpisLoading}
        />
        <KPICard
          title='Active Subs'
          value={kpis?.activeSubscriptions}
          icon={CreditCard}
          loading={kpisLoading}
        />
        <KPICard
          title='Monthly Revenue'
          value={kpis?.mrr}
          isMoney
          icon={DollarSign}
          trend={kpis?.mrrGrowth}
          loading={kpisLoading}
        />
        <KPICard
          title='Total Bookings'
          value={kpis?.totalBookings}
          icon={Calendar}
          loading={kpisLoading}
        />
        <KPICard
          title='Active Users'
          value={kpis?.activeUsers}
          icon={Users}
          loading={kpisLoading}
        />
      </div>

      {/* Charts Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <RevenueChart data={revData} isLoading={revLoading} />
        <TierDistributionChart data={tierData} isLoading={tierLoading} />
      </div>

      {/* Audit Logs */}
      <AuditLogsTable logs={logs} isLoading={logsLoading} />
    </div>
  );
}
