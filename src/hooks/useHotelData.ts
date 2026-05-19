
import { useQuery } from '@tanstack/react-query';

export function useHotelKPIs() {
  return useQuery({
    queryKey: ['hotel-kpis'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 600));
      return {
        occupancy: 78.5,
        arrivals: 12,
        departures: 8,
        inHouse: 42,
        available: 18,
        todayRevenue: 4210,
        occupancyGrowth: 5.2,
      };
    }
  });
}

export function useHotelCharts() {
  return useQuery({
    queryKey: ['hotel-charts'],
    queryFn: async () => {
      return {
        revenue30d: Array.from({ length: 30 }).map((_, i) => ({
          date: i + 1,
          revenue: Math.floor(Math.random() * 5000) + 2000,
        })),
        bookingsBySource: [
          { name: 'Direct', value: 45, color: '#C9973A' },
          { name: 'OTA (Booking.com)', value: 30, color: '#0F1B2D' },
          { name: 'OTA (Expedia)', value: 15, color: '#1a2a3a' },
          { name: 'Other', value: 10, color: '#94a3b8' },
        ],
        roomTypePerformance: [
          { type: 'Standard', occupancy: 85, revenue: 12000 },
          { type: 'Deluxe', occupancy: 72, revenue: 15400 },
          { type: 'Suite', occupancy: 45, revenue: 18900 },
          { type: 'Penthouse', occupancy: 20, revenue: 10000 },
        ]
      };
    }
  });
}

export function useHotelAvailabilityHeatmap() {
  return useQuery({
    queryKey: ['hotel-availability-heatmap'],
    queryFn: async () => {
      return Array.from({ length: 15 }).map((_, i) => ({
        room: `Room ${101 + i}`,
        dates: Array.from({ length: 14 }).map(() => Math.random() > 0.3 ? 'available' : 'booked')
      }));
    }
  });
}

export function useHotelBookings() {
  return useQuery({
    queryKey: ['hotel-bookings'],
    queryFn: async () => {
      return Array.from({ length: 20 }).map((_, i) => ({
        id: `book-${1000 + i}`,
        guest: ['Alice Smith', 'Bob Johnson', 'Charlie Williams', 'Diana Miller', 'Evan Davis'][i % 5],
        room: `20${i % 9 + 1}`,
        checkIn: new Date(Date.now() + (i-5) * 86400000).toISOString(),
        checkOut: new Date(Date.now() + (i-2) * 86400000).toISOString(),
        nights: 3,
        total: Math.floor(Math.random() * 1200) + 300,
        status: ['confirmed', 'checked_in', 'checked_out', 'cancelled', 'hold'][i % 5],
      }));
    }
  });
}

export function useHotelRooms() {
  return useQuery({
    queryKey: ['hotel-rooms'],
    queryFn: async () => {
      return Array.from({ length: 12 }).map((_, i) => ({
        id: `room-${101 + i}`,
        number: `${100 + i + 1}`,
        type: ['Standard', 'Deluxe', 'Suite'][i % 3],
        floor: Math.floor(i / 5) + 1,
        status: ['occupied', 'available', 'dirty', 'maintenance'][Math.floor(Math.random() * 4)],
        hkStatus: ['clean', 'dirty', 'in_progress', 'inspecting'][Math.floor(Math.random() * 4)],
      }));
    }
  });
}

export function useHousekeepingTasks() {
  return useQuery({
    queryKey: ['housekeeping-tasks'],
    queryFn: async () => {
      return {
        toClean: [
          { id: '1', room: '101', priority: 'high', notes: 'Late checkout', type: 'Stay over' },
          { id: '2', room: '204', priority: 'medium', notes: 'Pillow request', type: 'Checkout' },
          { id: '6', room: '205', priority: 'low', notes: '', type: 'Checkout' },
        ],
        cleaning: [
          { id: '3', room: '305', staff: 'Maria S.', elapsed: '15m', type: 'Deep Clean' },
        ],
        inspecting: [
          { id: '4', room: '402', staff: 'Admin', elapsed: '5m', type: 'Checkout' },
        ],
        clean: [
          { id: '5', room: '105', staff: 'Maria S.', finished: '10:30 AM', type: 'Stay over' },
        ]
      };
    }
  });
}

