import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CreateGuestModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
  form: any;
  setForm: (f: any) => void;
  creating: boolean;
}

export function CreateGuestModal({ open, onClose, onCreate, form, setForm, creating }: CreateGuestModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-[#0F1B2D]">Add Guest</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label>Full Name *</Label>
            <Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. John Doe" />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nationality</Label>
              <Input value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>ID Number</Label>
              <Input value={form.idNumber} onChange={e => setForm({ ...form, idNumber: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="isVip" checked={form.isVip} onChange={e => setForm({ ...form, isVip: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#0F1B2D] focus:ring-[#0F1B2D]" title="Mark as VIP Guest" />
            <Label htmlFor="isVip" className="cursor-pointer">Mark as VIP Guest</Label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]" onClick={onCreate} disabled={creating}>
              {creating ? 'Creating...' : 'Add Guest'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
