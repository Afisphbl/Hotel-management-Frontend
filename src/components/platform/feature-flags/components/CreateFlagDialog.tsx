import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { FlagFormFields } from "./FlagFormFields";
import type { FlagFormData } from "../utils/flagTypes";

interface CreateFlagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FlagFormData;
  setFormData: React.Dispatch<React.SetStateAction<FlagFormData>>;
  onCreate: () => void;
  isPending: boolean;
}

export function CreateFlagDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  onCreate,
  isPending,
}: CreateFlagDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            Create Feature Flag
          </DialogTitle>
          <DialogDescription>
            Define a new feature flag for the platform.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="create-flag-name">Name</Label>
            <Input
              id="create-flag-name"
              placeholder="e.g. new-booking-flow"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <FlagFormFields
            idPrefix="create"
            description={formData.description}
            status={formData.status}
            rolloutStrategy={formData.rolloutStrategy}
            rolloutPercentage={formData.rolloutPercentage}
            onChange={(fields) =>
              setFormData((prev) => ({ ...prev, ...fields }))
            }
          />
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#0F1B2D] hover:bg-[#1a2a3a]"
            onClick={onCreate}
            disabled={isPending || !formData.name.trim()}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" /> Create Flag
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
