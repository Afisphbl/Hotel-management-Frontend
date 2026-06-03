import { useParams } from '@tanstack/react-router';
import { useHotelUsageMetrics, useTenantInfrastructure } from '@/hooks/usePlatformData';
import { UsageMetricsLoading } from '@/components/platform/hotel-detail/UsageMetricsLoading';
import { UsageMetricsError } from '@/components/platform/hotel-detail/UsageMetricsError';
import { UsageMetricsEmpty } from '@/components/platform/hotel-detail/UsageMetricsEmpty';
import { InfrastructureHealth } from '@/components/platform/hotel-detail/InfrastructureHealth';
import { QuotaUsage } from '@/components/platform/hotel-detail/QuotaUsage';
import { UsageCharts } from '@/components/platform/hotel-detail/UsageCharts';

export function HotelUsageMetrics() {
  const { id } = useParams({ from: '/auth/platform/hotels/$id' });
  const { data: metrics, isLoading: metricsLoading, isError: metricsError } = useHotelUsageMetrics(id);
  const { data: infra, isLoading: infraLoading, isError: infraError, refetch } = useTenantInfrastructure(id);

  if (infraLoading || metricsLoading) {
    return <UsageMetricsLoading />;
  }

  if (infraError || metricsError) {
    return <UsageMetricsError onRetry={refetch} />;
  }

  if (!infra) {
    return <UsageMetricsEmpty />;
  }

  // Check if we have real live data from backend or just the fallback/empty state
  const hasLiveMetrics = !!(metrics && metrics.bookings && metrics.bookings.length > 0);
  const hasLiveInfra = !!(infra && (infra.storageUsed !== null || infra.roomsUsed !== null));

  return (
    <div className="space-y-6">
      <InfrastructureHealth infra={infra} />
      <QuotaUsage infra={infra} hasLiveInfra={hasLiveInfra} />
      <UsageCharts metrics={metrics} hasLiveMetrics={hasLiveMetrics} />
    </div>
  );
}
