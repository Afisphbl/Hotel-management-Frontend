import { createRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/authStore";
import { authLayoutRoute } from "./root.routes";
import { PlatformDashboard } from "@/pages/platform/Dashboard";
import { PlatformHotels } from "@/pages/platform/Hotels";
import { HotelCreate } from "@/pages/platform/HotelCreate";
import { HotelDetailsLayout } from "@/pages/platform/HotelDetailsLayout";
import { HotelOverview } from "@/pages/platform/hotel-detail/Overview";
import { HotelDomains } from "@/pages/platform/hotel-detail/Domains";
import { HotelBranding } from "@/pages/platform/hotel-detail/Branding";
import { HotelUsers } from "@/pages/platform/hotel-detail/Users";
import { HotelFeatureFlags } from "@/pages/platform/hotel-detail/FeatureFlags";
import { HotelAuditLogs } from "@/pages/platform/hotel-detail/AuditLogs";
import { HotelUsageMetrics } from "@/pages/platform/hotel-detail/UsageMetrics";
import { HotelSubscription } from "@/pages/platform/hotel-detail/Subscription";
import { HotelBilling } from "@/pages/platform/hotel-detail/Billing";
import { HotelSecurity } from "@/pages/platform/hotel-detail/Security";
import { HotelSettings } from "@/pages/platform/hotel-detail/Settings";
import { PlatformSubscriptions } from "@/pages/platform/Subscriptions";
import { PlatformFeatureFlags } from "@/pages/platform/FeatureFlags";
import { PlatformRoles } from "@/pages/platform/Roles";
import { PlatformAuditLogs } from "@/pages/platform/AuditLogs";
import { PlatformSettings } from "@/pages/platform/Settings";

export const platformLayoutRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "platform",
  loader: () => {
    const { user } = useAuthStore.getState();
    if (user?.scope !== "platform") throw redirect({ to: "/unauthorized" });
  },
});

const platformDashboardRoute = createRoute({
  getParentRoute: () => platformLayoutRoute,
  path: "dashboard",
  component: PlatformDashboard,
});

const platformHotelsRoute = createRoute({
  getParentRoute: () => platformLayoutRoute,
  path: "hotels",
  component: PlatformHotels,
});

const platformHotelCreateRoute = createRoute({
  getParentRoute: () => platformLayoutRoute,
  path: "hotels/create",
  component: HotelCreate,
});

const platformHotelDetailsRoute = createRoute({
  getParentRoute: () => platformLayoutRoute,
  path: "hotels/$id",
  component: HotelDetailsLayout,
});

const platformHotelOverviewRoute = createRoute({
  getParentRoute: () => platformHotelDetailsRoute,
  path: "/",
  component: HotelOverview,
});

const platformHotelDomainsRoute = createRoute({
  getParentRoute: () => platformHotelDetailsRoute,
  path: "domains",
  component: HotelDomains,
});

const platformHotelBrandingRoute = createRoute({
  getParentRoute: () => platformHotelDetailsRoute,
  path: "branding",
  component: HotelBranding,
});

const platformHotelUsersRoute = createRoute({
  getParentRoute: () => platformHotelDetailsRoute,
  path: "users",
  component: HotelUsers,
});

const platformHotelFeaturesRoute = createRoute({
  getParentRoute: () => platformHotelDetailsRoute,
  path: "features",
  component: HotelFeatureFlags,
});

const platformHotelAuditLogsRoute = createRoute({
  getParentRoute: () => platformHotelDetailsRoute,
  path: "audit-logs",
  component: HotelAuditLogs,
});

const platformHotelMetricsRoute = createRoute({
  getParentRoute: () => platformHotelDetailsRoute,
  path: "metrics",
  component: HotelUsageMetrics,
});

const platformHotelSubscriptionRoute = createRoute({
  getParentRoute: () => platformHotelDetailsRoute,
  path: "subscription",
  component: HotelSubscription,
});

const platformHotelBillingRoute = createRoute({
  getParentRoute: () => platformHotelDetailsRoute,
  path: "billing",
  component: HotelBilling,
});

const platformHotelSecurityRoute = createRoute({
  getParentRoute: () => platformHotelDetailsRoute,
  path: "security",
  component: HotelSecurity,
});

const platformHotelSettingsRoute = createRoute({
  getParentRoute: () => platformHotelDetailsRoute,
  path: "settings",
  component: HotelSettings,
});

const platformSubscriptionsRoute = createRoute({
  getParentRoute: () => platformLayoutRoute,
  path: "subscriptions",
  component: PlatformSubscriptions,
});

const platformFeatureFlagsRoute = createRoute({
  getParentRoute: () => platformLayoutRoute,
  path: "feature-flags",
  component: PlatformFeatureFlags,
});

const platformRolesRoute = createRoute({
  getParentRoute: () => platformLayoutRoute,
  path: "roles-permissions",
  component: PlatformRoles,
});

const platformAuditRoute = createRoute({
  getParentRoute: () => platformLayoutRoute,
  path: "audit-logs",
  component: PlatformAuditLogs,
});

const platformSettingsRoute = createRoute({
  getParentRoute: () => platformLayoutRoute,
  path: "settings",
  component: PlatformSettings,
});

export const platformRouteTree = platformLayoutRoute.addChildren([
  platformDashboardRoute,
  platformHotelsRoute,
  platformHotelCreateRoute,
  platformHotelDetailsRoute.addChildren([
    platformHotelOverviewRoute,
    platformHotelDomainsRoute,
    platformHotelBrandingRoute,
    platformHotelUsersRoute,
    platformHotelFeaturesRoute,
    platformHotelAuditLogsRoute,
    platformHotelMetricsRoute,
    platformHotelSubscriptionRoute,
    platformHotelBillingRoute,
    platformHotelSecurityRoute,
    platformHotelSettingsRoute,
  ]),
  platformSubscriptionsRoute,
  platformFeatureFlagsRoute,
  platformRolesRoute,
  platformAuditRoute,
  platformSettingsRoute,
]);
