import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, FileText, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface CancellationPolicy {
  deadlineHours: number;
  feePercent: number;
}

interface BookingPolicy {
  checkInTime: string;
  checkOutTime: string;
  allowOnline: boolean;
}

interface BookingPoliciesProps {
  selectedHotelId: string;
  cancellationPolicy: CancellationPolicy;
  bookingPolicies: BookingPolicy;
}

export function BookingPolicies({ selectedHotelId, cancellationPolicy, bookingPolicies }: BookingPoliciesProps) {
  const [cancel, setCancel] = useState<CancellationPolicy>(cancellationPolicy);
  const [booking, setBooking] = useState<BookingPolicy>(bookingPolicies);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCancel(cancellationPolicy);
    setBooking(bookingPolicies);
  }, [cancellationPolicy, bookingPolicies]);

  const saveCancellation = async () => {
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${selectedHotelId}/cancellation-policy`, { policy: cancel });
      toast.success('Cancellation policy saved');
    } catch (e: any) {
      toast.error('Failed: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const saveBooking = async () => {
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${selectedHotelId}/booking-policies`, booking);
      toast.success('Booking policies saved');
    } catch (e: any) {
      toast.error('Failed: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-none bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Booking & Cancellation Policies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Cancellation Policy</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Deadline (hours before check-in)</Label>
              <Input type="number" value={cancel.deadlineHours} onChange={(e) => setCancel({ ...cancel, deadlineHours: parseInt(e.target.value) })} />
            </div>
            <div className="space-y-1.5">
              <Label>Cancellation Fee (%)</Label>
              <Input type="number" value={cancel.feePercent} onChange={(e) => setCancel({ ...cancel, feePercent: parseFloat(e.target.value) })} />
            </div>
          </div>
          <Button onClick={saveCancellation} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Cancellation Policy
          </Button>
        </div>
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold">Booking Policies</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Check-in Time</Label>
              <Input value={booking.checkInTime} onChange={(e) => setBooking({ ...booking, checkInTime: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Check-out Time</Label>
              <Input value={booking.checkOutTime} onChange={(e) => setBooking({ ...booking, checkOutTime: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Allow Online Booking</Label>
            <Switch checked={booking.allowOnline} onCheckedChange={(v) => setBooking({ ...booking, allowOnline: v })} />
          </div>
          <Button onClick={saveBooking} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Booking Policies
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
