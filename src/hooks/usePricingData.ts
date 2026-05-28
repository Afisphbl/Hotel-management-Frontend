import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface RoomType { id: string; name: string; basePrice: number; }
export interface PriceOverride { id: string; roomTypeId: string; date: string; price: number; reason?: string; roomType?: RoomType; }
export interface Promotion { id: string; name: string; code?: string; roomTypeId?: string; discountType: 'percentage' | 'fixed'; discountValue: number; startDate: string; endDate: string; isActive: boolean; roomType?: RoomType; }
export interface SeasonalRate { id: string; name: string; roomTypeId: string; startDate: string; endDate: string; fixedPrice?: number; multiplier?: number; priority: number; isActive: boolean; roomType?: RoomType; }
export interface RatePlan { id: string; name: string; roomTypeId: string; weekdayAdjustment: number; weekendAdjustment: number; isActive: boolean; roomType?: RoomType; }

function unwrap(res: any) { return res?.data ?? res; }

export function usePricingData() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [overrides, setOverrides] = useState<PriceOverride[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [seasonalRates, setSeasonalRates] = useState<SeasonalRate[]>([]);
  const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rt, ov, pr, sr, rp] = await Promise.all([
        api.get('hotel/room-types').then(unwrap),
        api.get('hotel/pricing/overrides').then(unwrap),
        api.get('hotel/pricing/promotions').then(unwrap),
        api.get('hotel/pricing/seasonal-rates').then(unwrap),
        api.get('hotel/pricing/rate-plans').then(unwrap),
      ]);
      setRoomTypes(Array.isArray(rt) ? rt : rt?.items ?? []);
      setOverrides(Array.isArray(ov) ? ov : []);
      setPromotions(Array.isArray(pr) ? pr : []);
      setSeasonalRates(Array.isArray(sr) ? sr : []);
      setRatePlans(Array.isArray(rp) ? rp : []);
    } catch (e) {
      console.error('Failed to load pricing data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { roomTypes, overrides, promotions, seasonalRates, ratePlans, loading, reload: load };
}
