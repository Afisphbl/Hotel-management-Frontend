import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, Users, Bed, DollarSign, AlertCircle, ArrowUpRight, ArrowDownRight,
  Clock, UserCheck, Wrench, ClipboardList, ReceiptText, CheckCircle2, Hotel,
  BarChart3, Calendar, Shield, Activity, Building2, DoorOpen, DoorClosed,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

type DashboardData = {
  occupancy: number;
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  dirtyRooms: number;
  maintenanceRooms: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  activeBookings: number;
  monthlyBookings: number;
  yearlyBookings: number;
  confirmedBookings: number;
  checkedInBookings: number;
  todayRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  totalRevenue: number;
  monthlyProfit: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalGuests: number;
  totalStaff: number;
  activeStaff: number;
  recentBookings: Array<{
    id: string;
    guestName: string;
    roomNumber: string;
    nights: number;
    status: string;
    createdAt: string;
    totalPrice: number;
  }>;
  recentPayments: Array<{
    id: string;
    amount: number;
    method: string;
    createdAt: string;
  }>;
  occupancyTrend: Array<{ date: string; occupancy: number; revenue?: number }>;
  revenueTrend: Array<{ date: string; revenue: number }>;
  bookingTrend: Array<{ date: string; confirmed: number; checkedIn: number }>;
};

const BOOKING_STATUS_CLASS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-800',
  CHECKED_IN: 'bg-blue-100 text-blue-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
  CHECKED_OUT: 'bg-slate-100 text-slate-700',
};

function generateHeatmap() {
  return Array.from({ length: 15 }).map((_, i) => ({
    room: `Room ${101 + i}`,
    dates: Array.from({ length: 14 }).map(() => Math.random() > 0.3 ? 'available' : 'booked'),
  }));
}

function generateRevenue30d() {
  return Array.from({ length: 30 }).map((_, i) => ({
    date: i + 1,
    revenue: Math.floor(Math.random() * 5000) + 2000,
  }));
}

const BOOKINGS_BY_SOURCE = [
  { name: 'Direct', value: 45, color: '#C9973A' },
  { name: 'OTA (Booking.com)', value: 30, color: '#0F1B2D' },
  { name: 'OTA (Expedia)', value: 15, color: '#1a2a3a' },
  { name: 'Other', value: 10, color: '#94a3b8' },
];

const ACTIVITY_ITEMS = [
  { time: '2m ago', title: 'Check-in: Room 204', desc: 'Mr. John Doe has successfully checked in.', type: 'arrival' as const },
  { time: '15m ago', title: 'New Booking', desc: 'Direct booking received for Suite 501', type: 'booking' as const },
  { time: '45m ago', title: 'Maintenance', desc: 'Ticket #2405 resolved for Room 102', type: 'maintenance' as const },
  { time: '1h ago', title: 'Checkout: Room 305', desc: 'Guest Mrs. Jane Smith has checked out.', type: 'departure' as const },
];

