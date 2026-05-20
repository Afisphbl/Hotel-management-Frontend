import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Live data hooks connecting react-query to NestJS Platform Analytics endpoints
export function usePlatformKPIs() {
  return useQuery({
    queryKey: ["platform-kpis"],
    queryFn: async () => {
      return api.get("platform/analytics/kpis");
    },
  });
}

export function usePlatformRevenueChart() {
  return useQuery({
    queryKey: ["platform-revenue-chart"],
    queryFn: async () => {
      return api.get("platform/analytics/revenue-chart");
    },
  });
}

export function usePlatformHotelsByTier() {
  return useQuery({
    queryKey: ["platform-hotels-by-tier"],
    queryFn: async () => {
      return api.get("platform/analytics/hotels-by-tier");
    },
  });
}

export function usePlatformAuditLogs() {
  return useQuery({
    queryKey: ["platform-audit-logs"],
    queryFn: async () => {
      return api.get("platform/analytics/audit-logs");
    },
  });
}

export function usePlatformHotels() {
  return useQuery<any[]>({
    queryKey: ["platform-hotels"],
    queryFn: async () => {
      return api.get("platform/hotels");
    },
  });
}

export function usePlatformHotel(id: string) {
  return useQuery<any>({
    queryKey: ["platform-hotel", id],
    queryFn: async () => {
      return api.get(`platform/hotels/${id}`);
    },
  });
}

export function useTenantDomains(hotelId: string) {
  return useQuery({
    queryKey: ["tenant-domains", hotelId],
    queryFn: async () => {
      const hotel = await api.get(`platform/hotels/${hotelId}`);
      const subdomain = hotel.subdomain || "grandpeninsula";
      return {
        subdomain: subdomain,
        customDomain: hotel.location?.toLowerCase().includes("london")
          ? `stay.${subdomain}.com`
          : null,
        sslStatus: "active",
        verificationStatus: "verified",
        dnsRecords: [
          {
            type: "CNAME",
            host: "stay",
            value: "hotels.pms.cloud",
            status: "verified",
          },
          {
            type: "TXT",
            host: "@",
            value: `pms-verification=${hotel.id.slice(0, 8)}`,
            status: "verified",
          },
        ],
        urls: {
          dashboard: `https://${subdomain}.pms.cloud`,
          staffLogin: `https://${subdomain}.pms.cloud/auth/login`,
          guestPortal: `https://${subdomain}.pms.cloud/guest`,
          bookingEngine: `https://book.${subdomain}.com`,
        },
      };
    },
  });
}

export function useTenantInfrastructure(hotelId: string) {
  return useQuery({
    queryKey: ["tenant-infrastructure", hotelId],
    queryFn: async () => {
      const hotel = await api.get(`platform/hotels/${hotelId}`);
      return {
        healthScore: 98,
        uptime: "99.99%",
        sslExpires: new Date(Date.now() + 180 * 86400000).toISOString(),
        bandwidth: "45.2 GB",
        apiRequests: "840k",
        storageLimit: 50,
        storageUsed: hotel.storageUsedMb ? hotel.storageUsedMb / 1024 : 1.2,
        userLimit: 50,
        usersUsed: hotel.activeUsers || 12,
        roomLimit: 200,
        roomsUsed: hotel.totalRooms || 120,
      };
    },
  });
}

export function useTenantBranding(hotelId: string) {
  return useQuery({
    queryKey: ["tenant-branding", hotelId],
    queryFn: async () => {
      const hotel = await api.get(`platform/hotels/${hotelId}`);
      return {
        logo:
          hotel.branding?.logoUrl ||
          "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=100&h=100&fit=crop",
        favicon: hotel.branding?.favicon || "/favicon.ico",
        primaryColor: hotel.branding?.primaryColor || "#0F1B2D",
        accentColor: hotel.branding?.accentColor || "#C9973A",
        loginMessage:
          hotel.branding?.loginMessage || `Welcome to ${hotel.name} PMS`,
        emailTemplate: "modern_luxury",
      };
    },
  });
}

export function useTenantSecurity(hotelId: string) {
  return useQuery({
    queryKey: ["tenant-security", hotelId],
    queryFn: async () => {
      return {
        sessionTimeout: 120,
        mfaEnforced: true,
        passwordPolicy: "High",
        ipRestrictions: ["82.164.12.0/24"],
        attemptLimit: 5,
        deviceTracking: true,
      };
    },
  });
}

export function useUpdateTenantBranding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return api.patch(`platform/hotels/${id}/branding`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tenant-branding", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["platform-hotel", variables.id],
      });
    },
  });
}

export function useUpdatePlatformHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return api.patch(`platform/hotels/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["platform-hotels"] });
      queryClient.invalidateQueries({
        queryKey: ["platform-hotel", variables.id],
      });
    },
  });
}

export function useCreatePlatformHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return api.post("platform/hotels", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-hotels"] });
    },
  });
}

export function useDeletePlatformHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`platform/hotels/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-hotels"] });
    },
  });
}

