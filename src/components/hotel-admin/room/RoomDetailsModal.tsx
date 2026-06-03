import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { RoomModal } from "./RoomModal";
import type { Room, RoomType } from "./types";

interface RoomDetailsModalProps {
  room: Room;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}

export function RoomDetailsModal({ room, onClose, onSaved }: RoomDetailsModalProps) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [editRoomNumber, setEditRoomNumber] = useState(room.roomNumber);
  const [editFloor, setEditFloor] = useState(room.floor);
  const [editBasePrice, setEditBasePrice] = useState(room.basePrice ? String(room.basePrice) : "");
  const [editBaseCapacity, setEditBaseCapacity] = useState(room.baseCapacity ? String(room.baseCapacity) : "");
  const [editRoomTypeId, setEditRoomTypeId] = useState(room.roomTypeId || "");
  const [editImages, setEditImages] = useState<string[]>(room.images || []);
  const [editImageUploading, setEditImageUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditRoomNumber(room.roomNumber);
    setEditFloor(room.floor);
    setEditBasePrice(room.basePrice ? String(room.basePrice) : "");
    setEditBaseCapacity(room.baseCapacity ? String(room.baseCapacity) : "");
    setEditRoomTypeId(room.roomTypeId || "");
    setEditImages(room.images || []);
  }, [room]);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const res = await api.get("hotel/room-types");
        const items = res.data ?? res.items ?? res ?? [];
        setRoomTypes(Array.isArray(items) ? items : []);
      } catch (err: any) {
        toast.error(err.message || "Failed to load room types");
      }
    };

    fetchRoomTypes();
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    const result = await api.upload("hotel/cloudinary/upload", file);
    return (result as any).data?.url || result.url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setEditImageUploading(true);
    try {
      const url = await uploadImage(file);
      setEditImages((prev) => [...prev, url]);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setEditImageUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload: Record<string, unknown> = {
        roomNumber: editRoomNumber,
        floor: editFloor,
        roomTypeId: editRoomTypeId || null,
      };

      if (editBasePrice) payload.basePrice = parseFloat(editBasePrice);
      if (editBaseCapacity) payload.baseCapacity = parseInt(editBaseCapacity, 10);
      payload.images = editImages.length > 0 ? editImages : null;

      await api.patch(`hotel/rooms/${room.id}`, payload);
      toast.success("Room details saved");
      await onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update room details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RoomModal title={`Room ${room.roomNumber}`} onClose={onClose} size="lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
          <Input value={editRoomNumber} onChange={(e) => setEditRoomNumber(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
          <Input value={editFloor} onChange={(e) => setEditFloor(e.target.value)} />
        </div>
        <div>
          <label htmlFor="edit-room-type" className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
          <select id="edit-room-type" aria-label="Room Type" title="Room Type"
            value={editRoomTypeId}
            onChange={(e) => {
              const nextId = e.target.value;
              setEditRoomTypeId(nextId);
              const roomType = roomTypes.find((type) => type.id === nextId);
              if (roomType) {
                if (!editBasePrice) setEditBasePrice(String(roomType.basePrice));
                if (!editBaseCapacity) setEditBaseCapacity(String(roomType.baseCapacity));
              }
            }}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]"
          >
            <option value="">Standard / Generic</option>
            {roomTypes.map((roomType) => (
              <option key={roomType.id} value={roomType.id}>
                {roomType.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (ETB/night)</label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={editBasePrice}
            onChange={(e) => setEditBasePrice(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (guests)</label>
          <Input
            type="number"
            min="1"
            step="1"
            value={editBaseCapacity}
            onChange={(e) => setEditBaseCapacity(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {editImages.map((url, index) => (
              <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => setEditImages(editImages.filter((_, imageIndex) => imageIndex !== index))}
                  className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  &times;
                </button>
              </div>
            ))}
            <label className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#C9973A] transition-colors">
              {editImageUploading ? <span className="text-[10px] text-muted-foreground">...</span> : <span className="text-lg text-gray-400">+</span>}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={editImageUploading} />
            </label>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button className="flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </RoomModal>
  );
}
