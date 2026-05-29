import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ComposedChart, Line,
} from 'recharts';
import {
  TrendingUp, Users, Bed, DollarSign, AlertCircle, ArrowUpRight, ArrowDownRight,
  Clock, UserCheck, Wrench, ClipboardList, ReceiptText, CheckCircle2, Hotel,
  BarChart3, Calendar,
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

export function HotelOwnerDashboard() {
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

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
        // silently fail — UI shows zeros
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
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Owner Dashboard</h1>
        <p className="text-sm text-muted-foreground">Business overview — revenue, operations, and analytics</p>
      </div>

      {/* ── Revenue Summary ── */}
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

      {/* ── Invoice Summary ── */}
      <Section title="Invoices" icon={ReceiptText}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPI title="Pending" value={d?.pendingInvoices ?? 0} loading={isLoading} accent="text-blue-600" />
          <KPI title="Overdue" value={d?.overdueInvoices ?? 0} loading={isLoading} accent="text-red-600" />
          <KPI title="Monthly Profit Est." value={formatCurrency(d?.monthlyProfit ?? 0)} loading={isLoading} accent="text-amber-600" />
          <KPI title="Recent Payments" value={d?.recentPayments?.length ?? 0} loading={isLoading} accent="text-green-600" />
        </div>
        {!isLoading && (d?.recentPayments?.length ?? 0) > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recent Payments</p>
            {d!.recentPayments.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 text-sm">
                <span className="text-muted-foreground capitalize">{p.method || 'manual'} · {format(new Date(p.createdAt), 'MMM d')}</span>
                <span className="font-semibold text-[#0F1B2D]">{formatCurrency(p.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Housekeeping & Maintenance ── */}
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
          <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-[#0F1B2D] mb-1">Maintenance is managed by hotel admins.</p>
            <p>Rooms currently under maintenance are excluded from bookings. Contact your admin to resolve open tickets.</p>
          </div>
        </Section>
      </div>

      {/* ── Guests & Bookings ── */}
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

      {/* ── Staff Summary ── */}
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
