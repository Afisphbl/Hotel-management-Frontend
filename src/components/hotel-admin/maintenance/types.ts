export type MaintenanceStatus = "reported" | "assigned" | "in_progress" | "resolved" | "closed";
export type MaintenancePriority = "low" | "medium" | "high" | "critical";

export interface MaintenanceRoom {
  id: string;
  roomNumber: string;
  roomType?: { name?: string | null } | null;
}

export interface MaintenanceStaff {
  id: string;
  firstName: string;
  lastName: string;
  role?: string | null;
}

export interface MaintenanceTicket {
  id: string;
  roomId?: string | null;
  room?: MaintenanceRoom | null;
  title?: string | null;
  description?: string | null;
  assignedTo?: string | null;
  assignedToName?: string | null;
  reportedBy?: string | null;
  reporter?: { firstName: string; lastName: string } | null;
  priority?: MaintenancePriority | null;
  status?: MaintenanceStatus | null;
  cost?: number | null;
  createdAt?: string | null;
}

export interface MaintenanceStats {
  total: number;
  open: number;
  inProgress: number;
  completed: number;
}

export interface MaintenanceFormState {
  roomId: string;
  title: string;
  priority: MaintenancePriority;
  description: string;
}

export const MAINTENANCE_STATUS_FILTERS: Array<MaintenanceStatus | "ALL"> = [
  "ALL",
  "reported",
  "assigned",
  "in_progress",
  "resolved",
  "closed",
];
