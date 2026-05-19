
import { usePlatformKPIs, usePlatformRevenueChart, usePlatformHotelsByTier, usePlatformAuditLogs } from '@/hooks/usePlatformData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Hotel, 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Users 
} from 'lucide-react';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function PlatformDashboard() {
  const { data: kpis, isLoading: kpisLoading } = usePlatformKPIs();
  const { data: revData } = usePlatformRevenueChart();
  const { data: tierData } = usePlatformHotelsByTier();
  const { data: logs } = usePlatformAuditLogs();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Platform</h1>
          <p className="text-sm text-muted-foreground">Metrics across all properties.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard 
          title="Total Hotels" 
          value={kpis?.totalHotels} 
          icon={Hotel} 
          trend={kpis?.hotelsGrowth}
          loading={kpisLoading}
        />
        <KPICard 
          title="Active Subs" 
          value={kpis?.activeSubscriptions} 
          icon={CreditCard} 
          loading={kpisLoading}
        />
        <KPICard 
          title="Monthly Revenue" 
          value={kpis?.mrr} 
          isMoney
          icon={DollarSign} 
          trend={kpis?.mrrGrowth}
          loading={kpisLoading}
        />
        <KPICard 
          title="Total Bookings" 
          value={kpis?.totalBookings} 
          icon={Calendar} 
          loading={kpisLoading}
        />
        <KPICard 
          title="Active Users" 
          value={kpis?.activeUsers} 
          icon={Users} 
          loading={kpisLoading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Performance</CardTitle>
            <CardDescription>MRR and Booking Volume over last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {revData && revData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <AreaChart data={revData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9973A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#C9973A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#C9973A" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-muted/5 rounded-[4px]">
                <Skeleton className="h-[200px] w-full mx-6" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Hotels by Tier</CardTitle>
            <CardDescription>Subscription distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {tierData && tierData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <PieChart>
                  <Pie
                    data={tierData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {tierData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Skeleton className="h-40 w-40 rounded-full" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Recent Audit Logs</CardTitle>
          <CardDescription>Latest platform-wide activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-[#F8F7F4]">
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead className="hidden md:table-cell">Hotel</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="hidden lg:table-cell">Resource</TableHead>
                <TableHead className="hidden xl:table-cell">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs?.map((log) => (
                <TableRow key={log.id} className="hover:bg-[#F8F7F4]/50 transition-colors">
                  <TableCell className="text-[10px] sm:text-xs font-mono">
                    {format(new Date(log.timestamp), 'MMM d, HH:mm')}
                  </TableCell>
                  <TableCell className="font-medium text-xs sm:text-sm">{log.actor}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{log.hotel}</TableCell>
                  <TableCell>
                    <span className="text-[10px] sm:text-xs bg-[#0F1B2D]/5 px-2 py-0.5 rounded-full font-medium">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{log.resource}</TableCell>
                  <TableCell className="hidden xl:table-cell text-xs text-muted-foreground font-mono">{log.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function KPICard({ title, value, isMoney, icon: Icon, trend, loading }: any) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <Icon className="w-4 h-4 text-[#C9973A]" />
        </div>
        <div className="flex items-baseline gap-2">
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <h3 className="text-2xl font-bold text-[#0F1B2D]">
              {isMoney ? <MoneyDisplay amount={value} /> : value}
            </h3>
          )}
          {trend && (
            <span className={cn(
              "text-[10px] font-bold flex items-center",
              trend > 0 ? "text-green-600" : "text-red-600"
            )}>
              {trend > 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
