import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface Role {
  id: string;
  name: string;
}

interface ChangeRoleDialogProps {
  target: { id: string; currentRoleId: string } | null;
  selectedRoleId: string;
  onRoleChange: (roleId: string) => void;
  roles: Role[];
  isSaving: boolean;
  onSave: () => void;
  onClose: () => void;
}

export function ChangeRoleDialog({ target, selectedRoleId, onRoleChange, roles, isSaving, onSave, onClose }: ChangeRoleDialogProps) {
  return (
    <Dialog open={!!target} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Staff Role</DialogTitle>
          <DialogDescription>Select a new role for this staff member.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="role-select">New Role</Label>
            <select
              id="role-select"
              className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={selectedRoleId}
              onChange={e => onRoleChange(e.target.value)}
              aria-label="Select a new role for the staff member"
            >
              <option value="">Select a role...</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSave} disabled={isSaving || !selectedRoleId} className="bg-[#0F1B2D]">
            {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Update Role'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
