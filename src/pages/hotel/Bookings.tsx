
import React from 'react';
import { useHotelBookings } from '@/hooks/useHotelData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button, buttonVariants } from '@/components/ui/button';
import { Search, Filter, Plus, MoreVertical, FileText, CheckCircle2, XCircle, LogIn, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';
import { cn, formatDate } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export function HotelBookings() {
  const { data: bookings, isLoading } = useHotelBookings();
  const [filter, setFilter] = React.useState('all');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Bookings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage guest reservations and check-ins.</p>
        </div>
        <Button className="w-full sm:w-auto bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <Plus className="w-4 h-4 mr-2" /> New Booking
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={(v) => setFilter(v || 'all')}>
            <SelectTrigger className="w-full sm:w-[200px] bg-white border-none shadow-sm">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Filter bookings" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="today">Arrivals Today</SelectItem>
              <SelectItem value="in-house">In House</SelectItem>
              <SelectItem value="departing">Departing Today</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader className="border-b border-muted pb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search ref#, guest, room..." className="pl-9 bg-[#F8F7F4] border-none" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" /> Advance Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#F8F7F4]">
                <TableRow>
                  <TableHead>Ref#</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Stay Dates</TableHead>
                  <TableHead>Nights</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings?.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-[#F8F7F4]/50 transition-colors group">
                    <TableCell className="font-mono text-xs font-bold text-muted-foreground">
                      #{booking.id}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-[#0F1B2D]">{booking.guest}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold bg-[#0F1B2D]/5 px-1.5 py-0.5 rounded">{booking.room}</span>
                    </TableCell>
<TableCell className="text-xs whitespace-nowrap">
  {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
</TableCell>
                    <TableCell className="text-sm">{booking.nights}</TableCell>
                    <TableCell>
                      <MoneyDisplay amount={booking.total} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className={cn("h-8 w-8", buttonVariants({ variant: "ghost", size: "icon" }))}>
                          <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="gap-2">
                            <FileText className="w-4 h-4" /> View Folio
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-green-600">
                            <CheckCircle2 className="w-4 h-4" /> Confirm
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-green-600">
                            <LogIn className="w-4 h-4" /> Check In
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-blue-600">
                            <LogOut className="w-4 h-4" /> Check Out
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-gray-600">
                            <XCircle className="w-4 h-4" /> No Show
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-amber-600">
                            <XCircle className="w-4 h-4" /> Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
