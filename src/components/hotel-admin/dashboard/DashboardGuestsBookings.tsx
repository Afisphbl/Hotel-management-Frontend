import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardSection } from './DashboardSection';
import { DashboardKPI } from './DashboardKPI';
import { BOOKING_STATUS_CLASS } from './types';
import type { DashboardData } from './types';

interface DashboardGuestsBookingsProps {
  data: DashboardData | null;
  isLoading: boolean;
}

export function DashboardGuestsBookings({ data, isLoading }: DashboardGuestsBookingsProps) {
  const d = data;
  return (
    <DashboardSection title="Guests & Bookings" icon={Users}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardKPI title="Total Guests" value={d?.totalGuests ?? 0} loading={isLoading} accent="text-blue-600" />
        <DashboardKPI title="Today Check-ins" value={d?.todayCheckIns ?? 0} loading={isLoading} accent="text-green-600" />
        <DashboardKPI title="Today Check-outs" value={d?.todayCheckOuts ?? 0} loading={isLoading} accent="text-red-500" />
        <DashboardKPI title="Active Bookings" value={d?.activeBookings ?? 0} loading={isLoading} accent="text-purple-600" />
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
    </DashboardSection>
  );
}
