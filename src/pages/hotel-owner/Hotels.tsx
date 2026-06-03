import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { HotelsHeader } from '@/components/hotel-owner/hotels/HotelsHeader';
import { CreateHotelForm } from '@/components/hotel-owner/hotels/CreateHotelForm';
import { HotelsTable } from '@/components/hotel-owner/hotels/HotelsTable';
import { HotelDetailSheet } from '@/components/hotel-owner/hotels/HotelDetailSheet';

interface Hotel {
  id: string;
  name: string;
  location: string;
  status: string;
  currency: string;
  timezone: string;
  slug?: string;
  ownerName?: string;
  ownerEmail?: string;
  maintenanceMode?: boolean;
  branding?: { logoUrl?: string };
  settings?: {
    taxes?: Record<string, any>;
    bookingPolicies?: Record<string, any>;
    modulesEnabled?: Record<string, boolean>;
    notifications?: Record<string, any>;
    admins?: string[];
  };
  cancellationPolicy?: Record<string, any>;
  paymentMethods?: any[];
}

export function HotelsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => { fetchHotels(); }, []);

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('hotel/owner/hotels');
      setHotels(data.data || data || []);
    } catch (e: any) {
      toast.error('Failed to fetch hotels: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await api.patch(`hotel/owner/hotels/${id}/activate`, { active });
      toast.success(`Hotel ${active ? 'activated' : 'deactivated'}`);
      fetchHotels();
    } catch (e: any) {
      toast.error('Failed to update status: ' + e.message);
    }
  };

  const openHotel = (h: Hotel) => {
    setSelectedHotel(h);
    setIsPanelOpen(true);
  };

  const handlePanelChange = (open: boolean) => {
    setIsPanelOpen(open);
    if (!open) fetchHotels();
  };

  return (
    <div className="space-y-6 pb-10">
      <HotelsHeader isCreating={isCreating} onToggleCreate={() => setIsCreating(!isCreating)} />

      {isCreating && <CreateHotelForm onSuccess={() => { setIsCreating(false); fetchHotels(); }} />}

      <div className="border rounded-lg">
        <HotelsTable hotels={hotels} isLoading={isLoading} onToggleActive={toggleActive} onManage={openHotel} />
      </div>

      <HotelDetailSheet hotel={selectedHotel} open={isPanelOpen} onOpenChange={handlePanelChange} />
    </div>
  );
}
