import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Bed, 
  Plus,
  Search,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Lock,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function RoomsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchRooms();
  }, [selectedStatus]);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      
      const response = await fetch(`/api/hotel/rooms?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setRooms(data.data || []);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statuses = [
    { value: 'ALL', label: 'All Rooms' },
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'OCCUPIED', label: 'Occupied' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'BLOCKED', label: 'Blocked' }
  ];

  const availableCount = rooms.filter(r => r.status === 'AVAILABLE').length;
  const occupiedCount = rooms.filter(r => r.status === 'OCCUPIED').length;
  const maintenanceCount = rooms.filter(r => r.status === 'MAINTENANCE').length;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Rooms</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your room inventory and availability</p>
        </div>
        <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <Plus className="w-4 h-4 mr-2" /> Add Room
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Total Rooms</p>
                <h3 className="text-2xl font-bold text-[#0F1B2D] mt-1">{rooms.length}</h3>
              </div>
              <Bed className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Available</p>
                <h3 className="text-2xl font-bold text-green-600 mt-1">{availableCount}</h3>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Occupied</p>
                <h3 className="text-2xl font-bold text-blue-600 mt-1">{occupiedCount}</h3>
              </div>
              <Lock className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Maintenance</p>
                <h3 className="text-2xl font-bold text-orange-600 mt-1">{maintenanceCount}</h3>
              </div>
              <Wrench className="w-12 h-12 text-orange-600 opacity-20" />
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
                  placeholder="Search by room number or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {statuses.map(status => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition",
                    selectedStatus === status.value
                      ? "bg-[#C9973A] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)
        ) : filteredRooms.length > 0 ? (
          filteredRooms.map(room => (
            <Card key={room.id} className="shadow-sm border-none bg-white hover:shadow-md transition">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#0F1B2D]">Room {room.number}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{room.type}</p>
                  </div>
                  <RoomStatusBadge status={room.status} />
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Floor:</span>
                    <span className="font-medium">{room.floor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity:</span>
                    <span className="font-medium">{room.capacity} guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate:</span>
                    <span className="font-medium text-[#C9973A]">${room.dailyRate}/night</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full text-xs">
                  <MoreHorizontal className="w-3 h-3 mr-2" /> Manage
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">No rooms found</div>
        )}
      </div>
    </div>
  );
}

function RoomStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string }> = {
    'AVAILABLE': { bg: 'bg-green-100', text: 'text-green-800' },
    'OCCUPIED': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'MAINTENANCE': { bg: 'bg-orange-100', text: 'text-orange-800' },
    'BLOCKED': { bg: 'bg-red-100', text: 'text-red-800' }
  };

  const config = statusConfig[status] || statusConfig['AVAILABLE'];

  return (
    <span className={cn('px-3 py-1 rounded-full text-xs font-medium', config.bg, config.text)}>
      {status}
    </span>
  );
}
