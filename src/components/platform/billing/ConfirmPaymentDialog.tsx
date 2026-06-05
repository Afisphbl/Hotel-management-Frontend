import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface ConfirmPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotelId: string;
  onSuccess: () => void;
}

export function ConfirmPaymentDialog({ open, onOpenChange, hotelId, onSuccess }: ConfirmPaymentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  const handleConfirm = async () => {
    if (!paymentId) {
      toast.error("Please enter a payment ID");
      return;
    }
    setLoading(true);
    try {
      await api.patch(`platform/billing/${hotelId}/confirm`, { paymentId });
      toast.success("Payment confirmed successfully");
      onOpenChange(false);
      onSuccess();
      setPaymentId("");
    } catch (err: any) {
      toast.error(err.message || "Failed to confirm payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogDescription>
            Enter the pending payment ID to confirm a manual bank transfer or receipt upload.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payment ID</label>
            <input
              type="text"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              placeholder="e.g. uuid-of-pending-payment"
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={loading} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            {loading ? "Confirming..." : "Confirm Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
