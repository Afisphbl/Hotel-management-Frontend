
import { useQuery, useMutation } from '@tanstack/react-query';

// Mock data generator for Platform Dashboard
export function usePlatformKPIs() {
  return useQuery({
    queryKey: ['platform-kpis'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 800)); // simulate network
      return {
        totalHotels: 124,
        activeSubscriptions: 118,
        mrr: 45200,
        totalBookings: 8420,
        activeUsers: 842,
        mrrGrowth: 12.5,
        hotelsGrowth: 4,
      };
    }
  });
}

export function usePlatformRevenueChart() {
  return useQuery({
    queryKey: ['platform-revenue-chart'],
    queryFn: async () => {
      return [
        { month: 'Jan', revenue: 32000, bookings: 600 },
        { month: 'Feb', revenue: 35000, bookings: 650 },
        { month: 'Mar', revenue: 33500, bookings: 620 },
        { month: 'Apr', revenue: 38000, bookings: 710 },
        { month: 'May', revenue: 42000, bookings: 780 },
        { month: 'Jun', revenue: 45200, bookings: 840 },
      ];
    }
  });
}

export function usePlatformHotelsByTier() {
  return useQuery({
    queryKey: ['platform-hotels-by-tier'],
    queryFn: async () => {
      return [
        { name: 'Basic', value: 45, color: '#94a3b8' },
        { name: 'Pro', value: 62, color: '#C9973A' },
        { name: 'Enterprise', value: 17, color: '#0F1B2D' },
      ];
    }
  });
}

export function usePlatformAuditLogs() {
  return useQuery({
    queryKey: ['platform-audit-logs'],
    queryFn: async () => {
      return Array.from({ length: 20 }).map((_, i) => ({
        id: `log-${i}`,
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        actor: ['System', 'Alice Smith', 'Bob Jones', 'Charlie Brown'][Math.floor(Math.random() * 4)],
        hotel: i % 3 === 0 ? '-' : 'Grand Peninsula',
        action: ['Hotel Created', 'Subscription Updated', 'User Deleted', 'Config Changed'][Math.floor(Math.random() * 4)],
        resource: ['Hotel', 'Subscription', 'User', 'Settings'][Math.floor(Math.random() * 4)],
        ip: '192.168.1.' + Math.floor(Math.random() * 255),
      }));
    }
  });
}

export function usePlatformHotels() {
  return useQuery({
    queryKey: ['platform-hotels'],
    queryFn: async () => {
      return Array.from({ length: 24 }).map((_, i) => ({
        id: `hotel-${i}`,
        name: ['Grand Peninsula', 'Seaside Resort', 'Metro Inn', 'Urban Boutique', 'Mountain Lodge'][i % 5],
        owner: 'John Doe',
        plan: ['Basic', 'Pro', 'Enterprise'][i % 3],
        status: ['active', 'suspended', 'active', 'active'][i % 4],
        created: new Date(Date.now() - i * 8640000*10).toISOString(),
      }));
    }
  });
}

export function usePlatformHotel(id: string) {
  return useQuery({
    queryKey: ['platform-hotel', id],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 400));
      return {
        id,
        name: ['Grand Peninsula', 'Seaside Resort', 'Metro Inn', 'Urban Boutique', 'Mountain Lodge'][Math.floor(Math.random() * 5)],
        owner: 'John Doe',
        email: 'owner@example.com',
        phone: '+1 234 567 890',
        plan: ['Basic', 'Pro', 'Enterprise'][Math.floor(Math.random() * 3)],
        status: 'active',
        created: new Date(Date.now() - 30 * 86400000).toISOString(),
        location: 'London, UK',
        totalRooms: 120,
        currentOccupancy: '78%',
        monthlyRevenue: 15400,
        activeUsers: 12,
        storageUsed: '1.2 GB',
        lastBackup: new Date().toISOString(),
        region: 'europe-west',
        environment: 'production',
        timezone: 'UTC',
        currency: 'GBP',
      };
    }
  });
}

export function useTenantDomains(hotelId: string) {
  return useQuery({
    queryKey: ['tenant-domains', hotelId],
    queryFn: async () => {
      return {
        subdomain: hotelId.includes('0') ? 'grandpeninsula' : 'seaside',
        customDomain: hotelId.includes('0') ? 'stay.grandpeninsula.com' : null,
        sslStatus: 'active',
        verificationStatus: 'verified',
        dnsRecords: [
          { type: 'CNAME', host: 'stay', value: 'hotels.pms.cloud', status: 'verified' },
          { type: 'TXT', host: '@', value: 'pms-verification=abc-123', status: 'verified' }
        ],
        urls: {
          dashboard: 'https://grandpeninsula.pms.cloud',
          staffLogin: 'https://grandpeninsula.pms.cloud/auth/login',
          guestPortal: 'https://grandpeninsula.pms.cloud/guest',
          bookingEngine: 'https://book.grandpeninsula.com',
        }
      };
    }
  });
}

export function useTenantInfrastructure(hotelId: string) {
  return useQuery({
    queryKey: ['tenant-infrastructure', hotelId],
    queryFn: async () => {
      return {
        healthScore: 98,
        uptime: '99.99%',
        sslExpires: new Date(Date.now() + 180 * 86400000).toISOString(),
        bandwidth: '45.2 GB',
        apiRequests: '840k',
        storageLimit: 50,
        storageUsed: 1.2,
        userLimit: 50,
        usersUsed: 14,
        roomLimit: 200,
        roomsUsed: 120,
      };
    }
  });
}

