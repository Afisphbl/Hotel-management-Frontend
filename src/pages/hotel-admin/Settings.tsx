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
  Settings, Save, Bell, Shield, CreditCard, FileText, Globe, DollarSign, Clock,
} from 'lucide-react';
import { api } from '@/lib/api';

export function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hotelId, setHotelId] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<Record<string, boolean>>({});
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [cancellationPolicy, setCancellationPolicy] = useState({ deadlineHours: 24, feePercent: 0 });
  const [bookingPolicies, setBookingPolicies] = useState({ checkInTime: '14:00', checkOutTime: '11:00', allowOnline: true });
  const [newPaymentMethod, setNewPaymentMethod] = useState('');

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('hotel/owner/hotels');
      const hotels = res.data || res || [];
      const h = Array.isArray(hotels) ? hotels[0] : hotels;
      if (h?.id) {
        setHotelId(h.id);
        setNotifications(h.settings?.notifications || {});
        setPaymentMethods(h.paymentMethods || []);
        setCancellationPolicy(h.cancellationPolicy || { deadlineHours: 24, feePercent: 0 });
        setBookingPolicies(h.settings?.bookingPolicies || { checkInTime: '14:00', checkOutTime: '11:00', allowOnline: true });
      }
    } catch (e: any) {
      toast.error('Failed to load settings: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSection = async (section: string, data: any) => {
    if (!hotelId) return;
    setIsSaving(true);
    try {
      const endpoints: Record<string, string> = {
        notifications: `hotel/owner/hotels/${hotelId}/notifications`,
        'payment-methods': `hotel/owner/hotels/${hotelId}/payment-methods`,
        cancellation: `hotel/owner/hotels/${hotelId}/cancellation-policy`,
        policies: `hotel/owner/hotels/${hotelId}/booking-policies`,
      };
      await api.patch(endpoints[section], data);
      toast.success('Settings saved');
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
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">System Settings</h1>
        <p className="text-sm text-muted-foreground">Configure hotel system preferences and policies</p>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="bg-white border border-[#E5E7EB]">
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white">
            <CreditCard className="w-4 h-4 mr-2" /> Payments
          </TabsTrigger>
          <TabsTrigger value="policies" className="data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" /> Policies
          </TabsTrigger>
        </TabsList>

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
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-2">
                  <Label>{n.label}</Label>
                  <Switch
                    checked={notifications[n.key] ?? true}
                    onCheckedChange={(v) => setNotifications({ ...notifications, [n.key]: v })}
                  />
                </div>
              ))}
              <div className="pt-4">
                <Button onClick={() => saveSection('notifications', { notifications })} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                  <Save className="w-4 h-4 mr-2" /> Save Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card className="border-none bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {paymentMethods.map((pm, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                    <span className="capitalize">{pm.replace(/_/g, ' ')}</span>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => {
                      const updated = paymentMethods.filter((_, idx) => idx !== i);
                      setPaymentMethods(updated);
                      saveSection('payment-methods', { paymentMethods: updated });
                    }}>Remove</Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newPaymentMethod} onChange={e => setNewPaymentMethod(e.target.value)}
                  placeholder="e.g. cash, credit_card, chapa" className="flex-1" />
                <Button variant="outline" onClick={() => {
                  if (!newPaymentMethod.trim()) return;
                  const updated = [...paymentMethods, newPaymentMethod.trim().toLowerCase()];
                  setPaymentMethods(updated);
                  setNewPaymentMethod('');
                  saveSection('payment-methods', { paymentMethods: updated });
                }}>Add</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="mt-6">
          <Card className="border-none bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Booking & Cancellation Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Cancellation Policy</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Deadline (hours before check-in)</Label>
                    <Input type="number" value={cancellationPolicy.deadlineHours}
                      onChange={e => setCancellationPolicy({ ...cancellationPolicy, deadlineHours: parseInt(e.target.value) })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Cancellation Fee (%)</Label>
                    <Input type="number" value={cancellationPolicy.feePercent}
                      onChange={e => setCancellationPolicy({ ...cancellationPolicy, feePercent: parseFloat(e.target.value) })} />
                  </div>
                </div>
                <Button onClick={() => saveSection('cancellation', cancellationPolicy)} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                  <Save className="w-4 h-4 mr-2" /> Save Cancellation Policy
                </Button>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-semibold">Booking Policies</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Check-in Time</Label>
                    <Input value={bookingPolicies.checkInTime}
                      onChange={e => setBookingPolicies({ ...bookingPolicies, checkInTime: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Check-out Time</Label>
                    <Input value={bookingPolicies.checkOutTime}
                      onChange={e => setBookingPolicies({ ...bookingPolicies, checkOutTime: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Allow Online Booking</Label>
                  <Switch checked={bookingPolicies.allowOnline}
                    onCheckedChange={(v) => setBookingPolicies({ ...bookingPolicies, allowOnline: v })} />
                </div>
                <Button onClick={() => saveSection('policies', bookingPolicies)} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                  <Save className="w-4 h-4 mr-2" /> Save Booking Policies
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
