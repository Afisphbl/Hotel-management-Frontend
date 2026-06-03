import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Room } from "@/types/room";
import { RoomStatusBadge } from "./RoomStatusBadge";

interface RoomCardProps {
  room: Room;
  onEditStatus: (room: Room) => void;
  onEditDetails: (room: Room) => void;
}

export function RoomCard({ room, onEditStatus, onEditDetails }: RoomCardProps) {
  return (
    <Card className='shadow-sm border-none bg-white hover:shadow-md transition'>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div>
            <h3 className='text-xl font-bold text-[#0F1B2D]'>
              Room {room.roomNumber}
            </h3>
            <p className='text-sm text-muted-foreground'>
              {room.roomType?.name ?? "Standard"} · Floor {room.floor}
            </p>
          </div>
          <RoomStatusBadge status={room.status} />
        </div>

        {room.images && room.images.length > 0 && (
          <div className='mb-3 rounded-lg overflow-hidden h-32 bg-slate-100'>
            <img
              src={room.images[0]}
              alt={`Room ${room.roomNumber}`}
              className='w-full h-full object-cover'
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}

        <div className='space-y-2 mb-4 text-sm'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Capacity:</span>
            <span className='font-medium'>
              {room.baseCapacity ?? room.roomType?.baseCapacity ?? "—"}{" "}
              guests
            </span>
          </div>
          <div className='flex justify-between items-start'>
            <span className='text-muted-foreground mt-0.5'>Rate:</span>
            <div className='flex flex-col items-end'>
              {room.effectivePrice != null && 
               Math.round(Number(room.effectivePrice)) !== Math.round(Number(room.basePrice ?? room.roomType?.basePrice)) ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground line-through opacity-70">
                      {formatCurrency(Number(room.basePrice ?? room.roomType?.basePrice ?? 0))}
                    </span>
                    <span className="font-bold text-[#C9973A] text-base">
                      {formatCurrency(Number(room.effectivePrice))}
                    </span>
                  </div>
                  {room.pricingReason && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="bg-[#C9973A]/10 text-[#C9973A] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {room.pricingType === 'override' ? 'Special Rate' : 
                         room.pricingType === 'promotion' ? 'Promo Applied' : 
                         room.pricingType === 'seasonal' ? 'Seasonal' : 'Adjusted'}
                      </span>
                      <span className="text-[10px] text-muted-foreground italic max-w-[120px] truncate text-right">
                        {room.pricingReason}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <span className='font-medium text-[#0F1B2D] text-base'>
                  {room.basePrice != null
                    ? formatCurrency(Number(room.basePrice))
                    : room.roomType?.basePrice != null
                      ? formatCurrency(Number(room.roomType.basePrice))
                      : "—"}
                  <span className="text-xs font-normal text-muted-foreground ml-1">/night</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className='flex gap-2'>
          <Button
            variant='outline'
            className='flex-1 text-xs border-[#0F1B2D]/20 hover:bg-[#0F1B2D] hover:text-white transition'
            onClick={() => onEditStatus(room)}
          >
            Status
          </Button>
          <Button
            variant='outline'
            className='flex-1 text-xs border-[#0F1B2D]/20 hover:bg-[#0F1B2D] hover:text-white transition'
            onClick={() => onEditDetails(room)}
          >
            <Settings className='w-3 h-3 mr-1' />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
