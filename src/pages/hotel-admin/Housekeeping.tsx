import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Sparkles, Search, ChevronLeft, ChevronRight, Plus, CheckCircle, Clock, UserCheck, Trash, Edit2, RotateCw, Brush
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export function AdminHousekeeping() {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [roomList, setRoomList] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ roomId: '', description: '', priority: 'NORMAL', assignedTo: '' });

  const [editTarget, setEditTarget] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState({ roomId: '', description: '', priority: 'NORMAL', scheduledDate: '' });

  const [assignTarget, setAssignTarget] = useState<any>(null);
  const [assigning, setAssigning] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState('');

  const [completeTarget, setCompleteTarget] = useState<any>(null);
  const [completing, setCompleting] = useState(false);
  const [completeNotes, setCompleteNotes] = useState('');

  const PAGE_SIZE = 15;

  useEffect(() => { setPage(1); }, [filterStatus]);

  useEffect(() => {
    fetchTasks();
  }, [page, filterStatus]);

  useEffect(() => {
    fetchStaff();
    fetchRooms();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'ALL') params.append('status', filterStatus);
      params.append('page', String(page));
      params.append('limit', String(PAGE_SIZE));
      const res = await api.get(`hotel/housekeeping?${params.toString()}`);
      setTasks(res.data || res.items || []);
      if (res.meta) {
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      }
    } catch (err: any) {
      toast.error('Failed to load tasks: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await api.get('hotel/staff?limit=100');
      setStaffList(res.data || res.items || []);
    } catch (err: any) {
      console.error('Failed to load staff list:', err.message);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await api.get('hotel/rooms?limit=200');
      setRoomList(res.data || res.items || []);
    } catch (err: any) {
      console.error('Failed to load rooms:', err.message);
    }
  };

  const handleCreate = async () => {
    if (!createForm.roomId || !createForm.description) {
      toast.error('Room and description are required');
      return;
    }
    try {
      setCreating(true);
      await api.post('hotel/housekeeping', createForm);
      toast.success('Task created');
      setShowCreate(false);
      setCreateForm({ roomId: '', description: '', priority: 'NORMAL', assignedTo: '' });
      fetchTasks();
    } catch (err: any) {
      toast.error('Failed to create task: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async () => {
    if (!editForm.roomId || !editForm.description) {
      toast.error('Room and description are required');
      return;
    }
    try {
      setUpdating(true);
      await api.patch(`hotel/housekeeping/${editTarget.id}`, editForm);
      toast.success('Task updated');
      setEditTarget(null);
      fetchTasks();
    } catch (err: any) {
      toast.error('Failed to update task: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedStaffId) {
      toast.error('Please select a staff member');
      return;
    }
    try {
      setAssigning(true);
      await api.post(`hotel/housekeeping/${assignTarget.id}/assign`, { staffId: selectedStaffId });
      toast.success('Staff assigned successfully');
      setAssignTarget(null);
      setSelectedStaffId('');
      fetchTasks();
    } catch (err: any) {
      toast.error('Failed to assign staff: ' + err.message);
    } finally {
      setAssigning(false);
    }
  };

  const handleComplete = async () => {
    try {
      setCompleting(true);
      await api.post(`hotel/housekeeping/${completeTarget.id}/complete`, { notes: completeNotes });
      toast.success('Task marked as completed');
      setCompleteTarget(null);
      setCompleteNotes('');
      fetchTasks();
    } catch (err: any) {
      toast.error('Failed to complete task: ' + err.message);
    } finally {
      setCompleting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this housekeeping task?')) {
      return;
    }
    try {
      await api.delete(`hotel/housekeeping/${id}`);
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (err: any) {
      toast.error('Failed to delete task: ' + err.message);
    }
  };

  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const pendingCount = tasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED').length;
  const pendingTasks = tasks.filter(t => t.status === 'PENDING');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED');
  const verifiedTasks = tasks.filter(t => t.status === 'VERIFIED');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  const getPriorityColor = (priority?: string) => {
    if (!priority) return 'text-slate-600 bg-slate-50 border-slate-100';
    switch (priority.toUpperCase()) {
      case 'URGENT':
      case 'HIGH':
        return 'text-red-600 bg-red-50 border-red-100';
      case 'NORMAL':
      case 'MEDIUM':
        return 'text-amber-600 bg-amber-50 border-amber-100';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const filtered = tasks.filter(t =>
    t.room?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.assignedToName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Housekeeping</h1>
          <p className="text-sm text-muted-foreground">Real-time room status management and shift coordination</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <Plus className="w-4 h-4 mr-2" /> New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Dirty', count: pendingTasks.length, color: 'text-red-500', icon: RotateCw },
          { label: 'Cleaning', count: inProgressTasks.length, color: 'text-blue-500', icon: Brush },
          { label: 'Inspecting', count: verifiedTasks.length, color: 'text-amber-500', icon: Search },
          { label: 'Clean', count: completedTasks.length, color: 'text-green-500', icon: CheckCircle },
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Total Tasks</p>
                <h3 className="text-2xl font-bold text-[#0F1B2D] mt-1">{tasks.length}</h3>
              </div>
              <Sparkles className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Pending / Active</p>
                <h3 className="text-2xl font-bold text-yellow-600 mt-1">{pendingCount}</h3>
              </div>
              <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Completed</p>
                <h3 className="text-2xl font-bold text-green-600 mt-1">{completedCount}</h3>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

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
                      onClick={() => {
                        setAssignTarget(task);
                        setSelectedStaffId(task.assignedTo || '');
                      }}
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
                      onClick={() => {
                        setCompleteTarget(task);
                        setCompleteNotes(task.notes || '');
                      }}
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

      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search tasks..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {['ALL', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={cn("px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition",
                    filterStatus === s ? "bg-[#C9973A] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}>
                  {s === 'ALL' ? 'All' : s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader><CardTitle className="text-lg">Housekeeping Tasks</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(t => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">Room {t.room || t.roomNumber || '—'}</TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate" title={t.description}>{t.description || '—'}</TableCell>
                      <TableCell className="text-sm">{t.assignedToName || '—'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          t.priority === 'HIGH' || t.priority === 'URGENT' ? 'border-red-200 text-red-700 bg-red-50' :
                            t.priority === 'NORMAL' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                              'border-gray-200 text-gray-600'
                        )}>{t.priority || 'NORMAL'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs',
                          t.status === 'COMPLETED' || t.status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                            t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800')}>
                          {t.status?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {t.status !== 'COMPLETED' && t.status !== 'VERIFIED' && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => {
                                setAssignTarget(t);
                                setSelectedStaffId(t.assignedTo || '');
                              }} title="Assign Staff">
                                <UserCheck className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => {
                                setEditTarget(t);
                                setEditForm({
                                  roomId: t.roomId || '',
                                  description: t.description || '',
                                  priority: t.priority || 'NORMAL',
                                  scheduledDate: t.scheduledDate || new Date().toISOString().split('T')[0]
                                });
                              }} title="Edit Task">
                                <Edit2 className="w-4 h-4 text-amber-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => {
                                setCompleteTarget(t);
                                setCompleteNotes(t.notes || '');
                              }} title="Mark Complete">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)} title="Delete Task">
                            <Trash className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No tasks found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <p className="text-sm text-muted-foreground">Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, total)} of {total}</p>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <Button key={p} variant={p === page ? "default" : "outline"} size="sm"
                        className={p === page ? "bg-[#0F1B2D]" : ""} onClick={() => setPage(p)}>{p}</Button>
                    ))}
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* New Task Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-[#0F1B2D]">New Housekeeping Task</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5"><Label>Room *</Label>
                <select className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={createForm.roomId} onChange={e => setCreateForm({ ...createForm, roomId: e.target.value })}>
                  <option value="">-- Select Room --</option>
                  {roomList.map(r => (
                    <option key={r.id} value={r.id}>Room {r.roomNumber} {r.roomType?.name ? `(${r.roomType.name})` : ''}</option>
                  ))}
                </select></div>
              <div className="space-y-1.5"><Label>Description *</Label>
                <textarea className="flex w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={createForm.description} onChange={e => setCreateForm({ ...createForm, description: e.target.value })} placeholder="Cleaning instructions" /></div>
              <div className="space-y-1.5"><Label>Priority</Label>
                <select className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={createForm.priority} onChange={e => setCreateForm({ ...createForm, priority: e.target.value })}>
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select></div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button className="flex-1 bg-[#0F1B2D]" onClick={handleCreate} disabled={creating}>
                  {creating ? 'Creating...' : 'Create Task'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setEditTarget(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-[#0F1B2D]">Edit Housekeeping Task</h2>
              <button onClick={() => setEditTarget(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5"><Label>Room *</Label>
                <select className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={editForm.roomId} onChange={e => setEditForm({ ...editForm, roomId: e.target.value })}>
                  <option value="">-- Select Room --</option>
                  {roomList.map(r => (
                    <option key={r.id} value={r.id}>Room {r.roomNumber} {r.roomType?.name ? `(${r.roomType.name})` : ''}</option>
                  ))}
                </select></div>
              <div className="space-y-1.5"><Label>Description *</Label>
                <textarea className="flex w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Priority</Label>
                <select className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={editForm.priority} onChange={e => setEditForm({ ...editForm, priority: e.target.value })}>
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select></div>
              <div className="space-y-1.5"><Label>Scheduled Date</Label>
                <Input type="date" value={editForm.scheduledDate} onChange={e => setEditForm({ ...editForm, scheduledDate: e.target.value })} /></div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditTarget(null)}>Cancel</Button>
                <Button className="flex-1 bg-[#0F1B2D]" onClick={handleUpdate} disabled={updating}>
                  {updating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Staff Modal */}
      {assignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setAssignTarget(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-[#0F1B2D]">Assign Housekeeping Staff</h2>
              <button onClick={() => setAssignTarget(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-muted-foreground">Select a staff member to handle the housekeeping task for Room {assignTarget.room || assignTarget.roomNumber}</p>
              <div className="space-y-1.5">
                <Label>Staff Member</Label>
                <select className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={selectedStaffId} onChange={e => setSelectedStaffId(e.target.value)}>
                  <option value="">-- Select Staff --</option>
                  {staffList.map(st => (
                    <option key={st.id} value={st.id}>{st.firstName} {st.lastName} ({st.role?.replace('_', ' ')})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setAssignTarget(null)}>Cancel</Button>
                <Button className="flex-1 bg-[#0F1B2D]" onClick={handleAssign} disabled={assigning}>
                  {assigning ? 'Assigning...' : 'Assign Staff'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Task Modal */}
      {completeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setCompleteTarget(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-[#0F1B2D]">Complete Task</h2>
              <button onClick={() => setCompleteTarget(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-muted-foreground">Mark housekeeping task for Room {completeTarget.room || completeTarget.roomNumber} as completed</p>
              <div className="space-y-1.5"><Label>Notes</Label>
                <textarea className="flex w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={completeNotes} onChange={e => setCompleteNotes(e.target.value)} placeholder="Any special notes or observations?" /></div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setCompleteTarget(null)}>Cancel</Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleComplete} disabled={completing}>
                  {completing ? 'Completing...' : 'Mark Completed'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
