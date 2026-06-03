import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface NotificationsTabProps {
  hotelId: string;
  notifications: Record<string, any>;
}

export function NotificationsTab({ hotelId, notifications }: NotificationsTabProps) {
  const [value, setValue] = useState(JSON.stringify(notifications, null, 2));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { setValue(JSON.stringify(notifications, null, 2)); }, [notifications]);

  const save = async () => {
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/notifications`, { notifications: tryParse(value) });
      toast.success('Notification preferences saved');
    } catch (e: any) { toast.error('Failed: ' + e.message); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Notification Settings</h4>
      <p className="text-sm text-muted-foreground">Configure which events trigger email or SMS notifications.</p>
      <textarea
        className="w-full p-3 bg-slate-50 border rounded-lg h-48 text-xs font-mono"
        title="Notification preferences JSON"
        placeholder="Enter notification preferences as JSON"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <Button onClick={save} disabled={isSaving} className="bg-[#0F1B2D]">
        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Save Preferences
      </Button>
    </div>
  );
}

function tryParse(v: string) {
  try { return JSON.parse(v); } catch { return {}; }
}
