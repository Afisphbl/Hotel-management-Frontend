import { useQuery } from "@tanstack/react-query";
import {
  usePlatformKPIs,
  usePlatformRevenueChart,
  usePlatformHotelsByTier,
  usePlatformAuditLogs,
} from "@/hooks/usePlatformData";
import {
  Hotel, CreditCard, DollarSign, Calendar, Users,
  ReceiptText, AlertTriangle, CheckCircle2, ArrowUpRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardError } from "@/components/platform/dashboard-components/DashboardError";
import { DashboardHeader } from "@/components/platform/dashboard-components/DashboardHeader";
import { KPICard } from "@/components/platform/dashboard-components/KPICard";
import { RevenueChart } from "@/components/platform/dashboard-components/RevenueChart";
import { TierDistributionChart } from "@/components/platform/dashboard-components/TierDistributionChart";
import { AuditLogsTable } from "@/components/platform/dashboard-components/AuditLogsTable";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

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

  const { data: billingRaw, isLoading: billLoading } = useQuery({
    queryKey: ["platform-billing-summary"],
    queryFn: () => api.get("platform/billing/summary"),
  });

  const billing = billingRaw?.data ?? billingRaw;

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

      {/* Billing Summary Cards */}
      <div>
        <h3 className="text-lg font-serif text-[#0F1B2D] mb-4">Billing Summary</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <Card className='shadow-sm border-none bg-white'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between mb-2'>
                <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>Collected This Month</p>
                <ReceiptText className='w-4 h-4 text-green-600' />
              </div>
              {billLoading ? (
                <Skeleton className='h-8 w-24' />
              ) : (
                <h3 className='text-2xl font-bold text-[#0F1B2D]'>{formatCurrency(billing?.collectedThisMonth || 0)}</h3>
              )}
            </CardContent>
          </Card>
          <Card className='shadow-sm border-none bg-white'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between mb-2'>
                <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>Pending Approval</p>
                <AlertTriangle className='w-4 h-4 text-amber-500' />
              </div>
              {billLoading ? (
                <Skeleton className='h-8 w-24' />
              ) : (
                <div>
                  <h3 className='text-2xl font-bold text-[#0F1B2D]'>{formatCurrency(billing?.pendingAmount || 0)}</h3>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className='shadow-sm border-none bg-white'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between mb-2'>
                <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>Paid This Month</p>
                <CheckCircle2 className='w-4 h-4 text-green-600' />
              </div>
              {billLoading ? (
                <Skeleton className='h-8 w-24' />
              ) : (
                <h3 className='text-2xl font-bold text-[#0F1B2D]'>{billing?.paidThisMonth || 0} / {billing?.hotelsWithRate || 0}</h3>
              )}
            </CardContent>
          </Card>
          <Card className='shadow-sm border-none bg-white'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between mb-2'>
                <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>Overdue</p>
                <ArrowUpRight className='w-4 h-4 text-red-500' />
              </div>
              {billLoading ? (
                <Skeleton className='h-8 w-24' />
              ) : (
                <h3 className='text-2xl font-bold text-red-600'>{billing?.overdueCount || 0}</h3>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <RevenueChart data={revData} isLoading={revLoading} />
        <BillingCollectionChart data={billing?.monthlyCollectionHistory} isLoading={billLoading} />
        <TierDistributionChart data={tierData} isLoading={tierLoading} />
      </div>

      {/* Audit Logs */}
      <AuditLogsTable logs={logs} isLoading={logsLoading} />
    </div>
  );
}

function BillingCollectionChart({ data, isLoading }: { data: any[] | undefined; isLoading: boolean }) {
  return (
    <Card className='shadow-sm border-none bg-white'>
      <CardHeader>
        <CardTitle className='text-lg'>Billing Collections</CardTitle>
        <CardDescription>Monthly subscription payments over last 12 months</CardDescription>
      </CardHeader>
      <CardContent className='h-[300px]'>
        {isLoading ? (
          <div className='h-full w-full flex items-center justify-center bg-muted/5 rounded-[4px]'>
            <Skeleton className='h-[200px] w-full mx-6' />
          </div>
        ) : data && data.length > 0 ? (
          <ResponsiveContainer width='100%' height='100%' minHeight={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f0f0f0' />
              <XAxis dataKey='month' axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              <Bar dataKey='amount' fill='#C9973A' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className='h-full w-full flex flex-col items-center justify-center bg-slate-50/50 rounded-[8px] p-6 text-center border border-dashed border-slate-200'>
            <ReceiptText className='w-8 h-8 text-slate-400 mb-2' />
            <p className='text-sm font-medium text-slate-600'>No collection data</p>
            <p className='text-xs text-slate-400 max-w-[260px] mt-1'>
              Monthly subscription payments will appear here once hotels start paying.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
