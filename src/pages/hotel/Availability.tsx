
import { useHotelAvailabilityHeatmap } from '@/hooks/useHotelData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Filter, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';

export function HotelAvailability() {
  const { data: heatmap } = useHotelAvailabilityHeatmap();
  const startDate = new Date();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Availability</h1>
          <p className="text-sm text-muted-foreground">Real-time room inventory.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none"><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Button className="flex-1 sm:flex-none bg-[#0F1B2D]">Block</Button>
        </div>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader className="border-b border-muted pb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon"><ChevronLeft className="w-4 h-4" /></Button>
              <span className="font-bold text-sm min-w-[200px] text-center">
                {format(startDate, 'MMM d, yyyy')} - {format(addDays(startDate, 13), 'MMM d, yyyy')}
              </span>
              <Button variant="ghost" size="icon"><ChevronRight className="w-4 h-4" /></Button>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Filter rooms..." className="pl-9 bg-[#F8F7F4] border-none text-xs" />
              </div>
              <Button variant="outline" size="sm"><Filter className="w-4 h-4 px-2" /></Button>
            </div>
          </div>
          <div className="flex gap-4 pt-4 text-[10px] font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> Available</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-600 rounded-sm"></div> Confirmed</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-400 rounded-sm"></div> Hold</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-400 rounded-sm"></div> Blocked</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Out of Order</div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8F7F4]">
                <th className="sticky left-0 bg-[#F8F7F4] z-10 p-3 text-left text-[10px] font-bold text-muted-foreground uppercase border-r border-b min-w-[120px]">Room</th>
                {Array.from({ length: 14 }).map((_, i) => {
                  const date = addDays(startDate, i);
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  return (
                    <th key={i} className={cn(
                      "p-3 text-center text-[10px] font-bold border-b min-w-[60px]",
                      isWeekend ? "bg-slate-100/50 text-[#0F1B2D]" : "text-muted-foreground"
                    )}>
                      <div className="uppercase">{format(date, 'eee')}</div>
                      <div className="text-sm">{format(date, 'd')}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {heatmap?.map((row, i) => (
                <tr key={i} className="hover:bg-[#F8F7F4]/30">
                  <td className="sticky left-0 bg-white z-10 p-3 font-bold text-xs border-r border-b">
                    {row.room}
                    <div className="text-[9px] font-medium text-muted-foreground leading-none mt-0.5">Standard King</div>
                  </td>
                  {row.dates.map((status, j) => {
                    // Mock mixed statuses
                    const s = Math.random();
                    const currentStatus = s > 0.8 ? 'hold' : s > 0.7 ? 'blocked' : s > 0.3 ? 'confirmed' : 'available';
                    
                    return (
                      <td key={j} className="p-1 border-b border-r h-12 relative group">
                        <div className={cn(
                          "w-full h-full rounded-sm transition-all cursor-pointer",
                          currentStatus === 'available' ? 'bg-green-50' : 
                          currentStatus === 'confirmed' ? 'bg-blue-600/90' :
                          currentStatus === 'hold' ? 'bg-amber-400/90' : 'bg-slate-400/60'
                        )}>
                          {currentStatus !== 'available' && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="icon" variant="secondary" className="h-6 w-6 rounded-full shadow-lg">
                                <Search className="w-3 h-3 text-[#0F1B2D]" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