export function useHotelGuests() {
  return useQuery({
    queryKey: ['hotel-guests'],
    queryFn: async () => {
      return [
        { id: 'g-1', name: 'Alice Smith', email: 'alice@example.com', phone: '+44 7700 900123', status: 'In-house', totalSpend: 2450, visits: 3, lastStay: '2024-05-15' },
        { id: 'g-2', name: 'Bob Johnson', email: 'bob@example.com', phone: '+44 7700 900456', status: 'Checkout', totalSpend: 840, visits: 1, lastStay: '2024-05-18' },
        { id: 'g-3', name: 'Charlie Williams', email: 'charlie@gmail.com', phone: '+1 555-0199', status: 'Reserved', totalSpend: 0, visits: 0, lastStay: '-' },
        { id: 'g-4', name: 'Diana Miller', email: 'diana.m@corp.com', phone: '+44 7700 900789', status: 'VIP', totalSpend: 15600, visits: 12, lastStay: '2024-04-12' },
      ];
    }
  });
}

export function useHotelFinance() {
  return useQuery({
    queryKey: ['hotel-finance'],
    queryFn: async () => {
      return {
        mrr: 45200,
        unpaidInvoices: 12,
        pendingPayouts: 4,
        transactions: [
          { id: 'tx-1', date: '2024-05-19', type: 'Booking', amount: 450, guest: 'Alice Smith', status: 'Succeeded' },
          { id: 'tx-2', date: '2024-05-18', type: 'Refund', amount: -60, guest: 'Bob Johnson', status: 'Pending' },
          { id: 'tx-3', date: '2024-05-18', type: 'Booking', amount: 1200, guest: 'Diana Miller', status: 'Succeeded' },
          { id: 'tx-4', date: '2024-05-17', type: 'Market', amount: 15, guest: 'Walk-in', status: 'Succeeded' },
        ]
      };
    }
  });
}

export function useHotelMaintenance() {
  return useQuery({
    queryKey: ['hotel-maintenance'],
    queryFn: async () => {
      return [
        { id: 'm-1', room: '105', type: 'Plumbing', description: 'Leaking faucet in bathroom', priority: 'High', status: 'Pending', reportedBy: 'HK - Maria', date: '2024-05-19' },
        { id: 'm-2', room: '202', type: 'HVAC', description: 'AC unit making loud noise', priority: 'Medium', status: 'In Progress', reportedBy: 'Guest', date: '2024-05-18' },
        { id: 'm-3', room: 'Common Area', type: 'Electrical', description: 'Flickering light in lobby', priority: 'Low', status: 'Resolved', reportedBy: 'Front Desk', date: '2024-05-16' },
      ];
    }
  });
}

export function useHotelStaff() {
  return useQuery({
    queryKey: ['hotel-staff'],
    queryFn: async () => {
      return [
        { id: 's-1', name: 'James Wilson', role: 'Front Desk Manager', status: 'Active', shift: 'Morning', efficiency: '98%' },
        { id: 's-2', name: 'Maria Santos', role: 'Housekeeping Lead', status: 'On Shift', shift: 'All-day', efficiency: '94%' },
        { id: 's-3', name: 'David Chen', role: 'Maintenance', status: 'On Break', shift: 'Midday', efficiency: '88%' },
        { id: 's-4', name: 'Sophie Taylor', role: 'Concierge', status: 'Inactive', shift: 'Evening', efficiency: '92%' },
      ];
    }
  });
}

export function useHotelPricing() {
  return useQuery({
    queryKey: ['hotel-pricing'],
    queryFn: async () => {
      return {
        currentRates: [
          { id: 'p-1', type: 'Standard', basePrice: 120, currentPrice: 145, demand: 'High', strategy: 'Dynamic' },
          { id: 'p-2', type: 'Deluxe', basePrice: 180, currentPrice: 210, demand: 'High', strategy: 'Dynamic' },
          { id: 'p-3', type: 'Suite', basePrice: 350, currentPrice: 350, demand: 'Medium', strategy: 'Fixed' },
        ],
        competitorAvg: 115,
      };
    }
  });
}
