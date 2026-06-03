import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { MaintenanceModal } from "./MaintenanceModal";
import type { MaintenanceStaff, MaintenanceTicket } from "./types";

interface AssignMaintenanceModalProps {
  ticket: MaintenanceTicket;
  staffList: MaintenanceStaff[];
  onClose: () => void;
  onAssigned: () => void | Promise<void>;
}

export function AssignMaintenanceModal({ ticket, staffList, onClose, onAssigned }: AssignMaintenanceModalProps) {
  const [selectedStaffId, setSelectedStaffId] = useState(ticket.assignedTo || "");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    setSelectedStaffId(ticket.assignedTo || "");
  }, [ticket]);

  const handleAssign = async () => {
    if (!selectedStaffId) {
      toast.error("Please select a staff member");
      return;
    }

    try {
      setAssigning(true);
      await api.post(`hotel/maintenance/${ticket.id}/assign`, { staffId: selectedStaffId });
      toast.success("Staff assigned successfully");
      await onAssigned();
      onClose();
    } catch (err: any) {
      toast.error("Failed to assign staff: " + err.message);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <MaintenanceModal title="Assign Maintenance Staff" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Select a staff member to handle the maintenance request for Room {ticket.room?.roomNumber || ticket.roomId}
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="assign-staff">Staff Member</Label>
          <select id="assign-staff" aria-label="Staff Member" title="Staff Member"
            className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
          >
            <option value="">-- Select Staff --</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.firstName} {staff.lastName} ({staff.role ? staff.role.replace("_", " ") : "staff"})
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 bg-[#0F1B2D]" onClick={handleAssign} disabled={assigning}>
            {assigning ? "Assigning..." : "Assign Staff"}
          </Button>
        </div>
      </div>
    </MaintenanceModal>
  );
}
