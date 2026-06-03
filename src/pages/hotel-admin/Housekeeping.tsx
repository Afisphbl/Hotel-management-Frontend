import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  HousekeepingHeader, HousekeepingSummaryStrip, HousekeepingSummaryCards,
  HousekeepingDashboard, HousekeepingSearchFilter, HousekeepingTable,
  HousekeepingCreateModal, HousekeepingEditModal, HousekeepingAssignModal,
  HousekeepingCompleteModal
} from '@/components/hotel-admin/housekeeping';

export function AdminHousekeeping() {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [summary, setSummary] = useState({ dirty: 0, cleaning: 0, inspecting: 0, clean: 0, total: 0, pendingActive: 0, completed: 0 });

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
    fetchSummary();
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

  const fetchSummary = async () => {
    try {
      const res = await api.get('hotel/housekeeping?limit=1000');
      const allTasks = res.data || res.items || [];
      setSummary({
        dirty: allTasks.filter((t: any) => t.status === 'PENDING').length,
        cleaning: allTasks.filter((t: any) => t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED').length,
        inspecting: allTasks.filter((t: any) => t.status === 'VERIFIED').length,
        clean: allTasks.filter((t: any) => t.status === 'COMPLETED').length,
        total: allTasks.length,
        pendingActive: allTasks.filter((t: any) => t.status === 'PENDING' || t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED').length,
        completed: allTasks.filter((t: any) => t.status === 'COMPLETED').length,
      });
    } catch (err: any) {
      console.error('Failed to load summary:', err.message);
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
      fetchSummary();
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
      fetchSummary();
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
      fetchSummary();
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
      fetchSummary();
    } catch (err: any) {
      toast.error('Failed to delete task: ' + err.message);
    }
  };

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

  return (
    <div className="space-y-8 pb-10">
      <HousekeepingHeader onNewTask={() => setShowCreate(true)} />
      <HousekeepingSummaryStrip summary={summary} />
      <HousekeepingSummaryCards summary={summary} />
      <HousekeepingDashboard
        tasks={tasks}
        onAssign={(task) => { setAssignTarget(task); setSelectedStaffId(task.assignedTo || ''); }}
        onComplete={(task) => { setCompleteTarget(task); setCompleteNotes(task.notes || ''); }}
        getPriorityColor={getPriorityColor}
      />
      <HousekeepingSearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />
      <HousekeepingTable
        tasks={tasks}
        isLoading={isLoading}
        searchTerm={searchTerm}
        page={page}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={(task) => {
          setEditTarget(task);
          setEditForm({
            roomId: task.roomId || '',
            description: task.description || '',
            priority: task.priority || 'NORMAL',
            scheduledDate: task.scheduledDate || new Date().toISOString().split('T')[0]
          });
        }}
        onAssign={(task) => { setAssignTarget(task); setSelectedStaffId(task.assignedTo || ''); }}
        onComplete={(task) => { setCompleteTarget(task); setCompleteNotes(task.notes || ''); }}
        onDelete={handleDelete}
        getPriorityColor={getPriorityColor}
        PAGE_SIZE={PAGE_SIZE}
      />
      <HousekeepingCreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        roomList={roomList}
        form={createForm}
        onFormChange={setCreateForm}
        onCreate={handleCreate}
        creating={creating}
      />
      <HousekeepingEditModal
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        roomList={roomList}
        form={editForm}
        onFormChange={setEditForm}
        onUpdate={handleUpdate}
        updating={updating}
      />
      <HousekeepingAssignModal
        target={assignTarget}
        onClose={() => setAssignTarget(null)}
        staffList={staffList}
        selectedStaffId={selectedStaffId}
        onStaffChange={setSelectedStaffId}
        onAssign={handleAssign}
        assigning={assigning}
      />
      <HousekeepingCompleteModal
        target={completeTarget}
        onClose={() => setCompleteTarget(null)}
        completeNotes={completeNotes}
        onNotesChange={setCompleteNotes}
        onComplete={handleComplete}
        completing={completing}
      />
    </div>
  );
}
