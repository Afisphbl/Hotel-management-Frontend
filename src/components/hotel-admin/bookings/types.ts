export const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  hold: "bg-orange-100 text-orange-800",
  confirmed: "bg-green-100 text-green-800",
  checked_in: "bg-blue-100 text-blue-800",
  checked_out: "bg-slate-100 text-slate-700",
  cancelled: "bg-red-100 text-red-800",
  noshow: "bg-gray-100 text-gray-800",
};

export const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "hold", label: "Hold" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "Checked In" },
  { value: "checked_out", label: "Checked Out" },
  { value: "cancelled", label: "Cancelled" },
  { value: "noshow", label: "No Show" },
];

export const SOURCE_OPTIONS = [
  { value: "ALL", label: "All Sources" },
  { value: "direct", label: "Direct" },
  { value: "booking.com", label: "Booking.com" },
  { value: "expedia", label: "Expedia" },
  { value: "airbnb", label: "Airbnb" },
  { value: "phone", label: "Phone" },
  { value: "walk_in", label: "Walk-in" },
  { value: "corporate", label: "Corporate" },
  { value: "other", label: "Other" },
];

export interface GuestInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface RoomBrief {
  id: string;
  roomNumber: string;
  roomType?: { id: string; name: string };
}

export interface BookingRoomInfo {
  id: string;
  roomId: string;
  price: number;
  room: RoomBrief;
}

export interface Booking {
  id: string;
  guestId: string;
  guest?: GuestInfo;
  checkIn: string;
  checkOut: string;
  status: string;
  totalPrice: number;
  source?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  bookingRooms?: BookingRoomInfo[];
  nights?: number;
  guestName?: string;
  roomNumber?: string;
}

export const nights = (checkIn: string, checkOut: string) => {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(diff / 86400000));
};

export const guestDisplayName = (b: Booking) => {
  if (b.guest?.firstName)
    return `${b.guest.firstName} ${b.guest.lastName || ""}`.trim();
  return b.guestName || "N/A";
};

export const guestInitial = (b: Booking) => guestDisplayName(b)[0] || "G";

export const roomDisplay = (b: Booking) => {
  if (b.bookingRooms?.length) {
    return b.bookingRooms
      .map((br) => `Room ${br.room?.roomNumber || "—"}`)
      .join(", ");
  }
  return b.roomNumber ? `Room ${b.roomNumber}` : "—";
};

export const roomTypeDisplay = (b: Booking) => {
  if (b.bookingRooms?.length) {
    return b.bookingRooms
      .map((br) => br.room?.roomType?.name || "Standard")
      .filter(Boolean)
      .join(", ");
  }
  return "—";
};

export const guestEmail = (b: Booking) => b.guest?.email || "—";
export const guestPhone = (b: Booking) => b.guest?.phone || "—";

export const sourceLabel = (s?: string) =>
  s ? s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—";
