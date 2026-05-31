import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Wrench, Search, ChevronLeft, ChevronRight, Plus, CheckCircle, AlertCircle, Clock, UserCheck, Edit2, Trash,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export function AdminMaintenance() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [roomList, setRoomList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ roomId: '', title: '', priority: 'medium', description: '' });
  const [editTarget, setEditTarget] = useState<any>(null);
  const [editForm, setEditForm] = useState({ roomId: '', title: '', priority: 'medium', description: '' });
  const [updating, setUpdating] = useState(false);
  const [assignTarget, setAssignTarget] = useState<any>(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [resolveTarget, setResolveTarget] = useState<any>(null);
  const [resolveNotes, setResolveNotes] = useState('');
  const [resolveCost, setResolveCost] = useState('');

  const PAGE_SIZE = 15;

  useEffect(() => { setPage(1); }, [filterStatus]);

  useEffect(() => {
    fetchTickets();
  }, [page, filterStatus]);

  useEffect(() => {
    fetchStaff();
    fetchRooms();
  }, []);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'ALL') params.append('status', filterStatus);
      params.append('page', String(page));
      params.append('limit', String(PAGE_SIZE));
      const res = await api.get(`hotel/maintenance?${params.toString()}`);
      setTickets(res.data || res.items || []);
      if (res.meta) {
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      }
    } catch (err: any) {
      toast.error('Failed to load tickets: ' + err.message);
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

  const handleAction = async (id: string, action: string, data?: any) => {
    try {
      await api.post(`hotel/maintenance/${id}/${action}`, data || {});
      toast.success(`Ticket ${action} successful`);
      setResolveTarget(null);
      setResolveNotes('');
      setResolveCost('');
      setAssignTarget(null);
      setSelectedStaffId('');
      fetchTickets();
    } catch (err: any) {
      toast.error(`Failed to ${action}: ${err.message}`);
    }
  };

  const handleCreate = async () => {
    if (!createForm.roomId || !createForm.title) {
      toast.error('Room and title are required'); return;
    }
    try {
      setCreating(true);
      await api.post('hotel/maintenance', { ...createForm, reportedBy: user?.sub });
      toast.success('Ticket created');
      setShowCreate(false);
      setCreateForm({ roomId: '', title: '', priority: 'medium', description: '' });
      fetchTickets();
    } catch (err: any) {
      toast.error('Failed to create ticket: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async () => {
    if (!editForm.roomId || !editForm.title) {
      toast.error('Room and title are required');
      return;
    }
    try {
      setUpdating(true);
      await api.patch(`hotel/maintenance/${editTarget.id}`, editForm);
      toast.success('Ticket updated');
      setEditTarget(null);
      fetchTickets();
    } catch (err: any) {
      toast.error('Failed to update ticket: ' + err.message);
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
      await api.post(`hotel/maintenance/${assignTarget.id}/assign`, { staffId: selectedStaffId });
      toast.success('Staff assigned successfully');
      setAssignTarget(null);
      setSelectedStaffId('');
      fetchTickets();
    } catch (err: any) {
      toast.error('Failed to assign staff: ' + err.message);
    } finally {
      setAssigning(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this maintenance ticket?')) {
      return;
    }
    try {
      await api.delete(`hotel/maintenance/${id}`);
      toast.success('Ticket deleted successfully');
      fetchTickets();
    } catch (err: any) {
      toast.error('Failed to delete ticket: ' + err.message);
    }
  };

  const openCount = tickets.filter(t => t.status === 'reported' || t.status === 'assigned').length;
  const completedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;

  const filtered = tickets.filter(t =>
    (t.room?.roomNumber || t.roomId || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Maintenance</h1>
          <p className="text-sm text-muted-foreground">Track and resolve maintenance requests</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <Plus className="w-4 h-4 mr-2" /> New Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tickets', value: tickets.length, icon: Wrench, color: 'text-blue-600' },
          { label: 'Open / Assigned', value: openCount, icon: AlertCircle, color: 'text-red-600' },
          { label: 'In Progress', value: inProgressCount, icon: Clock, color: 'text-orange-600' },
          { label: 'Completed', value: completedCount, icon: CheckCircle, color: 'text-green-600' },
        ].map(s => (
          <Card key={s.label} className="shadow-sm border-none bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">{s.label}</p>
                  <h3 className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</h3>
                </div>
                <s.icon className={`w-12 h-12 ${s.color} opacity-20`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search tickets..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {['ALL', 'reported', 'assigned', 'in_progress', 'resolved', 'closed'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={cn("px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition",
                    filterStatus === s ? "bg-[#C9973A] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}>
                  {s === 'ALL' ? 'All' : s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader><CardTitle className="text-lg">Maintenance Tickets</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(t => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">Room {t.room?.roomNumber || t.roomId || '—'}</TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">{t.title || t.description || '—'}</TableCell>
                      <TableCell className="text-sm">{t.assignedToName || '—'}</TableCell>
                      <TableCell className="text-sm">{t.reporter ? `${t.reporter.firstName} ${t.reporter.lastName}` : t.reportedBy || '—'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          t.priority === 'high' || t.priority === 'critical' ? 'border-red-200 text-red-700 bg-red-50' :
                            t.priority === 'medium' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                              'border-gray-200 text-gray-600'
                        )}>{(t.priority || 'medium').toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs',
                          t.status === 'resolved' || t.status === 'closed' ? 'bg-green-100 text-green-800' :
                            t.status === 'in_progress' || t.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800')}>
                          {(t.status || 'reported').replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {t.createdAt ? formatDate(t.createdAt) : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {t.status !== 'resolved' && t.status !== 'closed' && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => {
                                setAssignTarget(t);
                                setSelectedStaffId(t.assignedTo || '');
                              }} title="Assign Staff">
                                <UserCheck className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="sm"
                                onClick={() => {
                                  setEditTarget(t);
                                  setEditForm({
                                    roomId: t.room?.id || t.roomId || '',
                                    title: t.title || '',
                                    priority: t.priority || 'medium',
                                    description: t.description || ''
                                  });
                                }} title="Edit Ticket">
                                <Edit2 className="w-4 h-4 text-amber-600" />
                              </Button>
                              <Button variant="ghost" size="sm"
                                onClick={() => { setResolveTarget(t); setResolveNotes(''); setResolveCost(''); }}
                                title="Resolve">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)} title="Delete Ticket">
                            <Trash className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={8} className="h-32 text-center text-muted-foreground">No tickets found</TableCell></TableRow>
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

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-[#0F1B2D]">New Maintenance Ticket</h2>
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
              <div className="space-y-1.5"><Label>Title *</Label>
                <Input value={createForm.title} onChange={e => setCreateForm({ ...createForm, title: e.target.value })} placeholder="Brief title" /></div>
              <div className="space-y-1.5"><Label>Description</Label>
                <textarea className="flex w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={createForm.description} onChange={e => setCreateForm({ ...createForm, description: e.target.value })} placeholder="Details of the problem" /></div>
              <div className="space-y-1.5"><Label>Priority</Label>
                <select className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={createForm.priority} onChange={e => setCreateForm({ ...createForm, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select></div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button className="flex-1 bg-[#0F1B2D]" onClick={handleCreate} disabled={creating}>
                  {creating ? 'Creating...' : 'Create Ticket'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setEditTarget(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-[#0F1B2D]">Edit Ticket</h2>
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
              <div className="space-y-1.5"><Label>Title *</Label>
                <Input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Brief title" /></div>
              <div className="space-y-1.5"><Label>Description</Label>
                <textarea className="flex w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Priority</Label>
                <select className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={editForm.priority} onChange={e => setEditForm({ ...editForm, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select></div>
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

      {assignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setAssignTarget(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-[#0F1B2D]">Assign Maintenance Staff</h2>
              <button onClick={() => setAssignTarget(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-muted-foreground">Select a staff member to handle the maintenance request for Room {assignTarget.room?.roomNumber || assignTarget.roomId}</p>
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

      {resolveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setResolveTarget(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-[#0F1B2D]">Resolve Ticket</h2>
              <button onClick={() => setResolveTarget(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-muted-foreground">Resolve maintenance ticket for Room {resolveTarget.room?.roomNumber || resolveTarget.roomId}</p>
              <div className="space-y-1.5"><Label>Resolution Notes</Label>
                <textarea className="flex w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={resolveNotes} onChange={e => setResolveNotes(e.target.value)} placeholder="What was done to fix the issue?" /></div>
              <div className="space-y-1.5"><Label>Cost (if any)</Label>
                <Input type="number" min="0" step="0.01" value={resolveCost} onChange={e => setResolveCost(e.target.value)} placeholder="0.00" /></div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setResolveTarget(null)}>Cancel</Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleAction(resolveTarget.id, 'resolve', { notes: resolveNotes, cost: resolveCost ? parseFloat(resolveCost) : undefined })}>
                  Resolve
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
