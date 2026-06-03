import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { MaintenanceModal } from "./MaintenanceModal";
import type { MaintenanceTicket } from "./types";

interface ResolveMaintenanceModalProps {
  ticket: MaintenanceTicket;
  onClose: () => void;
  onResolved: () => void | Promise<void>;
}

export function ResolveMaintenanceModal({ ticket, onClose, onResolved }: ResolveMaintenanceModalProps) {
  const [notes, setNotes] = useState("");
  const [cost, setCost] = useState("");

  const handleResolve = async () => {
    try {
      await api.post(`hotel/maintenance/${ticket.id}/resolve`, {
        notes,
        cost: cost ? parseFloat(cost) : undefined,
      });
      toast.success("Ticket resolved");
      await onResolved();
      onClose();
    } catch (err: any) {
      toast.error("Failed to resolve ticket: " + err.message);
    }
  };

  return (
    <MaintenanceModal title="Resolve Ticket" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Resolve maintenance ticket for Room {ticket.room?.roomNumber || ticket.roomId}
        </p>
        <div className="space-y-1.5">
          <Label>Resolution Notes</Label>
          <textarea
            className="flex w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What was done to fix the issue?"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Cost (if any)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleResolve}>
            Resolve
          </Button>
        </div>
      </div>
    </MaintenanceModal>
  );
}
