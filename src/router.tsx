import { createRouter } from "@tanstack/react-router";
import { rootRoute, indexRoute, loginRoute, authLayoutRoute, unauthorizedRoute } from "./routes/root.routes";
import { platformRouteTree } from "./routes/platform.routes";
import { hotelLayoutRoute, hotelRoutes } from "./routes/hotel.routes";
import { hotelOwnerRoutes } from "./routes/hotel-owner.routes";
import { hotelAdminRoutes } from "./routes/hotel-admin.routes";

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  unauthorizedRoute,
  authLayoutRoute.addChildren([
    platformRouteTree,
    hotelLayoutRoute.addChildren([
      ...hotelRoutes,
      ...hotelOwnerRoutes,
      ...hotelAdminRoutes,
    ]),
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
