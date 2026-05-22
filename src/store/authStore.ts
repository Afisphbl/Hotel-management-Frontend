import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, AuthUser, UserRole } from "@/types/auth";
import { api } from "@/lib/api";

function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT token", e);
    return null;
  }
}

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: ["*"],
  HOTEL_OWNER: ["*"],
  HOTEL_MANAGER: [
    "dashboard:read",
    "booking:*",
    "front_desk:*",
    "room:*",
    "guest:*",
    "availability:read",
    "reports:read",
    "staff:*",
    "maintenance:*",
    "housekeeping:*",
  ],
  REVENUE_MANAGER: [
    "dashboard:read",
    "booking:read",
    "pricing:*",
    "reports:read",
    "availability:read",
  ],
  FRONT_DESK: [
    "dashboard:read",
    "booking:*",
    "front_desk:*",
    "room:read",
    "guest:read",
    "availability:read",
  ],
  ACCOUNTANT: ["dashboard:read", "finance:*", "booking:read", "reports:read"],
  HOUSEKEEPING_SUPERVISOR: ["housekeeping:*", "room:read", "reports:read"],
  HOUSEKEEPING_STAFF: ["housekeeping:own_tasks"],
  MAINTENANCE_STAFF: ["maintenance:own_tickets"],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      originalToken: null,
      login: async (email, password, hotelId) => {
        try {
          console.log(`Connecting to backend login API for ${email}...`);
          const response = await api.post("auth/login", {
            email,
            password,
            ...(hotelId ? { hotelId } : {}),
          });

          if (response && response.access_token) {
            const payload = decodeJwt(response.access_token);
            if (payload) {
              // Convert email username to human readable name
              const rawName = payload.email
                ? payload.email.split("@")[0]
                : "User";
              const formattedName = rawName
                .split(/[._-]/)
                .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");

              const apiUser: AuthUser = {
                sub: payload.sub || "user_123",
                email: payload.email || email,
                name: formattedName,
                role: (payload.role || "HOTEL_OWNER") as UserRole,
                scope: (payload.scope || "hotel") as "platform" | "hotel",
                hotel_id: payload.hotel_id || undefined,
                permissions:
                  payload.permissions ||
                  ROLE_PERMISSIONS[
                    (payload.role || "HOTEL_OWNER") as UserRole
                  ] ||
                  [],
              };
              set({ user: apiUser, token: response.access_token, originalToken: null });
              console.log(
                "Successfully logged in against Live API and synced state!",
              );
              return;
            }
          }
          throw new Error("Authentication response empty.");
        } catch (error: any) {
          console.error("Authentication Error:", error);
          throw new Error(
            error.message ||
              "Login failed, please check your network and credentials.",
          );
        }
      },
      logout: () => set({ user: null, token: null, originalToken: null }),
      impersonate: async (hotelId: string) => {
        try {
          const currentToken = get().token;
          const response = await api.post("auth/impersonate", { hotelId });
          if (response && response.access_token) {
            const payload = decodeJwt(response.access_token);
            if (payload) {
              const apiUser: AuthUser = {
                sub: payload.sub,
                email: payload.email,
                name: `SUPPORT: ${payload.email.split("@")[0]}`,
                role: payload.role as UserRole,
                scope: payload.scope as "platform" | "hotel",
                hotel_id: payload.hotel_id,
                permissions: payload.permissions || ["*"],
              };
              set({ 
                user: apiUser, 
                token: response.access_token, 
                originalToken: currentToken 
              });
              return;
            }
          }
        } catch (error: any) {
          console.error("Impersonation Error:", error);
          throw new Error(error.message || "Failed to start impersonation session.");
        }
      },
      stopImpersonating: () => {
        const { originalToken } = get();
        if (originalToken) {
          const payload = decodeJwt(originalToken);
          if (payload) {
            const rawName = payload.email
              ? payload.email.split("@")[0]
              : "User";
            const formattedName = rawName
              .split(/[._-]/)
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ");

            const apiUser: AuthUser = {
              sub: payload.sub,
              email: payload.email,
              name: formattedName,
              role: (payload.role || "SUPER_ADMIN") as UserRole,
              scope: (payload.scope || "platform") as "platform" | "hotel",
              hotel_id: payload.hotel_id,
              permissions: payload.permissions || ["*"],
            };
            set({ 
              user: apiUser, 
              token: originalToken, 
              originalToken: null 
            });
            window.location.href = "/platform/dashboard";
          }
        }
      },
      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        if (user.permissions.includes("*")) return true;

        const [resource, action] = permission.split(":");
        return user.permissions.some((p) => {
          const [pResource, pAction] = p.split(":");
          if (pResource === resource && (pAction === "*" || pAction === action))
            return true;
          return false;
        });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
