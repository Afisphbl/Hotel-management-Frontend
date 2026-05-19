import React from 'react';
import { useHousekeepingTasks, useHotelRooms } from '@/hooks/useHotelData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brush, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  MoreVertical,
  Plus,
  Play,
  RotateCw,
  Search
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function HotelHousekeeping() {
  const { data: tasks } = useHousekeepingTasks();
  const { data: rooms } = useHotelRooms();

  const getPriorityColor = (p: string) => {
    switch (p.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-100';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Operations & HK</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time room status management and shift coordination.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none bg-white border-none shadow-sm gap-2">
                <Users className="w-4 h-4" /> Roster
            </Button>
            <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                <Plus className="w-4 h-4 mr-2" /> Assign
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Dirty', count: tasks?.toClean.length || 0, color: 'text-red-500', icon: RotateCw },
            { label: 'Cleaning', count: tasks?.cleaning.length || 0, color: 'text-blue-500', icon: Brush },
            { label: 'Inspecting', count: tasks?.inspecting.length || 0, color: 'text-amber-500', icon: Search },
            { label: 'Clean', count: tasks?.clean.length || 0, color: 'text-green-500', icon: CheckCircle2 },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border-b-2 border-transparent hover:border-[#C9973A] transition-all group">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-serif text-[#0F1B2D]">{stat.count}</p>
                </div>
                <stat.icon className={cn("w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity", stat.color)} />
            </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
              <div>
                <CardTitle className="font-serif text-lg">Active Queue</CardTitle>
                <CardDescription>Rooms waiting for cleaning service.</CardDescription>
              </div>
              <Badge variant="outline" className="font-bold border-red-200 text-red-700 bg-red-50">PRIORITY QUEUE</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {tasks?.toClean.map((task) => (
                  <div key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex flex-col items-center justify-center">
                        <span className="text-xs font-bold opacity-60 uppercase tracking-tight">Room</span>
                        <span className="text-sm font-serif">{task.room}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[#0F1B2D]">{task.type}</p>
                          <Badge className={cn("text-[9px] uppercase font-bold", getPriorityColor(task.priority))}>
                            {task.priority}
                          </Badge>
                        </div>
                        {task.notes && <p className="text-xs text-muted-foreground flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-500" /> {task.notes}</p>}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 h-8 text-xs font-bold">
                        <Play className="w-3 h-3 fill-current" /> Start Service
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-white">
            <CardHeader>
               <CardTitle className="font-serif text-lg">In Progress</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-100 border-t border-slate-50">
                 {tasks?.cleaning.map(task => (
                    <div key={task.id} className="p-4 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                             <Brush className="w-5 h-5 animate-pulse" />
                          </div>
                          <div>
                             <p className="font-bold text-[#0F1B2D]">Room {task.room} - {task.type}</p>
                             <p className="text-xs text-muted-foreground">Staff: {task.staff} • Elapsed: {task.elapsed}</p>
                          </div>
                       </div>
                       <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                    </div>
                 ))}
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="shadow-sm border-none bg-[#0F1B2D] text-white">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-[#C9973A]">Inventory Status</CardTitle>
                <CardDescription className="text-slate-400">Essential linen and supply levels.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {[
                    { label: 'King Linens', level: 85, color: 'bg-green-500' },
                    { label: 'Standard Towels', level: 42, color: 'bg-amber-500' },
                    { label: 'Toiletries (Kits)', level: 12, color: 'bg-red-500' },
                 ].map((item, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                          <span>{item.label}</span>
                          <span>{item.level}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className={cn("h-full transition-all duration-1000", item.color)} style={{ width: `${item.level}%` }} />
                       </div>
                    </div>
                 ))}
              </CardContent>
           </Card>

           <Card className="shadow-sm border-none bg-white">
              <CardHeader>
                <CardTitle className="font-serif text-lg">HK Shift Log</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 {tasks?.clean.map(task => (
                    <div key={task.id} className="flex items-start gap-3">
                       <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-[#0F1B2D]">Room {task.room} marked Clean</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{task.staff} • {task.finished}</p>
                       </div>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
