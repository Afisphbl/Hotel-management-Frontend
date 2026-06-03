import { Pencil, Trash2, LayoutList } from 'lucide-react';
import { PricingSection } from './PricingSection';
import type { RatePlan, RoomType } from '@/hooks/usePricingData';

interface PricingRatePlansListProps {
  ratePlans: RatePlan[];
  roomTypes: RoomType[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (item: RatePlan) => void;
  onDelete: (id: string) => void;
}

function rtName(id: string | undefined, roomTypes: RoomType[]) {
  return roomTypes.find(r => r.id === id)?.name ?? '—';
}

export function PricingRatePlansList({ ratePlans, roomTypes, loading, onAdd, onEdit, onDelete }: PricingRatePlansListProps) {
  return (
    <PricingSection title="Rate Plans" desc="Pre-defined pricing packages" icon={LayoutList} onAdd={onAdd} loading={loading}>
      {ratePlans.length === 0 ? (
        <p className="text-sm text-muted-foreground py-3">No rate plans defined</p>
      ) : (
        <div className="space-y-2">
          {ratePlans.map(r => (
            <div key={r.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
              <div className="flex-1">
                <span className="font-medium text-[#0F1B2D]">{r.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {r.roomTypeId ? rtName(r.roomTypeId, roomTypes) : 'All types'} · Wkdy: {r.weekdayAdjustment}% · Wknd: {r.weekendAdjustment}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onEdit(r)} className="text-gray-400 hover:text-[#C9973A]">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(`hotel/pricing/rate-plans/${r.id}`)} className="text-red-500 hover:text-red-700">
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
