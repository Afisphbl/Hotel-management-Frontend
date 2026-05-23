import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { 
  Download, 
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Home
} from 'lucide-react';

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
      // Mock report data - replace with actual API call
      const mockData = {
        revenueByMonth: [
          { month: 'Jan', revenue: 12000 },
          { month: 'Feb', revenue: 19000 },
          { month: 'Mar', revenue: 15000 },
          { month: 'Apr', revenue: 22000 },
          { month: 'May', revenue: 25000 },
          { month: 'Jun', revenue: 28000 }
        ],
        occupancyTrend: [
          { date: '2024-05-01', occupancy: 65 },
          { date: '2024-05-08', occupancy: 72 },
          { date: '2024-05-15', occupancy: 80 },
          { date: '2024-05-22', occupancy: 78 },
          { date: '2024-05-29', occupancy: 85 }
        ],
        bookingSource: [
          { name: 'Direct', value: 45, color: '#C9973A' },
          { name: 'OTA', value: 35, color: '#0F1B2D' },
          { name: 'Referral', value: 20, color: '#FFB347' }
        ],
        guestStatistics: {
          totalGuests: 1250,
          newGuests: 145,
          returningGuests: 780,
          averageStay: 3.2
        },
        financialMetrics: {
          totalRevenue: 125000,
          averageDailyRate: 185,
          revenuePAR: 145,
          occupancyRate: 78
        }
      };
      setReportData(mockData);
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setIsLoading(false);
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
        <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <Download className="w-4 h-4 mr-2" /> Export Report
        </Button>
      </div>

      {/* Date Range Selector */}
      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex gap-3">
            {[
              { label: 'Last 30 Days', value: '30' },
              { label: 'Last 90 Days', value: '90' },
              { label: 'Last Year', value: '365' },
              { label: 'Custom', value: 'custom' }
            ].map(range => (
              <button
                key={range.value}
                onClick={() => setDateRange(range.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  dateRange === range.value
                    ? 'bg-[#C9973A] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

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
        {/* Revenue Chart */}
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue performance</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData?.revenueByMonth || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
                  <Bar dataKey="revenue" fill="#C9973A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Occupancy Trend */}
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Occupancy Trend</CardTitle>
            <CardDescription>Room occupancy percentage over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportData?.occupancyTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
                  <Line type="monotone" dataKey="occupancy" stroke="#C9973A" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Source and Guest Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Source */}
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Booking Sources</CardTitle>
            <CardDescription>Distribution by channel</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData?.bookingSource || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {reportData?.bookingSource?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip cursor={{ fill: 'transparent' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Guest Statistics */}
        <Card className="lg:col-span-2 shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Guest Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-100">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Guests</p>
                  <h4 className="text-2xl font-bold text-[#0F1B2D] mt-1">
                    {reportData?.guestStatistics.totalGuests || '0'}
                  </h4>
                </div>
                <Users className="w-12 h-12 text-blue-600 opacity-20" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                  <p className="text-sm font-medium text-muted-foreground">Returning Guests</p>
                  <h4 className="text-2xl font-bold text-green-600 mt-1">
                    {reportData?.guestStatistics.returningGuests || '0'}
                  </h4>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                  <p className="text-sm font-medium text-muted-foreground">New Guests</p>
                  <h4 className="text-2xl font-bold text-purple-600 mt-1">
                    {reportData?.guestStatistics.newGuests || '0'}
                  </h4>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                <p className="text-sm font-medium text-muted-foreground">Average Stay Duration</p>
                <h4 className="text-2xl font-bold text-amber-600 mt-1">
                  {reportData?.guestStatistics.averageStay || '0'} nights
                </h4>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, color, loading }: any) {
  return (
    <Card className="border-none shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-2" />
            ) : (
              <h3 className="text-2xl font-bold text-[#0F1B2D] mt-1">{value}</h3>
            )}
          </div>
          <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
