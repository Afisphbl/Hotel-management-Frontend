import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface PoliciesTabProps {
  hotelId: string;
  initialCancellationPolicy: { deadlineHours: number; feePercent: number };
  initialBookingPolicies: { checkInTime: string; checkOutTime: string; allowOnline: boolean };
}

export function PoliciesTab({ hotelId, initialCancellationPolicy, initialBookingPolicies }: PoliciesTabProps) {
  const [cancellationPolicy, setCancellationPolicy] = useState(initialCancellationPolicy);
  const [bookingPolicies, setBookingPolicies] = useState(initialBookingPolicies);
  const [isSavingCancel, setIsSavingCancel] = useState(false);
  const [isSavingBooking, setIsSavingBooking] = useState(false);

  useEffect(() => {
    setCancellationPolicy(initialCancellationPolicy);
    setBookingPolicies(initialBookingPolicies);
  }, [initialCancellationPolicy, initialBookingPolicies]);

  const saveCancellation = async () => {
    setIsSavingCancel(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/cancellation-policy`, { policy: cancellationPolicy });
      toast.success('Cancellation policy updated');
    } catch (e: any) {
      toast.error('Failed to save cancellation policy: ' + e.message);
    } finally {
      setIsSavingCancel(false);
    }
  };

  const saveBooking = async () => {
    setIsSavingBooking(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/booking-policies`, bookingPolicies);
      toast.success('Booking policies updated');
    } catch (e: any) {
      toast.error('Failed to save booking policies: ' + e.message);
    } finally {
      setIsSavingBooking(false);
    }
  };

  return (
    <Card className="border-none bg-white shadow-sm mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Booking & Cancellation Policies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Cancellation Policy</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Deadline (hours before check-in)</Label>
              <Input
                type="number"
                value={cancellationPolicy.deadlineHours}
                onChange={(e) =>
                  setCancellationPolicy({
                    ...cancellationPolicy,
                    deadlineHours: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Cancellation Fee (%)</Label>
              <Input
                type="number"
                value={cancellationPolicy.feePercent}
                onChange={(e) =>
                  setCancellationPolicy({
                    ...cancellationPolicy,
                    feePercent: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <Button
            onClick={saveCancellation}
            disabled={isSavingCancel}
            className="bg-[#0F1B2D] hover:bg-[#1a2a3a]"
          >
            {isSavingCancel ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Cancellation Policy
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold">Booking Policies</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Check-in Time</Label>
              <Input
                value={bookingPolicies.checkInTime}
                onChange={(e) =>
                  setBookingPolicies({
                    ...bookingPolicies,
                    checkInTime: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Check-out Time</Label>
              <Input
                value={bookingPolicies.checkOutTime}
                onChange={(e) =>
                  setBookingPolicies({
                    ...bookingPolicies,
                    checkOutTime: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Allow Online Booking</Label>
            <Switch
              checked={bookingPolicies.allowOnline}
              onCheckedChange={(v) =>
                setBookingPolicies({ ...bookingPolicies, allowOnline: v })
              }
            />
          </div>
          <Button
            onClick={saveBooking}
            disabled={isSavingBooking}
            className="bg-[#0F1B2D] hover:bg-[#1a2a3a]"
          >
            {isSavingBooking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Booking Policies
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
