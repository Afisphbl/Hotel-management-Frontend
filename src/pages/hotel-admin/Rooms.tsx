import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Bed, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  CreateRoomModal,
  RoomCard,
  RoomDetailsModal,
  RoomFilters,
  RoomStatusModal,
  RoomSummaryCards,
} from "@/components/hotel-admin/room";
import type { PaginationMeta, Room } from "@/components/hotel-admin/room";

interface SummaryState {
  total?: number;
  available?: number;
  occupied?: number;
  dirty?: number;
  maintenance?: number;
  out_of_order?: number;
}

export function AdminRooms() {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  });
  const [sortBy, setSortBy] = useState("roomNumber");
  const [summary, setSummary] = useState<SummaryState>({});
  const [activeRoom, setActiveRoom] = useState<{ room: Room; mode: "status" | "details" } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (selectedStatus !== "ALL") params.append("status", selectedStatus);
      params.append("page", String(page));
      params.append("limit", String(pagination.limit));

      const response = await api.get(`hotel/rooms?${params.toString()}`);
      const items: Room[] = response.data ?? response.items ?? response ?? [];
      if (response.meta) setPagination(response.meta);
      setRooms(items);
    } catch (err: any) {
      setError(err.message || "Failed to load rooms");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await api.get("hotel/rooms/summary");
      if (response?.data) setSummary(response.data);
      else if (response?.total != null) setSummary(response);
    } catch (err: any) {
      toast.error(err.message || "Failed to load room summary");
    }
  };

  useEffect(() => {
    void fetchRooms();
  }, [selectedStatus, page, pagination.limit]);

  useEffect(() => {
    void fetchSummary();
  }, []);

  const refreshRooms = async () => {
    await Promise.all([fetchRooms(), fetchSummary()]);
  };

  const filteredRooms = rooms
    .filter(
      (room) =>
        room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.roomType?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.floor?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "roomNumber":
          return a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true });
        case "basePrice":
          return (a.basePrice ?? Infinity) - (b.basePrice ?? Infinity);
        case "baseCapacity":
          return (a.baseCapacity ?? 0) - (b.baseCapacity ?? 0);
        case "floor":
          return a.floor.localeCompare(b.floor, undefined, { numeric: true });
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Rooms</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage room inventory, status, and pricing</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          + Add Room
        </Button>
      </div>

      <RoomSummaryCards summary={summary} />

      <RoomFilters
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        sortBy={sortBy}
        onSearchChange={setSearchTerm}
        onStatusChange={(value) => {
          setSelectedStatus(value || "ALL");
          setPage(1);
        }}
        onSortChange={(value) => setSortBy(value || "roomNumber")}
      />

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <button onClick={fetchRooms} className="ml-auto underline">
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 w-full" />)
        ) : filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onEditStatus={(selectedRoom) => setActiveRoom({ room: selectedRoom, mode: "status" })}
              onEditDetails={(selectedRoom) => setActiveRoom({ room: selectedRoom, mode: "details" })}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
            <Bed className="w-10 h-10 opacity-30" />
            <p className="text-sm">No rooms found</p>
          </div>
        )}
      </div>

      {!isLoading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}–
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} rooms
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((currentPage) => currentPage === 1 || currentPage === pagination.totalPages || Math.abs(currentPage - page) <= 1)
              .map((currentPage, index, items) => (
                <span key={currentPage} className="flex items-center gap-1">
                  {index > 0 && items[index - 1] !== currentPage - 1 && <span className="text-muted-foreground px-1">…</span>}
                  <button
                    onClick={() => setPage(currentPage)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-sm font-medium transition",
                      currentPage === page ? "bg-[#C9973A] text-white" : "text-gray-600 hover:bg-gray-100",
                    )}
                  >
                    {currentPage}
                  </button>
                </span>
              ))}
            <Button variant="outline" size="sm" onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))} disabled={page >= pagination.totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {activeRoom?.mode === "status" && (
        <RoomStatusModal room={activeRoom.room} onClose={() => setActiveRoom(null)} onSaved={refreshRooms} />
      )}
      {activeRoom?.mode === "details" && (
        <RoomDetailsModal room={activeRoom.room} onClose={() => setActiveRoom(null)} onSaved={refreshRooms} />
      )}
      {showCreateModal && <CreateRoomModal onClose={() => setShowCreateModal(false)} onCreated={refreshRooms} />}
    </div>
  );
}
