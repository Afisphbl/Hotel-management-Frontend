import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, TrendingUp, Banknote, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface FinanceKPICardsProps {
  data: any;
  isLoading: boolean;
}

export function FinanceKPICards({ data, isLoading }: FinanceKPICardsProps) {
  const cards = [
    { title: 'Today Revenue', value: formatCurrency(data?.todayRevenue ?? 0), icon: DollarSign, color: 'text-green-600', trend: 'up' },
    { title: 'Monthly Revenue', value: formatCurrency(data?.monthlyRevenue ?? 0), icon: TrendingUp, color: 'text-blue-600', trend: 'up' },
    { title: 'Monthly Expenses', value: formatCurrency(data?.monthlyExpenses ?? 0), icon: Banknote, color: 'text-red-600', trend: 'down' },
    { title: 'Monthly Net Profit', value: formatCurrency(data?.monthlyProfit ?? 0), icon: TrendingDown, color: data?.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600', trend: data?.monthlyProfit >= 0 ? 'up' : 'down' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(s => (
        <Card key={s.title} className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">{s.title}</p>
                {isLoading ? <Skeleton className="mt-2 h-7 w-24" /> : (
                  <h3 className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</h3>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <s.icon className={`w-10 h-10 ${s.color} opacity-20`} />
                {s.trend && (
                  <span className={cn("text-xs flex items-center gap-0.5", s.trend === 'up' ? 'text-green-500' : 'text-red-500')}>
                    {s.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
