import { createRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/authStore";
import { hotelLayoutRoute } from "./hotel.routes";
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
import { Housekeeping as HotelAdminHousekeeping, Maintenance as HotelAdminMaintenance } from "@/pages/hotel-admin";

const hotelOwnerLoader = () => {
  const { user } = useAuthStore.getState();
  if (user?.scope !== "hotel" || user?.role !== "HOTEL_OWNER") {
    throw redirect({ to: "/unauthorized" });
  }
};

export const hotelOwnerRoutes = [
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "owner/dashboard", loader: hotelOwnerLoader, component: HotelOwnerDashboard }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "owner/rooms", loader: hotelOwnerLoader, component: HotelOwnerRooms }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "owner/staff", loader: hotelOwnerLoader, component: HotelOwnerStaff }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "owner/pricing", loader: hotelOwnerLoader, component: HotelOwnerPricing }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "owner/reports", loader: hotelOwnerLoader, component: HotelOwnerReports }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "owner/hotels", loader: hotelOwnerLoader, component: HotelOwnerHotels }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "owner/finance-settings", loader: hotelOwnerLoader, component: HotelOwnerFinanceSettings }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "owner/settings", loader: hotelOwnerLoader, component: HotelOwnerSettings }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "owner/housekeeping", loader: hotelOwnerLoader, component: HotelAdminHousekeeping }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "owner/maintenance", loader: hotelOwnerLoader, component: HotelAdminMaintenance }),
];
