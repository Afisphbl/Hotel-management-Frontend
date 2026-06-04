import { createRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/authStore";
import { hotelLayoutRoute } from "./hotel.routes";
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
  Reviews as HotelAdminReviews,
} from "@/pages/hotel-admin";

const adminRoles = ["HOTEL_MANAGER", "HOTEL_ADMIN", "SUPER_ADMIN"];

const hotelAdminLoader = () => {
  const { user } = useAuthStore.getState();
  if (user?.scope !== "hotel" || !adminRoles.includes(user?.role ?? "")) {
    throw redirect({ to: "/unauthorized" });
  }
};

export const hotelAdminRoutes = [
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "admin/dashboard", loader: hotelAdminLoader, component: HotelAdminDashboard }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "admin/property", loader: hotelAdminLoader, component: HotelAdminProperty }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "admin/rooms", loader: hotelAdminLoader, component: HotelAdminRooms }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "admin/bookings", loader: hotelAdminLoader, component: HotelAdminBookings }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "admin/guests", loader: hotelAdminLoader, component: HotelAdminGuests }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "admin/staff", loader: hotelAdminLoader, component: HotelAdminStaff }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "admin/pricing", loader: hotelAdminLoader, component: HotelAdminPricing }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "admin/finance", loader: hotelAdminLoader, component: HotelAdminFinance }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "admin/invoices", loader: hotelAdminLoader, component: HotelAdminInvoices }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "admin/payments", loader: hotelAdminLoader, component: HotelAdminPayments }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "admin/housekeeping", loader: hotelAdminLoader, component: HotelAdminHousekeeping }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "admin/maintenance", loader: hotelAdminLoader, component: HotelAdminMaintenance }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "admin/reports", loader: hotelAdminLoader, component: HotelAdminReports }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "admin/settings", loader: hotelAdminLoader, component: HotelAdminSettings }),
  createRoute({ getParentRoute: () => hotelLayoutRoute, path: "admin/reviews", loader: hotelAdminLoader, component: HotelAdminReviews }),
];