export function useTenantBranding(hotelId: string) {
  return useQuery({
    queryKey: ['tenant-branding', hotelId],
    queryFn: async () => {
      return {
        logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=100&h=100&fit=crop',
        favicon: '/favicon.ico',
        primaryColor: '#0F1B2D',
        accentColor: '#C9973A',
        loginMessage: 'Welcome to Grand Peninsula CMS',
        emailTemplate: 'modern_luxury',
      };
    }
  });
}

export function useTenantSecurity(hotelId: string) {
  return useQuery({
    queryKey: ['tenant-security', hotelId],
    queryFn: async () => {
      return {
        sessionTimeout: 120,
        mfaEnforced: true,
        passwordPolicy: 'High',
        ipRestrictions: ['82.164.12.0/24'],
        attemptLimit: 5,
        deviceTracking: true,
      };
    }
  });
}

export function useUpdateTenantBranding() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      await new Promise(r => setTimeout(r, 1000));
      return { id, ...data };
    }
  });
}

export function useUpdatePlatformHotel() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      await new Promise(r => setTimeout(r, 800));
      return { id, ...data };
    }
  });
}

export function useCreatePlatformHotel() {
  return useMutation({
    mutationFn: async (data: any) => {
      await new Promise(r => setTimeout(r, 1500));
      return { id: `hotel-${Math.random().toString(36).substr(2, 9)}`, ...data };
    }
  });
}

export function usePlatformSubscriptions() {
  return useQuery({
    queryKey: ['platform-subscriptions'],
    queryFn: async () => {
      return [
        { id: 'tier-basic', name: 'Basic', price: 99, hotels: 45, features: ['Core PMS', 'Support', '10 Rooms'] },
        { id: 'tier-pro', name: 'Pro', price: 299, hotels: 62, features: ['Advanced Analytics', 'Automation', 'Unlimited Rooms'] },
        { id: 'tier-enterprise', name: 'Enterprise', price: 999, hotels: 17, features: ['Custom Branding', 'API Access', '24/7 Priority Support'] },
      ];
    }
  });
}

export function usePlatformGlobalFeatureFlags() {
  return useQuery({
    queryKey: ['platform-global-features'],
    queryFn: async () => {
      return [
        { id: 'v2-ops', name: 'Operations Dashboard v2', status: 'beta', scope: '5% of tenants', description: 'New React-based operations dashboard.' },
        { id: 'fin-integration', name: 'Stripe Direct Connect', status: 'enabled', scope: 'All', description: 'Enable direct Stripe payouts for vendors.' },
        { id: 'ai-concierge', name: 'AI Concierge Beta', status: 'disabled', scope: 'Internal', description: 'Gemini-powered guest communication tool.' },
        { id: 'multi-currency', name: 'Advanced FX Engine', status: 'enabled', scope: 'All', description: 'Real-time currency conversion for booking engine.' },
      ];
    }
  });
}

export function usePlatformRoles() {
  return useQuery({
    queryKey: ['platform-roles'],
    queryFn: async () => {
      return [
        { id: 'role-super-admin', name: 'Super Admin', users: 3, permissions: ['all:manage', 'billing:root', 'system:access'] },
        { id: 'role-support', name: 'Platform Support', users: 12, permissions: ['tenant:view', 'ticket:manage', 'config:read'] },
        { id: 'role-analyst', name: 'Financial Analyst', users: 4, permissions: ['finance:read', 'revenue:view', 'billing:view'] },
        { id: 'role-ops', name: 'Infrastructure Manager', users: 2, permissions: ['cluster:manage', 'database:root', 'dns:manage'] },
      ];
    }
  });
}

export function useHotelUsers(hotelId: string) {
  return useQuery({
    queryKey: ['hotel-users', hotelId],
    queryFn: async () => {
      return Array.from({ length: 8 }).map((_, i) => ({
        id: `user-${hotelId}-${i}`,
        name: ['Alice Smith', 'Bob Johnson', 'Charlie Davis', 'Dana White'][i % 4],
        email: `user${i}@hotel.com`,
        role: i === 0 ? 'Owner' : 'Manager',
        status: i % 5 === 0 ? 'suspended' : 'active',
        lastLogin: new Date(Date.now() - i * 3600000 * 24).toISOString(),
      }));
    }
  });
}

export function useHotelFeatureFlags(hotelId: string) {
  return useQuery({
    queryKey: ['hotel-features', hotelId],
    queryFn: async () => {
      return [
        { id: 'housekeeping', name: 'Housekeeping Module', enabled: true, category: 'Operations' },
        { id: 'maintenance', name: 'Maintenance Module', enabled: true, category: 'Operations' },
        { id: 'pos', name: 'POS Integration', enabled: false, category: 'Integrations' },
        { id: 'whatsapp', name: 'WhatsApp Notifications', enabled: true, category: 'Guest Services' },
        { id: 'analytics', name: 'Advanced Analytics', enabled: hotelId.includes('1'), category: 'Business' },
        { id: 'guest-portal', name: 'Guest Self-Service Portal', enabled: true, category: 'Guest Services' },
      ];
    }
  });
}

export function useHotelUsageMetrics(hotelId: string) {
  return useQuery({
    queryKey: ['hotel-metrics', hotelId],
    queryFn: async () => {
      return {
        bookings: [120, 145, 132, 168, 154, 182],
        revenue: [12000, 14500, 15200, 16800, 15400, 19200],
        occupancy: 78,
        storage: 1.2,
        apiCalls: 4500,
        activeUsers: 14,
      };
    }
  });
}