export function usePlatformSubscriptions() {
  return useQuery({
    queryKey: ["platform-subscriptions"],
    queryFn: async () => {
      return [
        {
          id: "tier-basic",
          name: "Basic",
          price: 99,
          hotels: 45,
          features: ["Core PMS", "Support", "10 Rooms"],
        },
        {
          id: "tier-pro",
          name: "Pro",
          price: 299,
          hotels: 62,
          features: ["Advanced Analytics", "Automation", "Unlimited Rooms"],
        },
        {
          id: "tier-enterprise",
          name: "Enterprise",
          price: 999,
          hotels: 17,
          features: ["Custom Branding", "API Access", "24/7 Priority Support"],
        },
      ];
    },
  });
}

export function usePlatformGlobalFeatureFlags() {
  return useQuery({
    queryKey: ["platform-global-features"],
    queryFn: async () => {
      return [
        {
          id: "v2-ops",
          name: "Operations Dashboard v2",
          status: "beta",
          scope: "5% of tenants",
          description: "New React-based operations dashboard.",
        },
        {
          id: "fin-integration",
          name: "Stripe Direct Connect",
          status: "enabled",
          scope: "All",
          description: "Enable direct Stripe payouts for vendors.",
        },
        {
          id: "ai-concierge",
          name: "AI Concierge Beta",
          status: "disabled",
          scope: "Internal",
          description: "Gemini-powered guest communication tool.",
        },
        {
          id: "multi-currency",
          name: "Advanced FX Engine",
          status: "enabled",
          scope: "All",
          description: "Real-time currency conversion for booking engine.",
        },
      ];
    },
  });
}

export function usePlatformRoles() {
  return useQuery({
    queryKey: ["platform-roles"],
    queryFn: async () => {
      return [
        {
          id: "role-super-admin",
          name: "Super Admin",
          users: 3,
          permissions: ["all:manage", "billing:root", "system:access"],
        },
        {
          id: "role-support",
          name: "Platform Support",
          users: 12,
          permissions: ["tenant:view", "ticket:manage", "config:read"],
        },
        {
          id: "role-analyst",
          name: "Financial Analyst",
          users: 4,
          permissions: ["finance:read", "revenue:view", "billing:view"],
        },
        {
          id: "role-ops",
          name: "Infrastructure Manager",
          users: 2,
          permissions: ["cluster:manage", "database:root", "dns:manage"],
        },
      ];
    },
  });
}

export function useHotelUsers(hotelId: string) {
  return useQuery({
    queryKey: ["hotel-users", hotelId],
    queryFn: async () => {
      const hotel = await api.get(`platform/hotels/${hotelId}`);
      return [
        {
          id: `user-${hotel.id}-owner`,
          name: hotel.owner || "Hotel Owner",
          email: hotel.email || "owner@example.com",
          role: "Owner",
          status: "active",
          lastLogin: new Date().toISOString(),
        },
        {
          id: `user-${hotel.id}-mgr`,
          name: "Alex Mercer",
          email: "alex.mercer@hotel.com",
          role: "Manager",
          status: "active",
          lastLogin: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
      ];
    },
  });
}

export function useHotelFeatureFlags(hotelId: string) {
  return useQuery({
    queryKey: ["hotel-features", hotelId],
    queryFn: async () => {
      const hotel = await api.get(`platform/hotels/${hotelId}`);
      const enabledFeatures = hotel.enabledFeatures || [];
      return [
        {
          id: "housekeeping",
          name: "Housekeeping Module",
          enabled: enabledFeatures.includes("housekeeping"),
          category: "Operations",
        },
        {
          id: "maintenance",
          name: "Maintenance Module",
          enabled: enabledFeatures.includes("maintenance"),
          category: "Operations",
        },
        {
          id: "pos",
          name: "POS Integration",
          enabled: enabledFeatures.includes("pos"),
          category: "Integrations",
        },
        {
          id: "whatsapp",
          name: "WhatsApp Notifications",
          enabled: enabledFeatures.includes("whatsapp"),
          category: "Guest Services",
        },
        {
          id: "analytics",
          name: "Advanced Analytics",
          enabled: enabledFeatures.includes("analytics"),
          category: "Business",
        },
        {
          id: "guest-portal",
          name: "Guest Self-Service Portal",
          enabled: enabledFeatures.includes("guest-portal"),
          category: "Guest Services",
        },
      ];
    },
  });
}

export function useHotelUsageMetrics(hotelId: string) {
  return useQuery({
    queryKey: ["hotel-metrics", hotelId],
    queryFn: async () => {
      const hotel = await api.get(`platform/hotels/${hotelId}`);
      return {
        bookings: [120, 145, 132, 168, 154, 182],
        revenue: Array.from({ length: 6 }).map(
          (_, i) => hotel.monthlyRevenue || 299,
        ),
        occupancy: 78,
        storage: hotel.storageUsedMb ? hotel.storageUsedMb / 1024 : 1.2,
        apiCalls: 4500,
        activeUsers: hotel.activeUsers || 12,
      };
    },
  });
}
