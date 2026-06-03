import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface CreateHotelFormProps {
  onSuccess: () => void;
}

const defaultForm = {
  name: '',
  slug: '',
  type: 'BOUTIQUE',
  schemaName: '',
  status: 'ACTIVE',
  subdomain: '',
  location: '',
  region: '',
  timezone: 'UTC',
  currency: 'ETB',
  ownerName: '',
  ownerEmail: '',
  branding: {} as Record<string, any>,
  settings: {
    taxes: {} as Record<string, any>,
    bookingPolicies: {} as Record<string, any>,
    modulesEnabled: {} as Record<string, boolean>,
    notifications: {} as Record<string, any>,
  },
  subscription: {} as Record<string, any>,
  paymentMethods: [] as any[],
  cancellationPolicy: {} as Record<string, any>,
  storageUsedMb: 0,
  rooms: 120,
  maintenanceMode: false,
};

export function CreateHotelForm({ onSuccess }: CreateHotelFormProps) {
  const [form, setForm] = useState(structuredClone(defaultForm));

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm({ ...form, [key]: value });

  const createHotel = async () => {
    if (!form.name || !form.location) {
      toast.error('Please fill in name and location');
      return;
    }
    try {
      await api.post('hotel/owner/hotels', {
        ...form,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      });
      setForm(structuredClone(defaultForm));
      toast.success('Hotel created successfully');
      onSuccess();
    } catch (e: any) {
      toast.error('Failed to create hotel: ' + e.message);
    }
  };

  return (
    <Card className="border-[#C9973A]/20">
      <CardHeader>
        <CardTitle className="text-lg">Create New Hotel / Branch</CardTitle>
        <CardDescription>Enter the basic details to register a new property.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">Basic Information</h3>
            <div className="space-y-1">
              <label className="text-xs font-medium">Hotel Name *</label>
              <Input placeholder="e.g. Grand Plaza" value={form.name} onChange={e => update('name', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Slug (URL) *</label>
              <Input placeholder="grand-plaza" value={form.slug} onChange={e => update('slug', e.target.value)} />
              <p className="text-xs text-muted-foreground">URL-friendly identifier (auto-generated if empty)</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Location *</label>
              <Input placeholder="e.g. London, UK" value={form.location} onChange={e => update('location', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Region</label>
              <Input placeholder="e.g. Europe" value={form.region} onChange={e => update('region', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Hotel Type</label>
              <select
                className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                aria-label="Hotel type"
                title="Hotel type"
                value={form.type}
                onChange={e => update('type', e.target.value)}
              >
                <option value="BOUTIQUE">Boutique</option>
                <option value="CHAIN">Chain</option>
                <option value="RESORT">Resort</option>
                <option value="MOTEL">Motel</option>
                <option value="LUXURY">Luxury</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">Configuration</h3>
            <div className="space-y-1">
              <label className="text-xs font-medium">Timezone *</label>
              <Input placeholder="UTC" value={form.timezone} onChange={e => update('timezone', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Currency *</label>
              <Input placeholder="ETB" value={form.currency} onChange={e => update('currency', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Total Rooms</label>
              <Input type="number" min="1" placeholder="120" value={form.rooms} onChange={e => update('rooms', parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Subdomain (Optional)</label>
              <Input placeholder="hotelname" value={form.subdomain} onChange={e => update('subdomain', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Schema Name (Optional)</label>
              <Input placeholder="hotel_schema_001" value={form.schemaName} onChange={e => update('schemaName', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">Owner Information</h3>
            <div className="space-y-1">
              <label className="text-xs font-medium">Owner Name</label>
              <Input placeholder="John Doe" value={form.ownerName} onChange={e => update('ownerName', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Owner Email</label>
              <Input placeholder="owner@hotel.com" value={form.ownerEmail} onChange={e => update('ownerEmail', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Hotel Status</label>
              <select
                className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                aria-label="Hotel status"
                title="Hotel status"
                value={form.status}
                onChange={e => update('status', e.target.value)}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">Advanced Settings</h3>
            <div className="space-y-1">
              <label className="text-xs font-medium">Storage Used (MB)</label>
              <Input type="number" min="0" placeholder="0" value={form.storageUsedMb} onChange={e => update('storageUsedMb', parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Maintenance Mode</label>
              <Switch checked={form.maintenanceMode} onCheckedChange={checked => update('maintenanceMode', checked)} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">Initial Settings</h3>
            <div className="space-y-1">
              <label className="text-xs font-medium">Tax Configuration</label>
              <textarea
                className="w-full p-2 bg-slate-50 border rounded text-xs font-mono h-20"
                placeholder={`{\n  "vat": 0,\n  "service": 0,\n  "tourism": 0\n}`}
                value={JSON.stringify(form.settings.taxes, null, 2)}
                onChange={e => {
                  try { update('settings', { ...form.settings, taxes: JSON.parse(e.target.value) }); } catch {}
                }}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Booking Policies</label>
              <textarea
                className="w-full p-2 bg-slate-50 border rounded text-xs font-mono h-20"
                placeholder={`{\n  "checkInTime": "14:00",\n  "checkOutTime": "11:00",\n  "minimumStay": 1\n}`}
                value={JSON.stringify(form.settings.bookingPolicies, null, 2)}
                onChange={e => {
                  try { update('settings', { ...form.settings, bookingPolicies: JSON.parse(e.target.value) }); } catch {}
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">Business Rules</h3>
            <div className="space-y-1">
              <label className="text-xs font-medium">Cancellation Policy</label>
              <textarea
                className="w-full p-2 bg-slate-50 border rounded text-xs font-mono h-20"
                placeholder={`{\n  "freeCancellation": 24,\n  "partialRefund": true\n}`}
                value={JSON.stringify(form.cancellationPolicy, null, 2)}
                onChange={e => {
                  try { update('cancellationPolicy', JSON.parse(e.target.value)); } catch {}
                }}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Payment Methods</label>
              <textarea
                className="w-full p-2 bg-slate-50 border rounded text-xs font-mono h-20"
                placeholder={`[\n  {"type": "credit_card", "name": "Credit Card"},\n  {"type": "cash", "name": "Cash on Arrival"}\n]`}
                value={JSON.stringify(form.paymentMethods, null, 2)}
                onChange={e => {
                  try { update('paymentMethods', JSON.parse(e.target.value)); } catch {}
                }}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Notifications</label>
              <textarea
                className="w-full p-2 bg-slate-50 border rounded text-xs font-mono h-20"
                placeholder={`{\n  "email": true,\n  "sms": false,\n  "push": true\n}`}
                value={JSON.stringify(form.settings.notifications, null, 2)}
                onChange={e => {
                  try { update('settings', { ...form.settings, notifications: JSON.parse(e.target.value) }); } catch {}
                }}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={createHotel} className="bg-[#0F1B2D]">Register Hotel</Button>
        </div>
      </CardContent>
    </Card>
  );
}
