import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Percent, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface HotelSettingsTabProps {
  hotelId: string;
  currency: string;
  timezone: string;
  taxes: Record<string, any>;
}

export function HotelSettingsTab({ hotelId, currency, timezone, taxes }: HotelSettingsTabProps) {
  const [form, setForm] = useState({ currency, timezone, taxes: JSON.stringify(taxes, null, 2) });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { setForm({ currency, timezone, taxes: JSON.stringify(taxes, null, 2) }); }, [currency, timezone, taxes]);

  const saveLocalization = async () => {
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/timezone-currency-taxes`, {
        timezone: form.timezone, currency: form.currency,
        taxes: tryParse(form.taxes),
      });
      toast.success('Localization updated');
    } catch (e: any) {
      toast.error('Failed: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/settings`, { taxes: tryParse(form.taxes) });
      toast.success('Settings saved');
    } catch (e: any) {
      toast.error('Failed: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 border-b pb-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-muted-foreground">Currency</label>
            <Input value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-muted-foreground">Timezone</label>
            <Input value={form.timezone} onChange={e => setForm({ ...form, timezone: e.target.value })} />
          </div>
          <div className="col-span-2">
            <Button onClick={saveLocalization} disabled={isSaving} size="sm" variant="outline">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Update Localization
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2"><Percent className="w-4 h-4" /> Tax Configuration</h4>
          <div className="p-4 bg-slate-50 rounded-lg border text-xs font-mono">
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 h-32"
              aria-label="Tax configuration JSON"
              placeholder="Enter tax configuration JSON"
              value={form.taxes}
              onChange={e => setForm({ ...form, taxes: e.target.value })}
            />
          </div>
          <Button onClick={saveSettings} disabled={isSaving} className="bg-[#0F1B2D]">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

function tryParse(v: string) {
  try { return JSON.parse(v); } catch { return {}; }
}
