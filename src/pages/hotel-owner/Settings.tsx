import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Building2, Bell, CreditCard, FileText, Image, User } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { HotelInfo } from '@/components/hotel-owner/settings/HotelInfo';
import { NotificationsSettings } from '@/components/hotel-owner/settings/NotificationsSettings';
import { PaymentMethods } from '@/components/hotel-owner/settings/PaymentMethods';
import { BookingPolicies } from '@/components/hotel-owner/settings/BookingPolicies';
import { BrandingSettings } from '@/components/hotel-owner/settings/BrandingSettings';
import { ProfileSettings } from '@/components/hotel-owner/settings/ProfileSettings';

export function OwnerSettings() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hotels, setHotels] = useState<any[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');

  const [hotelInfo, setHotelInfo] = useState({ name: '', location: '', timezone: 'UTC', currency: 'ETB' });
  const [notifications, setNotifications] = useState<Record<string, boolean>>({});
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [cancellationPolicy, setCancellationPolicy] = useState({ deadlineHours: 24, feePercent: 0 });
  const [bookingPolicies, setBookingPolicies] = useState({ checkInTime: '14:00', checkOutTime: '11:00', allowOnline: true });
  const [branding, setBranding] = useState<Record<string, any>>({});

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('hotel/owner/hotels');
      const list: any[] = res.data ?? res ?? [];
      setHotels(list);
      const firstId = user?.hotel_id ?? list[0]?.id ?? '';
      if (firstId) {
        setSelectedHotelId(firstId);
        applyHotel(firstId, list);
      }
    } catch (e: any) {
      toast.error('Failed to load hotels: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const applyHotel = (id: string, list?: any[]) => {
    const h = (list ?? hotels).find((x) => x.id === id);
    if (!h) return;
    setHotelInfo({ name: h.name ?? '', location: h.location ?? '', timezone: h.timezone ?? 'UTC', currency: h.currency ?? 'ETB' });
    setNotifications(h.settings?.notifications ?? {});
    setPaymentMethods(Array.isArray(h.paymentMethods) ? h.paymentMethods : []);
    setCancellationPolicy(h.cancellationPolicy ?? { deadlineHours: 24, feePercent: 0 });
    setBookingPolicies(h.settings?.bookingPolicies ?? { checkInTime: '14:00', checkOutTime: '11:00', allowOnline: true });
    setBranding(h.branding ?? {});
  };

  if (isLoading)
    return (
      <div className='space-y-6 pb-10'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-96 w-full' />
      </div>
    );

  return (
    <div className='space-y-8 pb-10'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-serif text-[#0F1B2D]'>Settings</h1>
        <p className='text-sm text-muted-foreground'>Manage your account and hotel configuration</p>
      </div>

      <Tabs defaultValue='hotel' className='w-full'>
        <TabsList className='bg-white border border-[#E5E7EB] flex-wrap h-auto gap-1'>
          <TabsTrigger value='hotel' className='data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white'>
            <Building2 className='w-4 h-4 mr-2' /> Hotel
          </TabsTrigger>
          <TabsTrigger value='notifications' className='data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white'>
            <Bell className='w-4 h-4 mr-2' /> Notifications
          </TabsTrigger>
          <TabsTrigger value='payments' className='data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white'>
            <CreditCard className='w-4 h-4 mr-2' /> Payments
          </TabsTrigger>
          <TabsTrigger value='policies' className='data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white'>
            <FileText className='w-4 h-4 mr-2' /> Policies
          </TabsTrigger>
          <TabsTrigger value='branding' className='data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white'>
            <Image className='w-4 h-4 mr-2' /> Branding
          </TabsTrigger>
          <TabsTrigger value='profile' className='data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white'>
            <User className='w-4 h-4 mr-2' /> Profile
          </TabsTrigger>
        </TabsList>

        {hotels.length > 1 && (
          <div className='mt-4 flex items-center gap-3'>
            <Label className='shrink-0 text-sm'>Hotel:</Label>
            <Select value={selectedHotelId} onValueChange={(id) => { if (id) { setSelectedHotelId(id); applyHotel(id); } }}>
              <SelectTrigger className='w-64 bg-white'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hotels.map((h) => (
                  <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <TabsContent value='hotel' className='mt-6'>
          <HotelInfo key={selectedHotelId} selectedHotelId={selectedHotelId} hotelInfo={hotelInfo} />
        </TabsContent>
        <TabsContent value='notifications' className='mt-6'>
          <NotificationsSettings key={selectedHotelId} selectedHotelId={selectedHotelId} notifications={notifications} />
        </TabsContent>
        <TabsContent value='payments' className='mt-6'>
          <PaymentMethods key={selectedHotelId} selectedHotelId={selectedHotelId} paymentMethods={paymentMethods} />
        </TabsContent>
        <TabsContent value='policies' className='mt-6'>
          <BookingPolicies key={selectedHotelId} selectedHotelId={selectedHotelId} cancellationPolicy={cancellationPolicy} bookingPolicies={bookingPolicies} />
        </TabsContent>
        <TabsContent value='branding' className='mt-6'>
          <BrandingSettings key={selectedHotelId} selectedHotelId={selectedHotelId} branding={branding} />
        </TabsContent>
        <TabsContent value='profile' className='mt-6'>
          <ProfileSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
