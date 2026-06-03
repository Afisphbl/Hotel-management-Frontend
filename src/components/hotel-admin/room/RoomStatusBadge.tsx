import { cn } from "@/lib/utils";
import type { RoomStatus } from "./types";

const STATUS_BADGES: Record<RoomStatus, { bg: string; text: string; label: string }> = {
  available: { bg: "bg-green-100", text: "text-green-800", label: "Available" },
  occupied: { bg: "bg-blue-100", text: "text-blue-800", label: "Occupied" },
  dirty: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Dirty" },
  maintenance: { bg: "bg-orange-100", text: "text-orange-800", label: "Maintenance" },
  out_of_order: { bg: "bg-red-100", text: "text-red-800", label: "Out of Order" },
};

export function RoomStatusBadge({ status }: { status: RoomStatus }) {
  const badge = STATUS_BADGES[status] ?? STATUS_BADGES.available;
  return <span className={cn("px-3 py-1 rounded-full text-xs font-medium", badge.bg, badge.text)}>{badge.label}</span>;
}
