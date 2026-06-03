import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { RoomModal } from "./RoomModal";
import type { RoomType } from "./types";

interface CreateRoomModalProps {
  onClose: () => void;
  onCreated: () => void | Promise<void>;
}

export function CreateRoomModal({ onClose, onCreated }: CreateRoomModalProps) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newRoomFloor, setNewRoomFloor] = useState("");
  const [newRoomPrice, setNewRoomPrice] = useState("");
  const [newRoomCapacity, setNewRoomCapacity] = useState("");
  const [newRoomTypeId, setNewRoomTypeId] = useState("");
  const [newRoomImages, setNewRoomImages] = useState<string[]>([]);
  const [newRoomImageUploading, setNewRoomImageUploading] = useState(false);
  const [creating, setCreating] = useState(false);

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

    setNewRoomImageUploading(true);
    try {
      const url = await uploadImage(file);
      setNewRoomImages((prev) => [...prev, url]);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setNewRoomImageUploading(false);
    }
  };

  const handleCreate = async () => {
    if (!newRoomNumber.trim()) return;

    try {
      setCreating(true);
      const payload: Record<string, unknown> = {
        roomNumber: newRoomNumber.trim(),
        floor: newRoomFloor.trim() || "Ground",
        roomTypeId: newRoomTypeId || null,
      };

      if (newRoomPrice) payload.basePrice = parseFloat(newRoomPrice);
      if (newRoomCapacity) payload.baseCapacity = parseInt(newRoomCapacity, 10);
      if (newRoomImages.length > 0) payload.images = newRoomImages;

      await api.post("hotel/rooms", payload);
      toast.success(`Room ${newRoomNumber.trim()} created`);
      await onCreated();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  return (
    <RoomModal title="Add Room" onClose={onClose} size="lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
          <Input value={newRoomNumber} onChange={(e) => setNewRoomNumber(e.target.value)} placeholder="e.g. 101" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
          <Input value={newRoomFloor} onChange={(e) => setNewRoomFloor(e.target.value)} placeholder="e.g. First" />
        </div>
        <div>
          <label htmlFor="new-room-type" className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
          <select id="new-room-type" aria-label="Room Type" title="Room Type"
            value={newRoomTypeId}
            onChange={(e) => {
              const nextId = e.target.value;
              setNewRoomTypeId(nextId);
              const roomType = roomTypes.find((type) => type.id === nextId);
              if (roomType) {
                if (!newRoomPrice) setNewRoomPrice(String(roomType.basePrice));
                if (!newRoomCapacity) setNewRoomCapacity(String(roomType.baseCapacity));
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
            value={newRoomPrice}
            onChange={(e) => setNewRoomPrice(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (guests)</label>
          <Input
            type="number"
            min="1"
            step="1"
            value={newRoomCapacity}
            onChange={(e) => setNewRoomCapacity(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {newRoomImages.map((url, index) => (
              <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => setNewRoomImages(newRoomImages.filter((_, imageIndex) => imageIndex !== index))}
                  className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  &times;
                </button>
              </div>
            ))}
            <label className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#C9973A] transition-colors">
              {newRoomImageUploading ? <span className="text-[10px] text-muted-foreground">...</span> : <span className="text-lg text-gray-400">+</span>}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={newRoomImageUploading} />
            </label>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={creating}>
            Cancel
          </Button>
          <Button className="flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]" onClick={handleCreate} disabled={creating || !newRoomNumber.trim()}>
            {creating ? "Creating…" : "Add Room"}
          </Button>
        </div>
      </div>
    </RoomModal>
  );
}
