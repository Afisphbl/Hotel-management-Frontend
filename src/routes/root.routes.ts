import { createRootRoute, createRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/authStore";
import { LoginPage } from "@/pages/Login";
import { AppShell } from "@/components/layout/AppShell";
import { Unauthorized } from "@/components/shared/Unauthorized";

export const getHomeRedirect = () => {
  const { user } = useAuthStore.getState();
  if (!user) return "/login";
  const adminRoles = ["HOTEL_MANAGER", "HOTEL_ADMIN", "SUPER_ADMIN"];
  return user.scope === "platform"
    ? "/platform/dashboard"
    : user.role === "HOTEL_OWNER"
      ? "/hotel/owner/dashboard"
      : adminRoles.includes(user.role)
        ? "/hotel/admin/dashboard"
        : "/hotel/dashboard";
};

export const rootRoute = createRootRoute({
  component: Outlet
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  loader: () => {
    throw redirect({ to: getHomeRedirect() });
  },
});

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
  loader: () => {
    const { user } = useAuthStore.getState();
    if (user) throw redirect({ to: getHomeRedirect() });
  },
});

export const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AppShell,
  loader: () => {
    const { user } = useAuthStore.getState();
    if (!user) throw redirect({ to: "/" });
  },
});

export const unauthorizedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "unauthorized",
  component: Unauthorized,
});
