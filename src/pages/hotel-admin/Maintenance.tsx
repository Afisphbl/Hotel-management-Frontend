import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import {
  AssignMaintenanceModal,
  CreateMaintenanceModal,
  EditMaintenanceModal,
  MaintenanceFilters,
  MaintenanceStatsCards,
  MaintenanceTicketsTable,
  ResolveMaintenanceModal,
} from "@/components/hotel-admin/maintenance";
import type {
  MaintenanceRoom,
  MaintenanceStaff,
  MaintenanceStats,
  MaintenanceStatus,
  MaintenanceTicket,
} from "@/components/hotel-admin/maintenance";

export function AdminMaintenance() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [staffList, setStaffList] = useState<MaintenanceStaff[]>([]);
  const [roomList, setRoomList] = useState<MaintenanceRoom[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<MaintenanceStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<MaintenanceStats>({ total: 0, open: 0, inProgress: 0, completed: 0 });
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<MaintenanceTicket | null>(null);
  const [assignTarget, setAssignTarget] = useState<MaintenanceTicket | null>(null);
  const [resolveTarget, setResolveTarget] = useState<MaintenanceTicket | null>(null);

  const PAGE_SIZE = 15;

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== "ALL") params.append("status", filterStatus);
      params.append("page", String(page));
      params.append("limit", String(PAGE_SIZE));

      const res = await api.get(`hotel/maintenance?${params.toString()}`);
      setTickets((res.data || res.items || []) as MaintenanceTicket[]);
      if (res.meta) {
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      }
    } catch (err: any) {
      toast.error("Failed to load tickets: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await api.get("hotel/staff?limit=100");
      setStaffList((res.data || res.items || []) as MaintenanceStaff[]);
    } catch (err: any) {
      toast.error("Failed to load staff list: " + err.message);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await api.get("hotel/rooms?limit=200");
      setRoomList((res.data || res.items || []) as MaintenanceRoom[]);
    } catch (err: any) {
      toast.error("Failed to load rooms: " + err.message);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("hotel/maintenance/stats");
      if (res.data) setStats(res.data as MaintenanceStats);
    } catch (err: any) {
      toast.error("Failed to load maintenance stats: " + err.message);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filterStatus]);

  useEffect(() => {
    void fetchTickets();
  }, [page, filterStatus]);

  useEffect(() => {
    void fetchStaff();
    void fetchRooms();
    void fetchStats();
  }, []);

  const refreshTickets = async () => {
    await Promise.all([fetchTickets(), fetchStats()]);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this maintenance ticket?")) return;

    try {
      await api.delete(`hotel/maintenance/${id}`);
      toast.success("Ticket deleted successfully");
      await refreshTickets();
    } catch (err: any) {
      toast.error("Failed to delete ticket: " + err.message);
    }
  };

  const filteredTickets = tickets.filter(
    (ticket) =>
      (ticket.room?.roomNumber || ticket.roomId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Maintenance</h1>
          <p className="text-sm text-muted-foreground">Track and resolve maintenance requests</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <span className="mr-2">+</span> New Ticket
        </Button>
      </div>

      <MaintenanceStatsCards stats={stats} />

      <MaintenanceFilters
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        onSearchChange={setSearchTerm}
        onFilterChange={(value) => setFilterStatus(value)}
      />

      <MaintenanceTicketsTable
        tickets={filteredTickets}
        isLoading={isLoading}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onAssign={setAssignTarget}
        onEdit={setEditTarget}
        onResolve={setResolveTarget}
        onDelete={handleDelete}
      />

      <CreateMaintenanceModal
        open={showCreate}
        rooms={roomList}
        reportedBy={user?.sub}
        onClose={() => setShowCreate(false)}
        onCreated={refreshTickets}
      />
      {editTarget && (
        <EditMaintenanceModal
          ticket={editTarget}
          rooms={roomList}
          onClose={() => setEditTarget(null)}
          onSaved={refreshTickets}
        />
      )}
      {assignTarget && (
        <AssignMaintenanceModal
          ticket={assignTarget}
          staffList={staffList}
          onClose={() => setAssignTarget(null)}
          onAssigned={refreshTickets}
        />
      )}
      {resolveTarget && (
        <ResolveMaintenanceModal
          ticket={resolveTarget}
          onClose={() => setResolveTarget(null)}
          onResolved={refreshTickets}
        />
      )}
    </div>
  );
}
