import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DashboardData } from './types';

interface DashboardRoomAvailabilityProps {
  data: DashboardData | null;
}

export function DashboardRoomAvailability({ data }: DashboardRoomAvailabilityProps) {
  const d = data;
  return (
    <Card className="lg:col-span-2 shadow-sm border-none bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Room Availability</CardTitle>
          <CardDescription>Visual availability map for next 14 days</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 text-[10px] items-center">
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-sm"></div> Avail</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-600 rounded-sm"></div> Booked</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-400 rounded-sm"></div> Hold</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-400 rounded-sm"></div> Block</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-400 rounded-sm"></div> OOO</div>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="space-y-2 min-w-[400px]">
          <div className="flex border-b border-muted pb-2">
            <div className="w-20 text-[10px] font-bold uppercase text-muted-foreground">Room</div>
            <div className="flex-1 flex justify-between px-2">
              {Array.from({ length: 14 }).map((_, i) => {
                const day = new Date();
                day.setDate(day.getDate() + i);
                return (
                  <div key={i} className="w-6 text-center text-[10px] font-bold text-muted-foreground">{day.getDate()}</div>
                );
              })}
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto space-y-1 custom-scrollbar pr-2">
            {(d?.heatmap ?? []).map((row, i) => (
              <div key={i} className="flex items-center">
                <div className="w-20 text-xs font-medium text-[#0F1B2D]">Room {row.room}</div>
                <div className="flex-1 flex justify-between px-2">
                  {row.dates.map((status: string, j: number) => (
                    <div
                      key={j}
                      className={cn(
                        "w-6 h-6 rounded-sm border border-white/20 transition-transform hover:scale-110 cursor-pointer shadow-sm",
                        status === 'available' ? 'bg-green-500/80' :
                        status === 'confirmed' ? 'bg-blue-600/80 shadow-inner' :
                        status === 'hold' ? 'bg-amber-400/80' :
                        status === 'blocked' ? 'bg-slate-400/60' :
                        'bg-red-400/80'
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
