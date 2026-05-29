import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Users, Plus, Search, Mail, Edit, Trash2, CheckCircle, Clock,
  AlertCircle, Loader2, ChevronLeft, ChevronRight, Shield,
  ShieldCheck, UserPlus, XCircle,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

export function AdminStaff() {
  const [isLoading, setIsLoading] = useState(true);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [roles, setRoles] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', firstName: '', lastName: '', roleId: '', notes: '' });
  const [roleChangeTarget, setRoleChangeTarget] = useState<{ id: string; currentRoleId: string } | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [isRoleSaving, setIsRoleSaving] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<any | null>(null);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  useEffect(() => { setPage(1); }, [filterStatus]);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', PAGE_SIZE.toString());
      if (filterStatus !== 'ALL') params.append('status', filterStatus);

      const [staffRes, rolesRes, summaryRes] = await Promise.all([
        api.get(`hotel/owner/staff?${params.toString()}`),
        api.get('hotel/owner/staff/roles'),
        api.get('hotel/owner/staff/summary'),
      ]);

      setStaffList(staffRes.data || []);
      if (staffRes.meta) { setTotal(staffRes.meta.total); setTotalPages(staffRes.meta.totalPages); }
      setRoles(rolesRes.data || []);
      setSummary(summaryRes.data || null);
    } catch (e: any) {
      toast.error('Failed to load staff: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleInvite = async () => {
    if (!inviteForm.email || !inviteForm.firstName || !inviteForm.lastName || !inviteForm.roleId) {
      toast.error('Please fill in name, email, and role'); return;
    }
    setIsSaving(true);
    try {
      await api.post('hotel/owner/staff/invite', inviteForm);
      toast.success('Staff invited successfully');
      setIsInviteOpen(false);
      setInviteForm({ email: '', firstName: '', lastName: '', roleId: '', notes: '' });
      fetchAll();
    } catch (e: any) {
      toast.error('Failed to invite: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoleChange = async () => {
    if (!roleChangeTarget || !selectedRoleId) return;
    setIsRoleSaving(true);
    try {
      await api.patch(`hotel/owner/staff/${roleChangeTarget.id}/role`, { roleId: selectedRoleId });
      toast.success('Role updated');
      setRoleChangeTarget(null);
      fetchAll();
    } catch (e: any) {
      toast.error('Failed to update role: ' + e.message);
    } finally {
      setIsRoleSaving(false);
    }
  };

  const toggleStatus = async (item: any) => {
    try {
      const newStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await api.patch(`hotel/owner/staff/${item.id}/status`, { status: newStatus });
      toast.success(`Staff ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`);
      fetchAll();
    } catch (e: any) {
      toast.error('Failed to update status: ' + e.message);
    }
  };

  const handleRemove = async () => {
    if (!removeTarget) return;
    try {
      await api.delete(`hotel/owner/staff/${removeTarget.id}`);
      toast.success('Staff access revoked');
      setIsRemoveOpen(false);
      setRemoveTarget(null);
      fetchAll();
    } catch (e: any) {
      toast.error('Failed to remove: ' + e.message);
    }
  };

  const filteredList = staffList.filter(m =>
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusLabel = (s: string) => ({ ACTIVE: 'Active', INACTIVE: 'Inactive', PENDING: 'Pending' }[s] || s);

  const filterTabs = [
    { value: 'ALL', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Staff Management</h1>
          <p className="text-sm text-muted-foreground">Manage hotel staff, roles, and access permissions</p>
        </div>
        <Button onClick={() => { setInviteForm({ email: '', firstName: '', lastName: '', roleId: '', notes: '' }); setIsInviteOpen(true); }}
          className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <UserPlus className="w-4 h-4 mr-2" /> Invite Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Staff', value: summary?.total ?? total, icon: Users, color: 'text-blue-600' },
          { label: 'Active', value: summary?.active ?? 0, icon: ShieldCheck, color: 'text-green-600' },
          { label: 'Pending', value: summary?.pending ?? 0, icon: Clock, color: 'text-orange-600' },
          { label: 'Inactive', value: summary?.inactive ?? 0, icon: XCircle, color: 'text-red-600' },
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

      {summary?.distribution?.length > 0 && (
        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#C9973A]" /> Role Distribution
            </h3>
            <div className="flex flex-wrap gap-3">
              {summary.distribution.map((d: any) => (
                <Badge key={d.roleId} variant="outline" className="px-4 py-2 text-sm gap-2 border-slate-200">
                  <span className="font-semibold text-[#0F1B2D]">{d.roleName}</span>
                  <span className="bg-[#C9973A]/10 text-[#C9973A] px-2 py-0.5 rounded-full text-xs font-bold">{d.count}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name or email..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {filterTabs.map(tab => (
                <button key={tab.value} onClick={() => setFilterStatus(tab.value)}
                  className={cn("px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition",
                    filterStatus === tab.value ? "bg-[#C9973A] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader><CardTitle className="text-lg">Staff Directory</CardTitle></CardHeader>
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
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Granted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredList.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#0F1B2D] text-[#C9973A] flex items-center justify-center text-sm font-bold">
                            {item.firstName?.[0]}{item.lastName?.[0]}
                          </div>
                          <span>{item.firstName} {item.lastName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{item.email}</TableCell>
                      <TableCell>
                        {item.roleName ? (
                          <Badge variant="secondary" className="font-normal">{item.roleName.replace(/_/g, ' ')}</Badge>
                        ) : <span className="text-muted-foreground text-sm">No role</span>}
                      </TableCell>
                      <TableCell>
                        <span className={cn("px-3 py-1 rounded-full text-xs font-medium",
                          item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            item.status === 'PENDING' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800')}>
                          {statusLabel(item.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.grantedAt ? new Date(item.grantedAt).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => { setRoleChangeTarget({ id: item.id, currentRoleId: item.roleId }); setSelectedRoleId(item.roleId || ''); }} title="Change role">
                            <Shield className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => toggleStatus(item)} title={item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}>
                            {item.status === 'ACTIVE' ? <XCircle className="w-4 h-4 text-orange-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { setRemoveTarget(item); setIsRemoveOpen(true); }} title="Revoke access">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredList.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No staff found</TableCell></TableRow>
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

      <Sheet open={isInviteOpen} onOpenChange={(open) => { if (!open) { setInviteForm({ email: '', firstName: '', lastName: '', roleId: '', notes: '' }); setIsInviteOpen(false); } }}>
        <SheetContent className="sm:max-w-[500px] p-0 flex flex-col h-full">
          <SheetHeader className="border-b px-6 py-5 shrink-0">
            <SheetTitle className="text-xl font-serif">Invite Staff Member</SheetTitle>
            <SheetDescription>Grant a user access with a specific role.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto max-w-md space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>First Name *</Label>
                  <Input value={inviteForm.firstName} onChange={e => setInviteForm({ ...inviteForm, firstName: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Last Name *</Label>
                  <Input value={inviteForm.lastName} onChange={e => setInviteForm({ ...inviteForm, lastName: e.target.value })} /></div>
              </div>
              <div className="space-y-1.5"><Label>Email *</Label>
                <Input type="email" value={inviteForm.email} onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Role *</Label>
                <select className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={inviteForm.roleId} onChange={e => setInviteForm({ ...inviteForm, roleId: e.target.value })}>
                  <option value="">Select a role...</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name.replace(/_/g, ' ')}</option>)}
                </select></div>
              <div className="space-y-1.5"><Label>Notes (optional)</Label>
                <textarea className="flex w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={inviteForm.notes} onChange={e => setInviteForm({ ...inviteForm, notes: e.target.value })} /></div>
            </div>
          </div>
          <div className="border-t px-6 py-4 shrink-0 flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setInviteForm({ email: '', firstName: '', lastName: '', roleId: '', notes: '' }); setIsInviteOpen(false); }}>Cancel</Button>
            <Button onClick={handleInvite} disabled={isSaving} className="bg-[#0F1B2D]">
              {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Inviting...</> : <><UserPlus className="w-4 h-4 mr-2" /> Send Invite</>}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={!!roleChangeTarget} onOpenChange={(open) => { if (!open) setRoleChangeTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Staff Role</DialogTitle>
            <DialogDescription>Select a new role for this staff member.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5"><Label>New Role</Label>
              <select className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                value={selectedRoleId} onChange={e => setSelectedRoleId(e.target.value)}>
                <option value="">Select a role...</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name.replace(/_/g, ' ')}</option>)}
              </select></div>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={() => setRoleChangeTarget(null)}>Cancel</Button>
            <Button onClick={handleRoleChange} disabled={isRoleSaving || !selectedRoleId} className="bg-[#0F1B2D]">
              {isRoleSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Update Role'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRemoveOpen} onOpenChange={setIsRemoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Staff Access</DialogTitle>
            <DialogDescription>Are you sure you want to revoke access for {removeTarget?.firstName} {removeTarget?.lastName}?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsRemoveOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemove} className="bg-red-600 hover:bg-red-700">Revoke Access</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
