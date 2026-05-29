import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, Pencil, Tag, TrendingUp, Calendar, LayoutList } from 'lucide-react';
import { api } from '@/lib/api';
import { usePricingData } from '@/hooks/usePricingData';
import { toast } from 'sonner';
import type { Promotion, SeasonalRate, RatePlan } from '@/hooks/usePricingData';
import {
  OverrideDialog,
  PromotionDialog,
  SeasonalRateDialog,
  RatePlanDialog,
} from '@/components/shared/PricingDialogs';

// ─── Simple inline modal ──────────────────────────────────────────────────────
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-[#0F1B2D]">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export function PricingPage() {
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
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Pricing Management</h1>
        <p className="text-sm text-muted-foreground">Configure rates, overrides, promotions and seasonal pricing</p>
      </div>

      {/* Price Overrides */}
      <Section title="Price Overrides" desc="Fixed price for a specific room type on a specific date" icon={Calendar} onAdd={() => open('override')} loading={loading}>
        {overrides.length === 0 ? (
          <p className="text-center py-6 text-sm text-muted-foreground">No price overrides yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-xs text-gray-500">
                <th className="py-2 px-3">Room Type</th><th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Price</th><th className="py-2 px-3">Reason</th><th className="py-2 px-3" />
              </tr></thead>
              <tbody>
                {overrides.map(o => (
                  <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium">{o.roomType?.name ?? rtName(o.roomTypeId)}</td>
                    <td className="py-2 px-3">{o.date}</td>
                    <td className="py-2 px-3 font-semibold text-[#C9973A]">${o.price}</td>
                    <td className="py-2 px-3 text-xs text-muted-foreground">{o.reason ?? '—'}</td>
                    <td className="py-2 px-3">
                      <Button variant="ghost" size="sm" onClick={() => del(`hotel/pricing/overrides/${o.id}`)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Promotions */}
      <Section title="Promotions" desc="Discount codes and time-limited offers" icon={Tag} onAdd={() => open('promotion')} loading={loading}>
        {promotions.length === 0 ? (
          <p className="text-center py-6 text-sm text-muted-foreground">No promotions yet</p>
        ) : (
          <div className="space-y-2">
            {promotions.map((p: Promotion) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-[#C9973A]/30">
                <div>
                  <span className="font-medium text-sm text-[#0F1B2D]">{p.name}</span>
                  {p.code && <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{p.code}</span>}
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {p.discountType === 'percentage' ? `${p.discountValue}% off` : `$${p.discountValue} off`}
                    {' · '}{p.startDate} → {p.endDate}
                    {p.roomTypeId && ` · ${p.roomType?.name ?? rtName(p.roomTypeId)}`}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => open('promotion', p)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => del(`hotel/pricing/promotions/${p.id}`)}><Trash2 className="w-3.5 h-3.5 text-red-500" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Seasonal Rates */}
      <Section title="Seasonal Rates" desc="Fixed price or multiplier for date ranges" icon={TrendingUp} onAdd={() => open('seasonal')} loading={loading}>
        {seasonalRates.length === 0 ? (
          <p className="text-center py-6 text-sm text-muted-foreground">No seasonal rates yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {seasonalRates.map((s: SeasonalRate) => (
              <div key={s.id} className="p-3 rounded-lg border border-gray-100 hover:border-[#C9973A]/30">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm text-[#0F1B2D]">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.roomType?.name ?? rtName(s.roomTypeId)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.startDate} → {s.endDate}</p>
                    <p className="text-sm font-semibold text-[#C9973A] mt-1">
                      {s.fixedPrice ? `$${s.fixedPrice} fixed` : s.multiplier ? `×${s.multiplier}` : '—'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => open('seasonal', s)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => del(`hotel/pricing/seasonal-rates/${s.id}`)}><Trash2 className="w-3.5 h-3.5 text-red-500" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Rate Plans */}
      <Section title="Rate Plans" desc="Weekday / weekend price adjustments per room type" icon={LayoutList} onAdd={() => open('rateplan')} loading={loading}>
        {ratePlans.length === 0 ? (
          <p className="text-center py-6 text-sm text-muted-foreground">No rate plans yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-xs text-gray-500">
                <th className="py-2 px-3">Name</th><th className="py-2 px-3">Room Type</th>
                <th className="py-2 px-3">Weekday %</th><th className="py-2 px-3">Weekend %</th>
                <th className="py-2 px-3">Status</th><th className="py-2 px-3" />
              </tr></thead>
              <tbody>
                {ratePlans.map((r: RatePlan) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium">{r.name}</td>
                    <td className="py-2 px-3">{r.roomType?.name ?? rtName(r.roomTypeId)}</td>
                    <td className="py-2 px-3">{r.weekdayAdjustment > 0 ? '+' : ''}{r.weekdayAdjustment}%</td>
                    <td className="py-2 px-3">{r.weekendAdjustment > 0 ? '+' : ''}{r.weekendAdjustment}%</td>
                    <td className="py-2 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {r.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-2 px-3 flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => open('rateplan', r)}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => del(`hotel/pricing/rate-plans/${r.id}`)}><Trash2 className="w-3.5 h-3.5 text-red-500" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Modals */}
      {modal === 'override' && (
        <Modal title="Add Price Override" onClose={close}>
          <OverrideDialog roomTypes={roomTypes} onDone={done} onClose={close} />
        </Modal>
      )}
      {modal === 'promotion' && (
        <Modal title={editing ? 'Edit Promotion' : 'Create Promotion'} onClose={close}>
          <PromotionDialog roomTypes={roomTypes} onDone={done} onClose={close} initial={editing} />
        </Modal>
      )}
      {modal === 'seasonal' && (
        <Modal title={editing ? 'Edit Seasonal Rate' : 'Add Seasonal Rate'} onClose={close}>
          <SeasonalRateDialog roomTypes={roomTypes} onDone={done} onClose={close} initial={editing} />
        </Modal>
      )}
      {modal === 'rateplan' && (
        <Modal title={editing ? 'Edit Rate Plan' : 'Add Rate Plan'} onClose={close}>
          <RatePlanDialog roomTypes={roomTypes} onDone={done} onClose={close} initial={editing} />
        </Modal>
      )}
    </div>
  );
}
