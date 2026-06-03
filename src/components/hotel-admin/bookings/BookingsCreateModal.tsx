import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Calendar as CalendarIcon, Bed, CheckCircle } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { format, isBefore, startOfDay, addDays } from 'date-fns';

interface BookingsCreateModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export function BookingsCreateModal({ onClose, onCreated }: BookingsCreateModalProps) {
  const [step, setStep] = useState(1);
  const [creating, setCreating] = useState(false);
  const [guestMode, setGuestMode] = useState<"search" | "create">("search");

  const [guestSearch, setGuestSearch] = useState("");
  const [guests, setGuests] = useState<any[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [searchingGuests, setSearchingGuests] = useState(false);

  const [newGuest, setNewGuest] = useState({ firstName: "", lastName: "", email: "", phone: "" });

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
    rooms: { roomId: string; roomNumber: string; roomType?: { id: string; name: string } | null; total: number; nights: { date: string; price: number }[] }[];
  } | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  const today = startOfDay(new Date());

  const searchGuests = async (q: string) => {
    if (!q.trim()) return;
    try {
      setSearchingGuests(true);
      const res = await api.get(`hotel/guests?search=${encodeURIComponent(q)}&limit=10`);
      setGuests(res.data || res.items || []);
    } catch { setGuests([]); } finally { setSearchingGuests(false); }
  };

  useEffect(() => {
    if (guestSearch.length >= 2) {
      const timer = setTimeout(() => searchGuests(guestSearch), 300);
      return () => clearTimeout(timer);
    }
    setGuests([]);
  }, [guestSearch]);

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
    if (checkIn && checkOut) {
      setRooms([]);
      fetchAvailableRooms();
    }
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

