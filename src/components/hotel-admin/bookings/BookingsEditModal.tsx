import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Bed } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { format, isBefore, startOfDay, addDays } from 'date-fns';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { SOURCE_OPTIONS, Booking } from './types';

interface BookingsEditModalProps {
  booking: Booking;
  onClose: () => void;
  onSaved: () => void;
}

export function BookingsEditModal({ booking, onClose, onSaved }: BookingsEditModalProps) {
  const [checkIn, setCheckIn] = useState<Date | undefined>(booking.checkIn ? new Date(booking.checkIn) : undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(booking.checkOut ? new Date(booking.checkOut) : undefined);
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
        const res = await api.get(`hotel/rooms/booked-dates?startDate=${start}&endDate=${end}`);
        const dates: string[] = res.data || res || [];
        setBookedDates(dates.map((d) => {
          const [y, m, day] = d.split('-').map(Number);
          return startOfDay(new Date(y, m - 1, day));
        }));
      } catch { }
    };
    fetchBookedDates();
  }, []);

  useEffect(() => {
    if (checkIn && checkOut) fetchAvailableRooms();
  }, [checkIn, checkOut]);

  const fetchAvailableRooms = async () => {
    if (!checkIn || !checkOut) return;
    try {
      setLoadingRooms(true);
      const params = new URLSearchParams({ status: "available", dateFrom: format(checkIn, "yyyy-MM-dd"), dateTo: format(checkOut, "yyyy-MM-dd") });
      const res = await api.get(`hotel/rooms?${params.toString()}`);
      setRooms(res.data || res.items || []);
    } catch { setRooms([]); } finally { setLoadingRooms(false); }
  };

  const toggleRoom = (id: string) => {
    setSelectedRoomIds((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
  };

  const isDateDisabled = (date: Date) =>
    isBefore(date, today) || bookedDates.some((d) => d.getTime() === date.getTime());

  const totalNights = checkIn && checkOut
    ? Math.max(0, Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000))
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
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="font-semibold text-[#0F1B2D]">Edit Booking</h2>
            <p className="text-xs text-muted-foreground font-mono">{booking.id?.slice(0, 8)}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-[#0F1B2D] text-[#C9973A] flex items-center justify-center font-bold shrink-0">
              {booking.guest?.firstName?.[0] || "G"}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm">{booking.guest?.firstName || ""} {booking.guest?.lastName || ""}</p>
              <p className="text-xs text-muted-foreground">{booking.guest?.email || "—"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Check-in *</Label>
              <Popover>
                <PopoverTrigger>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !checkIn && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkIn ? format(checkIn, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={checkIn}
                    onSelect={(date) => { setCheckIn(date); if (date && checkOut && checkOut <= date) setCheckOut(undefined); }}
                    disabled={isDateDisabled} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label>Check-out *</Label>
              <Popover>
                <PopoverTrigger>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !checkOut && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOut ? format(checkOut, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={checkOut} onSelect={(date) => setCheckOut(date)}
                    disabled={(date) => !checkIn || date <= checkIn || isDateDisabled(date)} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {checkIn && checkOut && (
            <p className="text-sm text-muted-foreground -mt-3">{totalNights} {totalNights === 1 ? "night" : "nights"} stay</p>
          )}

          <div>
            <Label className="mb-1.5 block">Select Rooms *</Label>
            {!checkIn || !checkOut ? (
              <div className="text-center py-8 text-muted-foreground border rounded-lg">
                <Bed className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Select dates first to see available rooms</p>
              </div>
            ) : loadingRooms ? (
              <div className="space-y-2">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : rooms.length > 0 ? (
              <div className="space-y-1 max-h-52 overflow-y-auto border rounded-lg">
                {rooms.map((r: any) => {
                  const price = r.effectivePrice ?? r.basePrice ?? r.roomType?.basePrice ?? 0;
                  return (
                    <button key={r.id} onClick={() => toggleRoom(r.id)}
                      className={cn("w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-gray-50 transition",
                        selectedRoomIds.includes(r.id) && "bg-[#C9973A]/5")}>
                      <div className="flex items-center gap-3">
                        <Checkbox checked={selectedRoomIds.includes(r.id)} onCheckedChange={() => toggleRoom(r.id)} />
                        <div>
                          <p className="font-medium">Room {r.roomNumber}</p>
                          <p className="text-xs text-muted-foreground">{r.roomType?.name || "Standard"} · Floor {r.floor || "—"}</p>
                        </div>
                      </div>
                      <span className="font-medium text-sm">{formatCurrency(Number(price))} <span className="text-xs text-muted-foreground font-normal">/night</span></span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border rounded-lg">
                <Bed className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No available rooms for the selected dates</p>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Source</Label>
            <Select value={source} onValueChange={(v) => setSource(v ?? '')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SOURCE_OPTIONS.filter((o) => o.value !== "ALL").map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <textarea className="w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0F1B2D]/20"
              rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special requests, notes..." />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]" disabled={saving || selectedRoomIds.length === 0} onClick={handleSave}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
