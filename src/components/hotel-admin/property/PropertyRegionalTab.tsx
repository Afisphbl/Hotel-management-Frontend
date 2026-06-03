import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface RegionalData {
  timezone: string;
  currency: string;
}

interface PropertyRegionalTabProps {
  initialData: RegionalData | null;
  hotelId: string | undefined;
}

export function PropertyRegionalTab({ initialData, hotelId }: PropertyRegionalTabProps) {
  const [form, setForm] = useState<RegionalData>({ timezone: 'UTC', currency: 'ETB' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const save = async () => {
    if (!hotelId) return;
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/timezone-currency-taxes`, {
        timezone: form.timezone,
        currency: form.currency,
      });
      toast.success('Regional settings updated');
    } catch (e: any) {
      toast.error('Failed to save: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-none bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Regional Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="timezone">Timezone</Label>
            <select id="timezone" aria-label="Timezone" title="Timezone"
              className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={form.timezone}
              onChange={e => setForm({ ...form, timezone: e.target.value })}
            >
              <option value="UTC">UTC</option>
              <option value="Africa/Addis_Ababa">Africa/Addis_Ababa (UTC+3)</option>
              <option value="Africa/Nairobi">Africa/Nairobi (UTC+3)</option>
              <option value="Africa/Cairo">Africa/Cairo (UTC+2)</option>
              <option value="Africa/Johannesburg">Africa/Johannesburg (UTC+2)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
              <option value="America/Chicago">America/Chicago (UTC-6)</option>
              <option value="America/Denver">America/Denver (UTC-7)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (UTC-8)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
              <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
              <option value="Asia/Dubai">Asia/Dubai (UTC+4)</option>
              <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="currency">Currency</Label>
            <select id="currency" aria-label="Currency" title="Currency"
              className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={form.currency}
              onChange={e => setForm({ ...form, currency: e.target.value })}
            >
              <option value="ETB">ETB - Ethiopian Birr</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="ZAR">ZAR - South African Rand</option>
              <option value="AED">AED - UAE Dirham</option>
              <option value="SGD">SGD - Singapore Dollar</option>
            </select>
          </div>
        </div>
        <div className="pt-4">
          <Button onClick={save} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            <Save className="w-4 h-4 mr-2" /> Save Regional Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
