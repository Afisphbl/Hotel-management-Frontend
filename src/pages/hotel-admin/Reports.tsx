import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/authStore';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import {
  Download, TrendingUp, Calendar, DollarSign, Users, Home,
} from 'lucide-react';

const COLORS = ['#C9973A', '#0F1B2D', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

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

export function AdminReports() {
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => { fetchReportData(); }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/v1/hotel/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setReportData(json.data ?? null);
    } catch { } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Comprehensive insights into hotel operations</p>
        </div>
        <Button className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <Download className="w-4 h-4 mr-2" /> Export Report
        </Button>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex gap-3">
            {[
              { label: 'Last 30 Days', value: '30' },
              { label: 'Last 90 Days', value: '90' },
              { label: 'Last Year', value: '365' },
              { label: 'Custom', value: 'custom' },
            ].map(range => (
              <button key={range.value} onClick={() => setDateRange(range.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  dateRange === range.value ? 'bg-[#C9973A] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                {range.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Revenue" value={formatCurrency(reportData?.financialMetrics?.totalRevenue || 0)} icon={DollarSign} color="text-green-600" loading={isLoading} />
        <KPICard title="Occupancy Rate" value={`${reportData?.financialMetrics?.occupancyRate || '0'}%`} icon={Home} color="text-blue-600" loading={isLoading} />
        <KPICard title="Avg. Daily Rate" value={formatCurrency(reportData?.financialMetrics?.averageDailyRate || 0)} icon={TrendingUp} color="text-purple-600" loading={isLoading} />
        <KPICard title="RevPAR" value={formatCurrency(reportData?.financialMetrics?.revPAR || 0)} icon={DollarSign} color="text-amber-600" loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-none bg-white">
          <CardHeader><CardTitle className="text-base">Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              {isLoading ? <Skeleton className="h-full w-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData?.revenueTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" fontSize={11} stroke="#999" />
                    <YAxis fontSize={11} stroke="#999" />
                    <Tooltip formatter={(v: number) => [formatCurrency(v), 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#C9973A" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader><CardTitle className="text-base">Booking Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              {isLoading ? <Skeleton className="h-full w-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={(reportData?.bookingDistribution || []).length > 0 ? reportData.bookingDistribution : [{ name: 'No Data', value: 1 }]}
                      cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {(reportData?.bookingDistribution || []).length > 0
                        ? reportData.bookingDistribution.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)
                        : <Cell fill="#e5e7eb" />}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader><CardTitle className="text-base">Occupancy Trend</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64">
            {isLoading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData?.occupancyTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" fontSize={11} stroke="#999" />
                  <YAxis fontSize={11} stroke="#999" unit="%" />
                  <Tooltip formatter={(v: number) => [`${v}%`, 'Occupancy']} />
                  <Bar dataKey="occupancy" fill="#0F1B2D" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
