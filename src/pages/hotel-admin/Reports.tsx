import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  ReportsHeader,
  ReportsDateRange,
  ReportsKPICards,
  ReportsRevenueTrendChart,
  ReportsBookingDistributionChart,
  ReportsOccupancyTrendChart,
} from '@/components/hotel-admin/reports';

export function AdminReports() {
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => { fetchReportData(); }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const daysParam = dateRange === 'custom' ? '' : `?days=${dateRange}`;
      const res = await fetch(`/api/v1/hotel/reports${daysParam}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setReportData(json.data ?? null);
    } catch { } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const daysParam = dateRange === 'custom' ? '' : `?days=${dateRange}`;
      const res = await fetch(`/api/v1/hotel/reports${daysParam}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!json.data) return;
      const blob = new Blob([JSON.stringify(json.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hotel-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { }
  };

  return (
    <div className="space-y-8 pb-10">
      <ReportsHeader onExport={handleExport} />
      <ReportsDateRange value={dateRange} onChange={setDateRange} />
      <ReportsKPICards metrics={reportData?.financialMetrics} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportsRevenueTrendChart data={reportData?.revenueTrend} isLoading={isLoading} />
        <ReportsBookingDistributionChart data={reportData?.bookingDistribution} isLoading={isLoading} />
      </div>

      <ReportsOccupancyTrendChart data={reportData?.occupancyTrend} isLoading={isLoading} />
    </div>
  );
}
