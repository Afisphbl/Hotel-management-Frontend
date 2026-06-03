import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface NotificationsTabProps {
  hotelId: string;
  initialNotifications: Record<string, boolean>;
}

const notificationOptions = [
  { key: 'newBooking', label: 'New Booking' },
  { key: 'cancellation', label: 'Cancellation' },
  { key: 'checkIn', label: 'Check-in' },
  { key: 'checkOut', label: 'Check-out' },
  { key: 'payment', label: 'Payment Received' },
  { key: 'maintenance', label: 'Maintenance Request' },
  { key: 'housekeeping', label: 'Housekeeping Status' },
];

export function NotificationsTab({ hotelId, initialNotifications }: NotificationsTabProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/notifications`, { notifications });
      toast.success('Notification preferences saved');
    } catch (e: any) {
      toast.error('Failed to save notifications: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-none bg-white shadow-sm mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 px-4 py-4">
          {notificationOptions.map((n) => (
            <div key={n.key} className="flex items-center justify-between py-2">
              <Label>{n.label}</Label>
              <Switch
                checked={notifications[n.key] ?? true}
                onCheckedChange={(v) => setNotifications({ ...notifications, [n.key]: v })}
              />
            </div>
          ))}
        </div>
        <div className="pt-4 px-4 pb-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#0F1B2D] hover:bg-[#1a2a3a]"
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
