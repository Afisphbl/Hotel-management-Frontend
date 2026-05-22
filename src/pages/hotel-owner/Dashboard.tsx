import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Bed,
  Home,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function HotelOwnerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Replace with actual API call to /hotel/dashboard
      const response = await fetch('/api/hotel/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setDashboardData(data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Welcome to your hotel management dashboard</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            <Plus className="w-4 h-4 mr-2" /> New Booking
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none border-[#C9973A] text-[#C9973A] hover:bg-[#C9973A] hover:text-white">
            Reports
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Total Rooms"
          value={dashboardData?.totalRooms || '0'}
          icon={Bed}
          color="text-blue-600"
          loading={isLoading}
        />
        <KPICard 
          title="Occupancy Rate"
          value={dashboardData?.occupancyRate ? `${dashboardData.occupancyRate}%` : '0%'}
          icon={Users}
          color="text-green-600"
          loading={isLoading}
        />
        <KPICard 
          title="Active Bookings"
          value={dashboardData?.activeBookings || '0'}
          icon={Home}
          color="text-purple-600"
          loading={isLoading}
        />
        <KPICard 
          title="Revenue (30d)"
          value={dashboardData?.revenue30d ? `$${(dashboardData.revenue30d / 1000).toFixed(1)}k` : '$0'}
          icon={DollarSign}
          color="text-amber-600"
          loading={isLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Occupancy Trend */}
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Occupancy Trend (30 Days)</CardTitle>
            <CardDescription>Room occupancy percentage over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData?.occupancyTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                    formatter={(value) => `${value}%`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="occupancy" 
                    stroke="#C9973A" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Daily Revenue</CardTitle>
            <CardDescription>Revenue breakdown by day</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData?.dailyRevenue || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                    formatter={(value) => `$${value}`}
                  />
                  <Bar dataKey="revenue" fill="#C9973A" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2 shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Recent Bookings</CardTitle>
            <CardDescription>Latest booking activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
              ) : dashboardData?.recentBookings?.length > 0 ? (
                dashboardData.recentBookings.map((booking: any) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                    <div>
                      <p className="font-medium text-sm text-[#0F1B2D]">{booking.guestName}</p>
                      <p className="text-xs text-muted-foreground">{booking.roomNumber} • {booking.nights} nights</p>
                    </div>
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      booking.status === 'CONFIRMED' && 'bg-green-100 text-green-800',
                      booking.status === 'CHECKED_IN' && 'bg-blue-100 text-blue-800',
                      booking.status === 'PENDING' && 'bg-yellow-100 text-yellow-800'
                    )}>
                      {booking.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No recent bookings</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
            <CardDescription>Important metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatItem 
              label="Check-ins Today"
              value={dashboardData?.checkinsToday || '0'}
              icon={ArrowUpRight}
              color="text-green-600"
            />
            <StatItem 
              label="Check-outs Today"
              value={dashboardData?.checkoutsToday || '0'}
              icon={ArrowDownRight}
              color="text-red-600"
            />
            <StatItem 
              label="Maintenance Issues"
              value={dashboardData?.maintenanceIssues || '0'}
              icon={AlertCircle}
              color="text-orange-600"
            />
            <StatItem 
              label="Total Revenue"
              value={`$${dashboardData?.totalRevenue || '0'}`}
              icon={TrendingUp}
              color="text-blue-600"
            />
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
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-2" />
            ) : (
              <h3 className="text-2xl font-bold text-[#0F1B2D] mt-1">{value}</h3>
            )}
          </div>
          <div className={cn("w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center", color)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatItem({ label, value, icon: Icon, color }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <span className="font-bold text-[#0F1B2D]">{value}</span>
        <Icon className={cn("w-4 h-4", color)} />
      </div>
    </div>
  );
}
