export type RoomStatus =
  | "available"
  | "occupied"
  | "dirty"
  | "maintenance"
  | "out_of_order";

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
  pricingType?: 'override' | 'promotion' | 'seasonal' | 'rate_plan' | null;
  images?: string[];
  roomType?: RoomType;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RoomSummary {
  total?: number;
  available?: number;
  occupied?: number;
  dirty?: number;
  maintenance?: number;
  out_of_order?: number;
  roomLimit?: number;
  plan?: string;
  [key: string]: any;
}
