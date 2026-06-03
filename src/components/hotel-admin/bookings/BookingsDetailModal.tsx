import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bed, CheckCircle, Mail, Phone, User, Clock, XCircle } from 'lucide-react';
import { cn, formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { STATUS_STYLES, guestDisplayName, sourceLabel, nights, Booking } from './types';

interface BookingsDetailModalProps {
  booking: Booking;
  onClose: () => void;
  onAction: (action: string) => void;
}

export function BookingsDetailModal({ booking, onClose, onAction }: BookingsDetailModalProps) {
  const br = booking.bookingRooms || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="font-semibold text-[#0F1B2D]">Booking Details</h2>
            <p className="text-xs text-muted-foreground font-mono">{booking.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <div className="p-5 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#0F1B2D] text-[#C9973A] flex items-center justify-center text-xl font-bold shrink-0">
              {guestDisplayName(booking)[0] || "G"}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-[#0F1B2D]">{guestDisplayName(booking)}</h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                {booking.guest?.email && (
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {booking.guest.email}</span>
                )}
                {booking.guest?.phone && (
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {booking.guest.phone}</span>
                )}
              </div>
              <Badge className={cn("text-xs mt-1", STATUS_STYLES[booking.status] || "bg-gray-100")}>
                {(booking.status || "").replace("_", " ")}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div><span className="text-muted-foreground">Check In</span><p className="font-medium">{formatDate(booking.checkIn)}</p></div>
            <div><span className="text-muted-foreground">Check Out</span><p className="font-medium">{formatDate(booking.checkOut)}</p></div>
            <div><span className="text-muted-foreground">Nights</span><p className="font-medium">{booking.nights ?? nights(booking.checkIn, booking.checkOut)}</p></div>
            <div><span className="text-muted-foreground">Total</span><p className="font-medium">{formatCurrency(booking.totalPrice ?? 0)}</p></div>
            <div><span className="text-muted-foreground">Source</span><p className="font-medium">{sourceLabel(booking.source)}</p></div>
            <div><span className="text-muted-foreground">Created</span><p className="font-medium">{formatDateTime(booking.createdAt)}</p></div>
          </div>

          {br.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[#0F1B2D] mb-2 flex items-center gap-2">
                <Bed className="w-4 h-4" /> Rooms
              </h4>
              <div className="space-y-2">
                {br.map((r) => (
                  <div key={r.id || r.roomId} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 text-sm">
                    <div>
                      <span className="font-medium">Room {r.room?.roomNumber || "—"}</span>
                      {r.room?.roomType?.name && <span className="text-muted-foreground ml-2">({r.room.roomType.name})</span>}
                    </div>
                    <span className="font-medium">{formatCurrency(r.price ?? 0)}</span>
                  </div>
                ))}
                {br.length > 1 && (
                  <div className="flex items-center justify-between px-4 py-2 text-sm font-semibold border-t">
                    <span>Total</span>
                    <span>{formatCurrency(booking.totalPrice ?? 0)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {booking.notes && (
            <div>
              <h4 className="text-sm font-semibold text-[#0F1B2D] mb-1">Notes</h4>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{booking.notes}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t">
            {booking.status === "pending" && (
              <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => onAction("confirm")}>
                <CheckCircle className="w-4 h-4 mr-1" /> Confirm
              </Button>
            )}
            {(booking.status === "confirmed" || booking.status === "pending") && (
              <>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onAction("checkin")}>
                  <User className="w-4 h-4 mr-1" /> Check In
                </Button>
                <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => onAction("cancel")}>
                  <XCircle className="w-4 h-4 mr-1" /> Cancel
                </Button>
              </>
            )}
            {booking.status === "checked_in" && (
              <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white" onClick={() => onAction("checkout")}>
                <Clock className="w-4 h-4 mr-1" /> Check Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
