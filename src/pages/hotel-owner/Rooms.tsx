import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Bed,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { RoomTypesDialog } from "@/components/shared/RoomTypesDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Components
import { RoomsHeader } from "@/components/hotel-owner/rooms/RoomsHeader";
import { RoomsSummaryCards } from "@/components/hotel-owner/rooms/RoomsSummaryCards";
import { RoomsFilters } from "@/components/hotel-owner/rooms/RoomsFilters";
import { RoomCard } from "@/components/hotel-owner/rooms/RoomCard";
import { RoomEditModal } from "@/components/hotel-owner/rooms/RoomEditModal";
import { RoomCreateModal } from "@/components/hotel-owner/rooms/RoomCreateModal";

// Types
import { Room, RoomType, PaginationMeta, RoomSummary } from "@/types/room";

export function RoomsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  });
  const [sortBy, setSortBy] = useState("roomNumber");
  const [summary, setSummary] = useState<RoomSummary>({});

  // Room Type state
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [showRoomTypesModal, setShowRoomTypesModal] = useState(false);

  // Edit modal state
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editTab, setEditTab] = useState<"status" | "details">("status");

  // Create room modal state
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [selectedStatus, page]);

  useEffect(() => {
    fetchSummary();
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const res = await api.get("hotel/room-types");
      setRoomTypes(res.data || res.items || res || []);
    } catch (err) {
      console.error("Failed to fetch room types:", err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await api.get("hotel/rooms/summary");
      if (res?.data) {
        setSummary(res.data);
      } else if (res?.total != null) {
        setSummary(res);
      }
    } catch (err) {
      console.error("Failed to fetch room summary:", err);
    }
  };

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
      if (response.meta) {
        setPagination(response.meta);
      }
      setRooms(items);
    } catch (err: any) {
      console.error("Failed to fetch rooms:", err);
      setError(err.message || "Failed to load rooms");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([fetchRooms(), fetchSummary()]);
  };

  const goToPage = (p: number) => {
    if (p < 1 || p > pagination.totalPages) return;
    setPage(p);
  };

  const openEditModal = (room: Room, tab: "status" | "details") => {
    setEditingRoom(room);
    setEditTab(tab);
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
          return a.roomNumber.localeCompare(b.roomNumber, undefined, {
            numeric: true,
          });
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
    <div className='space-y-8 pb-10'>
      <RoomsHeader 
        summary={summary} 
        onManageRoomTypes={() => setShowRoomTypesModal(true)} 
        onAddRoom={() => setShowCreateModal(true)} 
      />

      <RoomsSummaryCards summary={summary} />

      <RoomsFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={(v) => {
          setSelectedStatus(v || "ALL");
          setPage(1);
        }}
        sortBy={sortBy}
        onSortByChange={(v) => setSortBy(v || "roomNumber")}
      />

      {/* Error */}
      {error && (
        <div className='flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm'>
          <AlertTriangle className='w-4 h-4 shrink-0' />
          <span>{error}</span>
          <button onClick={fetchRooms} className='ml-auto underline'>
            Retry
          </button>
        </div>
      )}

      {/* Rooms Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {isLoading ? (
          Array(6)
            .fill(0)
            .map((_, i) => <Skeleton key={i} className='h-56 w-full' />)
        ) : filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <RoomCard 
              key={room.id} 
              room={room} 
              onEditStatus={(r) => openEditModal(r, "status")}
              onEditDetails={(r) => openEditModal(r, "details")}
            />
          ))
        ) : (
          <div className='col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground gap-2'>
            <Bed className='w-10 h-10 opacity-30' />
            <p className='text-sm'>No rooms found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && pagination.totalPages > 1 && (
        <div className='flex items-center justify-between pt-4'>
          <p className='text-sm text-muted-foreground'>
            Showing{" "}
            {Math.min(
              (pagination.page - 1) * pagination.limit + 1,
              pagination.total,
            )}
            –{Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} rooms
          </p>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className='w-4 h-4' />
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === pagination.totalPages ||
                  Math.abs(p - page) <= 1,
              )
              .map((p, idx, arr) => (
                <span key={p} className='flex items-center gap-1'>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className='text-muted-foreground px-1'>…</span>
                  )}
                  <button
                    onClick={() => goToPage(p)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-sm font-medium transition",
                      p === page
                        ? "bg-[#C9973A] text-white"
                        : "text-gray-600 hover:bg-gray-100",
                    )}
                  >
                    {p}
                  </button>
                </span>
              ))}
            <Button
              variant='outline'
              size='sm'
              onClick={() => goToPage(page + 1)}
              disabled={page >= pagination.totalPages}
            >
              <ChevronRight className='w-4 h-4' />
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <RoomEditModal 
        room={editingRoom}
        isOpen={!!editingRoom}
        onClose={() => setEditingRoom(null)}
        onSuccess={handleRefresh}
        initialTab={editTab}
        roomTypes={roomTypes}
      />

      <RoomCreateModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setPage(1);
          handleRefresh();
        }}
        roomTypes={roomTypes}
      />

      {/* Room Types Management Modal */}
      <Dialog open={showRoomTypesModal} onOpenChange={setShowRoomTypesModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Room Types</DialogTitle>
          </DialogHeader>
          <RoomTypesDialog
            onClose={() => setShowRoomTypesModal(false)}
            onUpdate={() => fetchRoomTypes()}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
