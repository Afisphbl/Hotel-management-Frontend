import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface Role {
  id: string;
  name: string;
}

interface StaffChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRoleId: string;
  onSelectedRoleChange: (roleId: string) => void;
  roles: Role[];
  isSaving: boolean;
  onSave: () => void;
}

export function StaffChangeRoleDialog({
  open,
  onOpenChange,
  selectedRoleId,
  onSelectedRoleChange,
  roles,
  isSaving,
  onSave,
}: StaffChangeRoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Staff Role</DialogTitle>
          <DialogDescription>Select a new role for this staff member.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="new-role-select">New Role</Label>
            <select id="new-role-select" aria-label="New Role" title="New Role"
              className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={selectedRoleId}
              onChange={e => onSelectedRoleChange(e.target.value)}
            >
              <option value="">Select a role...</option>
              {roles.filter(r => !r.name.toUpperCase().includes('OWNER')).map(r => (
                <option key={r.id} value={r.id}>{r.name.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave} disabled={isSaving || !selectedRoleId} className="bg-[#0F1B2D]">
            {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Update Role'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
