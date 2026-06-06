import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface HousekeepingAssignModalProps {
  target: any;
  onClose: () => void;
  staffList: Staff[];
  selectedStaffId: string;
  onStaffChange: (id: string) => void;
  onAssign: () => void;
  assigning: boolean;
  staffLoading?: boolean;
}

export function HousekeepingAssignModal({ target, onClose, staffList, selectedStaffId, onStaffChange, onAssign, assigning, staffLoading }: HousekeepingAssignModalProps) {
  if (!target) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-[#0F1B2D]">Assign Housekeeping Staff</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground">Select a staff member to handle the housekeeping task for Room {target.room || target.roomNumber}</p>
          <div className="space-y-1.5">
            <Label htmlFor="hk-assign-staff">Staff Member</Label>
            <select id="hk-assign-staff" aria-label="Staff Member" title="Staff Member" className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={selectedStaffId} onChange={e => onStaffChange(e.target.value)} disabled={staffLoading}>
              <option value="">{staffLoading ? 'Loading staff...' : '-- Select Staff --'}</option>
              {staffList.map(st => (
                <option key={st.id} value={st.id}>{st.firstName} {st.lastName} ({st.role?.replace('_', ' ')})</option>
              ))}
            </select>
            {staffList.length === 0 && !staffLoading && (
              <p className="text-xs text-amber-600">No housekeeping staff available. Add staff members from the Staff page.</p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 bg-[#0F1B2D]" onClick={onAssign} disabled={assigning}>
              {assigning ? 'Assigning...' : 'Assign Staff'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
