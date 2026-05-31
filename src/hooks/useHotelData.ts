
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useHotel(id: string) {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: async () => {
      const data = await api.get(`hotel/owner/hotels/${id}`);
      return data.data || data;
    },
    enabled: !!id,
  });
}

export function useHotelKPIs() {
  return useQuery({
    queryKey: ['hotel-dashboard-kpis'],
    queryFn: async () => {
      const res = await api.get('hotel/dashboard');
      const d = res.data;
      return {
        occupancy: d.occupancy,
        arrivals: d.todayCheckIns,
        departures: d.todayCheckOuts,
        inHouse: d.occupiedRooms,
        available: d.availableRooms,
        todayRevenue: d.todayRevenue,
        occupancyGrowth: 0,
      };
    }
  });
}

export function useHotelCharts() {
  return useQuery({
    queryKey: ['hotel-dashboard-charts'],
    queryFn: async () => {
      const res = await api.get('hotel/dashboard');
      const d = res.data;
      return {
        revenue30d: d.revenue30d,
        bookingsBySource: d.bookingSource,
        roomTypePerformance: [],
      };
    }
  });
}

export function useHotelAvailabilityHeatmap() {
  return useQuery({
    queryKey: ['hotel-dashboard-heatmap'],
    queryFn: async () => {
      const res = await api.get('hotel/dashboard');
      return res.data.heatmap;
    }
  });
}

export function useHotelBookings() {
  return useQuery({
    queryKey: ['hotel-bookings'],
    queryFn: async () => {
      const res = await api.get('hotel/bookings');
      return res.data || res.items || [];
    }
  });
}

export function useHotelRooms() {
  return useQuery({
    queryKey: ['hotel-rooms'],
    queryFn: async () => {
      const res = await api.get('hotel/rooms');
      return (res.data || res.items || []).map((r: any) => ({
        id: r.id,
        number: r.roomNumber,
        type: r.roomType?.name || 'Standard',
        floor: r.floor,
        status: r.status,
        hkStatus: 'clean', // Defaulting since it might be separate
      }));
    }
  });
}

export function useHousekeepingTasks() {
  return useQuery({
    queryKey: ['housekeeping-tasks'],
    queryFn: async () => {
      const res = await api.get('hotel/housekeeping');
      return res.data || { toClean: [], cleaning: [], inspecting: [], clean: [] };
    }
  });
}

export function useHotelGuests() {
  return useQuery({
    queryKey: ['hotel-guests'],
    queryFn: async () => {
      const res = await api.get('hotel/guests');
      return (res.data || res.items || []).map((g: any) => ({
        id: g.id,
        name: `${g.firstName} ${g.lastName}`,
        email: g.email,
        phone: g.phone,
        status: 'Active',
        totalSpend: 0,
        visits: 0,
        lastStay: '-',
      }));
    }
  });
}

export function useHotelFinance() {
  return useQuery({
    queryKey: ['hotel-finance'],
    queryFn: async () => {
      const res = await api.get('hotel/dashboard');
      const d = res.data;
      return {
        mrr: d.monthlyRevenue,
        unpaidInvoices: d.pendingInvoices,
        pendingPayouts: 0,
        transactions: d.recentPayments.map((p: any) => ({
          id: p.id,
          date: p.createdAt,
          type: 'Payment',
          amount: p.amount,
          guest: 'N/A',
          status: 'Succeeded',
        })),
      };
    }
  });
}

export function useHotelMaintenance() {
  return useQuery({
    queryKey: ['hotel-maintenance'],
    queryFn: async () => {
      const res = await api.get('hotel/maintenance');
      return (res.data || res.items || []).map((m: any) => ({
        id: m.id,
        room: m.room?.roomNumber || 'Common',
        type: m.issueType,
        description: m.description,
        priority: m.priority,
        status: m.status,
        reportedBy: m.reportedBy,
        date: m.createdAt,
      }));
    }
  });
}

export function useHotelStaff() {
  return useQuery({
    queryKey: ['hotel-staff'],
    queryFn: async () => {
      const res = await api.get('hotel/staff');
      return (res.data || res.items || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        role: s.role,
        status: s.status,
        shift: 'Morning',
        efficiency: '95%',
      }));
    }
  });
}

export function useHotelPricing() {
  return useQuery({
    queryKey: ['hotel-pricing'],
    queryFn: async () => {
      const res = await api.get('hotel/pricing');
      return {
        currentRates: (res.data || []).map((p: any) => ({
          id: p.id,
          type: p.roomType?.name || 'Standard',
          basePrice: p.basePrice,
          currentPrice: p.currentPrice,
          demand: 'Medium',
          strategy: 'Dynamic',
        })),
        competitorAvg: 0,
      };
    }
  });
}
