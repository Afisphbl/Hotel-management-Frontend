import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Building2, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface HotelInfoData {
  name: string;
  location: string;
  timezone: string;
  currency: string;
}

interface HotelInfoProps {
  selectedHotelId: string;
  hotelInfo: HotelInfoData;
}

export function HotelInfo({ selectedHotelId, hotelInfo }: HotelInfoProps) {
  const [form, setForm] = useState<HotelInfoData>(hotelInfo);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(hotelInfo);
  }, [hotelInfo]);

  const saveInfo = async () => {
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${selectedHotelId}/info`, {
        name: form.name,
        location: form.location,
      });
      toast.success('Hotel info saved');
    } catch (e: any) {
      toast.error('Failed: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const saveTimezoneCurrency = async () => {
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${selectedHotelId}/timezone-currency-taxes`, {
        timezone: form.timezone,
        currency: form.currency,
      });
      toast.success('Timezone & currency saved');
    } catch (e: any) {
      toast.error('Failed: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-none bg-white shadow-sm max-w-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Hotel Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Hotel Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Timezone</Label>
            <Input value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} placeholder="e.g. Africa/Addis_Ababa" />
          </div>
          <div className="space-y-1.5">
            <Label>Currency</Label>
            <Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} placeholder="e.g. ETB, USD" />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={saveInfo} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Info
          </Button>
          <Button onClick={saveTimezoneCurrency} disabled={isSaving} variant="outline">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Timezone & Currency
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
