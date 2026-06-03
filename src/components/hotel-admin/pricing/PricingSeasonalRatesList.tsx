import { Pencil, Trash2, Calendar } from 'lucide-react';
import { PricingSection } from './PricingSection';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { SeasonalRate, RoomType } from '@/hooks/usePricingData';

interface PricingSeasonalRatesListProps {
  seasonalRates: SeasonalRate[];
  roomTypes: RoomType[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (item: SeasonalRate) => void;
  onDelete: (id: string) => void;
}

export function PricingSeasonalRatesList({ seasonalRates, loading, onAdd, onEdit, onDelete }: PricingSeasonalRatesListProps) {
  return (
    <PricingSection title="Seasonal Rates" desc="Date-based rate adjustments" icon={Calendar} onAdd={onAdd} loading={loading}>
      {seasonalRates.length === 0 ? (
        <p className="text-sm text-muted-foreground py-3">No seasonal rates configured</p>
      ) : (
        <div className="space-y-2">
          {seasonalRates.map(s => (
            <div key={s.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
              <div className="flex-1">
                <span className="font-medium text-[#0F1B2D]">{s.name}</span>
                <span className="ml-2 text-muted-foreground">
                  {s.startDate && formatDate(s.startDate)} — {s.endDate && formatDate(s.endDate)}
                </span>
                <span className="ml-2 font-medium text-[#C9973A]">
                  {s.fixedPrice != null ? formatCurrency(s.fixedPrice, 'ETB', 0) : s.multiplier != null ? `${Math.round((s.multiplier - 1) * 100)}% adjustment` : '—'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onEdit(s)} className="text-gray-400 hover:text-[#C9973A]">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(`hotel/pricing/seasonal-rates/${s.id}`)} className="text-red-500 hover:text-red-700">
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
