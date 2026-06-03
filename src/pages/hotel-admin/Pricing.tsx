import { useState } from 'react';
import { api } from '@/lib/api';
import { usePricingData } from '@/hooks/usePricingData';
import { toast } from 'sonner';
import {
  PricingHeader,
  PricingOverridesList,
  PricingPromotionsList,
  PricingSeasonalRatesList,
  PricingRatePlansList,
} from '@/components/hotel-admin/pricing';
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

  return (
    <div className="space-y-6 pb-10">
      <PricingHeader />

      <PricingOverridesList
        overrides={overrides}
        roomTypes={roomTypes}
        loading={loading}
        onAdd={() => open('override')}
        onEdit={(item) => open('override', item)}
        onDelete={del}
      />

      <PricingPromotionsList
        promotions={promotions}
        roomTypes={roomTypes}
        loading={loading}
        onAdd={() => open('promotion')}
        onEdit={(item) => open('promotion', item)}
        onDelete={del}
      />

      <PricingSeasonalRatesList
        seasonalRates={seasonalRates}
        roomTypes={roomTypes}
        loading={loading}
        onAdd={() => open('seasonal')}
        onEdit={(item) => open('seasonal', item)}
        onDelete={del}
      />

      <PricingRatePlansList
        ratePlans={ratePlans}
        roomTypes={roomTypes}
        loading={loading}
        onAdd={() => open('rateplan')}
        onEdit={(item) => open('rateplan', item)}
        onDelete={del}
      />

      {modal === 'override' && (
        <Modal title={editing ? 'Edit Override' : 'New Price Override'} onClose={close}>
          <OverrideDialog initial={editing} roomTypes={roomTypes} onDone={done} onClose={close} />
        </Modal>
      )}
      {modal === 'promotion' && (
        <Modal title={editing ? 'Edit Promotion' : 'New Promotion'} onClose={close}>
          <PromotionDialog initial={editing} roomTypes={roomTypes} onDone={done} onClose={close} />
        </Modal>
      )}
      {modal === 'seasonal' && (
        <Modal title={editing ? 'Edit Seasonal Rate' : 'New Seasonal Rate'} onClose={close}>
          <SeasonalRateDialog initial={editing} roomTypes={roomTypes} onDone={done} onClose={close} />
        </Modal>
      )}
      {modal === 'rateplan' && (
        <Modal title={editing ? 'Edit Rate Plan' : 'New Rate Plan'} onClose={close}>
          <RatePlanDialog initial={editing} roomTypes={roomTypes} onDone={done} onClose={close} />
        </Modal>
      )}
    </div>
  );
}
