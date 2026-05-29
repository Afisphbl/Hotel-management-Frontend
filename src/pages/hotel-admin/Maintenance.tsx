import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Wrench, Search, ChevronLeft, ChevronRight, Plus, CheckCircle, AlertCircle, Clock, UserCheck,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export function AdminMaintenance() {
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ roomId: '', issue: '', priority: 'NORMAL', description: '' });
  const [resolveTarget, setResolveTarget] = useState<any>(null);
  const [resolveNotes, setResolveNotes] = useState('');
  const [resolveCost, setResolveCost] = useState('');

  const PAGE_SIZE = 15;

  useEffect(() => { setPage(1); }, [filterStatus]);

  useEffect(() => { fetchTickets(); }, [page, filterStatus]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'ALL') params.append('status', filterStatus);
      params.append('page', String(page));
      params.append('limit', String(PAGE_SIZE));
      const res = await api.get(`hotel/maintenance?${params.toString()}`);
      setTickets(res.data || res.items || []);
      if (res.meta) { setTotal(res.meta.total); setTotalPages(res.meta.totalPages); }
    } catch (err: any) {
      toast.error('Failed to load tickets: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id: string, action: string, data?: any) => {
    try {
      await api.post(`hotel/maintenance/${id}/${action}`, data || {});
      toast.success(`Ticket ${action} successful`);
      setResolveTarget(null);
      setResolveNotes('');
      setResolveCost('');
      fetchTickets();
    } catch (err: any) {
      toast.error(`Failed to ${action}: ${err.message}`);
    }
  };

  const handleCreate = async () => {
    if (!createForm.roomId || !createForm.issue) {
      toast.error('Room and issue are required'); return;
    }
    try {
      setCreating(true);
      await api.post('hotel/maintenance', createForm);
      toast.success('Ticket created');
      setShowCreate(false);
      setCreateForm({ roomId: '', issue: '', priority: 'NORMAL', description: '' });
      fetchTickets();
    } catch (err: any) {
      toast.error('Failed to create ticket: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const openCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'PENDING').length;
  const completedCount = tickets.filter(t => t.status === 'COMPLETED' || t.status === 'RESOLVED').length;
  const inProgressCount = tickets.filter(t => t.status === 'IN_PROGRESS').length;

  const filtered = tickets.filter(t =>
    t.room?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.issue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          { label: 'Open / Pending', value: openCount, icon: AlertCircle, color: 'text-red-600' },
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
              {['ALL', 'OPEN', 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'COMPLETED'].map(s => (
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
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(t => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">Room {t.room || t.roomNumber || '—'}</TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">{t.issue || t.description || '—'}</TableCell>
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
                          t.status === 'COMPLETED' || t.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                            t.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800')}>
                          {t.status?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {t.createdAt ? formatDate(t.createdAt) : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {(!t.assignedTo && t.status !== 'COMPLETED' && t.status !== 'RESOLVED') && (
                            <Button variant="ghost" size="sm" onClick={() => handleAction(t.id, 'assign')} title="Assign">
                              <UserCheck className="w-4 h-4 text-blue-600" />
                            </Button>
                          )}
                          {(t.status === 'IN_PROGRESS' || t.status === 'OPEN') && (
                            <Button variant="ghost" size="sm"
                              onClick={() => { setResolveTarget(t); setResolveNotes(''); setResolveCost(''); }}
                              title="Resolve">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="h-32 text-center text-muted-foreground">No tickets found</TableCell></TableRow>
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
                <Input value={createForm.roomId} onChange={e => setCreateForm({ ...createForm, roomId: e.target.value })} placeholder="Room number or ID" /></div>
              <div className="space-y-1.5"><Label>Issue *</Label>
                <Input value={createForm.issue} onChange={e => setCreateForm({ ...createForm, issue: e.target.value })} placeholder="Brief title" /></div>
              <div className="space-y-1.5"><Label>Description</Label>
                <textarea className="flex w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={createForm.description} onChange={e => setCreateForm({ ...createForm, description: e.target.value })} /></div>
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
                  {creating ? 'Creating...' : 'Create Ticket'}
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
              <p className="text-sm text-muted-foreground">Resolve maintenance ticket for Room {resolveTarget.room || resolveTarget.roomNumber}</p>
              <div className="space-y-1.5"><Label>Resolution Notes</Label>
                <textarea className="flex w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={resolveNotes} onChange={e => setResolveNotes(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Cost (if any)</Label>
                <Input type="number" min="0" step="0.01" value={resolveCost} onChange={e => setResolveCost(e.target.value)} /></div>
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
