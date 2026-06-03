export const PLAN_FILTER_LABELS: Record<string, string> = {
  all: "All Plans",
  enterprise: "Enterprise",
  pro: "Pro",
  basic: "Basic",
};

export const SORT_OPTIONS = [
  { value: "name-asc", label: "Hotel name: A to Z" },
  { value: "name-desc", label: "Hotel name: Z to A" },
  { value: "rooms-asc", label: "Rooms: Low to High" },
  { value: "rooms-desc", label: "Rooms: High to Low" },
  { value: "created-desc", label: "Newest first" },
  { value: "created-asc", label: "Oldest first" },
] as const;

export const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  suspended: "Suspended",
  archived: "Archived",
};

export type PlanFilterValue = keyof typeof PLAN_FILTER_LABELS;
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export interface Hotel {
  id: string;
  name: string;
  plan: string | null;
  status: string | null;
  ownerName?: string;
  ownerEmail?: string;
  owner?: string;
  email?: string;
  totalRooms?: number;
  rooms?: number;
  created?: string;
  subscriptionId?: string;
  subdomain?: string;
  branding?: { primaryColor?: string; accentColor?: string };
  enabledFeatures?: string[];
}

export const PLAN_MAP: Record<string, string> = {
  basic: "BASIC", Basic: "BASIC", BASIC: "BASIC",
  pro: "PROFESSIONAL", Pro: "PROFESSIONAL", PROFESSIONAL: "PROFESSIONAL",
  enterprise: "ENTERPRISE", Enterprise: "ENTERPRISE", ENTERPRISE: "ENTERPRISE",
};

export function normalizePlan(plan: string): string {
  return PLAN_MAP[plan] ?? plan;
}

export function getTextValue(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) return trimmed;
    }
  }
  return "—";
}

export function getNumericValue(...values: Array<string | number | null | undefined>): number | "—" {
  for (const value of values) {
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) continue;
      const parsed = Number(trimmed);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }
  return "—";
}
