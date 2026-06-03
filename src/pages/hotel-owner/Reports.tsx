import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Download,
  TrendingUp,
  DollarSign,
  Users,
  Home
} from 'lucide-react';
import DateRangeSelector from '@/components/hotel-owner/report/DateRangeSelector';
import KPICard from '@/components/hotel-owner/report/KPICard';
import RevenueChart from '@/components/hotel-owner/report/RevenueChart';
import OccupancyChart from '@/components/hotel-owner/report/OccupancyChart';
import BookingSourceChart from '@/components/hotel-owner/report/BookingSourceChart';
import GuestStatistics from '@/components/hotel-owner/report/GuestStatistics';

export function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const daysParam = dateRange === 'custom' ? '' : `?days=${dateRange}`;
      const res = await api.get(`hotel/reports${daysParam}`);
      setReportData(res.data ?? null);
    } catch (error: any) {
      toast.error('Failed to load reports: ' + (error.message || 'Unknown error'));
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const daysParam = dateRange === 'custom' ? '' : `?days=${dateRange}`;
      const res = await api.get(`hotel/reports${daysParam}`);
      if (!res.data) return;
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hotel-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error('Export failed: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Reports & Analytics</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Comprehensive insights into your hotel operations</p>
        </div>
        <Button onClick={handleExport} className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <Download className="w-4 h-4 mr-2" /> Export Report
        </Button>
      </div>

      {/* Date Range Selector */}
      <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(reportData?.financialMetrics.totalRevenue || 0)}
          icon={DollarSign}
          color="text-green-600"
          loading={isLoading}
        />
        <KPICard
          title="Occupancy Rate"
          value={`${reportData?.financialMetrics.occupancyRate || '0'}%`}
          icon={Home}
          color="text-blue-600"
          loading={isLoading}
        />
        <KPICard
          title="Avg Daily Rate"
          value={formatCurrency(reportData?.financialMetrics.averageDailyRate || 0)}
          icon={TrendingUp}
          color="text-purple-600"
          loading={isLoading}
        />
        <KPICard
          title="Total Guests"
          value={reportData?.guestStatistics.totalGuests || '0'}
          icon={Users}
          color="text-orange-600"
          loading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueChart isLoading={isLoading} data={reportData?.revenueByMonth} />
        <OccupancyChart isLoading={isLoading} data={reportData?.occupancyTrend} />
      </div>

      {/* Booking Source and Guest Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <BookingSourceChart isLoading={isLoading} data={reportData?.bookingSource} />
        <GuestStatistics reportData={reportData} isLoading={isLoading} />
      </div>
    </div>
  );
}
