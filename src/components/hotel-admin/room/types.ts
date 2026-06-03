export type RoomStatus = "available" | "occupied" | "dirty" | "maintenance" | "out_of_order";

export interface RoomType {
  id: string;
  name: string;
  baseCapacity: number;
  basePrice: number;
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: string;
  status: RoomStatus;
  basePrice?: number | null;
  baseCapacity?: number | null;
  roomTypeId?: string | null;
  effectivePrice?: number | null;
  pricingReason?: string | null;
  pricingType?: "override" | "promotion" | "seasonal" | "rate_plan" | null;
  images?: string[];
  roomType?: RoomType;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const ROOM_STATUS_OPTIONS: { value: RoomStatus; label: string; color: string }[] = [
  { value: "available", label: "Available", color: "bg-green-500" },
  { value: "occupied", label: "Occupied", color: "bg-blue-500" },
  { value: "dirty", label: "Dirty", color: "bg-yellow-500" },
  { value: "maintenance", label: "Maintenance", color: "bg-orange-500" },
  { value: "out_of_order", label: "Out of Order", color: "bg-red-500" },
];
