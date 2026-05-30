import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { useAuthStore } from "@/store/authStore";
import { LoginPage } from "@/pages/Login";
import { AppShell } from "@/components/layout/AppShell";
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
import { HotelSecurity } from "@/pages/platform/hotel-detail/Security";
import { HotelSettings } from "@/pages/platform/hotel-detail/Settings";
import { PlatformSubscriptions } from "@/pages/platform/Subscriptions";
import { PlatformFeatureFlags } from "@/pages/platform/FeatureFlags";
import { PlatformRoles } from "@/pages/platform/Roles";
import { PlatformAuditLogs } from "@/pages/platform/AuditLogs";
import { PlatformSettings } from "@/pages/platform/Settings";
import { HotelDashboard } from "@/pages/hotel/Dashboard";
import { HotelBookings } from "@/pages/hotel/Bookings";
import { HotelRooms } from "@/pages/hotel/Rooms";
import { HotelAvailability } from "@/pages/hotel/Availability";
import { HotelFrontDesk } from "@/pages/hotel/FrontDesk";
import { HotelGuests } from "@/pages/hotel/Guests";
import { HotelPricing } from "@/pages/hotel/Pricing";
import { HotelFinance } from "@/pages/hotel/Finance";
import { HotelHousekeeping } from "@/pages/hotel/Housekeeping";
import { HotelMaintenance } from "@/pages/hotel/Maintenance";
import { HotelStaff } from "@/pages/hotel/Staff";
import { HotelReports } from "@/pages/hotel/Reports";
import { HotelSettings as PropertySettings } from "@/pages/hotel/Settings";
import { ComingSoon } from "@/components/shared/ComingSoon";
// Hotel Owner Pages
import {
  Dashboard as HotelOwnerDashboard,
  Rooms as HotelOwnerRooms,
  Staff as HotelOwnerStaff,
  Pricing as HotelOwnerPricing,
  Reports as HotelOwnerReports,
  Hotels as HotelOwnerHotels,
  FinanceSettings as HotelOwnerFinanceSettings,
  OwnerSettings as HotelOwnerSettings,
} from "@/pages/hotel-owner";
// Hotel Admin Pages
import {
  Dashboard as HotelAdminDashboard,
  Property as HotelAdminProperty,
  Rooms as HotelAdminRooms,
  Bookings as HotelAdminBookings,
  Guests as HotelAdminGuests,
  Staff as HotelAdminStaff,
  Pricing as HotelAdminPricing,
  Finance as HotelAdminFinance,
  Invoices as HotelAdminInvoices,
  Payments as HotelAdminPayments,
  Housekeeping as HotelAdminHousekeeping,
  Maintenance as HotelAdminMaintenance,
  Reports as HotelAdminReports,
  Settings as HotelAdminSettings,
} from "@/pages/hotel-admin";

// Root Layout
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Login Route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
  loader: () => {
    const { user } = useAuthStore.getState();
    if (user) {
      const adminRoles = ["HOTEL_MANAGER", "HOTEL_ADMIN", "SUPER_ADMIN"];
      throw redirect({
        to:
          user.scope === "platform"
            ? "/platform/dashboard"
            : user.role === "HOTEL_OWNER"
              ? "/hotel/owner/dashboard"
              : adminRoles.includes(user.role)
                ? "/hotel/admin/dashboard"
                : "/hotel/dashboard",
      });
    }
  },
});

// Auth Guard Layout
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AppShell,
  loader: () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      throw redirect({ to: "/" });
    }
  },
});

// Platform Layout
const platformLayoutRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "platform",
  loader: () => {
    const { user } = useAuthStore.getState();
    if (user?.scope !== "platform") {
      throw redirect({ to: "/unauthorized" });
    }
  },
});

// Hotel Layout
const hotelLayoutRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "hotel",
  loader: () => {
    const { user } = useAuthStore.getState();
    if (user?.scope !== "hotel") {
      throw redirect({ to: "/unauthorized" });
    }
  },
});

// Pages
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

const hotelDashboardRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "dashboard",
  component: HotelDashboard,
});

const hotelBookingsRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "bookings",
  component: HotelBookings,
});

const hotelRoomsRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "rooms",
  component: HotelRooms,
});

const hotelAvailabilityRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "availability",
  component: HotelAvailability,
});

const hotelFrontDeskRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "front-desk",
  component: HotelFrontDesk,
});

const hotelGuestsRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "guests",
  component: HotelGuests,
});

const hotelPricingRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "pricing",
  component: HotelPricing,
});

const hotelFinanceRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "finance",
  component: HotelFinance,
});

const hotelHousekeepingRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "housekeeping",
  component: HotelHousekeeping,
});

const hotelMaintenanceRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "maintenance",
  component: HotelMaintenance,
});

const hotelStaffRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "staff",
  component: HotelStaff,
});

const hotelReportsRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "reports",
  component: HotelReports,
});

const hotelSettingsRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "settings",
  component: PropertySettings,
});

const hotelOwnerLoader = () => {
  const { user } = useAuthStore.getState();
  if (user?.scope !== "hotel" || user?.role !== "HOTEL_OWNER") {
    throw redirect({ to: "/unauthorized" });
  }
};

