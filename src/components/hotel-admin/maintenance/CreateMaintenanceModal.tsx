import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { MaintenanceModal } from "./MaintenanceModal";
import type { MaintenanceFormState, MaintenanceRoom, MaintenancePriority } from "./types";

interface CreateMaintenanceModalProps {
  open: boolean;
  rooms: MaintenanceRoom[];
  reportedBy?: string;
  onClose: () => void;
  onCreated: () => void | Promise<void>;
}

const EMPTY_FORM: MaintenanceFormState = {
  roomId: "",
  title: "",
  priority: "medium",
  description: "",
};

export function CreateMaintenanceModal({ open, rooms, reportedBy, onClose, onCreated }: CreateMaintenanceModalProps) {
  const [form, setForm] = useState<MaintenanceFormState>(EMPTY_FORM);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (open) setForm(EMPTY_FORM);
  }, [open]);

  if (!open) return null;

  const handleCreate = async () => {
    if (!form.roomId || !form.title) {
      toast.error("Room and title are required");
      return;
    }

    try {
      setCreating(true);
      await api.post("hotel/maintenance", {
        ...form,
        reportedBy,
      });
      toast.success("Ticket created");
      setForm(EMPTY_FORM);
      await onCreated();
      onClose();
    } catch (err: any) {
      toast.error("Failed to create ticket: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <MaintenanceModal title="New Maintenance Ticket" onClose={onClose}>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="create-ticket-room">Room *</Label>
          <select id="create-ticket-room" aria-label="Room" title="Room"
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
          <Label htmlFor="create-ticket-title">Title *</Label>
          <Input id="create-ticket-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Brief title" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="create-ticket-desc">Description</Label>
          <textarea id="create-ticket-desc"
            className="flex w-full min-h-20 px-3 py-2 border border-input bg-background rounded-md text-sm"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Details of the problem"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="create-ticket-priority">Priority</Label>
          <select id="create-ticket-priority" aria-label="Priority" title="Priority"
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
          <Button className="flex-1 bg-[#0F1B2D]" onClick={handleCreate} disabled={creating}>
            {creating ? "Creating..." : "Create Ticket"}
          </Button>
        </div>
      </div>
    </MaintenanceModal>
  );
}
