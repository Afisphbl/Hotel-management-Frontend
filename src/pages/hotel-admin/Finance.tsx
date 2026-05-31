import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, TrendingUp, TrendingDown, ReceiptText, CreditCard, Banknote, ArrowUpRight, ArrowDownRight, BarChart3, Wrench } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Line } from 'recharts';

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

  const d = data;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Finance Overview</h1>
        <p className="text-sm text-muted-foreground">Revenue, invoices, and financial performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Today Revenue', value: formatCurrency(d?.todayRevenue ?? 0), icon: DollarSign, color: 'text-green-600', trend: 'up' },
          { title: 'Monthly Revenue', value: formatCurrency(d?.monthlyRevenue ?? 0), icon: TrendingUp, color: 'text-blue-600', trend: 'up' },
          { title: 'Monthly Expenses', value: formatCurrency(d?.monthlyExpenses ?? 0), icon: Banknote, color: 'text-red-600', trend: 'down' },
          { title: 'Monthly Net Profit', value: formatCurrency(d?.monthlyProfit ?? 0), icon: TrendingDown, color: d?.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600', trend: d?.monthlyProfit >= 0 ? 'up' : 'down' },
        ].map(s => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ReceiptText className="w-4 h-4 text-[#C9973A]" /> Invoice Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Pending', value: d?.pendingInvoices ?? 0, color: 'text-blue-600' },
                { label: 'Overdue', value: d?.overdueInvoices ?? 0, color: 'text-red-600' },
              ].map(s => (
                <div key={s.label} className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{s.label}</p>
                  {isLoading ? <Skeleton className="mt-2 h-7 w-16" /> : (
                    <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
                  )}
                </div>
              ))}
            </div>
            {!isLoading && (d?.recentPayments?.length ?? 0) > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recent Payments</p>
                {d!.recentPayments.slice(0, 5).map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 text-sm">
                    <span className="text-muted-foreground capitalize">{p.method || 'manual'}</span>
                    <span className="font-semibold text-[#0F1B2D]">{formatCurrency(p.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#C9973A]" /> Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              {isLoading ? <Skeleton className="h-full w-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={d?.revenueTrend ?? []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" fontSize={11} stroke="#999" tickFormatter={(v) => v.slice(5)} />
                    <YAxis fontSize={11} stroke="#999" />
                    <Tooltip formatter={(v: number) => [formatCurrency(v), 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#C9973A" fill="#C9973A" fillOpacity={0.2} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#C9973A]" /> Occupancy vs Revenue Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? <Skeleton className="h-full w-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={d?.revenueTrend.map((r: any, i: number) => ({
                    ...r,
                    occupancy: d?.occupancyTrend[i]?.occupancy ?? 0
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" fontSize={11} stroke="#999" tickFormatter={(v) => v.slice(5)} />
                    <YAxis yAxisId="left" fontSize={11} stroke="#999" />
                    <YAxis yAxisId="right" orientation="right" fontSize={11} stroke="#999" unit="%" />
                    <Tooltip formatter={(v: any, name: string) => name === 'occupancy' ? [`${v}%`, 'Occupancy'] : [formatCurrency(v), 'Revenue']} />
                    <Bar yAxisId="left" dataKey="revenue" fill="#0F1B2D" radius={[4, 4, 0, 0]} barSize={20} />
                    <Line yAxisId="right" type="monotone" dataKey="occupancy" stroke="#C9973A" strokeWidth={3} dot={{ r: 4, fill: '#C9973A' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" /> Expense Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              {isLoading ? <Skeleton className="h-full w-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={d?.expenseTrend ?? []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" fontSize={11} stroke="#999" tickFormatter={(v) => v.slice(5)} />
                    <YAxis fontSize={11} stroke="#999" />
                    <Tooltip formatter={(v: number) => [formatCurrency(v), 'Expenses']} />
                    <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#C9973A]" /> Expenses by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-32 w-full" /> : (
              <div className="space-y-3">
                {(d?.expenseByAccount ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No expenses recorded this month</p>
                ) : (
                  d!.expenseByAccount.map((e: any) => (
                    <div key={e.accountId} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5">
                      <span className="text-sm font-medium text-[#0F1B2D]">
                        {e.accountId === 'MAINTENANCE_EXPENSE' ? 'Maintenance' : e.accountId}
                      </span>
                      <span className="text-sm font-semibold text-red-600">{formatCurrency(e.total)}</span>
                    </div>
                  ))
                )}
                {(d?.recentExpenses ?? []).length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Recent Expenses</p>
                    <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                    {d!.recentExpenses.map((e: any) => (
                      <div key={e.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 text-sm mb-1">
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium text-[#0F1B2D]">{e.description || e.accountId}</p>
                          <p className="text-xs text-muted-foreground">{new Date(e.entryDate).toLocaleDateString()}</p>
                        </div>
                        <span className="font-semibold text-red-600 ml-2">{formatCurrency(e.amount)}</span>
                      </div>
                    ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
