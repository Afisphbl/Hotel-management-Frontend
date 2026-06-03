import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Globe, FileText, Shield, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import {
  PropertyHeader,
  PropertyInfoTab,
  PropertyAboutTab,
  PropertyRegionalTab,
  PropertyModulesTab,
  PropertyPoliciesTab,
  PropertyNotificationsTab,
} from '@/components/hotel-admin/property';

export function PropertyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hotel, setHotel] = useState<any>(null);

  useEffect(() => { fetchHotel(); }, []);

  const fetchHotel = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('hotel/owner/hotels');
      const hotels = res.data || res || [];
      const h = Array.isArray(hotels) ? hotels[0] : hotels;
      if (h) setHotel(h);
    } catch (e: any) {
      toast.error('Failed to load property: ' + e.message);
    } finally {
      setIsLoading(false);
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

  const info = hotel ? {
    name: hotel.name || '',
    description: hotel.description || '',
    location: hotel.location || '',
    region: hotel.region || '',
    subdomain: hotel.subdomain || '',
    slug: hotel.slug || '',
    type: hotel.type || 'BOUTIQUE',
  } : null;

  const about = hotel?.settings?.aboutContent ?? null;

  const regional = hotel ? {
    timezone: hotel.timezone || 'UTC',
    currency: hotel.currency || 'ETB',
  } : null;

  const modulesData = hotel?.settings?.modulesEnabled ?? null;
  const notificationsData = hotel?.settings?.notifications ?? null;
  const settings = hotel?.settings || {};

  return (
    <div className="space-y-8 pb-10">
      <PropertyHeader />

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="bg-white border border-[#E5E7EB]">
          <TabsTrigger value="info" className="data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white">
            <Building2 className="w-4 h-4 mr-2" /> Info
          </TabsTrigger>
          <TabsTrigger value="about" className="data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" /> About
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
          <PropertyInfoTab initialData={info} hotelId={hotel?.id} />
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <PropertyAboutTab initialData={about} hotelId={hotel?.id} />
        </TabsContent>

        <TabsContent value="regional" className="mt-6">
          <PropertyRegionalTab initialData={regional} hotelId={hotel?.id} />
        </TabsContent>

        <TabsContent value="modules" className="mt-6">
          <PropertyModulesTab initialData={modulesData} hotelId={hotel?.id} settings={settings} />
        </TabsContent>

        <TabsContent value="policies" className="mt-6">
          <PropertyPoliciesTab initialData={{ cancellationPolicy: hotel?.cancellationPolicy || {}, bookingPolicies: settings?.bookingPolicies || {} }} hotelId={hotel?.id} settings={settings} />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <PropertyNotificationsTab initialData={notificationsData} hotelId={hotel?.id} settings={settings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
