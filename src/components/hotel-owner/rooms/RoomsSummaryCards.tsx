import { Card, CardContent } from "@/components/ui/card";
import { Bed, CheckCircle, Lock, AlertTriangle, Wrench, X } from "lucide-react";
import { RoomSummary } from "@/types/room";

interface RoomsSummaryCardsProps {
  summary: RoomSummary;
}

export function RoomsSummaryCards({ summary }: RoomsSummaryCardsProps) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
      <Card className='shadow-sm border-none bg-white'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase'>
                Total Rooms
              </p>
              <h3 className='text-2xl font-bold text-[#0F1B2D] mt-1'>
                {summary.total ?? 0}
              </h3>
              {summary.roomLimit && (
                <p className='text-[10px] text-muted-foreground mt-0.5'>
                  Limit: {summary.roomLimit} ({summary.plan})
                </p>
              )}
            </div>
            <Bed className='w-10 h-10 text-blue-600 opacity-20' />
          </div>
        </CardContent>
      </Card>

      <Card className='shadow-sm border-none bg-white'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase'>
                Available
              </p>
              <h3 className='text-2xl font-bold text-green-600 mt-1'>
                {summary.available ?? 0}
              </h3>
            </div>
            <CheckCircle className='w-10 h-10 text-green-600 opacity-20' />
          </div>
        </CardContent>
      </Card>

      <Card className='shadow-sm border-none bg-white'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase'>
                Occupied
              </p>
              <h3 className='text-2xl font-bold text-blue-600 mt-1'>
                {summary.occupied ?? 0}
              </h3>
            </div>
            <Lock className='w-10 h-10 text-blue-600 opacity-20' />
          </div>
        </CardContent>
      </Card>

      <Card className='shadow-sm border-none bg-white'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase'>
                Dirty
              </p>
              <h3 className='text-2xl font-bold text-yellow-600 mt-1'>
                {summary.dirty ?? 0}
              </h3>
            </div>
            <AlertTriangle className='w-10 h-10 text-yellow-600 opacity-20' />
          </div>
        </CardContent>
      </Card>

      <Card className='shadow-sm border-none bg-white'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase'>
                Maintenance
              </p>
              <h3 className='text-2xl font-bold text-orange-600 mt-1'>
                {summary.maintenance ?? 0}
              </h3>
            </div>
            <Wrench className='w-10 h-10 text-orange-600 opacity-20' />
          </div>
        </CardContent>
      </Card>

      <Card className='shadow-sm border-none bg-white'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase'>
                Out of Order
              </p>
              <h3 className='text-2xl font-bold text-red-600 mt-1'>
                {summary.out_of_order ?? 0}
              </h3>
            </div>
            <X className='w-10 h-10 text-red-600 opacity-20' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
