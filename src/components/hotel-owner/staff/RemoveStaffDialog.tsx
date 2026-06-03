import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
}

interface RemoveStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: StaffMember | null;
  onConfirm: () => void;
}

export function RemoveStaffDialog({ open, onOpenChange, target, onConfirm }: RemoveStaffDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke Staff Access</DialogTitle>
          <DialogDescription>
            Are you sure you want to revoke access for {target?.firstName} {target?.lastName}? Their account will be deactivated.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Revoke Access
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
