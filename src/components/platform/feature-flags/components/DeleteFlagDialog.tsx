import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import type { FeatureFlag } from "../utils/flagTypes";

interface DeleteFlagDialogProps {
  flag: FeatureFlag | null;
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}

export function DeleteFlagDialog({
  flag,
  onConfirm,
  onClose,
  isPending,
}: DeleteFlagDialogProps) {
  return (
    <Dialog open={!!flag} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-red-600">
            Delete Feature Flag
          </DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to permanently delete{" "}
            <span className="font-bold text-[#0F1B2D]">"{flag?.name}"</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white gap-2"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" /> Confirm Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
