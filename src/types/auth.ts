export type UserRole =
  | "SUPER_ADMIN"
  | "HOTEL_OWNER"
  | "HOTEL_MANAGER"
  | "REVENUE_MANAGER"
  | "FRONT_DESK"
  | "ACCOUNTANT"
  | "HOUSEKEEPING_SUPERVISOR"
  | "HOUSEKEEPING_STAFF"
  | "MAINTENANCE_STAFF";

export type UserScope = "platform" | "hotel";

export interface AuthUser {
  sub: string;
  email: string;
  name: string;
  hotel_id?: string;
  role: UserRole;
  scope: UserScope;
  permissions: string[];
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string, hotelId?: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}
