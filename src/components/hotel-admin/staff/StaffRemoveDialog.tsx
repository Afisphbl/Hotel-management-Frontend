import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface StaffRemoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetName: string;
  onConfirm: () => void;
}

export function StaffRemoveDialog({ open, onOpenChange, targetName, onConfirm }: StaffRemoveDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke Staff Access</DialogTitle>
          <DialogDescription>
            Are you sure you want to revoke access for {targetName}?
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
