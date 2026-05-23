import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bed,
  Search,
  CheckCircle,
  Lock,
  Wrench,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

type RoomStatus = 'available' | 'occupied' | 'dirty' | 'maintenance' | 'out_of_order';

interface Room {
  id: string;
  roomNumber: string;
  floor: string;
  status: RoomStatus;
  roomType?: {
    name: string;
    baseCapacity: number;
    basePrice: number;
  };
}

const STATUS_OPTIONS: { value: RoomStatus; label: string; color: string }[] = [
  { value: 'available', label: 'Available', color: 'bg-green-500' },
  { value: 'occupied', label: 'Occupied', color: 'bg-blue-500' },
  { value: 'dirty', label: 'Dirty', color: 'bg-yellow-500' },
  { value: 'maintenance', label: 'Maintenance', color: 'bg-orange-500' },
  { value: 'out_of_order', label: 'Out of Order', color: 'bg-red-500' },
];

export function RoomsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [error, setError] = useState<string | null>(null);

  // Status update modal state
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [newStatus, setNewStatus] = useState<RoomStatus>('available');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [selectedStatus]);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      params.append('limit', '200');

      const response = await api.get(`hotel/rooms?${params.toString()}`);
      // Support both paginated { data: [...] } and direct array responses
      const items: Room[] = response.data ?? response.items ?? response ?? [];
      setRooms(items);
    } catch (err: any) {
      console.error('Failed to fetch rooms:', err);
      setError(err.message || 'Failed to load rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!editingRoom) return;
    try {
      setUpdating(true);
      await api.patch(`hotel/rooms/${editingRoom.id}/status`, { status: newStatus });
      // Optimistically update local state
      setRooms((prev) =>
        prev.map((r) => (r.id === editingRoom.id ? { ...r, status: newStatus } : r))
      );
      setEditingRoom(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update room status');
    } finally {
      setUpdating(false);
    }
  };

  const openStatusModal = (room: Room) => {
    setEditingRoom(room);
    setNewStatus(room.status);
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomType?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.floor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const countByStatus = (s: string) => rooms.filter((r) => r.status === s).length;

  const statuses = [
    { value: 'ALL', label: 'All Rooms' },
    { value: 'available', label: 'Available' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'dirty', label: 'Dirty' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'out_of_order', label: 'Out of Order' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Rooms</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View your room inventory and update room status
          </p>
        </div>
        {/* Info note — rooms are created by the platform admin */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-blue-50 border border-blue-100 rounded-lg px-4 py-2">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Rooms are added by the platform admin. You can update room status here.</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Total Rooms</p>
                <h3 className="text-2xl font-bold text-[#0F1B2D] mt-1">{rooms.length}</h3>
              </div>
              <Bed className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Available</p>
                <h3 className="text-2xl font-bold text-green-600 mt-1">{countByStatus('available')}</h3>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Occupied</p>
                <h3 className="text-2xl font-bold text-blue-600 mt-1">{countByStatus('occupied')}</h3>
              </div>
              <Lock className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Maintenance</p>
                <h3 className="text-2xl font-bold text-orange-600 mt-1">{countByStatus('maintenance')}</h3>
              </div>
              <Wrench className="w-10 h-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by room number, type or floor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {statuses.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSelectedStatus(s.value)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition',
                    selectedStatus === s.value
                      ? 'bg-[#C9973A] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <button onClick={fetchRooms} className="ml-auto underline">Retry</button>
        </div>
      )}

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array(6)
            .fill(0)
            .map((_, i) => <Skeleton key={i} className="h-48 w-full" />)
        ) : filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <Card
              key={room.id}
              className="shadow-sm border-none bg-white hover:shadow-md transition"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#0F1B2D]">
                      Room {room.roomNumber}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {room.roomType?.name ?? 'Standard'} · Floor {room.floor}
                    </p>
                  </div>
                  <RoomStatusBadge status={room.status} />
                </div>

                <div className="space-y-2 mb-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity:</span>
                    <span className="font-medium">
                      {room.roomType?.baseCapacity ?? '—'} guests
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Rate:</span>
                    <span className="font-medium text-[#C9973A]">
                      {room.roomType?.basePrice != null
                        ? `$${Number(room.roomType.basePrice).toFixed(2)}/night`
                        : '—'}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full text-xs border-[#0F1B2D]/20 hover:bg-[#0F1B2D] hover:text-white transition"
                  onClick={() => openStatusModal(room)}
                >
                  Update Status
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
            <Bed className="w-10 h-10 opacity-30" />
            <p className="text-sm">No rooms found</p>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0F1B2D]">
                Room {editingRoom.roomNumber} — Update Status
              </h2>
              <button
                onClick={() => setEditingRoom(null)}
                className="text-muted-foreground hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground">
              Current status:{' '}
              <span className="font-medium capitalize text-[#0F1B2D]">
                {editingRoom.status.replace('_', ' ')}
              </span>
            </p>

            <div className="space-y-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setNewStatus(opt.value)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition',
                    newStatus === opt.value
                      ? 'border-[#C9973A] bg-[#C9973A]/5 text-[#0F1B2D]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  )}
                >
                  <span className={cn('w-3 h-3 rounded-full shrink-0', opt.color)} />
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setEditingRoom(null)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#0F1B2D] hover:bg-[#1a2a3a]"
                onClick={handleStatusUpdate}
                disabled={updating || newStatus === editingRoom.status}
              >
                {updating ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RoomStatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; text: string; label: string }> = {
    available: { bg: 'bg-green-100', text: 'text-green-800', label: 'Available' },
    occupied: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Occupied' },
    dirty: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Dirty' },
    maintenance: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Maintenance' },
    out_of_order: { bg: 'bg-red-100', text: 'text-red-800', label: 'Out of Order' },
  };
  const c = cfg[status] ?? cfg['available'];
  return (
    <span className={cn('px-3 py-1 rounded-full text-xs font-medium', c.bg, c.text)}>
      {c.label}
    </span>
  );
}
