import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Users, Search, Phone, Mail, MapPin, ChevronLeft, ChevronRight, Plus, Eye, Edit,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export function AdminGuests() {
  const [isLoading, setIsLoading] = useState(true);
  const [guests, setGuests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ fullName: '', email: '', phone: '', nationality: '', idNumber: '' });

  const PAGE_SIZE = 15;

  useEffect(() => {
    fetchGuests();
  }, [page]);

  const fetchGuests = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      params.append('page', String(page));
      params.append('limit', String(PAGE_SIZE));
      const res = await api.get(`hotel/guests?${params.toString()}`);
      setGuests(res.data || res.items || []);
      if (res.meta) {
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      }
    } catch (err: any) {
      toast.error('Failed to load guests: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handleCreate = async () => {
    if (!createForm.fullName) { toast.error('Name is required'); return; }
    try {
      setCreating(true);
      await api.post('hotel/guests', createForm);
      toast.success('Guest created');
      setShowCreate(false);
      setCreateForm({ fullName: '', email: '', phone: '', nationality: '', idNumber: '' });
      fetchGuests();
    } catch (err: any) {
      toast.error('Failed to create guest: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Guests</h1>
          <p className="text-sm text-muted-foreground">Manage guest profiles and information</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <Plus className="w-4 h-4 mr-2" /> Add Guest
        </Button>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, or phone..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader><CardTitle className="text-lg">Guest Directory</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests.map(g => (
                    <TableRow key={g.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#0F1B2D] text-[#C9973A] flex items-center justify-center text-sm font-bold">
                            {(g.fullName || g.name)?.[0] || 'G'}
                          </div>
                          <span>{g.fullName || g.name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {g.email && <span className="flex items-center gap-1 text-sm"><Mail className="w-3 h-3 text-muted-foreground" /> {g.email}</span>}
                      </TableCell>
                      <TableCell className="text-sm">
                        {g.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-muted-foreground" /> {g.phone}</span>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{g.nationality || '—'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{g.createdAt ? formatDate(g.createdAt) : '—'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedGuest(g)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {guests.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No guests found</TableCell></TableRow>
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

      {selectedGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedGuest(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-[#0F1B2D]">Guest Details</h2>
              <button onClick={() => setSelectedGuest(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-[#0F1B2D] text-[#C9973A] flex items-center justify-center text-2xl font-bold">
                  {(selectedGuest.fullName || selectedGuest.name)?.[0] || 'G'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F1B2D]">{selectedGuest.fullName || selectedGuest.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedGuest.email || 'No email'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Phone</span><p className="font-medium">{selectedGuest.phone || '—'}</p></div>
                <div><span className="text-muted-foreground">Nationality</span><p className="font-medium">{selectedGuest.nationality || '—'}</p></div>
                <div><span className="text-muted-foreground">ID Number</span><p className="font-medium">{selectedGuest.idNumber || '—'}</p></div>
                <div><span className="text-muted-foreground">Created</span><p className="font-medium">{selectedGuest.createdAt ? formatDate(selectedGuest.createdAt) : '—'}</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-[#0F1B2D]">Add Guest</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input value={createForm.fullName} onChange={e => setCreateForm({ ...createForm, fullName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={createForm.email} onChange={e => setCreateForm({ ...createForm, email: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={createForm.phone} onChange={e => setCreateForm({ ...createForm, phone: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nationality</Label>
                  <Input value={createForm.nationality} onChange={e => setCreateForm({ ...createForm, nationality: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>ID Number</Label>
                  <Input value={createForm.idNumber} onChange={e => setCreateForm({ ...createForm, idNumber: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button className="flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]" onClick={handleCreate} disabled={creating}>
                  {creating ? 'Creating...' : 'Add Guest'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
