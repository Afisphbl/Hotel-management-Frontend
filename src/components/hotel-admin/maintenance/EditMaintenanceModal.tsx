import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { MaintenanceModal } from "./MaintenanceModal";
import type { MaintenanceFormState, MaintenanceRoom, MaintenanceTicket, MaintenancePriority } from "./types";

interface EditMaintenanceModalProps {
  ticket: MaintenanceTicket;
  rooms: MaintenanceRoom[];
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}

export function EditMaintenanceModal({ ticket, rooms, onClose, onSaved }: EditMaintenanceModalProps) {
  const [form, setForm] = useState<MaintenanceFormState>({
    roomId: ticket.room?.id || ticket.roomId || "",
    title: ticket.title || "",
    priority: ticket.priority || "medium",
    description: ticket.description || "",
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setForm({
      roomId: ticket.room?.id || ticket.roomId || "",
      title: ticket.title || "",
      priority: ticket.priority || "medium",
      description: ticket.description || "",
    });
  }, [ticket]);

  const handleUpdate = async () => {
    if (!form.roomId || !form.title) {
      toast.error("Room and title are required");
      return;
    }

    try {
      setUpdating(true);
      await api.patch(`hotel/maintenance/${ticket.id}`, form);
      toast.success("Ticket updated");
      await onSaved();
      onClose();
    } catch (err: any) {
      toast.error("Failed to update ticket: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <MaintenanceModal title="Edit Ticket" onClose={onClose}>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="edit-ticket-room">Room *</Label>
          <select id="edit-ticket-room" aria-label="Room" title="Room"
            className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
            value={form.roomId}
            onChange={(e) => setForm({ ...form, roomId: e.target.value })}
          >
            <option value="">-- Select Room --</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                Room {room.roomNumber} {room.roomType?.name ? `(${room.roomType.name})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit-ticket-title">Title *</Label>
          <Input id="edit-ticket-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Brief title" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit-ticket-desc">Description</Label>
          <textarea id="edit-ticket-desc"
            className="flex w-full min-h-20 px-3 py-2 border border-input bg-background rounded-md text-sm"
            placeholder="Describe the issue..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit-ticket-priority">Priority</Label>
          <select id="edit-ticket-priority" aria-label="Priority" title="Priority"
            className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as MaintenancePriority })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 bg-[#0F1B2D]" onClick={handleUpdate} disabled={updating}>
            {updating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </MaintenanceModal>
  );
}
