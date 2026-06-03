import { createRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/authStore";
import { authLayoutRoute } from "./root.routes";
import { HotelDashboard } from "@/pages/hotel/Dashboard";
import { HotelBookings } from "@/pages/hotel/Bookings";
import { HotelRooms } from "@/pages/hotel/Rooms";
import { HotelAvailability } from "@/pages/hotel/Availability";
import { HotelFrontDesk } from "@/pages/hotel/FrontDesk";
import { HotelGuests } from "@/pages/hotel/Guests";
import { HotelPricing } from "@/pages/hotel/Pricing";
import { HotelFinance } from "@/pages/hotel/Finance";
import { HotelStaff } from "@/pages/hotel/Staff";
import { HotelReports } from "@/pages/hotel/Reports";
import { HotelSettings as PropertySettings } from "@/pages/hotel/Settings";
import {
  Housekeeping as HotelAdminHousekeeping,
  Maintenance as HotelAdminMaintenance,
} from "@/pages/hotel-admin";

export const hotelLayoutRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "hotel",
  loader: () => {
    const { user } = useAuthStore.getState();
    if (user?.scope !== "hotel") throw redirect({ to: "/unauthorized" });
  },
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
  component: HotelAdminHousekeeping,
});

const hotelMaintenanceRoute = createRoute({
  getParentRoute: () => hotelLayoutRoute,
  path: "maintenance",
  component: HotelAdminMaintenance,
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

export const hotelRoutes = [
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
];
