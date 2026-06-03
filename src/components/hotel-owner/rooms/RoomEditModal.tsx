import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Room, RoomStatus, RoomType } from "@/types/room";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { RoomStatusBadge } from "./RoomStatusBadge";

const STATUS_OPTIONS: { value: RoomStatus; label: string; color: string }[] = [
  { value: "available", label: "Available", color: "bg-green-500" },
  { value: "occupied", label: "Occupied", color: "bg-blue-500" },
  { value: "dirty", label: "Dirty", color: "bg-yellow-500" },
  { value: "maintenance", label: "Maintenance", color: "bg-orange-500" },
  { value: "out_of_order", label: "Out of Order", color: "bg-red-500" },
];

interface RoomEditModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialTab: "status" | "details";
  roomTypes: RoomType[];
}

export function RoomEditModal({
  room,
  isOpen,
  onClose,
  onSuccess,
  initialTab,
  roomTypes,
}: RoomEditModalProps) {
  const [tab, setTab] = useState<"status" | "details">(initialTab);
  const [newStatus, setNewStatus] = useState<RoomStatus>("available");
  const [updating, setUpdating] = useState(false);

  const [editRoomNumber, setEditRoomNumber] = useState("");
  const [editFloor, setEditFloor] = useState("");
  const [editBasePrice, setEditBasePrice] = useState("");
  const [editBaseCapacity, setEditBaseCapacity] = useState("");
  const [editRoomTypeId, setEditRoomTypeId] = useState("");
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editImageUploading, setEditImageUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (room) {
      setTab(initialTab);
      setNewStatus(room.status);
      setEditRoomNumber(room.roomNumber);
      setEditFloor(room.floor);
      setEditBasePrice(room.basePrice ? String(room.basePrice) : "");
      setEditBaseCapacity(room.baseCapacity ? String(room.baseCapacity) : "");
      setEditRoomTypeId(room.roomTypeId || "");
      setEditImages(room.images || []);
    }
  }, [room, initialTab]);

  const handleStatusSubmit = async () => {
    if (!room) return;
    setUpdating(true);
    try {
      await api.patch(`hotel/rooms/${room.id}/status`, {
        status: newStatus,
      });
      toast.success("Room status updated");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update room status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDetailsSubmit = async () => {
    if (!room) return;
    setSaving(true);
    try {
      await api.patch(`hotel/rooms/${room.id}`, {
        roomNumber: editRoomNumber,
        floor: editFloor,
        roomTypeId: editRoomTypeId || null,
        basePrice: editBasePrice ? parseFloat(editBasePrice) : null,
        baseCapacity: editBaseCapacity ? parseInt(editBaseCapacity, 10) : null,
        images: editImages.length > 0 ? editImages : null,
      });
      toast.success("Room details saved");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update room details");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageUploading(true);
    try {
      const result = await api.upload("hotel/cloudinary/upload", file);
      const url = (result as any).data?.url || (result as any).url;
      setEditImages((prev) => [...prev, url]);
    } catch (err: any) {
      toast.error("Failed to upload image");
    } finally {
      setEditImageUploading(false);
    }
  };

  const handleRoomTypeChange = (id: string) => {
    setEditRoomTypeId(id);
    const rt = roomTypes.find((t) => t.id === id);
    if (rt) {
      if (!editBasePrice) setEditBasePrice(String(rt.basePrice));
      if (!editBaseCapacity) setEditBaseCapacity(String(rt.baseCapacity));
    }
  };

  if (!room) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='max-w-md max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Room {room.roomNumber}</DialogTitle>
        </DialogHeader>

        <div className='space-y-5'>
          <div className='flex gap-1 bg-gray-100 rounded-lg p-1'>
            <button
              onClick={() => setTab("status")}
              className={cn(
                "flex-1 px-3 py-2 rounded-md text-sm font-medium transition",
                tab === "status"
                  ? "bg-white shadow-sm text-[#0F1B2D]"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              Status
            </button>
            <button
              onClick={() => setTab("details")}
              className={cn(
                "flex-1 px-3 py-2 rounded-md text-sm font-medium transition",
                tab === "details"
                  ? "bg-white shadow-sm text-[#0F1B2D]"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              Details
            </button>
          </div>

          {/* Status tab */}
          {tab === "status" && (
            <>
              <div className='flex items-center justify-between mb-4'>
                <p className='text-sm text-muted-foreground'>
                  Current status:
                </p>
                <RoomStatusBadge status={room.status} />
              </div>

              <div className='space-y-2'>
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setNewStatus(opt.value)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition",
                      newStatus === opt.value
                        ? "border-[#C9973A] bg-[#C9973A]/5 text-[#0F1B2D]"
                        : "border-gray-200 text-gray-600 hover:border-gray-300",
                    )}
                  >
                    <span
                      className={cn("w-3 h-3 rounded-full shrink-0", opt.color)}
                    />
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className='flex gap-3 pt-2'>
                <Button
                  variant='outline'
                  className='flex-1'
                  onClick={onClose}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button
                  className='flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]'
                  onClick={handleStatusSubmit}
                  disabled={updating || newStatus === room.status}
                >
                  {updating ? "Saving…" : "Save"}
                </Button>
              </div>
            </>
          )}

          {/* Details tab */}
          {tab === "details" && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Room Number
                </label>
                <Input
                  value={editRoomNumber}
                  onChange={(e) => setEditRoomNumber(e.target.value)}
                  placeholder='e.g. 101'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Floor
                </label>
                <Input
                  value={editFloor}
                  onChange={(e) => setEditFloor(e.target.value)}
                  placeholder='e.g. First, Ground'
                />
              </div>
              <div>
                <label
                  htmlFor='room-type-select'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Room Type
                </label>
                <select
                  id='room-type-select'
                  value={editRoomTypeId}
                  onChange={(e) => handleRoomTypeChange(e.target.value)}
                  className='w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]'
                >
                  <option value=''>Standard / Generic</option>
                  {roomTypes.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Base Price (ETB/night)
                </label>
                <Input
                  type='number'
                  min='0'
                  step='0.01'
                  value={editBasePrice}
                  onChange={(e) => setEditBasePrice(e.target.value)}
                  placeholder='e.g. 199.00'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Capacity (guests)
                </label>
                <Input
                  type='number'
                  min='1'
                  step='1'
                  value={editBaseCapacity}
                  onChange={(e) => setEditBaseCapacity(e.target.value)}
                  placeholder='e.g. 2'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Photos
                </label>
                <div className='flex flex-wrap gap-2 mb-2'>
                  {editImages.map((url, i) => (
                    <div
                      key={i}
                      className='relative w-16 h-16 rounded-lg overflow-hidden border group'
                    >
                      <img
                        src={url}
                        alt=''
                        className='w-full h-full object-cover'
                      />
                      <button
                        onClick={() =>
                          setEditImages(editImages.filter((_, j) => j !== i))
                        }
                        className='absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition'
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  <label className='w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#C9973A] transition-colors'>
                    {editImageUploading ? (
                      <span className='text-[10px] text-muted-foreground'>
                        ...
                      </span>
                    ) : (
                      <span className='text-lg text-gray-400'>+</span>
                    )}
                    <input
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={handleImageUpload}
                      disabled={editImageUploading}
                    />
                  </label>
                </div>
              </div>

              <div className='flex gap-3 pt-2'>
                <Button
                  variant='outline'
                  className='flex-1'
                  onClick={onClose}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  className='flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]'
                  onClick={handleDetailsSubmit}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
