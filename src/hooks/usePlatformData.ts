import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ──────────────────────────────────────────────
// Analytics & KPIs
// ──────────────────────────────────────────────

export function usePlatformKPIs() {
  return useQuery({
    queryKey: ["platform-kpis"],
    queryFn: async () => {
      return api.get("platform/analytics/kpis");
    },
  });
}

export function usePlatformRevenueData() {
  return useQuery({
    queryKey: ["platform-revenue"],
    queryFn: async () => {
      return api.get("platform/analytics/revenue");
    },
  });
}

export function usePlatformOccupancyData() {
  return useQuery({
    queryKey: ["platform-occupancy"],
    queryFn: async () => {
      return api.get("platform/analytics/occupancy");
    },
  });
}

// ──────────────────────────────────────────────
// Hotels & Tenants
// ──────────────────────────────────────────────

export function usePlatformHotels(params: {
  page: number;
  limit: number;
  search?: string;
  plan?: string;
  sortBy?: string;
}) {
  return useQuery({
    queryKey: ["platform-hotels", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("page", params.page.toString());
      searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.plan) searchParams.append("plan", params.plan);
      if (params.sortBy) searchParams.append("sortBy", params.sortBy);

      return api.get(`platform/hotels?${searchParams.toString()}`);
    },
  });
}

export function usePlatformHotel(id: string) {
  return useQuery({
    queryKey: ["platform-hotel", id],
    queryFn: async () => {
      return api.get(`platform/hotels/${id}`);
    },
    enabled: !!id,
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

export function useUpdatePlatformHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return api.patch(`platform/hotels/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["platform-hotel", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["platform-hotels"] });
    },
  });
}

// ──────────────────────────────────────────────
// Users & Access
// ──────────────────────────────────────────────

export function usePlatformUsers(params: {
  page: number;
  limit: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ["platform-users", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("page", params.page.toString());
      searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);

      return api.get(`platform/users?${searchParams.toString()}`);
    },
  });
}

export function useUpdatePlatformUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return api.patch(`platform/users/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["platform-users"] });
      queryClient.invalidateQueries({ queryKey: ["hotel-users"] });
    },
  });
}

export function useSuspendPlatformUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      return api.post(`platform/users/${id}/suspend`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-users"] });
      queryClient.invalidateQueries({ queryKey: ["hotel-users"] });
    },
  });
}

export function useActivatePlatformUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return api.post(`platform/users/${id}/activate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-users"] });
      queryClient.invalidateQueries({ queryKey: ["hotel-users"] });
    },
  });
}

export function useSendPasswordResetLink() {
  return useMutation({
    mutationFn: async (id: string) => {
      return api.post(`platform/users/${id}/send-reset-link`);
    },
  });
}

export function useTransferOwnership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      hotelId,
      newOwnerId,
    }: {
      hotelId: string;
      newOwnerId: string;
    }) => {
      return api.post(`platform/hotels/${hotelId}/transfer-ownership`, {
        newOwnerId,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["platform-hotel", variables.hotelId],
      });
      queryClient.invalidateQueries({
        queryKey: ["hotel-users", variables.hotelId],
      });
    },
  });
}

export function useCreateTenantUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hotelId, data }: { hotelId: string; data: any }) => {
      return api.post(`platform/hotels/${hotelId}/users`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["hotel-users", variables.hotelId],
      });
    },
  });
}

export function useRemoveTenantUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      hotelId,
      userId,
    }: {
      hotelId: string;
      userId: string;
    }) => {
      return api.delete(`platform/hotels/${hotelId}/users/${userId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["hotel-users", variables.hotelId],
      });
    },
  });
}

// ──────────────────────────────────────────────
// Audit Logs
// ──────────────────────────────────────────────

export function usePlatformAuditLogs(params?: {
  page?: number;
  limit?: number;
  search?: string;
  hotelId?: string;
}) {
  return useQuery({
    queryKey: ["platform-audit-logs", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.limit) searchParams.append("limit", params.limit.toString());
      if (params?.search) searchParams.append("search", params.search);
      if (params?.hotelId) searchParams.append("hotelId", params.hotelId);

      return api.get(`platform/audit-logs?${searchParams.toString()}`);
    },
  });
}

// ──────────────────────────────────────────────
// Tenant Specific Management
// ──────────────────────────────────────────────

