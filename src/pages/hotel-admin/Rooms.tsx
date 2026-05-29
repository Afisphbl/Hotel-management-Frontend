import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Bed,
  Search,
  CheckCircle,
  Lock,
  Wrench,
  AlertTriangle,
  X,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-[#0F1B2D]">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

type RoomStatus = "available" | "occupied" | "dirty" | "maintenance" | "out_of_order";

interface Room {
  id: string;
  roomNumber: string;
  floor: string;
  status: RoomStatus;
  basePrice?: number | null;
  baseCapacity?: number | null;
  roomTypeId?: string | null;
  effectivePrice?: number | null;
  roomType?: {
    id: string;
    name: string;
    baseCapacity: number;
    basePrice: number;
  };
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STATUS_OPTIONS: { value: RoomStatus; label: string; color: string }[] = [
  { value: "available", label: "Available", color: "bg-green-500" },
  { value: "occupied", label: "Occupied", color: "bg-blue-500" },
  { value: "dirty", label: "Dirty", color: "bg-yellow-500" },
  { value: "maintenance", label: "Maintenance", color: "bg-orange-500" },
  { value: "out_of_order", label: "Out of Order", color: "bg-red-500" },
];

export function AdminRooms() {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0, page: 1, limit: 12, totalPages: 1,
  });
  const [sortBy, setSortBy] = useState("roomNumber");
  const [summary, setSummary] = useState<Record<string, any>>({});
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editTab, setEditTab] = useState<"status" | "details">("status");
  const [newStatus, setNewStatus] = useState<RoomStatus>("available");
  const [updating, setUpdating] = useState(false);
  const [editRoomNumber, setEditRoomNumber] = useState("");
  const [editFloor, setEditFloor] = useState("");
  const [editBasePrice, setEditBasePrice] = useState("");
  const [editBaseCapacity, setEditBaseCapacity] = useState("");
  const [editRoomTypeId, setEditRoomTypeId] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newRoomFloor, setNewRoomFloor] = useState("");
  const [newRoomPrice, setNewRoomPrice] = useState("");
  const [newRoomCapacity, setNewRoomCapacity] = useState("");
  const [newRoomTypeId, setNewRoomTypeId] = useState("");
  const [creating, setCreating] = useState(false);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);

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
    } catch { }
  };

  const fetchSummary = async () => {
    try {
      const res = await api.get("hotel/rooms/summary");
      if (res?.data) setSummary(res.data);
      else if (res?.total != null) setSummary(res);
    } catch { }
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
      if (response.meta) setPagination(response.meta);
      setRooms(items);
    } catch (err: any) {
      setError(err.message || "Failed to load rooms");
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (room: Room, tab: "status" | "details") => {
    setEditingRoom(room);
    setEditTab(tab);
    if (tab === "status") {
      setNewStatus(room.status);
    } else {
      setEditRoomNumber(room.roomNumber);
      setEditFloor(room.floor);
      setEditBasePrice(room.basePrice ? String(room.basePrice) : "");
      setEditBaseCapacity(room.baseCapacity ? String(room.baseCapacity) : "");
      setEditRoomTypeId(room.roomTypeId || "");
    }
  };

  const handleStatusUpdate = async () => {
    if (!editingRoom) return;
    try {
      setUpdating(true);
      await api.patch(`hotel/rooms/${editingRoom.id}/status`, { status: newStatus });
      setRooms((prev) => prev.map((r) => r.id === editingRoom.id ? { ...r, status: newStatus } : r));
      setEditingRoom(null);
      fetchSummary();
      toast.success("Room status updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update room status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDetailsSave = async () => {
    if (!editingRoom) return;
    try {
      setSaving(true);
      const payload: any = { roomNumber: editRoomNumber, floor: editFloor, roomTypeId: editRoomTypeId || null };
      if (editBasePrice) payload.basePrice = parseFloat(editBasePrice);
      if (editBaseCapacity) payload.baseCapacity = parseInt(editBaseCapacity, 10);
      await api.patch(`hotel/rooms/${editingRoom.id}`, payload);
      setPage(1);
      await fetchRooms();
      setEditingRoom(null);
      fetchSummary();
      toast.success("Room details saved");
    } catch (err: any) {
      toast.error(err.message || "Failed to update room details");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomNumber.trim()) return;
    try {
      setCreating(true);
      const payload: any = { roomNumber: newRoomNumber.trim(), floor: newRoomFloor.trim() || "Ground", roomTypeId: newRoomTypeId || null };
      if (newRoomPrice) payload.basePrice = parseFloat(newRoomPrice);
      if (newRoomCapacity) payload.baseCapacity = parseInt(newRoomCapacity, 10);
      await api.post("hotel/rooms", payload);
      setShowCreateModal(false);
      setNewRoomNumber("");
      setNewRoomFloor("");
      setNewRoomPrice("");
      setNewRoomCapacity("");
      setNewRoomTypeId("");
      setPage(1);
      await Promise.all([fetchRooms(), fetchSummary()]);
      toast.success(`Room ${newRoomNumber.trim()} created`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.roomType?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.floor?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case "roomNumber": return a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true });
      case "basePrice": return (a.basePrice ?? Infinity) - (b.basePrice ?? Infinity);
      case "baseCapacity": return (a.baseCapacity ?? 0) - (b.baseCapacity ?? 0);
      case "floor": return a.floor.localeCompare(b.floor, undefined, { numeric: true });
      case "status": return a.status.localeCompare(b.status);
      default: return 0;
    }
  });

  return (
    <div className='space-y-8 pb-10'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-serif text-[#0F1B2D]'>Rooms</h1>
          <p className='text-sm sm:text-base text-muted-foreground'>Manage room inventory, status, and pricing</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className='bg-[#0F1B2D] hover:bg-[#1a2a3a]'>
          + Add Room
        </Button>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
        {[{ label: 'Total', key: 'total', icon: Bed, color: 'text-blue-600' },
          { label: 'Available', key: 'available', icon: CheckCircle, color: 'text-green-600' },
          { label: 'Occupied', key: 'occupied', icon: Lock, color: 'text-blue-600' },
          { label: 'Dirty', key: 'dirty', icon: AlertTriangle, color: 'text-yellow-600' },
          { label: 'Maintenance', key: 'maintenance', icon: Wrench, color: 'text-orange-600' },
          { label: 'Out of Order', key: 'out_of_order', icon: X, color: 'text-red-600' },
        ].map(s => (
          <Card key={s.key} className='shadow-sm border-none bg-white'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs font-medium text-muted-foreground uppercase'>{s.label}</p>
                  <h3 className={`text-2xl font-bold ${s.color} mt-1`}>{summary[s.key] ?? 0}</h3>
                </div>
                <s.icon className={`w-10 h-10 ${s.color} opacity-20`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className='shadow-sm border-none bg-white'>
        <CardContent className='p-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                <Input placeholder='Search rooms...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='pl-10' />
              </div>
            </div>
            <div className='flex gap-2'>
              <Select value={selectedStatus} onValueChange={(v) => { setSelectedStatus(v || "ALL"); setPage(1); }}>
                <SelectTrigger className='w-[160px] bg-white'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='ALL'>All Rooms</SelectItem>
                  {STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v || "roomNumber")}>
                <SelectTrigger className='w-[160px] bg-white'>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='roomNumber'>Room Number</SelectItem>
                  <SelectItem value='basePrice'>Price</SelectItem>
                  <SelectItem value='baseCapacity'>Capacity</SelectItem>
                  <SelectItem value='floor'>Floor</SelectItem>
                  <SelectItem value='status'>Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className='flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm'>
          <AlertTriangle className='w-4 h-4 shrink-0' />
          <span>{error}</span>
          <button onClick={fetchRooms} className='ml-auto underline'>Retry</button>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {isLoading ? Array(6).fill(0).map((_, i) => <Skeleton key={i} className='h-56 w-full' />)
          : filteredRooms.length > 0 ? filteredRooms.map((room) => (
            <Card key={room.id} className='shadow-sm border-none bg-white hover:shadow-md transition'>
              <CardContent className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div>
                    <h3 className='text-xl font-bold text-[#0F1B2D]'>Room {room.roomNumber}</h3>
                    <p className='text-sm text-muted-foreground'>{room.roomType?.name ?? "Standard"} · Floor {room.floor}</p>
                  </div>
                  <RoomStatusBadge status={room.status} />
                </div>
                <div className='space-y-2 mb-4 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Capacity:</span>
                    <span className='font-medium'>{room.baseCapacity ?? room.roomType?.baseCapacity ?? "—"} guests</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Rate:</span>
                    <span className='font-medium'>
                      {room.effectivePrice != null ? formatCurrency(Number(room.effectivePrice))
                        : room.basePrice != null ? formatCurrency(Number(room.basePrice))
                          : room.roomType?.basePrice != null ? formatCurrency(Number(room.roomType.basePrice))
                            : "—"}
                      <span className="text-xs font-normal text-muted-foreground ml-1">/night</span>
                    </span>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <Button variant='outline' className='flex-1 text-xs border-[#0F1B2D]/20 hover:bg-[#0F1B2D] hover:text-white transition'
                    onClick={() => openEditModal(room, "status")}>Status</Button>
                  <Button variant='outline' className='flex-1 text-xs border-[#0F1B2D]/20 hover:bg-[#0F1B2D] hover:text-white transition'
                    onClick={() => openEditModal(room, "details")}><Settings className='w-3 h-3 mr-1' /> Edit</Button>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className='col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground gap-2'>
              <Bed className='w-10 h-10 opacity-30' />
              <p className='text-sm'>No rooms found</p>
            </div>
          )}
      </div>

      {!isLoading && pagination.totalPages > 1 && (
        <div className='flex items-center justify-between pt-4'>
          <p className='text-sm text-muted-foreground'>
            Showing {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} rooms
          </p>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
              <ChevronLeft className='w-4 h-4' />
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1).map((p, idx, arr) => (
              <span key={p} className='flex items-center gap-1'>
                {idx > 0 && arr[idx - 1] !== p - 1 && <span className='text-muted-foreground px-1'>…</span>}
                <button onClick={() => setPage(p)} className={cn("w-8 h-8 rounded-lg text-sm font-medium transition", p === page ? "bg-[#C9973A] text-white" : "text-gray-600 hover:bg-gray-100")}>{p}</button>
              </span>
            ))}
            <Button variant='outline' size='sm' onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages}>
              <ChevronRight className='w-4 h-4' />
            </Button>
          </div>
        </div>
      )}

      {editingRoom && (
        <Modal title={`Room ${editingRoom.roomNumber}`} onClose={() => setEditingRoom(null)}>
          <div className='space-y-5'>
            <div className='flex gap-1 bg-gray-100 rounded-lg p-1'>
              <button onClick={() => setEditTab("status")}
                className={cn("flex-1 px-3 py-2 rounded-md text-sm font-medium transition", editTab === "status" ? "bg-white shadow-sm text-[#0F1B2D]" : "text-gray-500 hover:text-gray-700")}>Status</button>
              <button onClick={() => setEditTab("details")}
                className={cn("flex-1 px-3 py-2 rounded-md text-sm font-medium transition", editTab === "details" ? "bg-white shadow-sm text-[#0F1B2D]" : "text-gray-500 hover:text-gray-700")}>Details</button>
            </div>
            {editTab === "status" && (
              <>
                <p className='text-sm text-muted-foreground'>Current status: <span className='font-medium capitalize text-[#0F1B2D]'>{editingRoom.status.replace("_", " ")}</span></p>
                <div className='space-y-2'>
                  {STATUS_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => setNewStatus(opt.value)}
                      className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition",
                        newStatus === opt.value ? "border-[#C9973A] bg-[#C9973A]/5 text-[#0F1B2D]" : "border-gray-200 text-gray-600 hover:border-gray-300")}>
                      <span className={cn("w-3 h-3 rounded-full shrink-0", opt.color)} />
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className='flex gap-3 pt-2'>
                  <Button variant='outline' className='flex-1' onClick={() => setEditingRoom(null)} disabled={updating}>Cancel</Button>
                  <Button className='flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]' onClick={handleStatusUpdate} disabled={updating || newStatus === editingRoom.status}>
                    {updating ? "Saving…" : "Save"}
                  </Button>
                </div>
              </>
            )}
            {editTab === "details" && (
              <div className='space-y-4'>
                <div><label className='block text-sm font-medium text-gray-700 mb-1'>Room Number</label>
                  <Input value={editRoomNumber} onChange={(e) => setEditRoomNumber(e.target.value)} /></div>
                <div><label className='block text-sm font-medium text-gray-700 mb-1'>Floor</label>
                  <Input value={editFloor} onChange={(e) => setEditFloor(e.target.value)} /></div>
                <div><label className='block text-sm font-medium text-gray-700 mb-1'>Room Type</label>
                  <select value={editRoomTypeId} onChange={(e) => { setEditRoomTypeId(e.target.value); const rt = roomTypes.find(t => t.id === e.target.value); if (rt) { if (!editBasePrice) setEditBasePrice(String(rt.basePrice)); if (!editBaseCapacity) setEditBaseCapacity(String(rt.baseCapacity)); } }}
                    className='w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]'>
                    <option value=''>Standard / Generic</option>
                    {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                  </select></div>
                <div><label className='block text-sm font-medium text-gray-700 mb-1'>Base Price (ETB/night)</label>
                  <Input type='number' min='0' step='0.01' value={editBasePrice} onChange={(e) => setEditBasePrice(e.target.value)} /></div>
                <div><label className='block text-sm font-medium text-gray-700 mb-1'>Capacity (guests)</label>
                  <Input type='number' min='1' step='1' value={editBaseCapacity} onChange={(e) => setEditBaseCapacity(e.target.value)} /></div>
                <div className='flex gap-3 pt-2'>
                  <Button variant='outline' className='flex-1' onClick={() => setEditingRoom(null)} disabled={saving}>Cancel</Button>
                  <Button className='flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]' onClick={handleDetailsSave} disabled={saving}>
                    {saving ? "Saving…" : "Save"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {showCreateModal && (
        <Modal title="Add Room" onClose={() => setShowCreateModal(false)}>
          <div className='space-y-4'>
            <div><label className='block text-sm font-medium text-gray-700 mb-1'>Room Number *</label>
              <Input value={newRoomNumber} onChange={(e) => setNewRoomNumber(e.target.value)} placeholder='e.g. 101' /></div>
            <div><label className='block text-sm font-medium text-gray-700 mb-1'>Floor</label>
              <Input value={newRoomFloor} onChange={(e) => setNewRoomFloor(e.target.value)} placeholder='e.g. First' /></div>
            <div><label className='block text-sm font-medium text-gray-700 mb-1'>Room Type</label>
              <select value={newRoomTypeId} onChange={(e) => { setNewRoomTypeId(e.target.value); const rt = roomTypes.find(t => t.id === e.target.value); if (rt) { if (!newRoomPrice) setNewRoomPrice(String(rt.basePrice)); if (!newRoomCapacity) setNewRoomCapacity(String(rt.baseCapacity)); } }}
                className='w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]'>
                <option value=''>Standard / Generic</option>
                {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
              </select></div>
            <div><label className='block text-sm font-medium text-gray-700 mb-1'>Base Price (ETB/night)</label>
              <Input type='number' min='0' step='0.01' value={newRoomPrice} onChange={(e) => setNewRoomPrice(e.target.value)} /></div>
            <div><label className='block text-sm font-medium text-gray-700 mb-1'>Capacity (guests)</label>
              <Input type='number' min='1' step='1' value={newRoomCapacity} onChange={(e) => setNewRoomCapacity(e.target.value)} /></div>
            <div className='flex gap-3 pt-2'>
              <Button variant='outline' className='flex-1' onClick={() => setShowCreateModal(false)} disabled={creating}>Cancel</Button>
              <Button className='flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]' onClick={handleCreateRoom} disabled={creating || !newRoomNumber.trim()}>
                {creating ? "Creating…" : "Add Room"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function RoomStatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; text: string; label: string }> = {
    available: { bg: "bg-green-100", text: "text-green-800", label: "Available" },
    occupied: { bg: "bg-blue-100", text: "text-blue-800", label: "Occupied" },
    dirty: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Dirty" },
    maintenance: { bg: "bg-orange-100", text: "text-orange-800", label: "Maintenance" },
    out_of_order: { bg: "bg-red-100", text: "text-red-800", label: "Out of Order" },
  };
  const c = cfg[status] ?? cfg["available"];
  return <span className={cn("px-3 py-1 rounded-full text-xs font-medium", c.bg, c.text)}>{c.label}</span>;
}
