import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Bell,
  CreditCard,
  FileText,
  User,
  Building2,
  Image,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import {
  HotelInfoTab,
  NotificationsTab,
  PaymentsTab,
  PoliciesTab,
  BrandingTab,
  ProfileTab,
} from "@/components/hotel-admin/settings";

export function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const [hotelId, setHotelId] = useState<string | null>(user?.hotel_id ?? null);
  const [settingsData, setSettingsData] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);

      let h: any = null;
      if (user?.hotel_id) {
        const res = await api.get(`hotel/owner/hotels/${user.hotel_id}`);
        h = res.data ?? res;
      } else {
        const res = await api.get("hotel/owner/hotels");
        const hotels = res.data ?? res ?? [];
        h = Array.isArray(hotels) ? hotels[0] : hotels;
      }

      if (h?.id) {
        setHotelId(h.id);
        setSettingsData(h);
      }
    } catch (e: any) {
      toast.error("Failed to load settings: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !settingsData) {
    return (
      <div className='space-y-6 pb-10'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-96 w-full' />
      </div>
    );
  }

  return (
    <div className='space-y-8 pb-10'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-serif text-[#0F1B2D]'>
          System Settings
        </h1>
        <p className='text-sm text-muted-foreground'>
          Configure hotel system preferences and policies
        </p>
      </div>

      <Tabs defaultValue='hotel' className='w-full'>
        <TabsList className='bg-white border border-[#E5E7EB] flex-wrap h-auto gap-1'>
          <TabsTrigger
            value='hotel'
            className='data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white'
          >
            <Building2 className='w-4 h-4 mr-2' /> Hotel Info
          </TabsTrigger>
          <TabsTrigger
            value='notifications'
            className='data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white'
          >
            <Bell className='w-4 h-4 mr-2' /> Notifications
          </TabsTrigger>
          <TabsTrigger
            value='payments'
            className='data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white'
          >
            <CreditCard className='w-4 h-4 mr-2' /> Payments
          </TabsTrigger>
          <TabsTrigger
            value='policies'
            className='data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white'
          >
            <FileText className='w-4 h-4 mr-2' /> Policies
          </TabsTrigger>
          <TabsTrigger
            value='branding'
            className='data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white'
          >
            <Image className='w-4 h-4 mr-2' /> Branding
          </TabsTrigger>
          <TabsTrigger
            value='profile'
            className='data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white'
          >
            <User className='w-4 h-4 mr-2' /> Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value='hotel' className='mt-6'>
          <HotelInfoTab
            hotelId={hotelId!}
            initialInfo={{ name: settingsData.name, location: settingsData.location }}
            initialLocalization={{ timezone: settingsData.timezone, currency: settingsData.currency }}
          />
        </TabsContent>

        <TabsContent value='notifications' className='mt-6'>
          <NotificationsTab
            hotelId={hotelId!}
            initialNotifications={settingsData.settings?.notifications ?? {}}
          />
        </TabsContent>

        <TabsContent value='payments' className='mt-6'>
          <PaymentsTab
            hotelId={hotelId!}
            initialPaymentMethods={Array.isArray(settingsData.paymentMethods) ? settingsData.paymentMethods : []}
          />
        </TabsContent>

        <TabsContent value='policies' className='mt-6'>
          <PoliciesTab
            hotelId={hotelId!}
            initialCancellationPolicy={settingsData.cancellationPolicy ?? { deadlineHours: 24, feePercent: 0 }}
            initialBookingPolicies={settingsData.settings?.bookingPolicies ?? { checkInTime: "14:00", checkOutTime: "11:00", allowOnline: true }}
          />
        </TabsContent>

        <TabsContent value='branding' className='mt-6'>
          <BrandingTab
            hotelId={hotelId!}
            initialBranding={settingsData.branding ?? {}}
          />
        </TabsContent>

        <TabsContent value='profile' className='mt-6'>
          <ProfileTab initialName={user?.name ?? ""} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
