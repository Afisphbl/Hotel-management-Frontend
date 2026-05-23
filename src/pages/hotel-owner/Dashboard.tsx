import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar, ComposedChart, Area, AreaChart
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
  Plus,
  Clock,
  UserCheck,
  UserX,
  Wrench,
  DollarSign as DollarIcon,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function HotelOwnerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
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

  const formatCurrency = (value: number) => {
    return `ETB ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'CHECKED_IN': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      case 'ISSUED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Hotel Owner Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Comprehensive business overview and analytics</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            <Plus className="w-4 h-4 mr-2" /> New Booking
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none border-[#C9973A] text-[#C9973A] hover:bg-[#C9973A] hover:text-white">
            <BarChart3 className="w-4 h-4 mr-2" /> Detailed Reports
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
          description={`Available: ${dashboardData?.availableRooms || 0}`}
        />
        <KPICard
          title="Occupancy Rate"
          value={`${dashboardData?.occupancy || 0}%`}
          icon={Users}
          color="text-green-600"
          loading={isLoading}
          description={`Occupied: ${dashboardData?.occupiedRooms || 0}`}
        />
        <KPICard
          title="Active Bookings"
          value={dashboardData?.activeBookings || '0'}
          icon={Home}
          color="text-purple-600"
          loading={isLoading}
          description={`This month: ${dashboardData?.monthlyBookings || 0}`}
        />
        <KPICard
          title="Monthly Revenue"
          value={formatCurrency(dashboardData?.monthlyRevenue || 0)}
          icon={DollarSign}
          color="text-amber-600"
          loading={isLoading}
          description={`Profit: ${formatCurrency(dashboardData?.monthlyProfit || 0)}`}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Occupancy Trend */}
        <Card className="lg:col-span-2 shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Performance Overview</CardTitle>
            <CardDescription>Occupancy, Revenue & Booking Trends (30 Days)</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dashboardData?.occupancyTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#999" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#999" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#999" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                    formatter={(value, name) => {
                      if (name === 'occupancy') return [`${value}%`, 'Occupancy'];
                      if (name === 'revenue') return [formatCurrency(value), 'Revenue'];
                      return [value, name];
                    }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="occupancy"
                    fill="#C9973A"
                    fillOpacity={0.2}
                    stroke="#C9973A"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0F1B2D"
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Room Status Distribution */}
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Room Status</CardTitle>
            <CardDescription>Current room distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <RoomStatItem
                label="Available"
                value={dashboardData?.availableRooms || 0}
                total={dashboardData?.totalRooms || 1}
                color="text-green-600"
                icon={Bed}
              />
              <RoomStatItem
                label="Occupied"
                value={dashboardData?.occupiedRooms || 0}
                total={dashboardData?.totalRooms || 1}
                color="text-blue-600"
                icon={Users}
              />
              <RoomStatItem
                label="Dirty"
                value={dashboardData?.dirtyRooms || 0}
                total={dashboardData?.totalRooms || 1}
                color="text-yellow-600"
                icon={Wrench}
              />
              <RoomStatItem
                label="Maintenance"
                value={dashboardData?.maintenanceRooms || 0}
                total={dashboardData?.totalRooms || 1}
                color="text-red-600"
                icon={AlertCircle}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over the past 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData?.revenueTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#999" fontSize={12} />
                  <YAxis stroke="#999" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    fill="#C9973A"
                    fillOpacity={0.3}
                    stroke="#C9973A"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Booking Trends */}
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Booking Activity</CardTitle>
            <CardDescription>Confirmed vs Checked-in bookings</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData?.bookingTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#999" fontSize={12} />
                  <YAxis stroke="#999" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                  />
                  <Bar dataKey="confirmed" fill="#C9973A" radius={[2, 2, 0, 0]} name="Confirmed" />
                  <Bar dataKey="checkedIn" fill="#0F1B2D" radius={[2, 2, 0, 0]} name="Checked In" />
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
            <CardDescription>Latest booking activities and guest information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
              ) : dashboardData?.recentBookings?.length > 0 ? (
                dashboardData.recentBookings.map((booking: any) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#C9973A] rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#0F1B2D]">{booking.guestName}</p>
                        <p className="text-xs text-muted-foreground">
                          Room {booking.roomNumber} • {booking.nights} nights • {formatCurrency(booking.totalPrice)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No recent bookings found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Business Metrics */}
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Business Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <BusinessMetricItem
              label="Total Revenue (Year)"
              value={formatCurrency(dashboardData?.yearlyRevenue || 0)}
              icon={TrendingUp}
              color="text-green-600"
              trend="+12.5%"
            />
            <BusinessMetricItem
              label="Total Guests"
              value={dashboardData?.totalGuests || '0'}
              icon={Users}
              color="text-blue-600"
            />
            <BusinessMetricItem
              label="Staff Members"
              value={dashboardData?.activeStaff || '0'}
              icon={UserCheck}
              color="text-purple-600"
              description={`Total: ${dashboardData?.totalStaff || 0}`}
            />
            <BusinessMetricItem
              label="Pending Invoices"
              value={dashboardData?.pendingInvoices || '0'}
              icon={AlertCircle}
              color="text-yellow-600"
            />
            <BusinessMetricItem
              label="Overdue Invoices"
              value={dashboardData?.overdueInvoices || '0'}
              icon={Clock}
              color="text-red-600"
            />
            <BusinessMetricItem
              label="Today's Check-ins"
              value={dashboardData?.todayCheckIns || '0'}
              icon={ArrowUpRight}
              color="text-green-600"
            />
            <BusinessMetricItem
              label="Today's Check-outs"
              value={dashboardData?.todayCheckOuts || '0'}
              icon={ArrowDownRight}
              color="text-red-600"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, color, loading, description }: any) {
  return (
    <Card className="border-none shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-2" />
            ) : (
              <h3 className="text-2xl font-bold text-[#0F1B2D] mt-1">{value}</h3>
            )}
            {description && !loading && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
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

function RoomStatItem({ label, value, total, color, icon: Icon }: any) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className={cn("w-4 h-4", color)} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-[#0F1B2D]">{value}</div>
        <div className="text-xs text-muted-foreground">{percentage}%</div>
      </div>
    </div>
  );
}

function BusinessMetricItem({ label, value, icon: Icon, color, description, trend }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
      <div className="flex items-center gap-2">
        <Icon className={cn("w-4 h-4", color)} />
        <div>
          <p className="text-sm font-medium text-[#0F1B2D]">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="text-right">
        <span className="font-bold text-[#0F1B2D]">{value}</span>
        {trend && (
          <span className="ml-2 text-xs font-medium text-green-600">{trend}</span>
        )}
      </div>
    </div>
  );
}
