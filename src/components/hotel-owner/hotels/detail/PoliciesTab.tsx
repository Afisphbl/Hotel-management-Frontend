import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface PoliciesTabProps {
  hotelId: string;
  bookingPolicies: Record<string, any>;
  cancellationPolicy: Record<string, any>;
}

export function PoliciesTab({ hotelId, bookingPolicies, cancellationPolicy }: PoliciesTabProps) {
  const [booking, setBooking] = useState(JSON.stringify(bookingPolicies, null, 2));
  const [cancel, setCancel] = useState(JSON.stringify(cancellationPolicy, null, 2));
  const [isSaving, setIsSaving] = useState<'booking' | 'cancel' | null>(null);

  useEffect(() => {
    setBooking(JSON.stringify(bookingPolicies, null, 2));
    setCancel(JSON.stringify(cancellationPolicy, null, 2));
  }, [bookingPolicies, cancellationPolicy]);

  const saveBooking = async () => {
    setIsSaving('booking');
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/booking-policies`, tryParse(booking));
      toast.success('Booking policies updated');
    } catch (e: any) { toast.error('Failed: ' + e.message); }
    finally { setIsSaving(null); }
  };

  const saveCancel = async () => {
    setIsSaving('cancel');
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/cancellation-policy`, { policy: tryParse(cancel) });
      toast.success('Cancellation policy updated');
    } catch (e: any) { toast.error('Failed: ' + e.message); }
    finally { setIsSaving(null); }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="font-medium">Booking Policies</h4>
        <textarea
          title="Booking policies"
          placeholder='Enter booking policies as JSON'
          aria-label="Booking policies"
          className="w-full p-3 bg-slate-50 border rounded-lg h-32 text-xs font-mono"
          value={booking}
          onChange={e => setBooking(e.target.value)}
        />
        <Button onClick={saveBooking} disabled={isSaving !== null} size="sm" className="bg-[#0F1B2D]">
          {isSaving === 'booking' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Save Policies
        </Button>
      </div>
      <div className="space-y-2 pt-4 border-t">
        <h4 className="font-medium">Cancellation & Refund Policy</h4>
        <textarea
          title="Cancellation and refund policy"
          placeholder='Enter cancellation policy as JSON'
          aria-label="Cancellation and refund policy"
          className="w-full p-3 bg-slate-50 border rounded-lg h-32 text-xs font-mono"
          value={cancel}
          onChange={e => setCancel(e.target.value)}
        />
        <Button onClick={saveCancel} disabled={isSaving !== null} size="sm" className="bg-[#0F1B2D]">
          {isSaving === 'cancel' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Save Cancellation Policy
        </Button>
      </div>
    </div>
  );
}

function tryParse(v: string) {
  try { return JSON.parse(v); } catch { return {}; }
}
