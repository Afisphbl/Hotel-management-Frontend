import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface HotelInfoTabProps {
  hotelId: string;
  initialInfo: { name: string; location: string };
  initialLocalization: { timezone: string; currency: string };
}

export function HotelInfoTab({ hotelId, initialInfo, initialLocalization }: HotelInfoTabProps) {
  const [info, setInfo] = useState(initialInfo);
  const [localization, setLocalization] = useState(initialLocalization);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [isSavingLoc, setIsSavingLoc] = useState(false);

  useEffect(() => {
    setInfo(initialInfo);
    setLocalization(initialLocalization);
  }, [initialInfo, initialLocalization]);

  const saveInfo = async () => {
    setIsSavingInfo(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/info`, info);
      toast.success('Hotel information updated');
    } catch (e: any) {
      toast.error('Failed to save hotel info: ' + e.message);
    } finally {
      setIsSavingInfo(false);
    }
  };

  const saveLocalization = async () => {
    setIsSavingLoc(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/timezone-currency-taxes`, localization);
      toast.success('Timezone and currency updated');
    } catch (e: any) {
      toast.error('Failed to save localization: ' + e.message);
    } finally {
      setIsSavingLoc(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Hotel Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Hotel Name</Label>
              <Input
                value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input
                value={info.location}
                onChange={(e) => setInfo({ ...info, location: e.target.value })}
              />
            </div>
          </div>
          <Button
            onClick={saveInfo}
            disabled={isSavingInfo}
            className="bg-[#0F1B2D] hover:bg-[#1a2a3a]"
          >
            {isSavingInfo ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Hotel Info
          </Button>
        </CardContent>
      </Card>

      <Card className="border-none bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Timezone & Currency</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Timezone</Label>
              <Input
                value={localization.timezone}
                onChange={(e) => setLocalization({ ...localization, timezone: e.target.value })}
                placeholder="e.g. Africa/Addis_Ababa"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Input
                value={localization.currency}
                onChange={(e) => setLocalization({ ...localization, currency: e.target.value })}
                placeholder="e.g. ETB, USD"
              />
            </div>
          </div>
          <Button
            onClick={saveLocalization}
            disabled={isSavingLoc}
            className="bg-[#0F1B2D] hover:bg-[#1a2a3a]"
          >
            {isSavingLoc ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Timezone & Currency
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
