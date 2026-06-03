import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RemoveUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUserName?: string;
  onConfirm: () => void;
  isPending: boolean;
}

export function RemoveUserModal({
  isOpen,
  onOpenChange,
  selectedUserName,
  onConfirm,
  isPending,
}: RemoveUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove User from Tenant</DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently remove{" "}
            <strong>{selectedUserName}</strong> from this hotel? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending && <RefreshCw className="w-4 h-4 animate-spin mr-2" />}
            Remove User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
