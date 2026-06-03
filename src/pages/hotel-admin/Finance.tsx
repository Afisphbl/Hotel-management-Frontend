import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  FinanceHeader, FinanceKPICards, FinanceInvoiceSummary,
  FinanceRevenueTrendChart, FinanceOccupancyRevenueChart,
  FinanceExpenseTrendChart, FinanceExpensesByCategory
} from '@/components/hotel-admin/finance';

export function AdminFinance() {
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/v1/hotel/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        setData(json.data ?? null);
      } catch { } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [token]);

  return (
    <div className="space-y-8 pb-10">
      <FinanceHeader />
      <FinanceKPICards data={data} isLoading={isLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinanceInvoiceSummary data={data} isLoading={isLoading} />
        <FinanceRevenueTrendChart data={data} isLoading={isLoading} />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <FinanceOccupancyRevenueChart data={data} isLoading={isLoading} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinanceExpenseTrendChart data={data} isLoading={isLoading} />
        <FinanceExpensesByCategory data={data} isLoading={isLoading} />
      </div>
    </div>
  );
}
