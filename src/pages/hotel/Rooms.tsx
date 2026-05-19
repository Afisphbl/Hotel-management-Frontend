
import { useHotelRooms, useHousekeepingTasks } from '@/hooks/useHotelData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Bed, Info, MoreVertical, Plus, List, LayoutGrid, ClipboardCheck } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function HotelRooms() {
  const { data: rooms, isLoading: roomsLoading } = useHotelRooms();
  const { data: hkTasks, isLoading: tasksLoading } = useHousekeepingTasks();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Rooms & Housekeeping</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time room status and housekeeping management.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border border-slate-100">
          <Button variant="ghost" size="sm" className="h-8 px-3 text-xs gap-2">
            <List className="w-3.5 h-3.5" /> List
          </Button>
          <Button size="sm" className="h-8 px-3 text-xs gap-2 bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            <LayoutGrid className="w-3.5 h-3.5" /> Grid
          </Button>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs gap-2 border-none bg-slate-50">
            <Plus className="w-3.5 h-3.5" /> Add Room
          </Button>
        </div>
      </div>

      <Tabs defaultValue="rooms" className="w-full flex flex-col gap-6">
        <div className="w-full">
          <Card className="p-4 bg-slate-50 border-none shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#C9973A] mb-4">View Management</h3>
            <TabsList className="bg-transparent h-auto p-0 flex flex-col sm:flex-row gap-2 w-full border-none shadow-none items-stretch sm:items-center">
              <TabsTrigger value="rooms" className="flex-1 justify-center h-10 px-4 rounded-lg data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white text-xs font-bold uppercase tracking-wider transition-all">
                <Bed className="w-3.5 h-3.5 mr-2" /> Rooms Overview
              </TabsTrigger>
              <TabsTrigger value="housekeeping" className="flex-1 justify-center h-10 px-4 rounded-lg data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white text-xs font-bold uppercase tracking-wider transition-all">
                <ClipboardCheck className="w-3.5 h-3.5 mr-2" /> Housekeeping
              </TabsTrigger>
              <TabsTrigger value="types" className="flex-1 justify-center h-10 px-4 rounded-lg data-[state=active]:bg-[#0F1B2D] data-[state=active]:text-white text-xs font-bold uppercase tracking-wider transition-all">
                <Info className="w-3.5 h-3.5 mr-2" /> Room Types
              </TabsTrigger>
            </TabsList>
          </Card>
        </div>

        <div className="w-full">
          <TabsContent value="rooms" className="m-0 focus-visible:outline-none">
            {roomsLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {rooms?.map((room) => (
                <Card key={room.id} className="overflow-hidden shadow-sm border-none bg-white group hover:ring-1 hover:ring-[#C9973A] transition-all">
                  <CardContent className="p-0 flex flex-col sm:flex-row">
                    <div className={cn(
                      "w-1.5 h-full absolute left-0 top-0",
                      room.status === 'occupied' ? 'bg-blue-500' :
                      room.status === 'available' ? 'bg-green-500' :
                      room.status === 'dirty' ? 'bg-amber-500' : 'bg-red-500'
                    )} />
                    <div className="flex-1 p-4 pl-6 relative">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                            <Bed className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-[#0F1B2D]">Room {room.number}</h4>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{room.type}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] uppercase font-bold text-slate-400">Housekeeping</p>
                            <p className="text-xs font-bold text-[#0F1B2D]">{room.hkStatus}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger className={cn("h-8 w-8 hover:bg-slate-100", buttonVariants({ variant: "ghost", size: "icon" }))}>
                              <MoreVertical className="w-4 h-4 text-slate-400" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Folio</DropdownMenuItem>
                              <DropdownMenuItem>Mark as Maintenance</DropdownMenuItem>
                              <DropdownMenuItem>Housekeeping Task</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-4">
                        <Badge variant="outline" className="text-[9px] uppercase font-bold bg-[#F8F7F4] border-slate-200">
                          Floor {room.floor}
                        </Badge>
                        <Badge className={cn(
                          "text-[9px] uppercase font-bold px-2",
                          room.status === 'available' ? 'bg-green-500/10 text-green-700 border-green-200 hover:bg-green-500/20' :
                          room.status === 'occupied' ? 'bg-blue-500/10 text-blue-700 border-blue-200 hover:bg-blue-500/20' :
                          'bg-red-500/10 text-red-700 border-red-200 hover:bg-red-500/20'
                        )} variant="outline">
                          {room.status}
                        </Badge>
                        <div className="sm:hidden flex items-center gap-1 ml-auto">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">HK: {room.hkStatus}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
          </TabsContent>

        <TabsContent value="housekeeping" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KanbanColumn title="To Clean" count={hkTasks?.toClean.length} color="bg-amber-500">
              {hkTasks?.toClean.map((task: any) => (
                <KanbanCard key={task.id} task={task} />
              ))}
            </KanbanColumn>
            <KanbanColumn title="Cleaning" count={hkTasks?.cleaning.length} color="bg-blue-500">
              {hkTasks?.cleaning.map((task: any) => (
                <KanbanCard key={task.id} task={task} />
              ))}
            </KanbanColumn>
            <KanbanColumn title="Inspecting" count={hkTasks?.inspecting.length} color="bg-purple-500">
              {hkTasks?.inspecting.map((task: any) => (
                <KanbanCard key={task.id} task={task} />
              ))}
            </KanbanColumn>
            <KanbanColumn title="Clean" count={hkTasks?.clean.length} color="bg-green-500">
              {hkTasks?.clean.map((task: any) => (
                <KanbanCard key={task.id} task={task} />
              ))}
            </KanbanColumn>
          </div>
        </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function KanbanColumn({ title, count, color, children }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-bold flex items-center gap-2 text-sm text-[#0F1B2D]">
          <div className={cn("w-2 h-2 rounded-full", color)} />
          {title}
        </h3>
        <Badge variant="secondary" className="bg-white border">{count}</Badge>
      </div>
      <div className="space-y-3 min-h-[500px] bg-slate-100/50 p-2 rounded-lg border border-dashed border-muted">
        {children}
      </div>
    </div>
  );
}

function KanbanCard({ task }: any) {
  return (
    <Card className="shadow-sm border-none bg-white p-4 space-y-3 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 bg-[#F8F7F4] rounded-md flex items-center justify-center font-bold text-[#0F1B2D] group-hover:bg-[#C9973A] group-hover:text-white transition-colors">
          {task.room}
        </div>
        {task.priority && (
          <Badge className={cn(
            "text-[9px] uppercase",
            task.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'
          )}>
            {task.priority}
          </Badge>
        )}
      </div>
      <div>
        <p className="text-xs font-medium text-[#0F1B2D]">{task.notes || 'Routine cleaning'}</p>
        {task.staff && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-[9px] bg-slate-50">Tasked to: {task.staff}</Badge>
            {task.elapsed && <span className="text-[9px] text-muted-foreground">{task.elapsed}</span>}
          </div>
        )}
        {task.finished && <p className="text-[9px] text-green-600 mt-2 font-bold uppercase">Ready at {task.finished}</p>}
      </div>
    </Card>
  );
}
