import { useQuery, useMutation } from "@tanstack/react-query";
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
      return {
        subdomain: hotelId.includes("0") ? "grandpeninsula" : "seaside",
        customDomain: hotelId.includes("0") ? "stay.grandpeninsula.com" : null,
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
            value: "pms-verification=abc-123",
            status: "verified",
          },
        ],
        urls: {
          dashboard: "https://grandpeninsula.pms.cloud",
          staffLogin: "https://grandpeninsula.pms.cloud/auth/login",
          guestPortal: "https://grandpeninsula.pms.cloud/guest",
          bookingEngine: "https://book.grandpeninsula.com",
        },
      };
    },
  });
}

export function useTenantInfrastructure(hotelId: string) {
  return useQuery({
    queryKey: ["tenant-infrastructure", hotelId],
    queryFn: async () => {
      return {
        healthScore: 98,
        uptime: "99.99%",
        sslExpires: new Date(Date.now() + 180 * 86400000).toISOString(),
        bandwidth: "45.2 GB",
        apiRequests: "840k",
        storageLimit: 50,
        storageUsed: 1.2,
        userLimit: 50,
        usersUsed: 14,
        roomLimit: 200,
        roomsUsed: 120,
      };
    },
  });
}

export function useTenantBranding(hotelId: string) {
  return useQuery({
    queryKey: ["tenant-branding", hotelId],
    queryFn: async () => {
      return {
        logo: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=100&h=100&fit=crop",
        favicon: "/favicon.ico",
        primaryColor: "#0F1B2D",
        accentColor: "#C9973A",
        loginMessage: "Welcome to Grand Peninsula CMS",
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
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await new Promise((r) => setTimeout(r, 1000));
      return { id, ...data };
    },
  });
}

export function useUpdatePlatformHotel() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return api.patch(`platform/hotels/${id}`, data);
    },
  });
}

export function useCreatePlatformHotel() {
  return useMutation({
    mutationFn: async (data: any) => {
      return api.post("platform/hotels", data);
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
      return Array.from({ length: 8 }).map((_, i) => ({
        id: `user-${hotelId}-${i}`,
        name: ["Alice Smith", "Bob Johnson", "Charlie Davis", "Dana White"][
          i % 4
        ],
        email: `user${i}@hotel.com`,
        role: i === 0 ? "Owner" : "Manager",
        status: i % 5 === 0 ? "suspended" : "active",
        lastLogin: new Date(Date.now() - i * 3600000 * 24).toISOString(),
      }));
    },
  });
}

export function useHotelFeatureFlags(hotelId: string) {
  return useQuery({
    queryKey: ["hotel-features", hotelId],
    queryFn: async () => {
      return [
        {
          id: "housekeeping",
          name: "Housekeeping Module",
          enabled: true,
          category: "Operations",
        },
        {
          id: "maintenance",
          name: "Maintenance Module",
          enabled: true,
          category: "Operations",
        },
        {
          id: "pos",
          name: "POS Integration",
          enabled: false,
          category: "Integrations",
        },
        {
          id: "whatsapp",
          name: "WhatsApp Notifications",
          enabled: true,
          category: "Guest Services",
        },
        {
          id: "analytics",
          name: "Advanced Analytics",
          enabled: hotelId.includes("1"),
          category: "Business",
        },
        {
          id: "guest-portal",
          name: "Guest Self-Service Portal",
          enabled: true,
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
      return {
        bookings: [120, 145, 132, 168, 154, 182],
        revenue: [12000, 14500, 15200, 16800, 15400, 19200],
        occupancy: 78,
        storage: 1.2,
        apiCalls: 4500,
        activeUsers: 14,
      };
    },
  });
}
