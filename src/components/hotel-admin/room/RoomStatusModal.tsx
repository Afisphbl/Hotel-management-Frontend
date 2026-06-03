import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { RoomModal } from "./RoomModal";
import { ROOM_STATUS_OPTIONS, type Room, type RoomStatus } from "./types";

interface RoomStatusModalProps {
  room: Room;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}

export function RoomStatusModal({ room, onClose, onSaved }: RoomStatusModalProps) {
  const [newStatus, setNewStatus] = useState<RoomStatus>(room.status);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setNewStatus(room.status);
  }, [room.status]);

  const handleSave = async () => {
    try {
      setUpdating(true);
      await api.patch(`hotel/rooms/${room.id}/status`, { status: newStatus });
      toast.success("Room status updated");
      await onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update room status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <RoomModal title={`Room ${room.roomNumber}`} onClose={onClose}>
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          Current status: <span className="font-medium capitalize text-[#0F1B2D]">{room.status.replace("_", " ")}</span>
        </p>
        <div className="space-y-2">
          {ROOM_STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setNewStatus(option.value)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition",
                newStatus === option.value
                  ? "border-[#C9973A] bg-[#C9973A]/5 text-[#0F1B2D]"
                  : "border-gray-200 text-gray-600 hover:border-gray-300",
              )}
            >
              <span className={cn("w-3 h-3 rounded-full shrink-0", option.color)} />
              {option.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={updating}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]"
            onClick={handleSave}
            disabled={updating || newStatus === room.status}
          >
            {updating ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </RoomModal>
  );
}
