
import { useParams } from '@tanstack/react-router';
import { 
  usePlatformHotel, 
  usePlatformAuditLogs 
} from '@/hooks/usePlatformData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export function HotelOverview() {
  const { id } = useParams({ from: '/auth/platform/hotels/$id' });
  const { data: hotel } = usePlatformHotel(id);
  const { data: logs } = usePlatformAuditLogs();

  if (!hotel) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 font-serif">Property Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Owner</p>
                <p className="text-sm font-medium">{hotel.owner}</p>
                <p className="text-xs text-muted-foreground">{hotel.email}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Joined Date</p>
                <p className="text-sm font-medium">{format(new Date(hotel.created), 'MMMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Current Plan</p>
                <Badge variant="outline" className="bg-[#C9973A]/10 text-[#C9973A] border-none font-bold uppercase text-[10px]">{hotel.plan}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-muted">
              <div className="bg-[#F8F7F4] p-4 rounded-xl">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Rooms</p>
                <p className="text-2xl font-serif">{hotel.totalRooms}</p>
              </div>
              <div className="bg-[#F8F7F4] p-4 rounded-xl">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Occupancy</p>
                <p className="text-2xl font-serif">{hotel.currentOccupancy}</p>
              </div>
              <div className="bg-[#F8F7F4] p-4 rounded-xl">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Storage</p>
                <p className="text-2xl font-serif">{hotel.storageUsed}</p>
              </div>
              <div className="bg-[#F8F7F4] p-4 rounded-xl">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Support</p>
                <p className="text-2xl font-serif">24h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 font-serif">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {logs?.slice(0, 5).map((log, i) => (
              <div key={i} className="flex gap-3 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C9973A] mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold text-[#0F1B2D]">{log.action}</p>
                  <p className="text-muted-foreground">{log.actor} • {format(new Date(log.timestamp), 'HH:mm')}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
