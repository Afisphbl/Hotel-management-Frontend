import { useParams } from "@tanstack/react-router";
import { usePlatformAuditLogs } from "@/hooks/usePlatformData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Database } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export function HotelAuditLogs() {
  const { id: hotelId } = useParams({ from: '/auth/platform/hotels/$id' });
  const { data: logs } = usePlatformAuditLogs({ hotelId });

  return (
    <Card className='shadow-sm border-none bg-white'>
      <CardHeader className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <CardTitle className='font-serif text-lg sm:text-xl text-center md:text-left'>
            Property Audit
          </CardTitle>
          <CardDescription className='text-center md:text-left text-xs sm:text-sm'>
            Consolidated log of configuration changes.
          </CardDescription>
        </div>
        <div className='flex items-center gap-2 w-full md:w-auto'>
          <div className='relative flex-1 md:w-[200px]'>
            <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
            <Input placeholder='Search...' className='pl-9' />
          </div>
          <Button variant='outline' size='icon' className='shrink-0'>
            <Calendar className='w-4 h-4' />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {logs && logs.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead className='hidden sm:table-cell'>Action</TableHead>
                <TableHead className='hidden md:table-cell'>Resource</TableHead>
                <TableHead className='hidden lg:table-cell'>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs?.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell className='text-[10px] sm:text-xs'>
                    {format(new Date(log.timestamp), "MMM d, HH:mm")}
                  </TableCell>
                  <TableCell className='text-xs sm:text-sm font-medium'>
                    {log.actor}
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    <Badge
                      variant='outline'
                      className='text-[10px] font-bold uppercase'
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className='hidden md:table-cell text-xs sm:text-sm text-muted-foreground'>
                    {log.resource}
                  </TableCell>
                  <TableCell className='hidden lg:table-cell text-[10px] sm:text-xs font-mono'>
                    {log.ip}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Database className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-sm text-slate-400">No audit logs found</p>
            <p className="text-[10px] text-slate-300 mt-1">Hotel-specific audit logging will be implemented soon</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
