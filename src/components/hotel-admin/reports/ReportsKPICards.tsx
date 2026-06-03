import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, TrendingUp, Home } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface FinancialMetrics {
  totalRevenue?: number;
  occupancyRate?: number | string;
  averageDailyRate?: number;
  revPAR?: number;
}

interface ReportsKPICardsProps {
  metrics: FinancialMetrics | null;
  isLoading: boolean;
}

function KPICard({ title, value, icon: Icon, color, loading }: { title: string; value: string; icon: any; color: string; loading: boolean }) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">{title}</p>
            {loading ? <Skeleton className="mt-2 h-7 w-20" /> : (
              <h3 className={`text-2xl font-bold ${color} mt-1`}>{value}</h3>
            )}
          </div>
          <Icon className={`w-10 h-10 ${color} opacity-20`} />
        </div>
      </CardContent>
    </Card>
  );
}

export function ReportsKPICards({ metrics, isLoading }: ReportsKPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard title="Total Revenue" value={formatCurrency(metrics?.totalRevenue || 0)} icon={DollarSign} color="text-green-600" loading={isLoading} />
      <KPICard title="Occupancy Rate" value={`${metrics?.occupancyRate || '0'}%`} icon={Home} color="text-blue-600" loading={isLoading} />
      <KPICard title="Avg. Daily Rate" value={formatCurrency(metrics?.averageDailyRate || 0)} icon={TrendingUp} color="text-purple-600" loading={isLoading} />
      <KPICard title="RevPAR" value={formatCurrency(metrics?.revPAR || 0)} icon={DollarSign} color="text-amber-600" loading={isLoading} />
    </div>
  );
}
