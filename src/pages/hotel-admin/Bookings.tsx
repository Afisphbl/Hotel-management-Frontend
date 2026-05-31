import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  User,
  Calendar as CalendarIcon,
  Plus,
  Bed,
  Mail,
  Phone,
  MoreVertical,
  Pencil,
} from "lucide-react";
import { cn, formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { format, isBefore, startOfDay, addDays } from "date-fns";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  hold: "bg-orange-100 text-orange-800",
  confirmed: "bg-green-100 text-green-800",
  checked_in: "bg-blue-100 text-blue-800",
  checked_out: "bg-slate-100 text-slate-700",
  cancelled: "bg-red-100 text-red-800",
  noshow: "bg-gray-100 text-gray-800",
};

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "hold", label: "Hold" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "Checked In" },
  { value: "checked_out", label: "Checked Out" },
  { value: "cancelled", label: "Cancelled" },
  { value: "noshow", label: "No Show" },
];

const SOURCE_OPTIONS = [
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

interface GuestInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface RoomBrief {
  id: string;
  roomNumber: string;
  roomType?: { id: string; name: string };
}

interface BookingRoomInfo {
  id: string;
  roomId: string;
  price: number;
  room: RoomBrief;
}

interface Booking {
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

export function AdminBookings() {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedSource, setSelectedSource] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState("");
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const PAGE_SIZE = 15;

  useEffect(() => {
    setPage(1);
  }, [selectedStatus, selectedSource, dateFrom, dateTo]);

  useEffect(() => {
    fetchBookings();
  }, [selectedStatus, selectedSource, page]);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== "ALL") params.append("status", selectedStatus);
      params.append("page", String(page));
      params.append("limit", String(PAGE_SIZE));
      const res = await api.get(`hotel/bookings?${params.toString()}`);
      const items: Booking[] = res.data || res.items || [];
      setBookings(items);
      if (res.meta) {
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      }
    } catch (err: any) {
      toast.error("Failed to load bookings: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, page]);

  const handleAction = async (id: string, action: string) => {
    try {
      const body =
        action === "confirm"
          ? { idempotencyKey: `confirm-${id}-${Date.now()}` }
          : {};
      await api.post(`hotel/bookings/${id}/${action}`, body);
      toast.success(`Booking ${action} successful`);
      fetchBookings();
    } catch (err: any) {
      toast.error(`Failed to ${action}: ${err.message}`);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.size === 0) return;
    try {
      setBulkProcessing(true);
      const results = await Promise.allSettled(
        Array.from(selectedIds).map((id) => {
          const body =
            bulkAction === "confirm"
              ? { idempotencyKey: `bulk-confirm-${id}-${Date.now()}` }
              : {};
          return api.post(`hotel/bookings/${id}/${bulkAction}`, body);
        }),
      );
      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;
      if (succeeded > 0)
        toast.success(`${succeeded} bookings ${bulkAction} successful`);
      if (failed > 0) toast.error(`${failed} bookings failed`);
      setSelectedIds(new Set());
      setBulkAction("");
      fetchBookings();
    } catch (err: any) {
      toast.error(`Bulk action failed: ${err.message}`);
    } finally {
      setBulkProcessing(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((b) => b.id)));
    }
  };

  const nights = (checkIn: string, checkOut: string) => {
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.round(diff / 86400000));
  };

  const guestDisplayName = (b: Booking) => {
    if (b.guest?.firstName)
      return `${b.guest.firstName} ${b.guest.lastName || ""}`.trim();
    return b.guestName || "N/A";
  };

  const guestInitial = (b: Booking) => guestDisplayName(b)[0] || "G";

  const roomDisplay = (b: Booking) => {
    if (b.bookingRooms?.length) {
      return b.bookingRooms
        .map((br) => `Room ${br.room?.roomNumber || "—"}`)
        .join(", ");
    }
    return b.roomNumber ? `Room ${b.roomNumber}` : "—";
  };

  const roomTypeDisplay = (b: Booking) => {
    if (b.bookingRooms?.length) {
      return b.bookingRooms
        .map((br) => br.room?.roomType?.name || "Standard")
        .filter(Boolean)
        .join(", ");
    }
    return "—";
  };

  const guestEmail = (b: Booking) => b.guest?.email || "—";
  const guestPhone = (b: Booking) => b.guest?.phone || "—";
  const sourceLabel = (s?: string) =>
    s ? s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—";

  const filtered = useMemo(() => {
    let f = bookings;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      f = f.filter(
        (b) =>
          guestDisplayName(b).toLowerCase().includes(q) ||
          b.id?.toLowerCase().includes(q) ||
          roomDisplay(b).toLowerCase().includes(q) ||
          guestEmail(b).toLowerCase().includes(q) ||
          b.guest?.firstName?.toLowerCase().includes(q) ||
          b.guest?.lastName?.toLowerCase().includes(q),
      );
    }
    if (selectedSource !== "ALL") {
      f = f.filter((b) => b.source === selectedSource);
    }
    if (dateFrom) {
      f = f.filter((b) => new Date(b.checkIn) >= new Date(dateFrom));
    }
    if (dateTo) {
      f = f.filter(
        (b) => new Date(b.checkOut) <= new Date(dateTo + "T23:59:59"),
      );
    }
    return f;
  }, [bookings, searchTerm, selectedSource, dateFrom, dateTo]);

  const allSelected =
    filtered.length > 0 && selectedIds.size === filtered.length;

  return (
    <div className='space-y-8 pb-10'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-serif text-[#0F1B2D]'>
            Bookings
          </h1>
          <p className='text-sm text-muted-foreground'>
            Manage reservations, check-ins, and check-outs
          </p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className='bg-[#0F1B2D] hover:bg-[#1a2a3a]'
        >
          <Plus className='w-4 h-4 mr-2' /> New Booking
        </Button>
      </div>

      <Card className='shadow-sm border-none bg-white'>
        <CardContent className='p-6 space-y-4'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <Input
                placeholder='Search by guest name, email, booking ID, or room...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
          <div className='flex flex-wrap gap-3'>
            <div className='flex items-center gap-2'>
              <Label className='text-xs text-muted-foreground whitespace-nowrap'>
                Status
              </Label>
              <Select
                value={selectedStatus}
                onValueChange={(v) => {
                  setSelectedStatus(v || "ALL");
                }}
              >
                <SelectTrigger className='w-[150px] bg-white'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-center gap-2'>
              <Label className='text-xs text-muted-foreground whitespace-nowrap'>
                Source
              </Label>
              <Select
                value={selectedSource}
                onValueChange={(v) => {
                  setSelectedSource(v || "ALL");
                }}
              >
                <SelectTrigger className='w-[150px] bg-white'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-center gap-2'>
              <Label className='text-xs text-muted-foreground whitespace-nowrap'>
                From
              </Label>
              <Input
                type='date'
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className='w-[150px]'
              />
            </div>
            <div className='flex items-center gap-2'>
              <Label className='text-xs text-muted-foreground whitespace-nowrap'>
                To
              </Label>
              <Input
                type='date'
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className='w-[150px]'
              />
            </div>
            {(dateFrom || dateTo || selectedSource !== "ALL") && (
              <Button
                variant='ghost'
                size='sm'
                className='text-xs'
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                  setSelectedSource("ALL");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedIds.size > 0 && (
        <div className='flex items-center justify-between bg-[#0F1B2D] text-white rounded-lg px-5 py-3 shadow-sm'>
          <span className='text-sm font-medium'>
            {selectedIds.size} selected
          </span>
          <div className='flex items-center gap-3'>
            <Select
              value={bulkAction}
              onValueChange={(v) => setBulkAction(v || "")}
            >
              <SelectTrigger className='w-[180px] bg-white/10 text-white border-white/20'>
                <SelectValue placeholder='Bulk action...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='confirm'>Confirm</SelectItem>
                <SelectItem value='checkin'>Check In</SelectItem>
                <SelectItem value='checkout'>Check Out</SelectItem>
                <SelectItem value='noshow'>No Show</SelectItem>
                <SelectItem value='cancel'>Cancel</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size='sm'
              variant='secondary'
              className='bg-white text-[#0F1B2D] hover:bg-white/90'
              disabled={!bulkAction || bulkProcessing}
              onClick={handleBulkAction}
            >
              {bulkProcessing ? "Processing..." : "Apply"}
            </Button>
            <Button
              size='sm'
              variant='ghost'
              className='text-white/60 hover:text-white'
              onClick={() => setSelectedIds(new Set())}
            >
              Deselect All
            </Button>
          </div>
        </div>
      )}

      <Card className='shadow-sm border-none bg-white'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-lg'>All Reservations</CardTitle>
          <span className='text-xs text-muted-foreground'>{total} total</span>
        </CardHeader>
        <CardContent className='p-0'>
          {isLoading ? (
            <div className='p-6 space-y-3'>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className='h-16 w-full' />
                ))}
            </div>
          ) : (
            <>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-10'>
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead className='hidden md:table-cell'>
                        Type
                      </TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead className='hidden sm:table-cell'>
                        Nights
                      </TableHead>
                      <TableHead className='hidden lg:table-cell'>
                        Contact
                      </TableHead>
                      <TableHead className='hidden sm:table-cell'>
                        Source
                      </TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((b) => (
                      <TableRow
                        key={b.id}
                        className={cn(
                          selectedIds.has(b.id) && "bg-[#C9973A]/5",
                        )}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(b.id)}
                            onCheckedChange={() => toggleSelect(b.id)}
                          />
                        </TableCell>
                        <TableCell className='font-medium'>
                          <div className='flex items-center gap-2'>
                            <div className='w-8 h-8 rounded-full bg-[#0F1B2D] text-[#C9973A] flex items-center justify-center text-xs font-bold shrink-0'>
                              {guestInitial(b)}
                            </div>
                            <div className='min-w-0'>
                              <p className='text-sm font-medium truncate max-w-[140px]'>
                                {guestDisplayName(b)}
                              </p>
                              <p className='text-xs text-muted-foreground font-mono'>
                                {b.id?.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='text-sm'>
                          {roomDisplay(b)}
                        </TableCell>
                        <TableCell className='text-sm text-muted-foreground hidden md:table-cell'>
                          {roomTypeDisplay(b)}
                        </TableCell>
                        <TableCell className='text-sm whitespace-nowrap'>
                          {formatDate(b.checkIn)} – {formatDate(b.checkOut)}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          <span className='text-sm font-medium'>
                            {b.nights ?? nights(b.checkIn, b.checkOut)}
                          </span>
                        </TableCell>
                        <TableCell className='hidden lg:table-cell'>
                          <div className='space-y-0.5'>
                            {b.guest?.email && (
                              <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                                <Mail className='w-3 h-3' /> {b.guest.email}
                              </span>
                            )}
                            {b.guest?.phone && (
                              <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                                <Phone className='w-3 h-3' /> {b.guest.phone}
                              </span>
                            )}
                            {!b.guest?.email && !b.guest?.phone && (
                              <span className='text-xs text-muted-foreground'>
                                —
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          <span className='text-xs text-muted-foreground'>
                            {sourceLabel(b.source)}
                          </span>
                        </TableCell>
                        <TableCell className='font-medium'>
                          {formatCurrency(b.totalPrice ?? 0)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "text-xs whitespace-nowrap",
                              STATUS_STYLES[b.status] ||
                                "bg-gray-100 text-gray-700",
                            )}
                          >
                            {(b.status || "").replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          <DropdownMenu>
                            <DropdownMenuTrigger className='h-8 w-8 p-0 hover:bg-transparent'>
                              <MoreVertical className='w-4 h-4' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem
                                onClick={() => setSelectedBooking(b)}
                              >
                                <Eye className='w-3.5 h-3.5 mr-2' /> View
                                Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setEditingBooking(b)}
                              >
                                <Pencil className='w-3.5 h-3.5 mr-2' /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAction(b.id, "confirm")}
                              >
                                <CheckCircle className='w-3.5 h-3.5 mr-2 text-green-600' />{" "}
                                Confirm
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAction(b.id, "checkin")}
                              >
                                <User className='w-3.5 h-3.5 mr-2 text-blue-600' />{" "}
                                Check In
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAction(b.id, "checkout")}
                              >
                                <Clock className='w-3.5 h-3.5 mr-2 text-orange-600' />{" "}
                                Check Out
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAction(b.id, "noshow")}
                              >
                                <XCircle className='w-3.5 h-3.5 mr-2 text-gray-600' />{" "}
                                No Show
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAction(b.id, "cancel")}
                              >
                                <XCircle className='w-3.5 h-3.5 mr-2 text-red-600' />{" "}
                                Cancel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={11}
                          className='h-32 text-center text-muted-foreground'
                        >
                          No bookings found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className='flex items-center justify-between px-6 py-4 border-t flex-wrap gap-2'>
                  <p className='text-sm text-muted-foreground'>
                    Showing {(page - 1) * PAGE_SIZE + 1}-
                    {Math.min(page * PAGE_SIZE, total)} of {total}
                  </p>
                  <div className='flex items-center gap-1'>
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <ChevronLeft className='w-4 h-4' />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (p) =>
                          p === 1 ||
                          p === totalPages ||
                          Math.abs(p - page) <= 2,
                      )
                      .map((p, idx, arr) => (
                        <span key={p} className='flex items-center gap-1'>
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className='text-muted-foreground px-1'>
                              …
                            </span>
                          )}
                          <Button
                            variant={p === page ? "default" : "outline"}
                            size='sm'
                            className={p === page ? "bg-[#0F1B2D]" : ""}
                            onClick={() => setPage(p)}
                          >
                            {p}
                          </Button>
                        </span>
                      ))}
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {selectedBooking && (
        <DetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onAction={(action) => {
            handleAction(selectedBooking.id, action);
            setSelectedBooking(null);
          }}
          guestDisplayName={guestDisplayName}
          roomDisplay={roomDisplay}
          roomTypeDisplay={roomTypeDisplay}
          guestEmail={guestEmail}
          guestPhone={guestPhone}
          sourceLabel={sourceLabel}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          formatDateTime={formatDateTime}
          nights={nights}
          STATUS_STYLES={STATUS_STYLES}
        />
      )}

      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSaved={() => {
            setEditingBooking(null);
            fetchBookings();
          }}
        />
      )}

      {showCreate && (
        <CreateBookingModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            fetchBookings();
          }}
        />
      )}
    </div>
  );
}

