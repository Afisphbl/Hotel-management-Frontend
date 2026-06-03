import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface BookingsHeaderProps {
  onNewBooking: () => void;
}

export function BookingsHeader({ onNewBooking }: BookingsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Bookings</h1>
        <p className="text-sm text-muted-foreground">Manage reservations, check-ins, and check-outs</p>
      </div>
      <Button onClick={onNewBooking} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
        <Plus className="w-4 h-4 mr-2" /> New Booking
      </Button>
    </div>
  );
}
