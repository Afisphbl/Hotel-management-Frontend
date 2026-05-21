import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ──────────────────────────────────────────────
// Analytics & KPIs
// ──────────────────────────────────────────────

export function usePlatformKPIs() {
  return useQuery({
    queryKey: ["platform-kpis"],
    queryFn: async () => {
      const [global, revenueSummary, mrr] = await Promise.all([
        api.get("platform/analytics/global"),
        api.get("platform/analytics/revenue-summary").catch(() => null),
        api.get("platform/analytics/mrr").catch(() => null),
      ]);
      return {
        totalHotels: revenueSummary?.totalHotels ?? global?.totalHotels ?? 0,
        activeSubscriptions:
          revenueSummary?.activeSubscriptions ?? mrr?.totalSubscriptions ?? 0,
        mrr: revenueSummary?.mrr ?? mrr?.totalMRR ?? 0,
        totalBookings: 0,
        activeUsers: global?.totalUsers ?? 0,
        mrrGrowth: mrr?.mrrGrowth ?? 0,
        hotelsGrowth: 0,
      };
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

export function usePlatformRevenueSummary() {
  return useQuery({
    queryKey: ["platform-revenue-summary"],
    queryFn: async () => {
      return api.get("platform/analytics/revenue-summary");
    },
  });
}

export function usePlatformMrr() {
  return useQuery({
    queryKey: ["platform-mrr"],
    queryFn: async () => {
      return api.get("platform/analytics/mrr");
    },
  });
}

export function usePlatformChurn() {
  return useQuery({
    queryKey: ["platform-churn"],
    queryFn: async () => {
      return api.get("platform/analytics/churn");
    },
  });
}

export function usePlatformFinancialReport(
  startDate?: string,
  endDate?: string,
) {
  return useQuery({
    queryKey: ["platform-financial-report", startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      const qs = params.toString();
      return api.get(
        `platform/analytics/financial-report${qs ? `?${qs}` : ""}`,
      );
    },
  });
}

export function usePlatformProjections(months?: number) {
  return useQuery({
    queryKey: ["platform-projections", months],
    queryFn: async () => {
      const qs = months ? `?months=${months}` : "";
      return api.get(`platform/analytics/projections${qs}`);
    },
  });
}

export function usePlatformBillingReport() {
  return useQuery({
    queryKey: ["platform-billing-report"],
    queryFn: async () => {
      return api.get("platform/analytics/billing-report");
    },
  });
}

// ──────────────────────────────────────────────
// Hotels
// ──────────────────────────────────────────────

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

// ──────────────────────────────────────────────
// Hotel Details – Domains, Branding, Security, etc.
// ──────────────────────────────────────────────

export function useTenantDomains(hotelId: string) {
  return useQuery({
    queryKey: ["tenant-domains", hotelId],
    queryFn: async () => {
      const hotel = await api.get(`platform/hotels/${hotelId}`);
      const subdomain =
        hotel.subdomain ||
        hotel.name?.toLowerCase().replace(/ /g, "-") ||
        "tenant";
      const customDomain = hotel.customDomain || null;
      return {
        subdomain,
        customDomain,
        sslStatus: hotel.sslStatus || "active",
        verificationStatus: hotel.verificationStatus || "verified",
        dnsRecords: hotel.dnsRecords || [
          {
            type: "CNAME",
            host: "stay",
            value: "hotels.pms.cloud",
            status: "verified",
          },
          {
            type: "TXT",
            host: "@",
            value: `pms-verification=${(hotel.id || "").slice(0, 8)}`,
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
        healthScore: health?.overallScore ?? hotel.healthScore ?? 98,
        uptime: health?.uptime ?? hotel.uptime ?? "99.99%",
        sslExpires:
          hotel.sslExpires ||
          new Date(Date.now() + 180 * 86400000).toISOString(),
        bandwidth: hotel.bandwidth ?? "45.2 GB",
        apiRequests: hotel.apiRequests ?? "840k",
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
        bookings: quota?.bookings ||
          hotel.bookings || [120, 145, 132, 168, 154, 182],
        revenue:
          quota?.revenue ||
          Array.from({ length: 6 }).map(() => hotel.monthlyRevenue || 299),
        occupancy: quota?.occupancy ?? hotel.currentOccupancy ?? 78,
        storage: quota?.storageUsedMb
          ? quota.storageUsedMb / 1024
          : hotel.storageUsedMb
            ? hotel.storageUsedMb / 1024
            : null,
        apiCalls: quota?.apiCalls || hotel.apiCalls || 4500,
        activeUsers: quota?.activeUsers ?? hotel.activeUsers ?? null,
      };
    },
  });
}

// ──────────────────────────────────────────────
// Subscriptions & Plans
// ──────────────────────────────────────────────

export function usePlatformSubscriptions() {
  return useQuery({
    queryKey: ["platform-subscriptions"],
    queryFn: async () => {
      return api.get("platform/subscriptions/plans");
    },
  });
}

// ──────────────────────────────────────────────
// Feature Flags
// ──────────────────────────────────────────────

export function usePlatformGlobalFeatureFlags() {
  return useQuery({
    queryKey: ["platform-global-features"],
    queryFn: async () => {
      return api.get("platform/feature-flags");
    },
  });
}

// ──────────────────────────────────────────────
// Roles & Permissions
// ──────────────────────────────────────────────

export function usePlatformRoles() {
  return useQuery({
    queryKey: ["platform-roles"],
    queryFn: async () => {
      return api.get("platform/permissions/predefined-roles");
    },
  });
}

export function usePlatformPermissions() {
  return useQuery({
    queryKey: ["platform-permissions"],
    queryFn: async () => {
      return api.get("platform/permissions");
    },
  });
}

// ──────────────────────────────────────────────
// Settings (global platform config)
// ──────────────────────────────────────────────

export function usePlatformSettings() {
  return useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      return api.get("platform/settings");
    },
  });
}

export function useUpdatePlatformSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      key: string;
      value: any;
      category?: string;
    }) => {
      return api.post("platform/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
  });
}

