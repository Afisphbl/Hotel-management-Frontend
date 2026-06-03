import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface AuditLogsTableProps {
  logs: any[] | undefined;
  isLoading: boolean;
}

export function AuditLogsTable({ logs, isLoading }: AuditLogsTableProps) {
  return (
    <Card className='shadow-sm border-none bg-white'>
      <CardHeader>
        <CardTitle className='text-lg'>Recent Audit Logs</CardTitle>
        <CardDescription>Latest platform-wide activities</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className='bg-[#F8F7F4]'>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead className='hidden md:table-cell'>Hotel</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className='hidden lg:table-cell'>Resource</TableHead>
              <TableHead className='hidden xl:table-cell'>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className='animate-pulse'>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-24' />
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    <Skeleton className='h-4 w-28' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-16' />
                  </TableCell>
                  <TableCell className='hidden lg:table-cell'>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell className='hidden xl:table-cell'>
                    <Skeleton className='h-4 w-24' />
                  </TableCell>
                </TableRow>
              ))
            ) : logs && logs.length > 0 ? (
              logs.map((log: any) => (
                <TableRow
                  key={log.id}
                  className='hover:bg-[#F8F7F4]/50 transition-colors'
                >
                  <TableCell className='text-[10px] sm:text-xs font-mono'>
                    {format(new Date(log.timestamp), "MMM d, HH:mm")}
                  </TableCell>
                  <TableCell className='font-medium text-xs sm:text-sm'>
                    {log.actor}
                  </TableCell>
                  <TableCell className='hidden md:table-cell text-sm'>
                    {log.hotel}
                  </TableCell>
                  <TableCell>
                    <span className='text-[10px] sm:text-xs bg-[#0F1B2D]/5 px-2 py-0.5 rounded-full font-medium'>
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className='hidden lg:table-cell text-sm text-muted-foreground'>
                    {log.resource}
                  </TableCell>
                  <TableCell className='hidden xl:table-cell text-xs text-muted-foreground font-mono'>
                    {log.ip}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='text-center py-10 text-muted-foreground'
                >
                  No platform audit logs recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
