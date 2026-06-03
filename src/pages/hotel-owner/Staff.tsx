import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { StaffHeader } from '@/components/hotel-owner/staff/StaffHeader';
import { StaffSummaryCards } from '@/components/hotel-owner/staff/StaffSummaryCards';
import { StaffRoleDistribution } from '@/components/hotel-owner/staff/StaffRoleDistribution';
import { StaffSearchBar } from '@/components/hotel-owner/staff/StaffSearchBar';
import { StaffTable } from '@/components/hotel-owner/staff/StaffTable';
import { InviteStaffSheet } from '@/components/hotel-owner/staff/InviteStaffSheet';
import { ChangeRoleDialog } from '@/components/hotel-owner/staff/ChangeRoleDialog';
import { RemoveStaffDialog } from '@/components/hotel-owner/staff/RemoveStaffDialog';
import { InviteResultDialog } from '@/components/hotel-owner/staff/InviteResultDialog';

const PAGE_SIZE = 10;

export function StaffPage() {
  const { user } = useAuthStore();
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
  const [inviteResult, setInviteResult] = useState<{ email: string; tempPassword?: string } | null>(null);

  const [roleChangeTarget, setRoleChangeTarget] = useState<{ id: string; currentRoleId: string } | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [isRoleSaving, setIsRoleSaving] = useState(false);

  const [removeTarget, setRemoveTarget] = useState<any | null>(null);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [filterStatus]);

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
      if (staffRes.meta) {
        setTotal(staffRes.meta.total);
        setTotalPages(staffRes.meta.totalPages);
      }
      setRoles(rolesRes.data || []);
      setSummary(summaryRes.data || null);
    } catch (e: any) {
      toast.error('Failed to load staff data: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const resetInviteForm = () => {
    setInviteForm({ email: '', firstName: '', lastName: '', roleId: '', notes: '' });
  };

  const handleInvite = async () => {
    if (!inviteForm.email || !inviteForm.firstName || !inviteForm.lastName || !inviteForm.roleId) {
      toast.error('Please fill in name, email, and role');
      return;
    }
    setIsSaving(true);
    try {
      const res = await api.post('hotel/owner/staff/invite', inviteForm);
      const r = res?.data ?? res;
      setInviteResult({ email: inviteForm.email, tempPassword: r?.tempPassword });
      setIsInviteOpen(false);
      resetInviteForm();
      fetchAll();
    } catch (e: any) {
      toast.error('Failed to invite: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const openRoleChange = (item: any) => {
    setRoleChangeTarget({ id: item.id, currentRoleId: item.roleId });
    setSelectedRoleId(item.roleId || '');
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

  const confirmRemove = (item: any) => {
    setRemoveTarget(item);
    setIsRemoveOpen(true);
  };

  const handleRemove = async () => {
    if (!removeTarget) return;

    const isTargetAdminOrOwner = removeTarget.roleName && (removeTarget.roleName.toUpperCase().includes('OWNER') || removeTarget.roleName.toUpperCase().includes('ADMIN'));
    if (user?.role === 'HOTEL_ADMIN' && isTargetAdminOrOwner) {
      toast.error('Admins cannot remove other admins or owners');
      return;
    }

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

  const canManageRole = (item: any) => {
    if (user?.role !== 'HOTEL_ADMIN') return true;
    const isTargetAdminOrOwner = item.roleName && (item.roleName.toUpperCase().includes('OWNER') || item.roleName.toUpperCase().includes('ADMIN'));
    return !isTargetAdminOrOwner;
  };

  return (
    <div className="space-y-8 pb-10">
      <StaffHeader onInvite={() => { resetInviteForm(); setIsInviteOpen(true); }} />
      <StaffSummaryCards summary={summary} total={total} />
      <StaffRoleDistribution distribution={summary?.distribution} />
      <StaffSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />
      <StaffTable
        isLoading={isLoading}
        staffList={staffList}
        searchTerm={searchTerm}
        page={page}
        pageSize={PAGE_SIZE}
        totalPages={totalPages}
        total={total}
        canManageRole={canManageRole}
        onChangeRole={openRoleChange}
        onToggleStatus={toggleStatus}
        onRemove={confirmRemove}
        onPageChange={setPage}
      />
      <InviteStaffSheet
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        form={inviteForm}
        onFormChange={setInviteForm}
        roles={roles}
        isSaving={isSaving}
        onInvite={handleInvite}
        onReset={resetInviteForm}
      />
      <ChangeRoleDialog
        target={roleChangeTarget}
        selectedRoleId={selectedRoleId}
        onRoleChange={setSelectedRoleId}
        roles={roles}
        isSaving={isRoleSaving}
        onSave={handleRoleChange}
        onClose={() => setRoleChangeTarget(null)}
      />
      <RemoveStaffDialog
        open={isRemoveOpen}
        onOpenChange={setIsRemoveOpen}
        target={removeTarget}
        onConfirm={handleRemove}
      />
      <InviteResultDialog
        result={inviteResult}
        onClose={() => setInviteResult(null)}
      />
    </div>
  );
}
