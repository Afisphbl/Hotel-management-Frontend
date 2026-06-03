import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { FlagFormFields } from "./FlagFormFields";
import type { FeatureFlag } from "../utils/flagTypes";

// The editing state shape — mirrors FeatureFlag but with guaranteed non-null editable fields
export interface EditingFlag {
  id: string;
  name: string;
  description: string;
  status: string;
  rolloutStrategy: string;
  rolloutPercentage: number;
}

interface EditFlagDialogProps {
  flag: EditingFlag | null;
  onChange: (updated: EditingFlag) => void;
  onSave: () => void;
  onClose: () => void;
  isPending: boolean;
}

export function EditFlagDialog({
  flag,
  onChange,
  onSave,
  onClose,
  isPending,
}: EditFlagDialogProps) {
  return (
    <Dialog open={!!flag} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            Edit Feature Flag
          </DialogTitle>
          <DialogDescription>
            Update the feature flag configuration.
          </DialogDescription>
        </DialogHeader>

        {flag && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <p className="text-sm font-medium text-[#0F1B2D] px-3 py-2 bg-slate-50 rounded-lg">
                {flag.name}
              </p>
            </div>

            <FlagFormFields
              idPrefix="edit"
              description={flag.description}
              status={flag.status}
              rolloutStrategy={flag.rolloutStrategy}
              rolloutPercentage={flag.rolloutPercentage}
              onChange={(fields) => onChange({ ...flag, ...fields })}
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-[#0F1B2D] hover:bg-[#1a2a3a]"
            onClick={onSave}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
