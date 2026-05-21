import { useParams } from "@tanstack/react-router";
import {
  usePlatformHotel,
  usePlatformAuditLogs,
} from "@/hooks/usePlatformData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Database, Activity } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function NoData({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
      <Database className="w-5 h-5 text-slate-300 mb-1" />
      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
        {label}
      </p>
      <p className="text-[9px] text-slate-300 mt-0.5">
        No database or data available
      </p>
    </div>
  );
}

function DataField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">
        {label}
      </p>
      {value ? (
        <p className="text-sm font-medium">{value}</p>
      ) : (
        <p className="text-xs text-slate-300 italic">No database or data</p>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="bg-[#F8F7F4] p-4 rounded-xl">
      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">
        {label}
      </p>
      {value != null ? (
        <p className="text-2xl font-serif">{value}</p>
      ) : (
        <p className="text-[10px] text-slate-300 italic leading-tight">
          No database or data
        </p>
      )}
    </div>
  );
}

export function HotelOverview() {
  const { id } = useParams({ from: "/auth/platform/hotels/$id" });
  const { data: hotel, isLoading, isError, error, refetch } = usePlatformHotel(id);
  const { data: logs } = usePlatformAuditLogs();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Database className="w-10 h-10 text-red-400 mb-3" />
        <h3 className="text-lg font-serif text-slate-500">Failed to load hotel data</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">{error?.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Database className="w-10 h-10 text-slate-300 mb-3" />
        <h3 className="text-lg font-serif text-slate-400">No hotel data found</h3>
        <p className="text-xs text-slate-300 mt-1">
          This hotel section has no database or data available
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-2 shadow-sm border-none bg-white'>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2 font-serif'>
              <Building2 className="w-4 h-4 text-[#C9973A]" />
              Property Profile
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-8'>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
              <div>
                <p className='text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1'>
                  Owner
                </p>
                {hotel.owner ? (
                  <>
                    <p className='text-sm font-medium'>{hotel.owner}</p>
                    {hotel.email && (
                      <p className='text-xs text-muted-foreground'>{hotel.email}</p>
                    )}
                  </>
                ) : (
                  <p className='text-xs text-slate-300 italic'>No database or data</p>
                )}
              </div>
              <DataField
                label="Joined Date"
                value={hotel.created ? format(new Date(hotel.created), "MMMM d, yyyy") : null}
              />
              <div>
                <p className='text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1'>
                  Current Plan
                </p>
                {hotel.plan ? (
                  <Badge
                    variant='outline'
                    className='bg-[#C9973A]/10 text-[#C9973A] border-none font-bold uppercase text-[10px]'
                  >
                    {hotel.plan}
                  </Badge>
                ) : (
                  <p className='text-xs text-slate-300 italic'>No database or data</p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-muted'>
              <StatCard label="Rooms" value={hotel.totalRooms} />
              <StatCard label="Occupancy" value={hotel.currentOccupancy} />
              <StatCard label="Storage" value={hotel.storageUsed} />
              <StatCard label="Location" value={hotel.location} />
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-sm border-none bg-white'>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2 font-serif'>
              <Activity className="w-4 h-4 text-[#C9973A]" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {logs && logs.length > 0 ? (
              logs.slice(0, 5).map((log: any, i: number) => (
                <div key={i} className='flex gap-3 text-xs'>
                  <div className='w-1.5 h-1.5 rounded-full bg-[#C9973A] mt-1.5 shrink-0' />
                  <div>
                    <p className='font-bold text-[#0F1B2D]'>{log.action}</p>
                    <p className='text-muted-foreground'>
                      {log.actor} • {format(new Date(log.timestamp), "HH:mm")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <NoData label="No Recent Activity" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
