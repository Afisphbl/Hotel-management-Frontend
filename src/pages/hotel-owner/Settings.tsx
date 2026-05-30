import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, Bell, CreditCard, FileText, User, Building2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function OwnerSettings() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Hotels list for selection
  const [hotels, setHotels] = useState<any[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');

  // Hotel info
  const [hotelInfo, setHotelInfo] = useState({ name: '', location: '', timezone: 'UTC', currency: 'ETB' });

  // Settings sections
  const [notifications, setNotifications] = useState<Record<string, boolean>>({});
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState({ deadlineHours: 24, feePercent: 0 });
  const [bookingPolicies, setBookingPolicies] = useState({ checkInTime: '14:00', checkOutTime: '11:00', allowOnline: true });

  // Profile / password
  const [profileName, setProfileName] = useState(user?.name ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => { loadHotels(); }, []);

  const loadHotels = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('hotel/owner/hotels');
      const list: any[] = res.data ?? res ?? [];
      setHotels(list);
      const firstId = user?.hotel_id ?? list[0]?.id ?? '';
      if (firstId) {
        setSelectedHotelId(firstId);
        loadHotelSettings(firstId, list);
      }
    } catch (e: any) {
      toast.error('Failed to load hotels: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHotelSettings = (id: string, list?: any[]) => {
    const h = (list ?? hotels).find((x) => x.id === id);
    if (!h) return;
    setHotelInfo({ name: h.name ?? '', location: h.location ?? '', timezone: h.timezone ?? 'UTC', currency: h.currency ?? 'ETB' });
    setNotifications(h.settings?.notifications ?? {});
    setPaymentMethods(Array.isArray(h.paymentMethods) ? h.paymentMethods : []);
    setCancellationPolicy(h.cancellationPolicy ?? { deadlineHours: 24, feePercent: 0 });
    setBookingPolicies(h.settings?.bookingPolicies ?? { checkInTime: '14:00', checkOutTime: '11:00', allowOnline: true });
  };

  const onHotelChange = (id: string) => {
    setSelectedHotelId(id);
    loadHotelSettings(id);
  };

  const save = async (endpoint: string, body: any) => {
    if (!selectedHotelId) return;
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${selectedHotelId}/${endpoint}`, body);
      toast.success('Saved');
    } catch (e: any) {
      toast.error('Failed to save: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    try {
      await api.post('auth/change-password', { currentPassword, newPassword });
      toast.success('Password changed');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? e.message ?? 'Failed');
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileName.trim()) return toast.error('Name cannot be empty');
    const parts = profileName.trim().split(/\s+/);
    setIsSaving(true);
    try {
      await api.patch('auth/profile', { firstName: parts[0], lastName: parts.slice(1).join(' ') || parts[0] });
      toast.success('Profile updated');
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? e.message ?? 'Failed');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="space-y-6 pb-10">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-96 w-full" />
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and hotel configuration</p>
      </div>

      <Tabs defaultValue="hotel" className="w-full">
        <TabsList className="bg-white border border-[#E5E7EB] flex-wrap h-auto gap-1">
          <TabsTrigger value="hotel" className="data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white">
            <Building2 className="w-4 h-4 mr-2" /> Hotel
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white">
            <CreditCard className="w-4 h-4 mr-2" /> Payments
          </TabsTrigger>
          <TabsTrigger value="policies" className="data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" /> Policies
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white">
            <User className="w-4 h-4 mr-2" /> Profile
          </TabsTrigger>
        </TabsList>

        {/* Hotel selector (shown on all hotel-related tabs) */}
        {hotels.length > 1 && (
          <div className="mt-4 flex items-center gap-3">
            <Label className="shrink-0 text-sm">Hotel:</Label>
            <Select value={selectedHotelId} onValueChange={onHotelChange}>
              <SelectTrigger className="w-64 bg-white">
                <SelectValue placeholder="Select hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotels.map((h) => (
                  <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* ── Hotel Info ── */}
        <TabsContent value="hotel" className="mt-6 space-y-6">
          <Card className="border-none bg-white shadow-sm">
            <CardHeader><CardTitle className="text-lg">Hotel Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Hotel Name</Label>
                  <Input value={hotelInfo.name} onChange={e => setHotelInfo({ ...hotelInfo, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input value={hotelInfo.location} onChange={e => setHotelInfo({ ...hotelInfo, location: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Timezone</Label>
                  <Input value={hotelInfo.timezone} onChange={e => setHotelInfo({ ...hotelInfo, timezone: e.target.value })} placeholder="e.g. Africa/Addis_Ababa" />
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Input value={hotelInfo.currency} onChange={e => setHotelInfo({ ...hotelInfo, currency: e.target.value })} placeholder="e.g. ETB, USD" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => save('info', { name: hotelInfo.name, location: hotelInfo.location })} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                  <Save className="w-4 h-4 mr-2" /> Save Info
                </Button>
                <Button onClick={() => save('timezone-currency-taxes', { timezone: hotelInfo.timezone, currency: hotelInfo.currency })} disabled={isSaving} variant="outline">
                  <Save className="w-4 h-4 mr-2" /> Save Timezone & Currency
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Notifications ── */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="border-none bg-white shadow-sm">
            <CardHeader><CardTitle className="text-lg">Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'newBooking', label: 'New Booking' },
                { key: 'cancellation', label: 'Cancellation' },
                { key: 'checkIn', label: 'Check-in' },
                { key: 'checkOut', label: 'Check-out' },
                { key: 'payment', label: 'Payment Received' },
                { key: 'maintenance', label: 'Maintenance Request' },
                { key: 'housekeeping', label: 'Housekeeping Status' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-2">
                  <Label>{n.label}</Label>
                  <Switch checked={notifications[n.key] ?? true} onCheckedChange={v => setNotifications({ ...notifications, [n.key]: v })} />
                </div>
              ))}
              <Button onClick={() => save('notifications', { notifications })} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                <Save className="w-4 h-4 mr-2" /> Save Notifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Payments ── */}
        <TabsContent value="payments" className="mt-6">
          <Card className="border-none bg-white shadow-sm">
            <CardHeader><CardTitle className="text-lg">Payment Methods</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((pm, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                  <span className="capitalize">{pm.replace(/_/g, ' ')}</span>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => {
                    const updated = paymentMethods.filter((_, idx) => idx !== i);
                    setPaymentMethods(updated);
                    save('payment-methods', { methods: updated });
                  }}>Remove</Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input value={newPaymentMethod} onChange={e => setNewPaymentMethod(e.target.value)} placeholder="e.g. cash, credit_card, chapa" className="flex-1" />
                <Button variant="outline" onClick={() => {
                  if (!newPaymentMethod.trim()) return;
                  const updated = [...paymentMethods, newPaymentMethod.trim().toLowerCase()];
                  setPaymentMethods(updated);
                  setNewPaymentMethod('');
                  save('payment-methods', { methods: updated });
                }}>Add</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Policies ── */}
        <TabsContent value="policies" className="mt-6">
          <Card className="border-none bg-white shadow-sm">
            <CardHeader><CardTitle className="text-lg">Booking & Cancellation Policies</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Cancellation Policy</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Deadline (hours before check-in)</Label>
                    <Input type="number" value={cancellationPolicy.deadlineHours} onChange={e => setCancellationPolicy({ ...cancellationPolicy, deadlineHours: parseInt(e.target.value) })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Cancellation Fee (%)</Label>
                    <Input type="number" value={cancellationPolicy.feePercent} onChange={e => setCancellationPolicy({ ...cancellationPolicy, feePercent: parseFloat(e.target.value) })} />
                  </div>
                </div>
                <Button onClick={() => save('cancellation-policy', { policy: cancellationPolicy })} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                  <Save className="w-4 h-4 mr-2" /> Save Cancellation Policy
                </Button>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-semibold">Booking Policies</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Check-in Time</Label>
                    <Input value={bookingPolicies.checkInTime} onChange={e => setBookingPolicies({ ...bookingPolicies, checkInTime: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Check-out Time</Label>
                    <Input value={bookingPolicies.checkOutTime} onChange={e => setBookingPolicies({ ...bookingPolicies, checkOutTime: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Allow Online Booking</Label>
                  <Switch checked={bookingPolicies.allowOnline} onCheckedChange={v => setBookingPolicies({ ...bookingPolicies, allowOnline: v })} />
                </div>
                <Button onClick={() => save('booking-policies', bookingPolicies)} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                  <Save className="w-4 h-4 mr-2" /> Save Booking Policies
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Profile ── */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card className="border-none bg-white shadow-sm">
            <CardHeader><CardTitle className="text-lg">Profile Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input value={profileName} onChange={e => setProfileName(e.target.value)} className="max-w-sm" />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={user?.email ?? ''} disabled className="max-w-sm text-muted-foreground" />
              </div>
              <Button onClick={handleUpdateProfile} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                <Save className="w-4 h-4 mr-2" /> Update Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm">
            <CardHeader><CardTitle className="text-lg">Change Password</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Current Password</Label>
                <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="max-w-sm" />
              </div>
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="max-w-sm" />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="max-w-sm" />
              </div>
              <Button onClick={handleChangePassword} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                <Save className="w-4 h-4 mr-2" /> Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
