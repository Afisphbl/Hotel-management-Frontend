import { cn } from "@/lib/utils";
import { RoomStatus } from "@/types/room";

interface RoomStatusBadgeProps {
  status: RoomStatus;
  className?: string;
}

export function RoomStatusBadge({ status, className }: RoomStatusBadgeProps) {
  const cfg: Record<string, { bg: string; text: string; label: string }> = {
    available: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Available",
    },
    occupied: { bg: "bg-blue-100", text: "text-blue-800", label: "Occupied" },
    dirty: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Dirty" },
    maintenance: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      label: "Maintenance",
    },
    out_of_order: {
      bg: "bg-red-100",
      text: "text-red-800",
      label: "Out of Order",
    },
  };
  const c = cfg[status] ?? cfg["available"];
  return (
    <span
      className={cn("px-3 py-1 rounded-full text-xs font-medium", c.bg, c.text, className)}
    >
      {c.label}
    </span>
  );
}