  const totalNights = checkIn && checkOut
    ? Math.max(0, Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000))
    : 0;

  const handleCreate = async () => {
    try {
      setCreating(true);
      let guestId = selectedGuest?.id;
      if (!guestId && newGuest.firstName) {
        const created = await api.post("hotel/guests", {
          firstName: newGuest.firstName, lastName: newGuest.lastName,
          email: newGuest.email || undefined, phone: newGuest.phone || undefined,
        });
        guestId = created.data?.id || created.id;
        if (!guestId) throw new Error("Failed to create guest");
      }
      await api.post("hotel/bookings", {
        guestId, roomIds: selectedRoomIds,
        checkIn: format(checkIn!, "yyyy-MM-dd"), checkOut: format(checkOut!, "yyyy-MM-dd"),
        idempotencyKey: `booking-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        metadata: { notes, source: "direct", createdBy: "admin" },
      });
      toast.success("Booking created successfully");
      onCreated();
    } catch (err: any) {
      toast.error("Failed to create booking: " + err.message);
    } finally { setCreating(false); }
  };

  const canProceedStep1 = guestMode === "search" ? !!selectedGuest : !!newGuest.firstName;
  const canProceedStep2 = selectedRoomIds.length > 0 && !!checkIn && !!checkOut && checkOut > checkIn;

  const switchMode = (mode: "search" | "create") => {
    setGuestMode(mode);
    setSelectedGuest(null);
    setGuestSearch("");
    setGuests([]);
    setNewGuest({ firstName: "", lastName: "", email: "", phone: "" });
  };

  const goToStep = async (target: number) => {
    if (target === 2 && !canProceedStep1) { toast.error("Please select or enter a guest first"); return; }
    if (target === 3 && (!canProceedStep1 || !canProceedStep2)) { toast.error("Please complete all required fields"); return; }
    if (target === 3) {
      try {
        setLoadingPrice(true);
        const res = await api.post("hotel/bookings/calculate-price", {
          roomIds: selectedRoomIds, checkIn: format(checkIn!, "yyyy-MM-dd"), checkOut: format(checkOut!, "yyyy-MM-dd"),
        });
        setPricePreview(res.data || res);
      } catch { setPricePreview(null); } finally { setLoadingPrice(false); }
    }
    setStep(target);
  };

  const isDateDisabled = (date: Date) =>
    isBefore(date, today) || bookedDates.some((d) => d.getTime() === date.getTime());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-[#0F1B2D]">New Booking</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-lg mx-5 mt-5 p-1">
          {[{ n: 1, label: "1. Guest" }, { n: 2, label: "2. Room & Dates" }, { n: 3, label: "3. Review" }].map(({ n, label }) => (
            <button key={n} onClick={() => goToStep(n)}
              className={cn("flex-1 px-3 py-2 rounded-md text-sm font-medium transition",
                step === n ? "bg-white shadow-sm text-[#0F1B2D]" : "text-gray-500 hover:text-gray-700",
                n > step && "cursor-not-allowed opacity-60")}>{label}</button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {step === 1 && (
            <>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <button onClick={() => switchMode("search")}
                  className={cn("flex-1 px-3 py-2 rounded-md text-sm font-medium transition",
                    guestMode === "search" ? "bg-white shadow-sm text-[#0F1B2D]" : "text-gray-500 hover:text-gray-700")}>
                  Search Existing</button>
                <button onClick={() => switchMode("create")}
                  className={cn("flex-1 px-3 py-2 rounded-md text-sm font-medium transition",
                    guestMode === "create" ? "bg-white shadow-sm text-[#0F1B2D]" : "text-gray-500 hover:text-gray-700")}>
                  New Guest</button>
              </div>

              {guestMode === "search" ? (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search by name, email, or phone..." value={guestSearch}
                      onChange={(e) => setGuestSearch(e.target.value)} className="pl-10" />
                  </div>
                  {searchingGuests && <div className="space-y-2">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>}
                  {!searchingGuests && guests.length > 0 && (
                    <div className="space-y-1 max-h-52 overflow-y-auto border rounded-lg">
                      {guests.map((g: any) => (
                        <button key={g.id} onClick={() => { setSelectedGuest(g); setGuestSearch(`${g.firstName || ""} ${g.lastName || ""}`); }}
                          className={cn("w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-gray-50 transition",
                            selectedGuest?.id === g.id && "bg-[#C9973A]/5")}>
                          <div className="w-9 h-9 rounded-full bg-[#0F1B2D] text-[#C9973A] flex items-center justify-center text-sm font-bold shrink-0">
                            {(g.firstName?.[0] || "G").toUpperCase()}</div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium">{g.firstName} {g.lastName}</p>
                            <p className="text-xs text-muted-foreground">{g.email}</p>
                          </div>
                          {g.phone && <span className="text-xs text-muted-foreground shrink-0">{g.phone}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedGuest && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                      <div className="text-sm">
                        <span className="font-medium">{selectedGuest.firstName} {selectedGuest.lastName}</span>
                        <span className="text-muted-foreground"> — {selectedGuest.email}</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Enter the guest details to create a new profile.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label>First Name *</Label><Input value={newGuest.firstName} onChange={(e) => setNewGuest({ ...newGuest, firstName: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Last Name</Label><Input value={newGuest.lastName} onChange={(e) => setNewGuest({ ...newGuest, lastName: e.target.value })} /></div>
                  </div>
                  <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={newGuest.email} onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Phone</Label><Input value={newGuest.phone} onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })} /></div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                <Button className="flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]" disabled={!canProceedStep1} onClick={() => setStep(2)}>Next</Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
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
                        onSelect={(date) => { setCheckIn(date); if (date && checkOut && checkOut <= date) setCheckOut(undefined); setSelectedRoomIds([]); }}
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
                      <Calendar mode="single" selected={checkOut} onSelect={(date) => { setCheckOut(date); setSelectedRoomIds([]); }}
                        disabled={(date) => !checkIn || date <= checkIn || isDateDisabled(date)} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {checkIn && checkOut && (
                <p className="text-sm text-muted-foreground">{totalNights} {totalNights === 1 ? "night" : "nights"} stay</p>
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
                <Label>Notes (optional)</Label>
                <Input placeholder="Special requests, notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]" disabled={!canProceedStep2} onClick={() => goToStep(3)}>Review</Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-[#0F1B2D] text-[#C9973A] flex items-center justify-center font-bold">
                    {(guestMode === "create" ? newGuest.firstName?.[0] || "G" : selectedGuest?.firstName?.[0] || "G").toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {guestMode === "create" ? `${newGuest.firstName} ${newGuest.lastName}`.trim() : `${selectedGuest?.firstName || ""} ${selectedGuest?.lastName || ""}`.trim()}
                    </p>
                    <p className="text-xs text-muted-foreground">{guestMode === "create" ? newGuest.email || "—" : selectedGuest?.email || "—"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 rounded-lg p-3">
                  <div><span className="text-muted-foreground">Check In</span><p className="font-medium">{checkIn ? format(checkIn, "MMM d, yyyy") : "—"}</p></div>
                  <div><span className="text-muted-foreground">Check Out</span><p className="font-medium">{checkOut ? format(checkOut, "MMM d, yyyy") : "—"}</p></div>
                  <div><span className="text-muted-foreground">Nights</span><p className="font-medium">{totalNights}</p></div>
                  <div><span className="text-muted-foreground">Rooms</span><p className="font-medium">{selectedRoomIds.length}</p></div>
                </div>

                {selectedRoomIds.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Price Breakdown</p>
                    {loadingPrice ? (
                      <div className="space-y-1"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
                    ) : pricePreview ? (
                      <div className="space-y-1">
                        {pricePreview.rooms.map((r) => (
                          <div key={r.roomId} className="flex items-center justify-between text-sm px-3 py-2 bg-gray-50 rounded-lg">
                            <span>Room {r.roomNumber} <span className="text-muted-foreground">({r.roomType?.name || "Standard"})</span> <span className="text-muted-foreground">({pricePreview.nights} night{pricePreview.nights !== 1 ? "s" : ""})</span></span>
                            <span className="font-medium">{formatCurrency(r.total)}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between text-sm font-semibold px-3 py-2 mt-1 border-t">
                          <span>Total (rates & promotions applied)</span>
                          <span className="text-[#C9973A]">{formatCurrency(pricePreview.total)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {rooms.filter((r) => selectedRoomIds.includes(r.id)).map((r) => {
                          const price = r.effectivePrice ?? r.basePrice ?? r.roomType?.basePrice ?? 0;
                          return (
                            <div key={r.id} className="flex items-center justify-between text-sm px-3 py-2 bg-gray-50 rounded-lg">
                              <span>Room {r.roomNumber} <span className="text-muted-foreground">({r.roomType?.name || "Standard"})</span></span>
                              <span className="font-medium">{formatCurrency(Number(price))}<span className="text-xs text-muted-foreground font-normal">/night</span></span>
                            </div>
                          );
                        })}
                        <div className="flex items-center justify-between text-sm font-semibold px-3 py-2 mt-1 border-t">
                          <span>Estimated Total</span>
                          <span className="text-[#C9973A]">{formatCurrency(rooms.filter((r) => selectedRoomIds.includes(r.id)).reduce((sum, r) => sum + Number(r.effectivePrice ?? r.basePrice ?? r.roomType?.basePrice ?? 0) * totalNights, 0))}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {notes && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Notes</p>
                    <p className="text-sm bg-gray-50 rounded-lg p-3">{notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                <Button className="flex-1 bg-[#C9973A] hover:bg-[#b8892e] text-white" disabled={!canProceedStep2 || creating} onClick={handleCreate}>
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
