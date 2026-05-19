
import { useHotelKPIs, useHotelCharts, useHotelAvailabilityHeatmap } from '@/hooks/useHotelData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar, ComposedChart
} from 'recharts';
import { 
  Users, 
  DoorOpen, 
  DoorClosed, 
  Bed, 
  CheckCircle2, 
  TrendingUp, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';
import { cn } from '@/lib/utils';

export function HotelDashboard() {
  const { data: kpis, isLoading: kpisLoading } = useHotelKPIs();
  const { data: charts } = useHotelCharts();
  const { data: heatmap } = useHotelAvailabilityHeatmap();

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Hotel Overview</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Property status for Grand Peninsula Resort</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            <Plus className="w-4 h-4 mr-2" /> New Booking
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none border-[#C9973A] text-[#C9973A] hover:bg-[#C9973A] hover:text-white">
            Daily Report
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPIBox title="Occupancy" value={`${kpis?.occupancy}%`} icon={Users} trend={kpis?.occupancyGrowth} loading={kpisLoading} />
        <KPIBox title="Arrivals" value={kpis?.arrivals} icon={ArrowUpRight} color="text-green-600" loading={kpisLoading} />
        <KPIBox title="Departures" value={kpis?.departures} icon={ArrowDownRight} color="text-red-500" loading={kpisLoading} />
        <KPIBox title="In-House" value={kpis?.inHouse} icon={CheckCircle2} color="text-blue-500" loading={kpisLoading} />
        <KPIBox title="Available" value={kpis?.available} icon={Bed} loading={kpisLoading} />
        <KPIBox title="Rev (Today)" value={kpis?.todayRevenue} isMoney icon={TrendingUp} loading={kpisLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Availability Heatmap */}
        <Card className="lg:col-span-2 shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Room Availability</CardTitle>
              <CardDescription>Visual availability map for next 14 days</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] items-center">
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-sm"></div> Avail</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-sm"></div> Occ</div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="space-y-2 min-w-[400px]">
              <div className="flex border-b border-muted pb-2">
                <div className="w-20 text-[10px] font-bold uppercase text-muted-foreground">Room</div>
                <div className="flex-1 flex justify-between px-2">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className="w-6 text-center text-[10px] font-bold text-muted-foreground">{18 + i}</div>
                  ))}
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto space-y-1 custom-scrollbar pr-2">
                {heatmap?.map((row, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-20 text-xs font-medium text-[#0F1B2D]">{row.room}</div>
                    <div className="flex-1 flex justify-between px-2">
                      {row.dates.map((status, j) => (
                        <div 
                          key={j} 
                          className={cn(
                            "w-6 h-6 rounded-sm border border-white/20 transition-transform hover:scale-110 cursor-pointer shadow-sm",
                            status === 'available' ? 'bg-green-500/80' : 'bg-blue-600/80 shadow-inner'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Live Activity</CardTitle>
            <CardDescription>Real-time property updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <ActivityItem 
                time="2m ago" 
                title="Check-in: Room 204" 
                desc="Mr. John Doe has successfully checked in."
                type="arrival"
              />
              <ActivityItem 
                time="15m ago" 
                title="New Booking" 
                desc="Direct booking received for Suite 501"
                type="booking"
              />
              <ActivityItem 
                time="45m ago" 
                title="Maintenance" 
                desc="Ticket #2405 resolved for Room 102"
                type="maintenance"
              />
              <ActivityItem 
                time="1h ago" 
                title="Checkout: Room 305" 
                desc="Guest Mrs. Jane Smith has checked out."
                type="departure"
              />
              <Button variant="ghost" className="w-full text-xs text-[#C9973A] hover:bg-[#C9973A]/5">
                View all activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Revenue 30d</CardTitle>
            <CardDescription>Daily revenue performance</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            {charts?.revenue30d && charts.revenue30d.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                <BarChart data={charts?.revenue30d}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#C9973A" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Skeleton className="h-[180px] w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Bookings by Source</CardTitle>
            <CardDescription>Direct vs OTA distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] relative">
            {charts?.bookingsBySource && charts.bookingsBySource.length > 0 ? (
              <div className="h-full w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts?.bookingsBySource}
                      cx="40%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {charts?.bookingsBySource.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Legend 
                      layout="vertical" 
                      align="right" 
                      verticalAlign="middle"
                      wrapperStyle={{
                        paddingLeft: '20px',
                        fontSize: '11px',
                        lineHeight: '24px'
                      }}
                      iconType="circle"
                      iconSize={8}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Skeleton className="h-32 w-32 rounded-full" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPIBox({ title, value, icon: Icon, color = "text-[#0F1B2D]", trend, loading, isMoney }: any) {
  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden">
      <CardContent className="p-4 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-full bg-[#F8F7F4] flex items-center justify-center">
            <Icon className={cn("w-4 h-4", color)} />
          </div>
          {trend && (
            <span className={cn("text-[10px] font-bold", trend > 0 ? "text-green-600" : "text-red-500")}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{title}</p>
          {loading ? (
            <Skeleton className="h-6 w-16 mt-1" />
          ) : (
            <h4 className="text-lg font-bold text-[#0F1B2D] mt-0.5">
              {isMoney ? <MoneyDisplay amount={value} decimals={0} /> : value}
            </h4>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ time, title, desc, type }: any) {
  return (
    <div className="flex gap-4 group">
      <div className="mt-1">
        <div className={cn(
          "w-2 h-2 rounded-full",
          type === 'arrival' && 'bg-green-500',
          type === 'booking' && 'bg-[#C9973A]',
          type === 'maintenance' && 'bg-blue-500',
          type === 'departure' && 'bg-red-500'
        )} />
        <div className="w-0.5 h-full bg-muted mx-auto my-1 group-last:hidden" />
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-[#0F1B2D]">{title}</p>
          <span className="text-[10px] text-muted-foreground">{time}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
