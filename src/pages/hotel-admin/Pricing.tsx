import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, Pencil, Tag, TrendingUp, Calendar, LayoutList } from 'lucide-react';
import { api } from '@/lib/api';
import { usePricingData } from '@/hooks/usePricingData';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import type { Promotion, SeasonalRate, RatePlan } from '@/hooks/usePricingData';
import {
  OverrideDialog,
  PromotionDialog,
  SeasonalRateDialog,
  RatePlanDialog,
} from '@/components/shared/PricingDialogs';

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-[#0F1B2D]">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Section({ title, desc, icon: Icon, onAdd, children, loading }: {
  title: string; desc: string; icon: any; onAdd: () => void; children: React.ReactNode; loading: boolean;
}) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#C9973A]/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#C9973A]" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-xs">{desc}</CardDescription>
          </div>
        </div>
        <Button size="sm" className="bg-[#0F1B2D] hover:bg-[#1a2a3a]" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">{Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : children}
      </CardContent>
    </Card>
  );
}

export function AdminPricing() {
  const { roomTypes, overrides, promotions, seasonalRates, ratePlans, loading, reload } = usePricingData();

  type ModalType = 'override' | 'promotion' | 'seasonal' | 'rateplan' | null;
  const [modal, setModal] = useState<ModalType>(null);
  const [editing, setEditing] = useState<any>(null);

  const open = (type: ModalType, item?: any) => { setEditing(item ?? null); setModal(type); };
  const close = () => { setModal(null); setEditing(null); };
  const done = () => { close(); reload(); };

  const del = async (endpoint: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete(endpoint);
      toast.success('Item deleted');
      reload();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete item');
    }
  };

  const rtName = (id?: string) => roomTypes.find(r => r.id === id)?.name ?? '—';

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Pricing Management</h1>
        <p className="text-sm text-muted-foreground">Configure rates, overrides, promotions and seasonal pricing</p>
      </div>

      <Section title="Price Overrides" desc="Room-specific rate overrides" icon={Tag}
        onAdd={() => open('override')} loading={loading}>
        {overrides.length === 0 ? (
          <p className="text-sm text-muted-foreground py-3">No overrides configured</p>
        ) : (
          <div className="space-y-2">
            {overrides.map(o => (
              <div key={o.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
                <div className="flex-1">
                  <span className="font-medium text-[#0F1B2D]">Room {o.roomNumber || o.roomId}</span>
                  <span className="ml-2 text-muted-foreground">→ {formatCurrency(o.price)}/night</span>
                  {o.reason && <span className="ml-2 text-xs text-muted-foreground italic">({o.reason})</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => open('override', o)} className="text-gray-400 hover:text-[#C9973A]">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => del(`hotel/pricing/overrides/${o.id}`)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Promotions" desc="Time-limited promotional discounts" icon={TrendingUp}
        onAdd={() => open('promotion')} loading={loading}>
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
                      {p.discountType === 'percentage' ? `${p.discountValue}%` : formatCurrency(p.discountValue)} OFF
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {p.startDate && formatDate(p.startDate)} — {p.endDate && formatDate(p.endDate)}
                    {p.roomTypeId && ` · ${rtName(p.roomTypeId)}`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => open('promotion', p)} className="text-gray-400 hover:text-[#C9973A]">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => del(`hotel/pricing/promotions/${p.id}`)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Seasonal Rates" desc="Date-based rate adjustments" icon={Calendar}
        onAdd={() => open('seasonal')} loading={loading}>
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
                    {s.adjustmentType === 'percentage' ? `${s.adjustmentValue}%` : formatCurrency(s.adjustmentValue)}
                    {s.adjustmentType === 'percentage' ? ' adjustment' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => open('seasonal', s)} className="text-gray-400 hover:text-[#C9973A]">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => del(`hotel/pricing/seasonal-rates/${s.id}`)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Rate Plans" desc="Pre-defined pricing packages" icon={LayoutList}
        onAdd={() => open('rateplan')} loading={loading}>
        {ratePlans.length === 0 ? (
          <p className="text-sm text-muted-foreground py-3">No rate plans defined</p>
        ) : (
          <div className="space-y-2">
            {ratePlans.map(r => (
              <div key={r.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
                <div className="flex-1">
                  <span className="font-medium text-[#0F1B2D]">{r.name}</span>
                  {r.description && <span className="ml-2 text-muted-foreground">{r.description}</span>}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {r.roomTypeId ? rtName(r.roomTypeId) : 'All types'} · {r.nightMin ?? 1}n min
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => open('rateplan', r)} className="text-gray-400 hover:text-[#C9973A]">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => del(`hotel/pricing/rate-plans/${r.id}`)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {modal === 'override' && (
        <Modal title={editing ? 'Edit Override' : 'New Price Override'} onClose={close}>
          <OverrideDialog initial={editing} roomTypes={roomTypes} onDone={done} onCancel={close} />
        </Modal>
      )}
      {modal === 'promotion' && (
        <Modal title={editing ? 'Edit Promotion' : 'New Promotion'} onClose={close}>
          <PromotionDialog initial={editing} roomTypes={roomTypes} onDone={done} onCancel={close} />
        </Modal>
      )}
      {modal === 'seasonal' && (
        <Modal title={editing ? 'Edit Seasonal Rate' : 'New Seasonal Rate'} onClose={close}>
          <SeasonalRateDialog initial={editing} roomTypes={roomTypes} onDone={done} onCancel={close} />
        </Modal>
      )}
      {modal === 'rateplan' && (
        <Modal title={editing ? 'Edit Rate Plan' : 'New Rate Plan'} onClose={close}>
          <RatePlanDialog initial={editing} roomTypes={roomTypes} onDone={done} onCancel={close} />
        </Modal>
      )}
    </div>
  );
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0 }).format(v);
}