const hotelAdminLoader = () => {
  const { user } = useAuthStore.getState();
  if (user?.scope !== "hotel") {
    throw redirect({ to: "/unauthorized" });
  }
  const adminRoles = ["HOTEL_MANAGER", "HOTEL_ADMIN", "SUPER_ADMIN"];
  if (!adminRoles.includes(user?.role ?? "")) {
    throw redirect({ to: "/unauthorized" });
  }
};

// Hotel Owner Routes
const hotelOwnerDashboardRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "owner/dashboard",
  loader: hotelOwnerLoader,
  component: HotelOwnerDashboard,
});

const hotelOwnerRoomsRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "owner/rooms",
  loader: hotelOwnerLoader,
  component: HotelOwnerRooms,
});

const hotelOwnerStaffRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "owner/staff",
  loader: hotelOwnerLoader,
  component: HotelOwnerStaff,
});

const hotelOwnerPricingRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "owner/pricing",
  loader: hotelOwnerLoader,
  component: HotelOwnerPricing,
});

const hotelOwnerReportsRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "owner/reports",
  loader: hotelOwnerLoader,
  component: HotelOwnerReports,
});

const hotelOwnerHotelsRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "owner/hotels",
  loader: hotelOwnerLoader,
  component: HotelOwnerHotels,
});

const hotelOwnerFinanceSettingsRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "owner/finance-settings",
  loader: hotelOwnerLoader,
  component: HotelOwnerFinanceSettings,
});

const hotelOwnerSettingsRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "owner/settings",
  loader: hotelOwnerLoader,
  component: HotelOwnerSettings,
});

// Hotel Admin Routes
const hotelAdminDashboardRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "admin/dashboard",
  loader: hotelAdminLoader,
  component: HotelAdminDashboard,
});

const hotelAdminPropertyRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "admin/property",
  loader: hotelAdminLoader,
  component: HotelAdminProperty,
});

const hotelAdminRoomsRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "admin/rooms",
  loader: hotelAdminLoader,
  component: HotelAdminRooms,
});

const hotelAdminBookingsRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "admin/bookings",
  loader: hotelAdminLoader,
  component: HotelAdminBookings,
});

const hotelAdminGuestsRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "admin/guests",
  loader: hotelAdminLoader,
  component: HotelAdminGuests,
});

const hotelAdminStaffRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "admin/staff",
  loader: hotelAdminLoader,
  component: HotelAdminStaff,
});

const hotelAdminPricingRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "admin/pricing",
  loader: hotelAdminLoader,
  component: HotelAdminPricing,
});

const hotelAdminFinanceRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "admin/finance",
  loader: hotelAdminLoader,
  component: HotelAdminFinance,
});

const hotelAdminInvoicesRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "admin/invoices",
  loader: hotelAdminLoader,
  component: HotelAdminInvoices,
});

const hotelAdminPaymentsRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "admin/payments",
  loader: hotelAdminLoader,
  component: HotelAdminPayments,
});

const hotelAdminHousekeepingRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "admin/housekeeping",
  loader: hotelAdminLoader,
  component: HotelAdminHousekeeping,
});

const hotelAdminMaintenanceRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "admin/maintenance",
  loader: hotelAdminLoader,
  component: HotelAdminMaintenance,
});

const hotelAdminReportsRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "admin/reports",
  loader: hotelAdminLoader,
  component: HotelAdminReports,
});

const hotelAdminSettingsRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "admin/settings",
  loader: hotelAdminLoader,
  component: HotelAdminSettings,
});

const unauthorizedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "unauthorized",
  component: () => <div>Unauthorized</div>,
});

export const routeTree = rootRoute.addChildren([
  loginRoute,
  unauthorizedRoute,
  authLayoutRoute.addChildren([
    platformLayoutRoute.addChildren([
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
        platformHotelSecurityRoute,
        platformHotelSettingsRoute,
      ]),
      platformSubscriptionsRoute,
      platformFeatureFlagsRoute,
      platformRolesRoute,
      platformAuditRoute,
      platformSettingsRoute,
    ]),
      hotelLayoutRoute.addChildren([
      hotelDashboardRoute,
      hotelBookingsRoute,
      hotelRoomsRoute,
      hotelAvailabilityRoute,
      hotelFrontDeskRoute,
      hotelGuestsRoute,
      hotelPricingRoute,
      hotelFinanceRoute,
      hotelHousekeepingRoute,
      hotelMaintenanceRoute,
      hotelStaffRoute,
      hotelReportsRoute,
      hotelSettingsRoute,
      // Hotel Owner Routes
      hotelOwnerDashboardRoute,
      hotelOwnerRoomsRoute,
      hotelOwnerStaffRoute,
      hotelOwnerPricingRoute,
      hotelOwnerReportsRoute,
      hotelOwnerHotelsRoute,
      hotelOwnerFinanceSettingsRoute,
      hotelOwnerSettingsRoute,
      // Hotel Admin Routes
      hotelAdminDashboardRoute,
      hotelAdminPropertyRoute,
      hotelAdminRoomsRoute,
      hotelAdminBookingsRoute,
      hotelAdminGuestsRoute,
      hotelAdminStaffRoute,
      hotelAdminPricingRoute,
      hotelAdminFinanceRoute,
      hotelAdminInvoicesRoute,
      hotelAdminPaymentsRoute,
      hotelAdminHousekeepingRoute,
      hotelAdminMaintenanceRoute,
      hotelAdminReportsRoute,
      hotelAdminSettingsRoute,
    ]),
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
