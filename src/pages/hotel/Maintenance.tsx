import React from 'react';
import { useHotelMaintenance } from '@/hooks/useHotelData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Plus,
  MoreVertical,
  History,
  Wrench as ToolIcon
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function HotelMaintenance() {
  const { data: issues } = useHotelMaintenance();

  const getPriorityBadge = (p: string) => {
    switch (p.toLowerCase()) {
      case 'high': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">HIGH</Badge>;
      case 'medium': return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">MEDIUM</Badge>;
      default: return <Badge variant="outline">LOW</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Maintenance</h2>
          <p className="text-sm text-muted-foreground mt-1">Track asset upkeep and repairs.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none bg-white border-none shadow-sm gap-2">
            <History className="w-4 h-4" /> History
          </Button>
          <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            <Plus className="w-4 h-4 mr-2" /> Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Open Jobs', value: issues?.filter(i => i.status !== 'Resolved').length || 0, icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'High Priority', value: issues?.filter(i => i.priority === 'High' && i.status !== 'Resolved').length || 0, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'In Progress', value: issues?.filter(i => i.status === 'In Progress').length || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Resolved (Today)', value: issues?.filter(i => i.status === 'Resolved').length || 0, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <Card key={i} className="shadow-sm border-none bg-white p-5">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-serif text-[#0F1B2D]">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search logs, room #, or equipment..." className="pl-9 bg-white border-none shadow-sm" />
        </div>
        <Button variant="outline" className="bg-white border-none shadow-sm gap-2">
          <Filter className="w-4 h-4" /> Filter by Type
        </Button>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="pl-6">Ticket/Location</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues?.map(issue => (
                <TableRow key={issue.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center">
                        <span className="text-[8px] font-bold opacity-50 uppercase leading-none mb-1">Room</span>
                        <span className="text-sm font-serif leading-none">{issue.room}</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#0F1B2D]">{issue.type}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{issue.date}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[250px]">
                    <p className="text-xs text-slate-600 line-clamp-1">{issue.description}</p>
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(issue.priority)}
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{issue.reportedBy}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        issue.status === 'Resolved' ? "bg-green-500" :
                        issue.status === 'In Progress' ? "bg-amber-500" : "bg-red-500"
                      )} />
                      <span className="text-xs font-medium">{issue.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-[#0F1B2D]">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
