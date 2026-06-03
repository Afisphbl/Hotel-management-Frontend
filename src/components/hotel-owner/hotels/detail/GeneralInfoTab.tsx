import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Save, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface GeneralInfoData {
  id: string;
  name: string;
  location: string;
  slug?: string;
  ownerName?: string;
  ownerEmail?: string;
  maintenanceMode?: boolean;
}

interface GeneralInfoTabProps {
  hotel: GeneralInfoData;
}

export function GeneralInfoTab({ hotel }: GeneralInfoTabProps) {
  const [form, setForm] = useState({ ...hotel });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { setForm({ ...hotel }); }, [hotel]);

  const save = async () => {
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotel.id}/info`, {
        name: form.name, location: form.location, slug: form.slug,
        ownerName: form.ownerName, ownerEmail: form.ownerEmail,
      });
      if (form.maintenanceMode !== hotel.maintenanceMode) {
        await api.patch(`hotel/owner/hotels/${hotel.id}`, { maintenanceMode: form.maintenanceMode });
      }
      toast.success('Information updated');
    } catch (e: any) {
      toast.error('Failed: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Hotel Name</label>
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Location</label>
          <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Slug (URL friendly)</label>
          <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Owner Name</label>
          <Input value={form.ownerName} onChange={e => setForm({ ...form, ownerName: e.target.value })} />
        </div>
        <div className="col-span-2 space-y-1 pt-2">
          <div className="flex items-center justify-between p-3 border rounded-lg bg-amber-50 border-amber-100">
            <div>
              <p className="text-sm font-semibold text-amber-900">Maintenance Mode</p>
              <p className="text-xs text-amber-700">When enabled, the hotel booking site will show a maintenance message.</p>
            </div>
            <Switch checked={!!form.maintenanceMode} onCheckedChange={val => setForm({ ...form, maintenanceMode: val })} />
          </div>
        </div>
      </div>
      <Button onClick={save} disabled={isSaving} className="bg-[#0F1B2D]">
        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Changes
      </Button>
    </div>
  );
}
