import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface PolicyData {
  cancellationPolicy: any;
  bookingPolicies: any;
}

interface PropertyPoliciesTabProps {
  initialData: PolicyData | null;
  hotelId: string | undefined;
  settings: any;
}

export function PropertyPoliciesTab({ initialData, hotelId, settings }: PropertyPoliciesTabProps) {
  const [cancellationPolicy, setCancellationPolicy] = useState<any>({});
  const [bookingPolicies, setBookingPolicies] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCancellationPolicy(initialData.cancellationPolicy || {});
      setBookingPolicies(initialData.bookingPolicies || {});
    }
  }, [initialData]);

  const save = async () => {
    if (!hotelId) return;
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/settings`, {
        settings: { ...settings, cancellationPolicy, bookingPolicies },
      });
      toast.success('Policies updated');
    } catch (e: any) {
      toast.error('Failed to save policies: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-none bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Booking & Cancellation Policies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Cancellation Deadline (hours before check-in)</Label>
          <Input
            type="number"
            value={cancellationPolicy?.deadlineHours ?? 24}
            onChange={e => setCancellationPolicy({ ...cancellationPolicy, deadlineHours: parseInt(e.target.value) })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Cancellation Fee (%)</Label>
          <Input
            type="number"
            value={cancellationPolicy?.feePercent ?? 0}
            onChange={e => setCancellationPolicy({ ...cancellationPolicy, feePercent: parseFloat(e.target.value) })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Check-in Time</Label>
          <Input
            value={bookingPolicies?.checkInTime ?? '14:00'}
            onChange={e => setBookingPolicies({ ...bookingPolicies, checkInTime: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Check-out Time</Label>
          <Input
            value={bookingPolicies?.checkOutTime ?? '11:00'}
            onChange={e => setBookingPolicies({ ...bookingPolicies, checkOutTime: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Allow Online Booking</Label>
          <Switch
            checked={bookingPolicies?.allowOnline ?? true}
            onCheckedChange={(v) => setBookingPolicies({ ...bookingPolicies, allowOnline: v })}
          />
        </div>
        <div className="pt-4">
          <Button onClick={save} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            <Save className="w-4 h-4 mr-2" /> Save Policies
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
