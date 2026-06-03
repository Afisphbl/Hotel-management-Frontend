import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brush, CheckCircle, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HousekeepingDashboardProps {
  tasks: any[];
  onAssign: (task: any) => void;
  onComplete: (task: any) => void;
  getPriorityColor: (priority?: string) => string;
}

export function HousekeepingDashboard({ tasks, onAssign, onComplete, getPriorityColor }: HousekeepingDashboardProps) {
  const pendingTasks = tasks.filter(t => t.status === 'PENDING');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
            <CardTitle className="font-serif text-lg">Active Queue</CardTitle>
            <Badge variant="outline" className="font-bold border-red-200 text-red-700 bg-red-50">PRIORITY QUEUE</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {pendingTasks.slice(0, 6).map((task) => (
                <div key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex flex-col items-center justify-center">
                      <span className="text-xs font-bold opacity-60 uppercase tracking-tight">Room</span>
                      <span className="text-sm font-serif">{task.room || task.roomNumber || task.roomId}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[#0F1B2D]">{task.description || 'General cleaning'}</p>
                        <Badge className={cn("text-[9px] uppercase font-bold", getPriorityColor(task.priority))}>
                          {task.priority || 'NORMAL'}
                        </Badge>
                      </div>
                      {task.notes && <p className="text-xs text-muted-foreground">{task.notes}</p>}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 h-8 text-xs font-bold"
                    onClick={() => onAssign(task)}
                  >
                    <UserCheck className="w-3 h-3" /> Assign
                  </Button>
                </div>
              ))}
              {pendingTasks.length === 0 && (
                <div className="p-6 text-sm text-muted-foreground text-center">No pending tasks in queue.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="font-serif text-lg">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 border-t border-slate-50">
              {inProgressTasks.slice(0, 6).map(task => (
                <div key={task.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Brush className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0F1B2D]">Room {task.room || task.roomNumber || task.roomId}</p>
                      <p className="text-xs text-muted-foreground">{task.description || 'Cleaning in progress'}{task.assignedToName ? ` • ${task.assignedToName}` : ''}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-600"
                    onClick={() => onComplete(task)}
                  >
                    Complete
                  </Button>
                </div>
              ))}
              {inProgressTasks.length === 0 && (
                <div className="p-6 text-sm text-muted-foreground text-center">No active tasks.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle className="font-serif text-lg">HK Shift Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {completedTasks.slice(0, 8).map(task => (
            <div key={task.id} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600 mt-1">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F1B2D]">Room {task.room || task.roomNumber || task.roomId} marked Clean</p>
                <p className="text-[10px] text-muted-foreground uppercase">{task.assignedToName || 'Unassigned'} • {task.completedAt ? new Date(task.completedAt).toLocaleString() : 'Recently completed'}</p>
              </div>
            </div>
          ))}
          {completedTasks.length === 0 && (
            <p className="text-sm text-muted-foreground">No completed tasks yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
