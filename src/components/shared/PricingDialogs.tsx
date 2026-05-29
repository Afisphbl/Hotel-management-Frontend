import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { RoomType, PriceOverride, Promotion, SeasonalRate, RatePlan } from '@/hooks/usePricingData';

interface Props { roomTypes: RoomType[]; onDone: () => void; onClose: () => void; }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium text-gray-600">{label}</Label>
      {children}
    </div>
  );
}

function RoomTypeSelect({ value, onChange, roomTypes }: { value: string; onChange: (v: string) => void; roomTypes: RoomType[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]">
      <option value="">Select room type</option>
      {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name} (${rt.basePrice}/night)</option>)}
    </select>
  );
}

// ─── Override Dialog ──────────────────────────────────────────────────────────
export function OverrideDialog({ roomTypes, onDone, onClose }: Props) {
  const [form, setForm] = useState({ roomTypeId: '', date: '', price: '', reason: '' });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.roomTypeId || !form.date || !form.price) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      await api.post('hotel/pricing/overrides', { ...form, price: Number(form.price) });
      toast.success('Price override created');
      onDone();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create override');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <Field label="Room Type"><RoomTypeSelect value={form.roomTypeId} onChange={v => set('roomTypeId', v)} roomTypes={roomTypes} /></Field>
      <Field label="Date"><Input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></Field>
      <Field label="Override Price ($)"><Input type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. 200" /></Field>
      <Field label="Reason (optional)"><Input value={form.reason} onChange={e => set('reason', e.target.value)} placeholder="e.g. Holiday weekend" /></Field>
      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <Button onClick={submit} disabled={saving} className="flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]">{saving ? 'Saving…' : 'Save'}</Button>
      </div>
    </div>
  );
}

// ─── Promotion Dialog ─────────────────────────────────────────────────────────
export function PromotionDialog({ roomTypes, onDone, onClose, initial }: Props & { initial?: Promotion }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '', code: initial?.code ?? '', roomTypeId: initial?.roomTypeId ?? '',
    discountType: initial?.discountType ?? 'percentage', discountValue: String(initial?.discountValue ?? ''),
    startDate: initial?.startDate ?? '', endDate: initial?.endDate ?? '', isActive: initial?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.discountValue || !form.startDate || !form.endDate) {
      toast.error('Please fill in required fields (Name, Value, Dates)');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, discountValue: Number(form.discountValue), roomTypeId: form.roomTypeId || null };
      if (initial?.id) {
        await api.patch(`hotel/pricing/promotions/${initial.id}`, payload);
        toast.success('Promotion updated');
      } else {
        await api.post('hotel/pricing/promotions', payload);
        toast.success('Promotion created');
      }
      onDone();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save promotion');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <Field label="Name"><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Early Bird" /></Field>
      <Field label="Promo Code (optional)"><Input value={form.code} onChange={e => set('code', e.target.value)} placeholder="e.g. EARLY20" /></Field>
      <Field label="Room Type (leave blank for all)"><RoomTypeSelect value={form.roomTypeId} onChange={v => set('roomTypeId', v)} roomTypes={roomTypes} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Discount Type">
          <select value={form.discountType} onChange={e => set('discountType', e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]">
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount ($)</option>
          </select>
        </Field>
        <Field label="Value"><Input type="number" min="0" value={form.discountValue} onChange={e => set('discountValue', e.target.value)} placeholder="e.g. 15" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Start Date"><Input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} /></Field>
        <Field label="End Date"><Input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} /></Field>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="promo-active" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4" />
        <Label htmlFor="promo-active" className="text-sm">Active</Label>
      </div>
      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <Button onClick={submit} disabled={saving} className="flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]">{saving ? 'Saving…' : 'Save'}</Button>
      </div>
    </div>
  );
}

