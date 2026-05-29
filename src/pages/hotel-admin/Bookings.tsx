import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Calendar, Search, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, Eye, User, DollarSign,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CHECKED_IN: 'bg-blue-100 text-blue-800',
  CHECKED_OUT: 'bg-slate-100 text-slate-700',
  CANCELLED: 'bg-red-100 text-red-800',
};

export function AdminBookings() {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const PAGE_SIZE = 15;

  useEffect(() => { setPage(1); }, [selectedStatus]);

  useEffect(() => {
    fetchBookings();
  }, [selectedStatus, page]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      params.append('page', String(page));
      params.append('limit', String(PAGE_SIZE));
      const res = await api.get(`hotel/bookings?${params.toString()}`);
      setBookings(res.data || res.items || []);
      if (res.meta) {
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      }
    } catch (err: any) {
      toast.error('Failed to load bookings: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id: string, action: string) => {
    try {
      await api.post(`hotel/bookings/${id}/${action}`);
      toast.success(`Booking ${action} successful`);
      fetchBookings();
    } catch (err: any) {
      toast.error(`Failed to ${action}: ${err.message}`);
    }
  };

  const filtered = bookings.filter(b =>
    b.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Bookings</h1>
        <p className="text-sm text-muted-foreground">Manage reservations, check-ins, and check-outs</p>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by guest name, booking ID, or room..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {['ALL', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'].map(s => (
                <button key={s} onClick={() => setSelectedStatus(s)}
                  className={cn("px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition",
                    selectedStatus === s ? "bg-[#C9973A] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}>
                  {s === 'ALL' ? 'All' : s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader><CardTitle className="text-lg">All Reservations</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Nights</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(b => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#0F1B2D] text-[#C9973A] flex items-center justify-center text-xs font-bold">
                            {b.guestName?.[0] || 'G'}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{b.guestName || 'N/A'}</p>
                            <p className="text-xs text-muted-foreground">{b.id?.slice(0, 8)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>Room {b.roomNumber || '—'}</TableCell>
                      <TableCell className="text-sm">
                        <div>{b.checkIn ? formatDate(b.checkIn) : '—'}</div>
                        <div className="text-muted-foreground">{b.checkOut ? formatDate(b.checkOut) : '—'}</div>
                      </TableCell>
                      <TableCell>{b.nights ?? '—'}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(b.totalPrice ?? 0)}</TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', STATUS_STYLES[b.status] || 'bg-gray-100 text-gray-700')}>
                          {b.status?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {b.status === 'PENDING' && (
                            <Button variant="ghost" size="sm" onClick={() => handleAction(b.id, 'confirm')} title="Confirm">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </Button>
                          )}
                          {(b.status === 'CONFIRMED' || b.status === 'PENDING') && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleAction(b.id, 'checkin')} title="Check In">
                                <User className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleAction(b.id, 'cancel')} title="Cancel">
                                <XCircle className="w-4 h-4 text-red-600" />
                              </Button>
                            </>
                          )}
                          {b.status === 'CHECKED_IN' && (
                            <Button variant="ghost" size="sm" onClick={() => handleAction(b.id, 'checkout')} title="Check Out">
                              <Clock className="w-4 h-4 text-orange-600" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(b)} title="View Details">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="h-32 text-center text-muted-foreground">No bookings found</TableCell></TableRow>
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

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-[#0F1B2D]">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Booking ID</span><p className="font-medium">{selectedBooking.id}</p></div>
                <div><span className="text-muted-foreground">Status</span>
                  <Badge className={cn('text-xs', STATUS_STYLES[selectedBooking.status])}>{selectedBooking.status?.replace('_', ' ')}</Badge>
                </div>
                <div><span className="text-muted-foreground">Guest</span><p className="font-medium">{selectedBooking.guestName || 'N/A'}</p></div>
                <div><span className="text-muted-foreground">Room</span><p className="font-medium">Room {selectedBooking.roomNumber || '—'}</p></div>
                <div><span className="text-muted-foreground">Check In</span><p className="font-medium">{selectedBooking.checkIn ? formatDate(selectedBooking.checkIn) : '—'}</p></div>
                <div><span className="text-muted-foreground">Check Out</span><p className="font-medium">{selectedBooking.checkOut ? formatDate(selectedBooking.checkOut) : '—'}</p></div>
                <div><span className="text-muted-foreground">Nights</span><p className="font-medium">{selectedBooking.nights ?? '—'}</p></div>
                <div><span className="text-muted-foreground">Total</span><p className="font-medium">{formatCurrency(selectedBooking.totalPrice ?? 0)}</p></div>
                <div className="col-span-2"><span className="text-muted-foreground">Created</span><p className="font-medium">{selectedBooking.createdAt ? formatDate(selectedBooking.createdAt) : '—'}</p></div>
              </div>
              {selectedBooking.notes && (
                <div><span className="text-sm text-muted-foreground">Notes</span><p className="text-sm mt-1">{selectedBooking.notes}</p></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
