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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface User {
  id: string;
  name: string;
  role: string;
  status: string;
}

interface TransferOwnershipModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  users: User[] | undefined;
  selectedUserId?: string;
  transferTargetId: string;
  onTransferTargetChange: (id: string) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function TransferOwnershipModal({
  isOpen,
  onOpenChange,
  users,
  selectedUserId,
  transferTargetId,
  onTransferTargetChange,
  onConfirm,
  isPending,
}: TransferOwnershipModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Property Ownership</DialogTitle>
          <DialogDescription>
            Transferring ownership is a critical action. Only one OWNER can
            exist per hotel. The current owner will be downgraded to
            MANAGER.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select New Owner</Label>
            <Select
              value={transferTargetId}
              onValueChange={onTransferTargetChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an active user..." />
              </SelectTrigger>
              <SelectContent>
                {users
                  ?.filter(
                    (u) =>
                      u.id !== selectedUserId && u.status === "active",
                  )
                  .map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-[11px] text-amber-800 border border-amber-100">
            <strong>Warning:</strong> The selected user will become the new
            primary OWNER and legal representative for this property.
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#C9973A] hover:bg-[#b88a35]"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending && <RefreshCw className="w-4 h-4 animate-spin mr-2" />}
            Confirm Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