export function useTenantDomains(hotelId: string) {
  return useQuery({
    queryKey: ["tenant-domains", hotelId],
    queryFn: async () => {
      const hotel = await api.get(`platform/hotels/${hotelId}`);
      return {
        subdomain: hotel.subdomain,
        customDomain: hotel.customDomain || null,
        status: hotel.domainStatus || "active",
        sslStatus: hotel.sslStatus || "valid",
        sslExpires: hotel.sslExpires || null,
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
        logo: hotel.branding?.logoUrl || null,
        favicon: hotel.branding?.favicon || null,
        primaryColor: hotel.branding?.primaryColor || "#0F1B2D",
        accentColor: hotel.branding?.accentColor || "#C9973A",
        loginMessage:
          hotel.branding?.loginMessage || `Welcome to ${hotel.name} PMS`,
        emailTemplate: hotel.branding?.emailTemplate || "modern_luxury",
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

export function useTenantSecurity(hotelId: string) {
  return useQuery({
    queryKey: ["tenant-security", hotelId],
    queryFn: async () => {
      const policy = await api
        .get("platform/compliance/password-policy")
        .catch(() => ({}));
      return {
        sessionTimeout: policy.sessionTimeoutMinutes ?? 120,
        mfaEnforced: policy.mfaRequired ?? true,
        passwordPolicy: policy.strength ?? "High",
        ipRestrictions: policy.allowedIpRanges ?? [],
        attemptLimit: policy.maxLoginAttempts ?? 5,
        deviceTracking: policy.deviceTracking ?? true,
      };
    },
  });
}

export function useTenantInfrastructure(hotelId: string) {
  return useQuery({
    queryKey: ["tenant-infrastructure", hotelId],
    queryFn: async () => {
      const [hotel, health] = await Promise.all([
        api.get(`platform/hotels/${hotelId}`),
        api.get("platform/monitoring/health/detailed").catch(() => null),
      ]);
      return {
        healthScore: health?.overallScore ?? hotel.healthScore ?? null,
        uptime: health?.uptime ?? hotel.uptime ?? null,
        sslExpires:
          hotel.sslExpires ||
          new Date(Date.now() + 180 * 86400000).toISOString(),
        bandwidth: hotel.bandwidth || null,
        apiRequests: hotel.apiRequests || null,
        storageLimit: 50,
        storageUsed: hotel.storageUsedMb ? hotel.storageUsedMb / 1024 : null,
        userLimit: 50,
        usersUsed: hotel.activeUsers ?? null,
        roomLimit: 200,
        roomsUsed: hotel.totalRooms ?? null,
      };
    },
  });
}

export function useHotelUsers(hotelId: string) {
  return useQuery({
    queryKey: ["hotel-users", hotelId],
    queryFn: async () => {
      const users = await api
        .get(`platform/users?search=${hotelId}`)
        .catch(() => null);
      if (users && Array.isArray(users) && users.length > 0) {
        return users;
      }
      const hotel = await api.get(`platform/hotels/${hotelId}`);
      const result = [];
      if (hotel.owner) {
        result.push({
          id: `owner-${hotel.id}`,
          name: hotel.owner,
          email: hotel.email || null,
          role: "Owner",
          status: "active",
          lastLogin: hotel.lastLoginAt || new Date().toISOString(),
        });
      }
      return result;
    },
  });
}

export function useToggleHotelFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      hotelId,
      featureId,
      enabled,
    }: {
      hotelId: string;
      featureId: string;
      enabled: boolean;
    }) => {
      return api.post(`platform/hotels/${hotelId}/features/${featureId}/toggle`, {
        enabled,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["hotel-features", variables.hotelId],
      });
      queryClient.invalidateQueries({
        queryKey: ["platform-hotel", variables.hotelId],
      });
    },
  });
}

export function useHotelFeatureFlags(hotelId: string) {
  return useQuery({
    queryKey: ["hotel-features", hotelId],
    queryFn: async () => {
      const [hotel, globalFlags] = await Promise.all([
        api.get(`platform/hotels/${hotelId}`),
        api.get("platform/feature-flags").catch(() => []),
      ]);
      const enabledFeatures = hotel.enabledFeatures || [];
      const predefined = [
        {
          id: "housekeeping",
          name: "Housekeeping Module",
          category: "Operations",
        },
        {
          id: "maintenance",
          name: "Maintenance Module",
          category: "Operations",
        },
        { id: "pos", name: "POS Integration", category: "Integrations" },
        {
          id: "whatsapp",
          name: "WhatsApp Notifications",
          category: "Guest Services",
        },
        { id: "analytics", name: "Advanced Analytics", category: "Business" },
        {
          id: "guest-portal",
          name: "Guest Self-Service Portal",
          category: "Guest Services",
        },
      ];
      const items = predefined.map((f) => ({
        ...f,
        enabled: enabledFeatures.includes(f.id),
      }));
      const extras = (Array.isArray(globalFlags) ? globalFlags : []).map(
        (gf: any) => ({
          id: gf.id || gf.key,
          name: gf.name || gf.key,
          enabled: gf.status === "enabled" || enabledFeatures.includes(gf.id),
          category: gf.category || "Global",
        }),
      );
      return [...items, ...extras];
    },
  });
}

export function useHotelUsageMetrics(hotelId: string) {
  return useQuery({
    queryKey: ["hotel-metrics", hotelId],
    queryFn: async () => {
      const [hotel, quota] = await Promise.all([
        api.get(`platform/hotels/${hotelId}`),
        api.get(`platform/quota/snapshot/${hotelId}`).catch(() => null),
      ]);
      return {
        bookings: quota?.bookings || hotel.bookings || null,
        revenue: quota?.revenue || hotel.revenue || null,
        occupancy: quota?.occupancy ?? hotel.currentOccupancy ?? null,
        storage: quota?.storageUsedMb
          ? quota.storageUsedMb / 1024
          : hotel.storageUsedMb || null,
      };
    },
  });
}

export function useHotelUsageMetricsExtended(hotelId: string) {
  return useQuery({
    queryKey: ["hotel-metrics-extended", hotelId],
    queryFn: async () => {
      const [hotel, quota] = await Promise.all([
        api.get(`platform/hotels/${hotelId}`),
        api.get(`platform/quota/snapshot/${hotelId}`).catch(() => null),
      ]);
      return {
        storageUsed: quota?.storageUsedMb
          ? quota.storageUsedMb / 1024
          : hotel.storageUsedMb
            ? hotel.storageUsedMb / 1024
            : null,
        apiCalls: quota?.apiCalls || hotel.apiCalls || null,
        activeUsers: quota?.activeUsers ?? hotel.activeUsers ?? null,
      };
    },
  });
}

export function useTenantQuotaAlerts(hotelId?: string) {
  return useQuery({
    queryKey: ["tenant-quota-alerts", hotelId],
    queryFn: async () => {
      const qs = hotelId ? `?hotelId=${hotelId}` : "";
      return api.get(`platform/quota/alerts${qs}`);
    },
  });
}
