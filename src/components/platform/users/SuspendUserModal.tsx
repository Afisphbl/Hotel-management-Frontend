import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, RefreshCw } from "lucide-react";

interface SuspendUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUserName?: string;
  onConfirm: () => void;
  isPending: boolean;
}

export function SuspendUserModal({
  isOpen,
  onOpenChange,
  selectedUserName,
  onConfirm,
  isPending,
}: SuspendUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            Suspend User Access
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to suspend{" "}
            <strong>{selectedUserName}</strong>? The user will immediately
            lose access to all platform features and active sessions will be
            revoked.
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
            Suspend Access
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
