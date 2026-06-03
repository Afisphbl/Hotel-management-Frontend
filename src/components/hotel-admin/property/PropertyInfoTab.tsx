import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface HotelInfo {
  name: string;
  description: string;
  location: string;
  region: string;
  subdomain: string;
  slug: string;
  type: string;
}

interface PropertyInfoTabProps {
  initialData: HotelInfo | null;
  hotelId: string | undefined;
}

export function PropertyInfoTab({ initialData, hotelId }: PropertyInfoTabProps) {
  const [form, setForm] = useState<HotelInfo>({
    name: '', description: '', location: '', region: '',
    subdomain: '', slug: '', type: 'BOUTIQUE',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const save = async () => {
    if (!hotelId) return;
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/info`, form);
      toast.success('Property info updated');
    } catch (e: any) {
      toast.error('Failed to save: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-none bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Property Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Property Name</Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Region</Label>
            <Input value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Subdomain</Label>
            <Input value={form.subdomain} onChange={e => setForm({ ...form, subdomain: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="property-type">Type</Label>
            <select id="property-type" aria-label="Type" title="Type"
              className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              <option value="BOUTIQUE">Boutique</option>
              <option value="HOTEL">Hotel</option>
              <option value="RESORT">Resort</option>
              <option value="LODGE">Lodge</option>
              <option value="MOTEL">Motel</option>
              <option value="APARTMENT">Apartment</option>
            </select>
          </div>
        </div>
        <div className="space-y-1.5 mt-4">
          <Label>Description</Label>
          <textarea
            className="flex w-full min-h-30 px-3 py-2 border border-input bg-background rounded-md text-sm resize-y"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your property..."
          />
        </div>
        <div className="pt-4">
          <Button onClick={save} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
