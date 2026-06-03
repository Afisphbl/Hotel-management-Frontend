import { Pencil, Trash2, TrendingUp } from 'lucide-react';
import { PricingSection } from './PricingSection';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Promotion, RoomType } from '@/hooks/usePricingData';

interface PricingPromotionsListProps {
  promotions: Promotion[];
  roomTypes: RoomType[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (item: Promotion) => void;
  onDelete: (id: string) => void;
}

function rtName(id: string | undefined, roomTypes: RoomType[]) {
  return roomTypes.find(r => r.id === id)?.name ?? '—';
}

export function PricingPromotionsList({ promotions, roomTypes, loading, onAdd, onEdit, onDelete }: PricingPromotionsListProps) {
  return (
    <PricingSection title="Promotions" desc="Time-limited promotional discounts" icon={TrendingUp} onAdd={onAdd} loading={loading}>
      {promotions.length === 0 ? (
        <p className="text-sm text-muted-foreground py-3">No promotions active</p>
      ) : (
        <div className="space-y-2">
          {promotions.map(p => (
            <div key={p.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#0F1B2D]">{p.name}</span>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">
                    {p.discountType === 'percentage' ? `${p.discountValue}%` : formatCurrency(p.discountValue, 'ETB', 0)} OFF
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {p.startDate && formatDate(p.startDate)} — {p.endDate && formatDate(p.endDate)}
                  {p.roomTypeId && ` · ${rtName(p.roomTypeId, roomTypes)}`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onEdit(p)} className="text-gray-400 hover:text-[#C9973A]">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(`hotel/pricing/promotions/${p.id}`)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PricingSection>
  );
}
