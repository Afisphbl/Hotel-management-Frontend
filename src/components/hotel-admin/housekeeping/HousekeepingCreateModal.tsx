import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CreateForm {
  roomId: string;
  description: string;
  priority: string;
  assignedTo: string;
}

interface Room {
  id: string;
  roomNumber: string;
  roomType?: { name: string };
}

interface HousekeepingCreateModalProps {
  open: boolean;
  onClose: () => void;
  roomList: Room[];
  form: CreateForm;
  onFormChange: (form: CreateForm) => void;
  onCreate: () => void;
  creating: boolean;
}

export function HousekeepingCreateModal({ open, onClose, roomList, form, onFormChange, onCreate, creating }: HousekeepingCreateModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-[#0F1B2D]">New Housekeeping Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5"><Label htmlFor="hk-create-room">Room *</Label>
            <select id="hk-create-room" aria-label="Room" title="Room" className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={form.roomId} onChange={e => onFormChange({ ...form, roomId: e.target.value })}>
              <option value="">-- Select Room --</option>
              {roomList.map(r => (
                <option key={r.id} value={r.id}>Room {r.roomNumber} {r.roomType?.name ? `(${r.roomType.name})` : ''}</option>
              ))}
            </select></div>
          <div className="space-y-1.5"><Label htmlFor="hk-create-desc">Description *</Label>
            <textarea id="hk-create-desc" className="flex w-full min-h-20 px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={form.description} onChange={e => onFormChange({ ...form, description: e.target.value })} placeholder="Cleaning instructions" /></div>
          <div className="space-y-1.5"><Label htmlFor="hk-create-priority">Priority</Label>
            <select id="hk-create-priority" aria-label="Priority" title="Priority" className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={form.priority} onChange={e => onFormChange({ ...form, priority: e.target.value })}>
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select></div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 bg-[#0F1B2D]" onClick={onCreate} disabled={creating}>
              {creating ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
