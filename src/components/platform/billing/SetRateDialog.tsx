import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface SetRateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotelId: string;
  currentRate?: number;
  onSuccess: () => void;
}

export function SetRateDialog({ open, onOpenChange, hotelId, currentRate, onSuccess }: SetRateDialogProps) {
  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState(currentRate?.toString() || "");

  const handleSave = async () => {
    const parsed = parseFloat(rate);
    if (isNaN(parsed) || parsed < 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      await api.patch(`platform/billing/${hotelId}/rate`, { rate: parsed });
      toast.success(`Monthly rate set to ${formatCurrency(parsed)}`);
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to set rate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Set Monthly Rate</DialogTitle>
          <DialogDescription>
            Set the monthly subscription amount for this hotel in ETB.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Rate (ETB)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 1500"
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]"
            />
          </div>
          {currentRate !== undefined && currentRate > 0 && (
            <p className="text-xs text-muted-foreground">
              Current rate: {formatCurrency(currentRate)}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            {loading ? "Saving..." : "Save Rate"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
