import React from 'react';
import { usePlatformAuditLogs } from '@/hooks/usePlatformData';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, History, Filter, Download, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

export function PlatformAuditLogs() {
  const { data: logs } = usePlatformAuditLogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Audit History</h2>
          <p className="text-sm text-muted-foreground mt-1">Record of critical platform actions.</p>
        </div>
        <Button variant="outline" className="w-full md:w-auto bg-white border-none shadow-sm gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9 bg-white border-none shadow-sm" />
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          <Button variant="outline" className="flex-1 lg:flex-none bg-white border-none shadow-sm gap-2 whitespace-nowrap overflow-hidden">
            <Calendar className="w-4 h-4 hidden sm:block" /> Range
          </Button>
          <Button variant="outline" className="lg:flex-none bg-white border-none shadow-sm gap-2">
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-none bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="pl-6 min-w-[100px]">Time</TableHead>
                  <TableHead className="min-w-[150px]">Actor</TableHead>
                  <TableHead className="hidden sm:table-cell min-w-[120px]">Context</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[120px]">Action</TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[150px]">Resource</TableHead>
                  <TableHead className="hidden xl:table-cell pr-6 min-w-[120px]">IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs?.map((log) => (
                  <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-6 py-4 text-[10px] font-medium text-slate-500 whitespace-nowrap">
                      {format(new Date(log.timestamp), 'MMM d, HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <div className="hidden xs:flex w-6 h-6 shrink-0 rounded bg-[#F8F7F4] flex items-center justify-center text-[10px] font-bold text-[#0F1B2D] border border-slate-100">
                          {log.actor.charAt(0)}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-[#0F1B2D] truncate">{log.actor}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className={cn(
                        "text-[10px] px-2 py-1 rounded border whitespace-nowrap",
                        log.hotel === '-' ? "bg-slate-50 text-slate-400 border-slate-100" : "bg-[#C9973A]/5 text-[#C9973A] border-[#C9973A]/10 font-bold"
                      )}>
                        {log.hotel}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-[10px] font-bold uppercase border-slate-200 whitespace-nowrap">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground truncate max-w-[200px]">{log.resource}</TableCell>
                    <TableCell className="hidden xl:table-cell pr-6 text-[10px] font-mono text-slate-400 whitespace-nowrap">
                      {log.ip}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
