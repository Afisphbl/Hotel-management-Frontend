export type DashboardData = {
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
  heatmap?: Array<{ room: string; dates: string[] }>;
  revenue30d?: Array<{ date: string | number; revenue: number }>;
  bookingSource?: Array<{ name: string; value: number; color: string }>;
};

export const BOOKING_STATUS_CLASS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-800',
  CHECKED_IN: 'bg-blue-100 text-blue-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
  CHECKED_OUT: 'bg-slate-100 text-slate-700',
};

export function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export interface ActivityItemData {
  time: string;
  title: string;
  desc: string;
  type: 'arrival' | 'booking' | 'maintenance' | 'departure';
}

export function buildActivityItems(d: DashboardData | null): ActivityItemData[] {
  const items: ActivityItemData[] = [];
  if (!d) return items;

  for (const b of d.recentBookings ?? []) {
    if (b.status === 'CHECKED_IN' || b.status === 'checked_in') {
      items.push({ time: relativeTime(b.createdAt), title: `Check-in: Room ${b.roomNumber}`, desc: `${b.guestName} has checked in.`, type: 'arrival' });
    } else {
      items.push({ time: relativeTime(b.createdAt), title: 'New Booking', desc: `Booking received for ${b.guestName} — Room ${b.roomNumber} (${b.nights}n).`, type: 'booking' });
    }
  }

  for (const p of d.recentPayments ?? []) {
    items.push({ time: relativeTime(p.createdAt), title: 'Payment Received', desc: `${p.method} payment of $${Number(p.amount).toFixed(2)} processed.`, type: 'booking' });
  }

  return items.sort((a, b) => {
    const aMins = parseInt(a.time) || 0;
    const bMins = parseInt(b.time) || 0;
    return aMins - bMins;
  }).slice(0, 8);
}
