import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface DeletePlanDialogProps {
  plan: { id: string; name: string } | null;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeletePlanDialog({ plan, onClose, onConfirm, isPending }: DeletePlanDialogProps) {
  return (
    <Dialog open={!!plan} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-red-600">Delete Plan</DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to permanently delete{" "}
            <span className="font-bold text-[#0F1B2D]">"{plan?.name}"</span>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
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
