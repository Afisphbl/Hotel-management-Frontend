import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface OverrideSuspensionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotelId: string;
  onSuccess: () => void;
}

export function OverrideSuspensionDialog({ open, onOpenChange, hotelId, onSuccess }: OverrideSuspensionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const handleOverride = async () => {
    setLoading(true);
    try {
      await api.patch(`platform/billing/${hotelId}/override`, { reason: reason || undefined });
      toast.success("Suspension overridden. Hotel reactivated.");
      onOpenChange(false);
      onSuccess();
      setReason("");
    } catch (err: any) {
      toast.error(err.message || "Failed to override suspension");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Override Suspension</DialogTitle>
          <DialogDescription>
            This will immediately reactivate the hotel account and record a zero-amount payment for the current period.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason (optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Manual override, goodwill credit..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A] resize-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleOverride} disabled={loading} className="bg-green-700 hover:bg-green-800">
            {loading ? "Processing..." : "Override & Reactivate"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
