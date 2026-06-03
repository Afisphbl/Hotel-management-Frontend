import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoomType } from "@/types/room";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface RoomCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  roomTypes: RoomType[];
}

export function RoomCreateModal({
  isOpen,
  onClose,
  onSuccess,
  roomTypes,
}: RoomCreateModalProps) {
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newRoomFloor, setNewRoomFloor] = useState("");
  const [newRoomPrice, setNewRoomPrice] = useState("");
  const [newRoomCapacity, setNewRoomCapacity] = useState("");
  const [newRoomTypeId, setNewRoomTypeId] = useState("");
  const [newRoomImages, setNewRoomImages] = useState<string[]>([]);
  const [newRoomImageUploading, setNewRoomImageUploading] = useState(false);
  const [creating, setCreating] = useState(false);

  const resetForm = () => {
    setNewRoomNumber("");
    setNewRoomFloor("");
    setNewRoomPrice("");
    setNewRoomCapacity("");
    setNewRoomTypeId("");
    setNewRoomImages([]);
  };

  const handleCreateSubmit = async () => {
    if (!newRoomNumber.trim()) return;
    setCreating(true);
    try {
      const payload: any = {
        roomNumber: newRoomNumber.trim(),
        floor: newRoomFloor.trim() || "Ground",
        roomTypeId: newRoomTypeId || null,
      };
      if (newRoomPrice) payload.basePrice = parseFloat(newRoomPrice);
      if (newRoomCapacity) payload.baseCapacity = parseInt(newRoomCapacity, 10);
      if (newRoomImages.length > 0) payload.images = newRoomImages;

      await api.post("hotel/rooms", payload);
      toast.success(`Room ${payload.roomNumber} created`);
      onSuccess();
      resetForm();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewRoomImageUploading(true);
    try {
      const result = await api.upload("hotel/cloudinary/upload", file);
      const url = (result as any).data?.url || (result as any).url;
      setNewRoomImages((prev) => [...prev, url]);
    } catch (err: any) {
      toast.error("Failed to upload image");
    } finally {
      setNewRoomImageUploading(false);
    }
  };

  const handleRoomTypeChange = (id: string) => {
    setNewRoomTypeId(id);
    const rt = roomTypes.find((t) => t.id === id);
    if (rt) {
      if (!newRoomPrice) setNewRoomPrice(String(rt.basePrice));
      if (!newRoomCapacity) setNewRoomCapacity(String(rt.baseCapacity));
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          resetForm();
        }
      }}
    >
      <DialogContent className='max-w-md max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add Room</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Room Number *
            </label>
            <Input
              value={newRoomNumber}
              onChange={(e) => setNewRoomNumber(e.target.value)}
              placeholder='e.g. 101'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Floor
            </label>
            <Input
              value={newRoomFloor}
              onChange={(e) => setNewRoomFloor(e.target.value)}
              placeholder='e.g. First, Ground'
            />
          </div>
          <div>
            <label
              htmlFor='roomType'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Room Type
            </label>
            <select
              id='roomType'
              value={newRoomTypeId}
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
              value={newRoomPrice}
              onChange={(e) => setNewRoomPrice(e.target.value)}
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
              value={newRoomCapacity}
              onChange={(e) => setNewRoomCapacity(e.target.value)}
              placeholder='e.g. 2'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Photos
            </label>
            <div className='flex flex-wrap gap-2 mb-2'>
              {newRoomImages.map((url, i) => (
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
                      setNewRoomImages(newRoomImages.filter((_, j) => j !== i))
                    }
                    className='absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition'
                  >
                    &times;
                  </button>
                </div>
              ))}
              <label className='w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#C9973A] transition-colors'>
                {newRoomImageUploading ? (
                  <span className='text-[10px] text-muted-foreground'>...</span>
                ) : (
                  <span className='text-lg text-gray-400'>+</span>
                )}
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleImageUpload}
                  disabled={newRoomImageUploading}
                />
              </label>
            </div>
          </div>

          <div className='flex gap-3 pt-2'>
            <Button
              variant='outline'
              className='flex-1'
              onClick={onClose}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              className='flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]'
              onClick={handleCreateSubmit}
              disabled={creating || !newRoomNumber.trim()}
            >
              {creating ? "Creating…" : "Add Room"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
