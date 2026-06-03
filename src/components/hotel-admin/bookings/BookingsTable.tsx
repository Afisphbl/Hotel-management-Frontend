import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Mail, Phone, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, Pencil, CheckCircle, User, Clock, XCircle } from 'lucide-react';
import { cn, formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { STATUS_STYLES, guestDisplayName, guestInitial, roomDisplay, roomTypeDisplay, guestEmail, guestPhone, sourceLabel, nights, Booking } from './types';

interface BookingsTableProps {
  bookings: Booking[];
  filtered: Booking[];
  isLoading: boolean;
  page: number;
  total: number;
  totalPages: number;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  allSelected: boolean;
  onPageChange: (page: number) => void;
  onView: (booking: Booking) => void;
  onEdit: (booking: Booking) => void;
  onAction: (id: string, action: string) => void;
  PAGE_SIZE: number;
}

export function BookingsTable({
  bookings, filtered, isLoading, page, total, totalPages,
  selectedIds, onToggleSelect, onToggleSelectAll, allSelected,
  onPageChange, onView, onEdit, onAction, PAGE_SIZE,
}: BookingsTableProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">All Reservations</CardTitle>
        <span className="text-xs text-muted-foreground">{total} total</span>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox checked={allSelected} onCheckedChange={onToggleSelectAll} />
                    </TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="hidden sm:table-cell">Nights</TableHead>
                    <TableHead className="hidden lg:table-cell">Contact</TableHead>
                    <TableHead className="hidden sm:table-cell">Source</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((b) => (
                    <TableRow key={b.id} className={cn(selectedIds.has(b.id) && "bg-[#C9973A]/5")}>
                      <TableCell>
                        <Checkbox checked={selectedIds.has(b.id)} onCheckedChange={() => onToggleSelect(b.id)} />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#0F1B2D] text-[#C9973A] flex items-center justify-center text-xs font-bold shrink-0">
                            {guestInitial(b)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate max-w-[140px]">{guestDisplayName(b)}</p>
                            <p className="text-xs text-muted-foreground font-mono">{b.id?.slice(0, 8)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{roomDisplay(b)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{roomTypeDisplay(b)}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{formatDate(b.checkIn)} – {formatDate(b.checkOut)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm font-medium">{b.nights ?? nights(b.checkIn, b.checkOut)}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="space-y-0.5">
                          {b.guest?.email && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="w-3 h-3" /> {b.guest.email}
                            </span>
                          )}
                          {b.guest?.phone && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="w-3 h-3" /> {b.guest.phone}
                            </span>
                          )}
                          {!b.guest?.email && !b.guest?.phone && (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground">{sourceLabel(b.source)}</span>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(b.totalPrice ?? 0)}</TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs whitespace-nowrap", STATUS_STYLES[b.status] || "bg-gray-100 text-gray-700")}>
                          {(b.status || "").replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 p-0 hover:bg-transparent">
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView(b)}>
                              <Eye className="w-3.5 h-3.5 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(b)}>
                              <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAction(b.id, "confirm")}>
                              <CheckCircle className="w-3.5 h-3.5 mr-2 text-green-600" /> Confirm
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAction(b.id, "checkin")}>
                              <User className="w-3.5 h-3.5 mr-2 text-blue-600" /> Check In
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAction(b.id, "checkout")}>
                              <Clock className="w-3.5 h-3.5 mr-2 text-orange-600" /> Check Out
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAction(b.id, "noshow")}>
                              <XCircle className="w-3.5 h-3.5 mr-2 text-gray-600" /> No Show
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAction(b.id, "cancel")}>
                              <XCircle className="w-3.5 h-3.5 mr-2 text-red-600" /> Cancel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={11} className="h-32 text-center text-muted-foreground">No bookings found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t flex-wrap gap-2">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, total)} of {total}
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .map((p, idx, arr) => (
                      <span key={p} className="flex items-center gap-1">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="text-muted-foreground px-1">…</span>
                        )}
                        <Button variant={p === page ? "default" : "outline"} size="sm"
                          className={p === page ? "bg-[#0F1B2D]" : ""} onClick={() => onPageChange(p)}>
                          {p}
                        </Button>
                      </span>
                    ))}
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