export function AdminDashboard() {
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [heatmap] = useState(generateHeatmap);
  const [revenue30d] = useState(generateRevenue30d);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/v1/hotel/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        setData(json.data ?? null);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [token]);

  const d = data;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Operational overview — monitor and manage your property</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPIBox title="Occupancy" value={`${d?.occupancy ?? 0}%`} icon={TrendingUp} loading={isLoading} />
        <KPIBox title="Arrivals" value={d?.todayCheckIns ?? 0} icon={ArrowUpRight} color="text-green-600" loading={isLoading} />
        <KPIBox title="Departures" value={d?.todayCheckOuts ?? 0} icon={ArrowDownRight} color="text-red-500" loading={isLoading} />
        <KPIBox title="In-House" value={d?.occupiedRooms ?? 0} icon={DoorClosed} color="text-blue-500" loading={isLoading} />
        <KPIBox title="Available" value={d?.availableRooms ?? 0} icon={DoorOpen} loading={isLoading} />
        <KPIBox title="Rev (Today)" value={formatCurrency(d?.todayRevenue ?? 0)} icon={DollarSign} loading={isLoading} />
      </div>

      {/* Revenue */}
      <Section title="Revenue" icon={DollarSign}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPI title="Today" value={formatCurrency(d?.todayRevenue ?? 0)} loading={isLoading} accent="text-green-600" />
          <KPI title="This Month" value={formatCurrency(d?.monthlyRevenue ?? 0)} loading={isLoading} accent="text-green-600" />
          <KPI title="This Year" value={formatCurrency(d?.yearlyRevenue ?? 0)} loading={isLoading} accent="text-green-700" />
          <KPI title="All Time" value={formatCurrency(d?.totalRevenue ?? 0)} loading={isLoading} accent="text-green-800" />
        </div>
        <div className="mt-4 h-52">
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
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Housekeeping Status" icon={ClipboardList}>
          <div className="grid grid-cols-2 gap-4">
            <KPI title="Available Rooms" value={d?.availableRooms ?? 0} loading={isLoading} accent="text-green-600" />
            <KPI title="Occupied" value={d?.occupiedRooms ?? 0} loading={isLoading} accent="text-blue-600" />
            <KPI title="Dirty / Needs Cleaning" value={d?.dirtyRooms ?? 0} loading={isLoading} accent="text-yellow-600" />
            <KPI title="Occupancy Rate" value={`${d?.occupancy ?? 0}%`} loading={isLoading} accent="text-purple-600" />
          </div>
          <div className="mt-4 h-40">
            {isLoading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={d?.occupancyTrend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" fontSize={11} stroke="#999" tickFormatter={(v) => v.slice(5)} />
                  <YAxis fontSize={11} stroke="#999" unit="%" />
                  <Tooltip formatter={(v: number) => [`${v}%`, 'Occupancy']} />
                  <Area type="monotone" dataKey="occupancy" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Section>

        <Section title="Maintenance" icon={Wrench}>
          <div className="grid grid-cols-2 gap-4">
            <KPI title="Rooms in Maintenance" value={d?.maintenanceRooms ?? 0} loading={isLoading} accent="text-red-600" />
            <KPI title="Total Rooms" value={d?.totalRooms ?? 0} loading={isLoading} accent="text-slate-600" />
            <KPI title="Out-of-Service %" value={d?.totalRooms ? `${Math.round(((d.maintenanceRooms) / d.totalRooms) * 100)}%` : '0%'} loading={isLoading} accent="text-orange-600" />
            <KPI title="Active Staff" value={d?.activeStaff ?? 0} loading={isLoading} accent="text-green-600" />
          </div>
        </Section>
      </div>

      <Section title="Guests & Bookings" icon={Users}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPI title="Total Guests" value={d?.totalGuests ?? 0} loading={isLoading} accent="text-blue-600" />
          <KPI title="Today Check-ins" value={d?.todayCheckIns ?? 0} loading={isLoading} accent="text-green-600" />
          <KPI title="Today Check-outs" value={d?.todayCheckOuts ?? 0} loading={isLoading} accent="text-red-500" />
          <KPI title="Active Bookings" value={d?.activeBookings ?? 0} loading={isLoading} accent="text-purple-600" />
        </div>
        <div className="mt-4 h-52">
          {isLoading ? <Skeleton className="h-full w-full" /> : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d?.bookingTrend ?? []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={11} stroke="#999" tickFormatter={(v) => v.slice(5)} />
                <YAxis fontSize={11} stroke="#999" />
                <Tooltip />
                <Bar dataKey="confirmed" fill="#C9973A" radius={[2, 2, 0, 0]} name="Confirmed" />
                <Bar dataKey="checkedIn" fill="#0F1B2D" radius={[2, 2, 0, 0]} name="Checked In" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        {!isLoading && (d?.recentBookings?.length ?? 0) > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recent Bookings</p>
            {d!.recentBookings.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 text-sm">
                <div>
                  <span className="font-medium text-[#0F1B2D]">{b.guestName}</span>
                  <span className="ml-2 text-muted-foreground">· Room {b.roomNumber} · {b.nights}n</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn('text-xs', BOOKING_STATUS_CLASS[b.status] ?? 'bg-slate-100 text-slate-700')}>
                    {b.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-muted-foreground">{formatCurrency(b.totalPrice)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Room Availability + Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                {heatmap.map((row, i) => (
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

        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Live Activity</CardTitle>
            <CardDescription>Real-time property updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {ACTIVITY_ITEMS.map((item, i) => (
                <ActivityItem key={i} time={item.time} title={item.title} desc={item.desc} type={item.type} />
              ))}
              <Button variant="ghost" className="w-full text-xs text-[#C9973A] hover:bg-[#C9973A]/5">
                View all activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue 30d + Bookings by Source */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Revenue 30d</CardTitle>
            <CardDescription>Daily revenue performance</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            {revenue30d.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                <BarChart data={revenue30d}>
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
            <div className="h-full w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={BOOKINGS_BY_SOURCE}
                    cx="40%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {BOOKINGS_BY_SOURCE.map((entry, index) => (
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
                      lineHeight: '24px',
                    }}
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Section title="Staff Overview" icon={UserCheck}>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <KPI title="Total Staff" value={d?.totalStaff ?? 0} loading={isLoading} accent="text-slate-600" />
          <KPI title="Active Staff" value={d?.activeStaff ?? 0} loading={isLoading} accent="text-green-600" />
          <KPI title="Monthly Bookings" value={d?.monthlyBookings ?? 0} loading={isLoading} accent="text-blue-600" />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <Card className="border-none bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#0F1B2D]">
          <Icon className="h-4 w-4 text-[#C9973A]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function KPI({ title, value, loading, accent }: { title: string; value: string | number; loading: boolean; accent: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{title}</p>
      {loading ? (
        <Skeleton className="mt-2 h-7 w-20" />
      ) : (
        <p className={cn('mt-1 text-xl font-bold', accent)}>{value}</p>
      )}
    </div>
  );
}

function KPIBox({ title, value, icon: Icon, color = "text-[#0F1B2D]", loading }: any) {
  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden">
      <CardContent className="p-4 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-full bg-[#F8F7F4] flex items-center justify-center">
            <Icon className={cn("w-4 h-4", color)} />
          </div>
        </div>
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{title}</p>
          {loading ? (
            <Skeleton className="h-6 w-16 mt-1" />
          ) : (
            <h4 className="text-lg font-bold text-[#0F1B2D] mt-0.5">{value}</h4>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ time, title, desc, type }: { time: string; title: string; desc: string; type: 'arrival' | 'booking' | 'maintenance' | 'departure' }) {
  return (
    <div className="flex gap-4 group">
      <div className="mt-1">
        <div className={cn(
          "w-2 h-2 rounded-full",
          type === 'arrival' && 'bg-green-500',
          type === 'booking' && 'bg-[#C9973A]',
          type === 'maintenance' && 'bg-blue-500',
          type === 'departure' && 'bg-red-500',
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
