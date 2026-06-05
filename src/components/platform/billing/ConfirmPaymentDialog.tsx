import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
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
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (open && hotelId) {
      setFetching(true);
      setPaymentId("");
      api.get(`platform/billing/${hotelId}/pending-payments`)
        .then((res: any) => setPendingList(res.data ?? res))
        .catch(() => setPendingList([]))
        .finally(() => setFetching(false));
    }
  }, [open, hotelId]);

  const handleConfirm = async () => {
    if (!paymentId) {
      toast.error("Please select a payment to confirm");
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

  const selected = pendingList.find((p) => p.id === paymentId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogDescription>
            Select a pending payment to confirm a manual bank transfer or receipt upload.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pending Payments</label>
            {fetching ? (
              <p className="text-sm text-muted-foreground">Loading pending payments...</p>
            ) : pendingList.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending payments for this hotel.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {pendingList.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentId(p.id)}
                    className={`w-full text-left px-3 py-2 rounded-md border text-sm transition-colors ${
                      paymentId === p.id
                        ? 'border-[#C9973A] bg-amber-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-medium">{formatCurrency(p.amount)}</span>
                    <span className="text-muted-foreground ml-2 capitalize">{p.method?.replace('_', ' ')}</span>
                    <span className="text-xs text-muted-foreground block truncate">{p.id}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selected && (
            <div className="rounded-lg bg-slate-50 p-3 text-sm space-y-1">
              <p><span className="font-medium">Amount:</span> {formatCurrency(selected.amount)}</p>
              <p><span className="font-medium">Method:</span> <span className="capitalize">{selected.method?.replace('_', ' ')}</span></p>
              {selected.receiptUrl && (
                <p><span className="font-medium">Receipt:</span> <a href={selected.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-[#C9973A] underline">View</a></p>
              )}
              {selected.notes && <p><span className="font-medium">Notes:</span> {selected.notes}</p>}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={loading || !paymentId} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            {loading ? "Confirming..." : "Confirm Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
