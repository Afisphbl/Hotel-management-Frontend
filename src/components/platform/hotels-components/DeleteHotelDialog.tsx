import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import type { Hotel } from "./utils";

interface DeleteHotelDialogProps {
  hotel: Hotel | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteHotelDialog({ hotel, onOpenChange, onConfirm, isPending }: DeleteHotelDialogProps) {
  return (
    <Dialog open={!!hotel} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-red-600">Delete Tenant</DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to permanently delete{" "}
            <span className="font-bold text-[#0F1B2D]">"{hotel?.name}"</span>? This will remove all
            associated subscriptions, feature flags, user access, and the tenant schema.
            <span className="block mt-2 font-semibold text-red-600">This action cannot be undone.</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white gap-2" onClick={onConfirm} disabled={isPending}>
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
            ) : (
              <><Trash2 className="w-4 h-4" /> Confirm Delete</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
