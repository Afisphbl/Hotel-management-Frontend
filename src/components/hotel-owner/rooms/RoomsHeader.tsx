import { Button } from "@/components/ui/button";
import { RoomSummary } from "@/types/room";

interface RoomsHeaderProps {
  summary: RoomSummary;
  onManageRoomTypes: () => void;
  onAddRoom: () => void;
}

export function RoomsHeader({ summary, onManageRoomTypes, onAddRoom }: RoomsHeaderProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-serif text-[#0F1B2D]'>
          Rooms
        </h1>
        <p className='text-sm sm:text-base text-muted-foreground'>
          Manage your room inventory, prices, and status
        </p>
      </div>
      {summary.total != null &&
      summary.roomLimit != null &&
      summary.total >= summary.roomLimit ? (
        <Button className='bg-[#C9973A] hover:bg-[#b8882e] text-white'>
          Upgrade Plan
        </Button>
      ) : (
        <div className='flex gap-2'>
          <Button
            onClick={onManageRoomTypes}
            variant='outline'
            className='border-[#0F1B2D]/20 text-[#0F1B2D]'
          >
            Manage Room Types
          </Button>
          <Button
            onClick={onAddRoom}
            className='bg-[#0F1B2D] hover:bg-[#1a2a3a]'
          >
            + Add Room
          </Button>
        </div>
      )}
    </div>
  );
}
