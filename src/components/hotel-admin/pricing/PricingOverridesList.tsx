import { Pencil, Trash2, Tag } from 'lucide-react';
import { PricingSection } from './PricingSection';
import { formatCurrency } from '@/lib/utils';
import type { PriceOverride, RoomType } from '@/hooks/usePricingData';

interface PricingOverridesListProps {
  overrides: PriceOverride[];
  roomTypes: RoomType[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (item: PriceOverride) => void;
  onDelete: (id: string) => void;
}

function rtName(id: string | undefined, roomTypes: RoomType[]) {
  return roomTypes.find(r => r.id === id)?.name ?? '—';
}

export function PricingOverridesList({ overrides, roomTypes, loading, onAdd, onEdit, onDelete }: PricingOverridesListProps) {
  return (
    <PricingSection title="Price Overrides" desc="Room-specific rate overrides" icon={Tag} onAdd={onAdd} loading={loading}>
      {overrides.length === 0 ? (
        <p className="text-sm text-muted-foreground py-3">No overrides configured</p>
      ) : (
        <div className="space-y-2">
          {overrides.map(o => (
            <div key={o.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
              <div className="flex-1">
                <span className="font-medium text-[#0F1B2D]">{rtName(o.roomTypeId, roomTypes)}</span>
                <span className="ml-2 text-muted-foreground">→ {formatCurrency(o.price, 'ETB', 0)}/night</span>
                {o.reason && <span className="ml-2 text-xs text-muted-foreground italic">({o.reason})</span>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onEdit(o)} className="text-gray-400 hover:text-[#C9973A]">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(`hotel/pricing/overrides/${o.id}`)} className="text-red-500 hover:text-red-700">
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
