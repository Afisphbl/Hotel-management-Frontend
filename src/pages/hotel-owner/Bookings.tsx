import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, 
  User, 
  DollarSign, 
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function BookingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchBookings();
  }, [selectedStatus]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      
      const response = await fetch(`/api/hotel/bookings?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setBookings(data.data || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statuses = [
    { value: 'ALL', label: 'All Bookings' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'CHECKED_IN', label: 'Checked In' },
    { value: 'CHECKED_OUT', label: 'Checked Out' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Bookings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage all your hotel bookings and reservations</p>
        </div>
        <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <Plus className="w-4 h-4 mr-2" /> New Booking
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by guest name or booking ID..."
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

      {/* Bookings List */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Booking ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Guest</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Dates</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Room</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(booking => (
                      <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-3 px-4 text-xs font-mono text-[#0F1B2D]">{booking.id.slice(0, 8)}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-[#0F1B2D]">{booking.guestName}</div>
                          <div className="text-xs text-muted-foreground">{booking.guestEmail}</div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div>{booking.checkIn}</div>
                          <div className="text-xs text-muted-foreground">→ {booking.checkOut}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-[#0F1B2D]">{booking.roomNumber}</td>
                        <td className="py-3 px-4 font-semibold text-[#0F1B2D]">${booking.totalAmount || '0'}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground">No bookings found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; icon: any }> = {
    'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
    'CONFIRMED': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    'CHECKED_IN': { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
    'CHECKED_OUT': { bg: 'bg-gray-100', text: 'text-gray-800', icon: CheckCircle },
    'CANCELLED': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
  };

  const config = statusConfig[status] || statusConfig['PENDING'];
  const Icon = config.icon;

  return (
    <div className={cn('flex items-center gap-1 px-2 py-1 rounded text-xs font-medium w-fit', config.bg, config.text)}>
      <Icon className="w-3 h-3" />
      {status}
    </div>
  );
}