function DetailModal({
  booking,
  onClose,
  onAction,
  guestDisplayName,
  roomDisplay,
  roomTypeDisplay,
  guestEmail,
  guestPhone,
  sourceLabel,
  formatCurrency: fc,
  formatDate: fd,
  formatDateTime: fdt,
  nights: calcNights,
  STATUS_STYLES,
}: {
  booking: Booking;
  onClose: () => void;
  onAction: (a: string) => void;
  guestDisplayName: (b: Booking) => string;
  roomDisplay: (b: Booking) => string;
  roomTypeDisplay: (b: Booking) => string;
  guestEmail: (b: Booking) => string;
  guestPhone: (b: Booking) => string;
  sourceLabel: (s?: string) => string;
  formatCurrency: (n: number) => string;
  formatDate: (d: string) => string;
  formatDateTime: (d: string) => string;
  nights: (ci: string, co: string) => number;
  STATUS_STYLES: Record<string, string>;
}) {
  const br = booking.bookingRooms || [];

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between p-5 border-b'>
          <div>
            <h2 className='font-semibold text-[#0F1B2D]'>Booking Details</h2>
            <p className='text-xs text-muted-foreground font-mono'>
              {booking.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 text-xl leading-none'
          >
            &times;
          </button>
        </div>

        <div className='p-5 space-y-6'>
          <div className='flex items-center gap-4'>
            <div className='w-14 h-14 rounded-full bg-[#0F1B2D] text-[#C9973A] flex items-center justify-center text-xl font-bold shrink-0'>
              {guestDisplayName(booking)[0] || "G"}
            </div>
            <div className='min-w-0'>
              <h3 className='text-lg font-bold text-[#0F1B2D]'>
                {guestDisplayName(booking)}
              </h3>
              <div className='flex items-center gap-3 text-sm text-muted-foreground flex-wrap'>
                {booking.guest?.email && (
                  <span className='flex items-center gap-1'>
                    <Mail className='w-3 h-3' /> {booking.guest.email}
                  </span>
                )}
                {booking.guest?.phone && (
                  <span className='flex items-center gap-1'>
                    <Phone className='w-3 h-3' /> {booking.guest.phone}
                  </span>
                )}
              </div>
              <Badge
                className={cn(
                  "text-xs mt-1",
                  STATUS_STYLES[booking.status] || "bg-gray-100",
                )}
              >
                {(booking.status || "").replace("_", " ")}
              </Badge>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-x-6 gap-y-3 text-sm'>
            <div>
              <span className='text-muted-foreground'>Check In</span>
              <p className='font-medium'>{fd(booking.checkIn)}</p>
            </div>
            <div>
              <span className='text-muted-foreground'>Check Out</span>
              <p className='font-medium'>{fd(booking.checkOut)}</p>
            </div>
            <div>
              <span className='text-muted-foreground'>Nights</span>
              <p className='font-medium'>
                {booking.nights ??
                  calcNights(booking.checkIn, booking.checkOut)}
              </p>
            </div>
            <div>
              <span className='text-muted-foreground'>Total</span>
              <p className='font-medium'>{fc(booking.totalPrice ?? 0)}</p>
            </div>
            <div>
              <span className='text-muted-foreground'>Source</span>
              <p className='font-medium'>{sourceLabel(booking.source)}</p>
            </div>
            <div>
              <span className='text-muted-foreground'>Created</span>
              <p className='font-medium'>{fdt(booking.createdAt)}</p>
            </div>
          </div>

          {br.length > 0 && (
            <div>
              <h4 className='text-sm font-semibold text-[#0F1B2D] mb-2 flex items-center gap-2'>
                <Bed className='w-4 h-4' /> Rooms
              </h4>
              <div className='space-y-2'>
                {br.map((r) => (
                  <div
                    key={r.id || r.roomId}
                    className='flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 text-sm'
                  >
                    <div>
                      <span className='font-medium'>
                        Room {r.room?.roomNumber || "—"}
                      </span>
                      {r.room?.roomType?.name && (
                        <span className='text-muted-foreground ml-2'>
                          ({r.room.roomType.name})
                        </span>
                      )}
                    </div>
                    <span className='font-medium'>{fc(r.price ?? 0)}</span>
                  </div>
                ))}
                {br.length > 1 && (
                  <div className='flex items-center justify-between px-4 py-2 text-sm font-semibold border-t'>
                    <span>Total</span>
                    <span>{fc(booking.totalPrice ?? 0)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {booking.notes && (
            <div>
              <h4 className='text-sm font-semibold text-[#0F1B2D] mb-1'>
                Notes
              </h4>
              <p className='text-sm text-gray-600 bg-gray-50 rounded-lg p-3'>
                {booking.notes}
              </p>
            </div>
          )}

          <div className='flex gap-2 pt-2 border-t'>
            {booking.status === "pending" && (
              <Button
                className='flex-1 bg-green-600 hover:bg-green-700 text-white'
                onClick={() => onAction("confirm")}
              >
                <CheckCircle className='w-4 h-4 mr-1' /> Confirm
              </Button>
            )}
            {(booking.status === "confirmed" ||
              booking.status === "pending") && (
              <>
                <Button
                  className='flex-1 bg-blue-600 hover:bg-blue-700 text-white'
                  onClick={() => onAction("checkin")}
                >
                  <User className='w-4 h-4 mr-1' /> Check In
                </Button>
                <Button
                  variant='outline'
                  className='flex-1 text-red-600 border-red-200 hover:bg-red-50'
                  onClick={() => onAction("cancel")}
                >
                  <XCircle className='w-4 h-4 mr-1' /> Cancel
                </Button>
              </>
            )}
            {booking.status === "checked_in" && (
              <Button
                className='flex-1 bg-orange-600 hover:bg-orange-700 text-white'
                onClick={() => onAction("checkout")}
              >
                <Clock className='w-4 h-4 mr-1' /> Check Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateBookingModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [step, setStep] = useState(1);
  const [creating, setCreating] = useState(false);
  const [guestMode, setGuestMode] = useState<"search" | "create">("search");

  const [guestSearch, setGuestSearch] = useState("");
  const [guests, setGuests] = useState<any[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [searchingGuests, setSearchingGuests] = useState(false);

  const [newGuest, setNewGuest] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [notes, setNotes] = useState("");
  const [pricePreview, setPricePreview] = useState<{
    total: number;
    nights: number;
    rooms: {
      roomId: string;
      roomNumber: string;
      roomType?: { id: string; name: string } | null;
      total: number;
      nights: { date: string; price: number }[];
    }[];
  } | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  const today = startOfDay(new Date());

  const searchGuests = async (q: string) => {
    if (!q.trim()) return;
    try {
      setSearchingGuests(true);
      const res = await api.get(
        `hotel/guests?search=${encodeURIComponent(q)}&limit=10`,
      );
      setGuests(res.data || res.items || []);
    } catch {
      setGuests([]);
    } finally {
      setSearchingGuests(false);
    }
  };

  useEffect(() => {
    if (guestSearch.length >= 2) {
      const timer = setTimeout(() => searchGuests(guestSearch), 300);
      return () => clearTimeout(timer);
    }
    setGuests([]);
  }, [guestSearch]);

  // Fetch booked dates for the next 6 months to disable in calendar
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const start = format(today, "yyyy-MM-dd");
        const end = format(addDays(today, 180), "yyyy-MM-dd");
        const res = await api.get(
          `hotel/rooms/booked-dates?startDate=${start}&endDate=${end}`,
        );
        const dates: string[] = res.data || res || [];
        setBookedDates(dates.map((d) => startOfDay(new Date(d))));
      } catch {
        // non-critical, just don't disable anything
      }
    };
    fetchBookedDates();
  }, []);

  useEffect(() => {
    if (checkIn && checkOut) {
      setRooms([]); // Clear rooms to show loading state
      fetchAvailableRooms();
    }
  }, [checkIn, checkOut]);

  const fetchAvailableRooms = async () => {
    if (!checkIn || !checkOut) return;
    try {
      setLoadingRooms(true);
      const params = new URLSearchParams({
        status: "available",
        dateFrom: format(checkIn, "yyyy-MM-dd"),
        dateTo: format(checkOut, "yyyy-MM-dd"),
      });
      const res = await api.get(`hotel/rooms?${params.toString()}`);
      setRooms(res.data || res.items || []);
    } catch {
      setRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  };

  const toggleRoom = (id: string) => {
    setSelectedRoomIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const totalNights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000),
        )
      : 0;

  const handleCreate = async () => {
    try {
      setCreating(true);
      let guestId = selectedGuest?.id;

      if (!guestId && newGuest.firstName) {
        const created = await api.post("hotel/guests", {
          firstName: newGuest.firstName,
          lastName: newGuest.lastName,
          email: newGuest.email || undefined,
          phone: newGuest.phone || undefined,
        });
        guestId = created.data?.id || created.id;
        if (!guestId) throw new Error("Failed to create guest");
      }

      await api.post("hotel/bookings", {
        guestId,
        roomIds: selectedRoomIds,
        checkIn: format(checkIn!, "yyyy-MM-dd"),
        checkOut: format(checkOut!, "yyyy-MM-dd"),
        idempotencyKey: `booking-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        metadata: { notes, source: "direct", createdBy: "admin" },
      });
      toast.success("Booking created successfully");
      onCreated();
    } catch (err: any) {
      toast.error("Failed to create booking: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  const canProceedStep1 =
    guestMode === "search" ? !!selectedGuest : !!newGuest.firstName;
  const canProceedStep2 =
    selectedRoomIds.length > 0 && !!checkIn && !!checkOut && checkOut > checkIn;

  const switchMode = (mode: "search" | "create") => {
    setGuestMode(mode);
    setSelectedGuest(null);
    setGuestSearch("");
    setGuests([]);
    setNewGuest({ firstName: "", lastName: "", email: "", phone: "" });
  };

  const goToStep = async (target: number) => {
    if (target === 2 && !canProceedStep1) {
      toast.error("Please select or enter a guest first");
      return;
    }
    if (target === 3 && (!canProceedStep1 || !canProceedStep2)) {
      toast.error("Please complete all required fields");
      return;
    }
    if (target === 3) {
      try {
        setLoadingPrice(true);
        const res = await api.post("hotel/bookings/calculate-price", {
          roomIds: selectedRoomIds,
          checkIn: format(checkIn!, "yyyy-MM-dd"),
          checkOut: format(checkOut!, "yyyy-MM-dd"),
        });
        setPricePreview(res.data || res);
      } catch {
        setPricePreview(null);
      } finally {
        setLoadingPrice(false);
      }
    }
    setStep(target);
  };

  const isDateDisabled = (date: Date) =>
    isBefore(date, today) ||
    bookedDates.some((d) => d.getTime() === date.getTime());

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between p-5 border-b'>
          <h2 className='font-semibold text-[#0F1B2D]'>New Booking</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 text-xl leading-none'
          >
            &times;
          </button>
        </div>

        <div className='flex gap-1 bg-gray-100 rounded-lg mx-5 mt-5 p-1'>
          {[
            { n: 1, label: "1. Guest" },
            { n: 2, label: "2. Room & Dates" },
            { n: 3, label: "3. Review" },
          ].map(({ n, label }) => (
            <button
              key={n}
              onClick={() => goToStep(n)}
              className={cn(
                "flex-1 px-3 py-2 rounded-md text-sm font-medium transition",
                step === n
                  ? "bg-white shadow-sm text-[#0F1B2D]"
                  : "text-gray-500 hover:text-gray-700",
                n > step && "cursor-not-allowed opacity-60",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className='p-5 space-y-4'>
          {step === 1 && (
            <>
              <div className='flex gap-1 bg-gray-100 rounded-lg p-1'>
                <button
                  onClick={() => switchMode("search")}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-md text-sm font-medium transition",
                    guestMode === "search"
                      ? "bg-white shadow-sm text-[#0F1B2D]"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  Search Existing
                </button>
                <button
                  onClick={() => switchMode("create")}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-md text-sm font-medium transition",
                    guestMode === "create"
                      ? "bg-white shadow-sm text-[#0F1B2D]"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  New Guest
                </button>
              </div>

              {guestMode === "search" ? (
                <>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                    <Input
                      placeholder='Search by name, email, or phone...'
                      value={guestSearch}
                      onChange={(e) => setGuestSearch(e.target.value)}
                      className='pl-10'
                    />
                  </div>

                  {searchingGuests && (
                    <div className='space-y-2'>
                      {Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className='h-14 w-full' />
                        ))}
                    </div>
                  )}

                  {!searchingGuests && guests.length > 0 && (
                    <div className='space-y-1 max-h-52 overflow-y-auto border rounded-lg'>
                      {guests.map((g: any) => (
                        <button
                          key={g.id}
                          onClick={() => {
                            setSelectedGuest(g);
                            setGuestSearch(
                              `${g.firstName || ""} ${g.lastName || ""}`,
                            );
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-gray-50 transition",
                            selectedGuest?.id === g.id && "bg-[#C9973A]/5",
                          )}
                        >
                          <div className='w-9 h-9 rounded-full bg-[#0F1B2D] text-[#C9973A] flex items-center justify-center text-sm font-bold shrink-0'>
                            {(g.firstName?.[0] || "G").toUpperCase()}
                          </div>
                          <div className='min-w-0 flex-1'>
                            <p className='font-medium'>
                              {g.firstName} {g.lastName}
                            </p>
                            <p className='text-xs text-muted-foreground'>
                              {g.email}
                            </p>
                          </div>
                          {g.phone && (
                            <span className='text-xs text-muted-foreground shrink-0'>
                              {g.phone}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedGuest && (
                    <div className='bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3'>
                      <CheckCircle className='w-5 h-5 text-green-600 shrink-0' />
                      <div className='text-sm'>
                        <span className='font-medium'>
                          {selectedGuest.firstName} {selectedGuest.lastName}
                        </span>
                        <span className='text-muted-foreground'>
                          {" "}
                          — {selectedGuest.email}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className='space-y-3'>
                  <p className='text-sm text-muted-foreground'>
                    Enter the guest details to create a new profile.
                  </p>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='space-y-1.5'>
                      <Label>First Name *</Label>
                      <Input
                        value={newGuest.firstName}
                        onChange={(e) =>
                          setNewGuest({
                            ...newGuest,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className='space-y-1.5'>
                      <Label>Last Name</Label>
                      <Input
                        value={newGuest.lastName}
                        onChange={(e) =>
                          setNewGuest({ ...newGuest, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className='space-y-1.5'>
                    <Label>Email</Label>
                    <Input
                      type='email'
                      value={newGuest.email}
                      onChange={(e) =>
                        setNewGuest({ ...newGuest, email: e.target.value })
                      }
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <Label>Phone</Label>
                    <Input
                      value={newGuest.phone}
                      onChange={(e) =>
                        setNewGuest({ ...newGuest, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              <div className='flex gap-3 pt-2'>
                <Button variant='outline' className='flex-1' onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  className='flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]'
                  disabled={!canProceedStep1}
                  onClick={() => setStep(2)}
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <Label>Check-in *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkIn && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {checkIn
                          ? format(checkIn, "MMM d, yyyy")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={checkIn}
                        onSelect={(date) => {
                          setCheckIn(date);
                          if (date && checkOut && checkOut <= date)
                            setCheckOut(undefined);
                          setSelectedRoomIds([]);
                        }}
                        disabled={isDateDisabled}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className='space-y-1.5'>
                  <Label>Check-out *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOut && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {checkOut
                          ? format(checkOut, "MMM d, yyyy")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={checkOut}
                        onSelect={(date) => {
                          setCheckOut(date);
                          setSelectedRoomIds([]);
                        }}
                        disabled={(date) =>
                          !checkIn || date <= checkIn || isDateDisabled(date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {checkIn && checkOut && (
                <p className='text-sm text-muted-foreground'>
                  {totalNights} {totalNights === 1 ? "night" : "nights"} stay
                </p>
              )}

              <div>
                <Label className='mb-1.5 block'>Select Rooms *</Label>
                {!checkIn || !checkOut ? (
                  <div className='text-center py-8 text-muted-foreground border rounded-lg'>
                    <Bed className='w-8 h-8 mx-auto mb-2 opacity-40' />
                    <p className='text-sm'>
                      Select dates first to see available rooms
                    </p>
                  </div>
                ) : loadingRooms ? (
                  <div className='space-y-2'>
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className='h-12 w-full' />
                      ))}
                  </div>
                ) : rooms.length > 0 ? (
                  <div className='space-y-1 max-h-52 overflow-y-auto border rounded-lg'>
                    {rooms.map((r: any) => {
                      const price =
                        r.effectivePrice ??
                        r.basePrice ??
                        r.roomType?.basePrice ??
                        0;
                      return (
                        <button
                          key={r.id}
                          onClick={() => toggleRoom(r.id)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-gray-50 transition",
                            selectedRoomIds.includes(r.id) && "bg-[#C9973A]/5",
                          )}
                        >
                          <div className='flex items-center gap-3'>
                            <Checkbox
                              checked={selectedRoomIds.includes(r.id)}
                              onCheckedChange={() => toggleRoom(r.id)}
                            />
                            <div>
                              <p className='font-medium'>Room {r.roomNumber}</p>
                              <p className='text-xs text-muted-foreground'>
                                {r.roomType?.name || "Standard"} · Floor{" "}
                                {r.floor || "—"}
                              </p>
                            </div>
                          </div>
                          <span className='font-medium text-sm'>
                            {formatCurrency(Number(price))}{" "}
                            <span className='text-xs text-muted-foreground font-normal'>
                              /night
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className='text-center py-8 text-muted-foreground border rounded-lg'>
                    <Bed className='w-8 h-8 mx-auto mb-2 opacity-40' />
                    <p className='text-sm'>
                      No available rooms for the selected dates
                    </p>
                  </div>
                )}
              </div>

              <div className='space-y-1.5'>
                <Label>Notes (optional)</Label>
                <Input
                  placeholder='Special requests, notes...'
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className='flex gap-3 pt-2'>
                <Button
                  variant='outline'
                  className='flex-1'
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  className='flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]'
                  disabled={!canProceedStep2}
                  onClick={() => goToStep(3)}
                >
                  Review
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className='space-y-3'>
                <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                  <div className='w-10 h-10 rounded-full bg-[#0F1B2D] text-[#C9973A] flex items-center justify-center font-bold'>
                    {(guestMode === "create"
                      ? newGuest.firstName?.[0] || "G"
                      : selectedGuest?.firstName?.[0] || "G"
                    ).toUpperCase()}
                  </div>
                  <div>
                    <p className='font-medium text-sm'>
                      {guestMode === "create"
                        ? `${newGuest.firstName} ${newGuest.lastName}`.trim()
                        : `${selectedGuest?.firstName || ""} ${selectedGuest?.lastName || ""}`.trim()}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {guestMode === "create"
                        ? newGuest.email || "—"
                        : selectedGuest?.email || "—"}
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3 text-sm bg-gray-50 rounded-lg p-3'>
                  <div>
                    <span className='text-muted-foreground'>Check In</span>
                    <p className='font-medium'>
                      {checkIn ? format(checkIn, "MMM d, yyyy") : "—"}
                    </p>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Check Out</span>
                    <p className='font-medium'>
                      {checkOut ? format(checkOut, "MMM d, yyyy") : "—"}
                    </p>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Nights</span>
                    <p className='font-medium'>{totalNights}</p>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Rooms</span>
                    <p className='font-medium'>{selectedRoomIds.length}</p>
                  </div>
                </div>

                {selectedRoomIds.length > 0 && (
                  <div>
                    <p className='text-xs font-medium text-muted-foreground uppercase mb-1'>
                      Price Breakdown
                    </p>
                    {loadingPrice ? (
                      <div className='space-y-1'>
                        <Skeleton className='h-10 w-full' />
                        <Skeleton className='h-10 w-full' />
                      </div>
                    ) : pricePreview ? (
                      <div className='space-y-1'>
                        {pricePreview.rooms.map((r) => (
                          <div
                            key={r.roomId}
                            className='flex items-center justify-between text-sm px-3 py-2 bg-gray-50 rounded-lg'
                          >
                            <span>
                              Room {r.roomNumber}{" "}
                              <span className='text-muted-foreground'>
                                ({r.roomType?.name || "Standard"})
                              </span>{" "}
                              <span className='text-muted-foreground'>
                                ({pricePreview.nights} night
                                {pricePreview.nights !== 1 ? "s" : ""})
                              </span>
                            </span>
                            <span className='font-medium'>
                              {formatCurrency(r.total)}
                            </span>
                          </div>
                        ))}
                        <div className='flex items-center justify-between text-sm font-semibold px-3 py-2 mt-1 border-t'>
                          <span>Total (rates & promotions applied)</span>
                          <span className='text-[#C9973A]'>
                            {formatCurrency(pricePreview.total)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className='space-y-1'>
                        {rooms
                          .filter((r) => selectedRoomIds.includes(r.id))
                          .map((r) => {
                            const price =
                              r.effectivePrice ??
                              r.basePrice ??
                              r.roomType?.basePrice ??
                              0;
                            return (
                              <div
                                key={r.id}
                                className='flex items-center justify-between text-sm px-3 py-2 bg-gray-50 rounded-lg'
                              >
                                <span>
                                  Room {r.roomNumber}{" "}
                                  <span className='text-muted-foreground'>
                                    ({r.roomType?.name || "Standard"})
                                  </span>
                                </span>
                                <span className='font-medium'>
                                  {formatCurrency(Number(price))}
                                  <span className='text-xs text-muted-foreground font-normal'>
                                    /night
                                  </span>
                                </span>
                              </div>
                            );
                          })}
                        <div className='flex items-center justify-between text-sm font-semibold px-3 py-2 mt-1 border-t'>
                          <span>Estimated Total</span>
                          <span className='text-[#C9973A]'>
                            {formatCurrency(
                              rooms
                                .filter((r) => selectedRoomIds.includes(r.id))
                                .reduce(
                                  (sum, r) =>
                                    sum +
                                    Number(
                                      r.effectivePrice ??
                                        r.basePrice ??
                                        r.roomType?.basePrice ??
                                        0,
                                    ) *
                                      totalNights,
                                  0,
                                ),
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {notes && (
                  <div>
                    <p className='text-xs font-medium text-muted-foreground uppercase mb-1'>
                      Notes
                    </p>
                    <p className='text-sm bg-gray-50 rounded-lg p-3'>{notes}</p>
                  </div>
                )}
              </div>

              <div className='flex gap-3 pt-2'>
                <Button
                  variant='outline'
                  className='flex-1'
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  className='flex-1 bg-[#C9973A] hover:bg-[#b8892e] text-white'
                  disabled={!canProceedStep2 || creating}
                  onClick={handleCreate}
                >
                  {creating ? "Creating..." : "Create Booking"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EditBookingModal({
  booking,
  onClose,
  onSaved,
}: {
  booking: Booking;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    booking.checkIn ? new Date(booking.checkIn) : undefined,
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    booking.checkOut ? new Date(booking.checkOut) : undefined,
  );
  const [source, setSource] = useState(booking.source ?? "direct");
  const [notes, setNotes] = useState(booking.notes ?? "");
  const [rooms, setRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>(
    () => booking.bookingRooms?.map((br) => br.roomId).filter(Boolean) ?? [],
  );
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [saving, setSaving] = useState(false);

  const today = startOfDay(new Date());

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const start = format(today, "yyyy-MM-dd");
        const end = format(addDays(today, 180), "yyyy-MM-dd");
        const res = await api.get(
          `hotel/rooms/booked-dates?startDate=${start}&endDate=${end}`,
        );
        const dates: string[] = res.data || res || [];
        setBookedDates(dates.map((d) => startOfDay(new Date(d))));
      } catch {
        // non-critical
      }
    };
    fetchBookedDates();
  }, []);

  useEffect(() => {
    if (checkIn && checkOut) {
      fetchAvailableRooms();
    }
  }, [checkIn, checkOut]);

  const fetchAvailableRooms = async () => {
    if (!checkIn || !checkOut) return;
    try {
      setLoadingRooms(true);
      const params = new URLSearchParams({
        status: "available",
        dateFrom: format(checkIn, "yyyy-MM-dd"),
        dateTo: format(checkOut, "yyyy-MM-dd"),
      });
      const res = await api.get(`hotel/rooms?${params.toString()}`);
      setRooms(res.data || res.items || []);
    } catch {
      setRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  };

  const toggleRoom = (id: string) => {
    setSelectedRoomIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const isDateDisabled = (date: Date) =>
    isBefore(date, today) ||
    bookedDates.some((d) => d.getTime() === date.getTime());

  const totalNights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000),
        )
      : 0;

  const handleSave = async () => {
    try {
      setSaving(true);
      const body: Record<string, any> = { notes, source };
      if (checkIn) body.checkIn = format(checkIn, "yyyy-MM-dd");
      if (checkOut) body.checkOut = format(checkOut, "yyyy-MM-dd");
      if (selectedRoomIds.length > 0) body.roomIds = selectedRoomIds;
      await api.patch(`hotel/bookings/${booking.id}`, body);
      toast.success("Booking updated");
      onSaved();
    } catch (err: any) {
      toast.error("Failed to update: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between p-5 border-b'>
          <div>
            <h2 className='font-semibold text-[#0F1B2D]'>Edit Booking</h2>
            <p className='text-xs text-muted-foreground font-mono'>
              {booking.id?.slice(0, 8)}
            </p>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 text-xl leading-none'
          >
            &times;
          </button>
        </div>

        <div className='p-5 space-y-5'>
          {/* Guest info (read-only) */}
          <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
            <div className='w-10 h-10 rounded-full bg-[#0F1B2D] text-[#C9973A] flex items-center justify-center font-bold shrink-0'>
              {booking.guest?.firstName?.[0] || "G"}
            </div>
            <div className='min-w-0'>
              <p className='font-medium text-sm'>
                {booking.guest?.firstName || ""} {booking.guest?.lastName || ""}
              </p>
              <p className='text-xs text-muted-foreground'>
                {booking.guest?.email || "—"}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <Label>Check-in *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkIn && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {checkIn ? format(checkIn, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={checkIn}
                    onSelect={(date) => {
                      setCheckIn(date);
                      if (date && checkOut && checkOut <= date)
                        setCheckOut(undefined);
                    }}
                    disabled={isDateDisabled}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className='space-y-1.5'>
              <Label>Check-out *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkOut && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {checkOut ? format(checkOut, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={checkOut}
                    onSelect={(date) => setCheckOut(date)}
                    disabled={(date) =>
                      !checkIn || date <= checkIn || isDateDisabled(date)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {checkIn && checkOut && (
            <p className='text-sm text-muted-foreground -mt-3'>
              {totalNights} {totalNights === 1 ? "night" : "nights"} stay
            </p>
          )}

          {/* Rooms */}
          <div>
            <Label className='mb-1.5 block'>Select Rooms *</Label>
            {!checkIn || !checkOut ? (
              <div className='text-center py-8 text-muted-foreground border rounded-lg'>
                <Bed className='w-8 h-8 mx-auto mb-2 opacity-40' />
                <p className='text-sm'>
                  Select dates first to see available rooms
                </p>
              </div>
            ) : loadingRooms ? (
              <div className='space-y-2'>
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className='h-12 w-full' />
                  ))}
              </div>
            ) : rooms.length > 0 ? (
              <div className='space-y-1 max-h-52 overflow-y-auto border rounded-lg'>
                {rooms.map((r: any) => {
                  const price =
                    r.effectivePrice ??
                    r.basePrice ??
                    r.roomType?.basePrice ??
                    0;
                  return (
                    <button
                      key={r.id}
                      onClick={() => toggleRoom(r.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-gray-50 transition",
                        selectedRoomIds.includes(r.id) && "bg-[#C9973A]/5",
                      )}
                    >
                      <div className='flex items-center gap-3'>
                        <Checkbox
                          checked={selectedRoomIds.includes(r.id)}
                          onCheckedChange={() => toggleRoom(r.id)}
                        />
                        <div>
                          <p className='font-medium'>Room {r.roomNumber}</p>
                          <p className='text-xs text-muted-foreground'>
                            {r.roomType?.name || "Standard"} · Floor{" "}
                            {r.floor || "—"}
                          </p>
                        </div>
                      </div>
                      <span className='font-medium text-sm'>
                        {formatCurrency(Number(price))}{" "}
                        <span className='text-xs text-muted-foreground font-normal'>
                          /night
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className='text-center py-8 text-muted-foreground border rounded-lg'>
                <Bed className='w-8 h-8 mx-auto mb-2 opacity-40' />
                <p className='text-sm'>
                  No available rooms for the selected dates
                </p>
              </div>
            )}
          </div>

          {/* Source */}
          <div className='space-y-1.5'>
            <Label>Source</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_OPTIONS.filter((o) => o.value !== "ALL").map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className='space-y-1.5'>
            <Label>Notes</Label>
            <textarea
              className='w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0F1B2D]/20'
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder='Special requests, notes...'
            />
          </div>

          {/* Actions */}
          <div className='flex gap-3 pt-2'>
            <Button variant='outline' className='flex-1' onClick={onClose}>
              Cancel
            </Button>
            <Button
              className='flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]'
              disabled={saving || selectedRoomIds.length === 0}
              onClick={handleSave}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