// ─── Seasonal Rate Dialog ─────────────────────────────────────────────────────
export function SeasonalRateDialog({ roomTypes, onDone, onClose, initial }: Props & { initial?: SeasonalRate }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '', roomTypeId: initial?.roomTypeId ?? '',
    startDate: initial?.startDate ?? '', endDate: initial?.endDate ?? '',
    fixedPrice: String(initial?.fixedPrice ?? ''), multiplier: String(initial?.multiplier ?? ''),
    priority: String(initial?.priority ?? '0'), isActive: initial?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.roomTypeId || !form.startDate || !form.endDate) {
      toast.error('Please fill in required fields (Name, Room Type, Dates)');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        fixedPrice: form.fixedPrice ? Number(form.fixedPrice) : null,
        multiplier: form.multiplier ? Number(form.multiplier) : null,
        priority: Number(form.priority),
      };
      if (initial?.id) {
        await api.patch(`hotel/pricing/seasonal-rates/${initial.id}`, payload);
        toast.success('Seasonal rate updated');
      } else {
        await api.post('hotel/pricing/seasonal-rates', payload);
        toast.success('Seasonal rate created');
      }
      onDone();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save seasonal rate');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <Field label="Season Name"><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Summer Peak" /></Field>
      <Field label="Room Type"><RoomTypeSelect value={form.roomTypeId} onChange={v => set('roomTypeId', v)} roomTypes={roomTypes} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Start Date"><Input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} /></Field>
        <Field label="End Date"><Input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Fixed Price ($ — overrides base)"><Input type="number" min="0" value={form.fixedPrice} onChange={e => set('fixedPrice', e.target.value)} placeholder="e.g. 250" /></Field>
        <Field label="Multiplier (e.g. 1.5 = +50%)"><Input type="number" min="0" step="0.01" value={form.multiplier} onChange={e => set('multiplier', e.target.value)} placeholder="e.g. 1.5" /></Field>
      </div>
      <Field label="Priority (higher = applied first)"><Input type="number" min="0" value={form.priority} onChange={e => set('priority', e.target.value)} /></Field>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="sr-active" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4" />
        <Label htmlFor="sr-active" className="text-sm">Active</Label>
      </div>
      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <Button onClick={submit} disabled={saving} className="flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]">{saving ? 'Saving…' : 'Save'}</Button>
      </div>
    </div>
  );
}

// ─── Rate Plan Dialog ─────────────────────────────────────────────────────────
export function RatePlanDialog({ roomTypes, onDone, onClose, initial }: Props & { initial?: RatePlan }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '', roomTypeId: initial?.roomTypeId ?? '',
    weekdayAdjustment: String(initial?.weekdayAdjustment ?? '0'),
    weekendAdjustment: String(initial?.weekendAdjustment ?? '0'),
    isActive: initial?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.roomTypeId) {
      toast.error('Please fill in Name and Room Type');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, weekdayAdjustment: Number(form.weekdayAdjustment), weekendAdjustment: Number(form.weekendAdjustment) };
      if (initial?.id) {
        await api.patch(`hotel/pricing/rate-plans/${initial.id}`, payload);
        toast.success('Rate plan updated');
      } else {
        await api.post('hotel/pricing/rate-plans', payload);
        toast.success('Rate plan created');
      }
      onDone();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save rate plan');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <Field label="Plan Name"><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Standard Plan" /></Field>
      <Field label="Room Type"><RoomTypeSelect value={form.roomTypeId} onChange={v => set('roomTypeId', v)} roomTypes={roomTypes} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Weekday Adjustment (%)"><Input type="number" value={form.weekdayAdjustment} onChange={e => set('weekdayAdjustment', e.target.value)} placeholder="e.g. 0 or -10" /></Field>
        <Field label="Weekend Adjustment (%)"><Input type="number" value={form.weekendAdjustment} onChange={e => set('weekendAdjustment', e.target.value)} placeholder="e.g. 20" /></Field>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="rp-active" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4" />
        <Label htmlFor="rp-active" className="text-sm">Active</Label>
      </div>
      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <Button onClick={submit} disabled={saving} className="flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]">{saving ? 'Saving…' : 'Save'}</Button>
      </div>
    </div>
  );
}
