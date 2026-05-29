import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Building2, Globe, MapPin, Clock, DollarSign, Percent, Save,
  Bell, CreditCard, FileText, Shield,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function PropertyPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hotel, setHotel] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    location: '',
    region: '',
    timezone: 'UTC',
    currency: 'ETB',
    subdomain: '',
    slug: '',
    type: 'BOUTIQUE',
    status: 'ACTIVE',
  });

  const [settings, setSettings] = useState({
    modulesEnabled: {} as Record<string, boolean>,
    notifications: {} as Record<string, boolean>,
    cancellationPolicy: {} as any,
    bookingPolicies: {} as any,
    paymentMethods: [] as string[],
  });

  useEffect(() => {
    fetchHotel();
  }, []);

  const fetchHotel = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('hotel/owner/hotels');
      const hotels = res.data || res || [];
      const h = Array.isArray(hotels) ? hotels[0] : hotels;
      if (h) {
        setHotel(h);
        setForm({
          name: h.name || '',
          location: h.location || '',
          region: h.region || '',
          timezone: h.timezone || 'UTC',
          currency: h.currency || 'ETB',
          subdomain: h.subdomain || '',
          slug: h.slug || '',
          type: h.type || 'BOUTIQUE',
          status: h.status || 'ACTIVE',
        });
        setSettings({
          modulesEnabled: h.settings?.modulesEnabled || {},
          notifications: h.settings?.notifications || {},
          cancellationPolicy: h.cancellationPolicy || {},
          bookingPolicies: h.settings?.bookingPolicies || {},
          paymentMethods: h.paymentMethods || [],
        });
      }
    } catch (e: any) {
      toast.error('Failed to load property: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveInfo = async () => {
    if (!hotel?.id) return;
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotel.id}/info`, form);
      toast.success('Property info updated');
    } catch (e: any) {
      toast.error('Failed to save: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const saveSettings = async () => {
    if (!hotel?.id) return;
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotel.id}/settings`, { settings });
      toast.success('Settings updated');
    } catch (e: any) {
      toast.error('Failed to save settings: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const saveTimezoneCurrency = async () => {
    if (!hotel?.id) return;
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotel.id}/timezone-currency-taxes`, {
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

  if (isLoading) {
    return (
      <div className="space-y-6 pb-10">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Property Configuration</h1>
        <p className="text-sm text-muted-foreground">Manage your hotel property settings and preferences</p>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="bg-white border border-[#E5E7EB]">
          <TabsTrigger value="info" className="data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white">
            <Building2 className="w-4 h-4 mr-2" /> Info
          </TabsTrigger>
          <TabsTrigger value="regional" className="data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white">
            <Globe className="w-4 h-4 mr-2" /> Regional
          </TabsTrigger>
          <TabsTrigger value="modules" className="data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" /> Modules
          </TabsTrigger>
          <TabsTrigger value="policies" className="data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" /> Policies
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
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
                  <Label>Type</Label>
                  <select
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
              <div className="pt-4">
                <Button onClick={saveInfo} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="mt-6">
          <Card className="border-none bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Regional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Timezone</Label>
                  <select
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
                  <Label>Currency</Label>
                  <select
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
                <Button onClick={saveTimezoneCurrency} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                  <Save className="w-4 h-4 mr-2" /> Save Regional Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="mt-6">
          <Card className="border-none bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Enabled Modules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {['housekeeping', 'maintenance', 'finance', 'pricing', 'shifts', 'reports', 'frontDesk', 'onlineBooking'].map(mod => (
                <div key={mod} className="flex items-center justify-between py-2">
                  <Label className="capitalize">{mod.replace(/([A-Z])/g, ' $1')}</Label>
                  <Switch
                    checked={settings.modulesEnabled[mod] ?? true}
                    onCheckedChange={(v) => setSettings({
                      ...settings,
                      modulesEnabled: { ...settings.modulesEnabled, [mod]: v }
                    })}
                  />
                </div>
              ))}
              <div className="pt-4">
                <Button onClick={saveSettings} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                  <Save className="w-4 h-4 mr-2" /> Save Modules
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="mt-6">
          <Card className="border-none bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Booking & Cancellation Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Cancellation Deadline (hours before check-in)</Label>
                <Input
                  type="number"
                  value={settings.cancellationPolicy?.deadlineHours ?? 24}
                  onChange={e => setSettings({
                    ...settings,
                    cancellationPolicy: { ...settings.cancellationPolicy, deadlineHours: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Cancellation Fee (%)</Label>
                <Input
                  type="number"
                  value={settings.cancellationPolicy?.feePercent ?? 0}
                  onChange={e => setSettings({
                    ...settings,
                    cancellationPolicy: { ...settings.cancellationPolicy, feePercent: parseFloat(e.target.value) }
                  })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Check-in Time</Label>
                <Input
                  value={settings.bookingPolicies?.checkInTime ?? '14:00'}
                  onChange={e => setSettings({
                    ...settings,
                    bookingPolicies: { ...settings.bookingPolicies, checkInTime: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Check-out Time</Label>
                <Input
                  value={settings.bookingPolicies?.checkOutTime ?? '11:00'}
                  onChange={e => setSettings({
                    ...settings,
                    bookingPolicies: { ...settings.bookingPolicies, checkOutTime: e.target.value }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Allow Online Booking</Label>
                <Switch
                  checked={settings.bookingPolicies?.allowOnline ?? true}
                  onCheckedChange={(v) => setSettings({
                    ...settings,
                    bookingPolicies: { ...settings.bookingPolicies, allowOnline: v }
                  })}
                />
              </div>
              <div className="pt-4">
                <Button onClick={saveSettings} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                  <Save className="w-4 h-4 mr-2" /> Save Policies
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="border-none bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'newBooking', label: 'New Booking' },
                { key: 'cancellation', label: 'Cancellation' },
                { key: 'checkIn', label: 'Check-in' },
                { key: 'checkOut', label: 'Check-out' },
                { key: 'payment', label: 'Payment Received' },
                { key: 'maintenance', label: 'Maintenance Request' },
                { key: 'housekeeping', label: 'Housekeeping Status' },
                { key: 'review', label: 'Guest Review' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-2">
                  <Label>{n.label}</Label>
                  <Switch
                    checked={settings.notifications[n.key] ?? true}
                    onCheckedChange={(v) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, [n.key]: v }
                    })}
                  />
                </div>
              ))}
              <div className="pt-4">
                <Button onClick={saveSettings} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                  <Save className="w-4 h-4 mr-2" /> Save Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