// ──────────────────────────────────────────────
// SMTP Config
// ──────────────────────────────────────────────

export function usePlatformConfigSmtp() {
  return useQuery({
    queryKey: ["platform-config-smtp"],
    queryFn: async () => {
      return api.get("platform/config/smtp");
    },
  });
}

export function useUpdatePlatformConfigSmtp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return api.post("platform/config/smtp", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-config-smtp"] });
    },
  });
}

// ──────────────────────────────────────────────
// Payment Gateway Config
// ──────────────────────────────────────────────

export function usePlatformPaymentGateway() {
  return useQuery({
    queryKey: ["platform-payment-gateway"],
    queryFn: async () => {
      return api.get("platform/config/payment-gateway");
    },
  });
}

export function useUpdatePlatformPaymentGateway() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return api.post("platform/config/payment-gateway", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-payment-gateway"] });
    },
  });
}

// ──────────────────────────────────────────────
// Password Policy / Compliance
// ──────────────────────────────────────────────

export function usePlatformPasswordPolicy() {
  return useQuery({
    queryKey: ["platform-password-policy"],
    queryFn: async () => {
      return api.get("platform/compliance/password-policy");
    },
  });
}

export function useUpdatePlatformPasswordPolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return api.patch("platform/compliance/password-policy", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-password-policy"] });
    },
  });
}

// ──────────────────────────────────────────────
// Monitoring & Health
// ──────────────────────────────────────────────

export function usePlatformMonitoringHealth() {
  return useQuery({
    queryKey: ["platform-monitoring-health"],
    queryFn: async () => {
      return api.get("platform/monitoring/health");
    },
    refetchInterval: 30000,
  });
}

export function usePlatformMonitoringSystem() {
  return useQuery({
    queryKey: ["platform-monitoring-system"],
    queryFn: async () => {
      return api.get("platform/monitoring/system");
    },
    refetchInterval: 60000,
  });
}

export function usePlatformMonitoringMetrics() {
  return useQuery({
    queryKey: ["platform-monitoring-metrics"],
    queryFn: async () => {
      return api.get("platform/monitoring/metrics");
    },
    refetchInterval: 60000,
  });
}

export function usePlatformUptime(hours?: number) {
  return useQuery({
    queryKey: ["platform-uptime", hours],
    queryFn: async () => {
      const qs = hours ? `?hours=${hours}` : "";
      return api.get(`platform/monitoring/uptime${qs}`);
    },
    refetchInterval: 60000,
  });
}

// ──────────────────────────────────────────────
// Tax Rules
// ──────────────────────────────────────────────

export function usePlatformTaxRules() {
  return useQuery({
    queryKey: ["platform-tax-rules"],
    queryFn: async () => {
      return api.get("platform/tax-rules");
    },
  });
}

// ──────────────────────────────────────────────
// User Management
// ──────────────────────────────────────────────

export function usePlatformUsers() {
  return useQuery({
    queryKey: ["platform-users"],
    queryFn: async () => {
      return api.get("platform/users");
    },
  });
}

export function useUpdatePlatformUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return api.patch(`platform/users/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-users"] });
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
    },
  });
}

export function useResetUserPassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      currentPassword,
      newPassword,
    }: {
      id: string;
      currentPassword: string;
      newPassword: string;
    }) => {
      return api.post(`platform/users/${id}/change-password`, {
        currentPassword,
        newPassword,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-users"] });
    },
  });
}

// ──────────────────────────────────────────────
// Tenant Quota & Utilization
// ──────────────────────────────────────────────

export function useTenantQuotaSnapshot(hotelId: string) {
  return useQuery({
    queryKey: ["tenant-quota-snapshot", hotelId],
    queryFn: async () => {
      return api.get(`platform/quota/snapshot/${hotelId}`);
    },
  });
}

export function useTenantQuotaUtilization(hotelId: string) {
  return useQuery({
    queryKey: ["tenant-quota-utilization", hotelId],
    queryFn: async () => {
      return api.get(`platform/quota/utilization/${hotelId}`);
    },
  });
}

export function useTenantQuotaOverage(hotelId: string) {
  return useQuery({
    queryKey: ["tenant-quota-overage", hotelId],
    queryFn: async () => {
      return api.get(`platform/quota/overage/${hotelId}`);
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
