import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const NOTIFICATIONS = [
  { key: 'newBooking', label: 'New Booking' },
  { key: 'cancellation', label: 'Cancellation' },
  { key: 'checkIn', label: 'Check-in' },
  { key: 'checkOut', label: 'Check-out' },
  { key: 'payment', label: 'Payment Received' },
  { key: 'maintenance', label: 'Maintenance Request' },
  { key: 'housekeeping', label: 'Housekeeping Status' },
  { key: 'review', label: 'Guest Review' },
];

interface PropertyNotificationsTabProps {
  initialData: Record<string, boolean> | null;
  hotelId: string | undefined;
  settings: any;
}

export function PropertyNotificationsTab({ initialData, hotelId, settings }: PropertyNotificationsTabProps) {
  const [notifications, setNotifications] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) setNotifications(initialData);
  }, [initialData]);

  const save = async () => {
    if (!hotelId) return;
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/settings`, {
        settings: { ...settings, notifications },
      });
      toast.success('Notification preferences updated');
    } catch (e: any) {
      toast.error('Failed to save notifications: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-none bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {NOTIFICATIONS.map(n => (
          <div key={n.key} className="flex items-center justify-between py-2">
            <Label>{n.label}</Label>
            <Switch
              checked={notifications[n.key] ?? true}
              onCheckedChange={(v) => setNotifications({ ...notifications, [n.key]: v })}
            />
          </div>
        ))}
        <div className="pt-4">
          <Button onClick={save} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            <Save className="w-4 h-4 mr-2" /> Save Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
