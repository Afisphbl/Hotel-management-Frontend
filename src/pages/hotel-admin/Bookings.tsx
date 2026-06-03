import { useEffect, useState, useMemo, useCallback } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  BookingsHeader, BookingsSearchFilter, BookingsBulkActionBar, BookingsTable,
  BookingsDetailModal, BookingsCreateModal, BookingsEditModal,
} from '@/components/hotel-admin/bookings';
import { guestDisplayName, guestEmail, roomDisplay, Booking } from '@/components/hotel-admin/bookings/types';

export function AdminBookings() {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedSource, setSelectedSource] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState("");
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const PAGE_SIZE = 15;

  useEffect(() => { setPage(1); }, [selectedStatus, selectedSource, dateFrom, dateTo]);

  useEffect(() => { fetchBookings(); }, [selectedStatus, selectedSource, page]);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== "ALL") params.append("status", selectedStatus);
      params.append("page", String(page));
      params.append("limit", String(PAGE_SIZE));
      const res = await api.get(`hotel/bookings?${params.toString()}`);
      const items: Booking[] = res.data || res.items || [];
      setBookings(items);
      if (res.meta) {
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      }
    } catch (err: any) {
      toast.error("Failed to load bookings: " + err.message);
    } finally { setIsLoading(false); }
  }, [selectedStatus, page]);

  const handleAction = async (id: string, action: string) => {
    try {
      const body = action === "confirm" ? { idempotencyKey: `confirm-${id}-${Date.now()}` } : {};
      await api.post(`hotel/bookings/${id}/${action}`, body);
      toast.success(`Booking ${action} successful`);
      fetchBookings();
    } catch (err: any) { toast.error(`Failed to ${action}: ${err.message}`); }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.size === 0) return;
    try {
      setBulkProcessing(true);
      const results = await Promise.allSettled(
        Array.from(selectedIds).map((id) => {
          const body = bulkAction === "confirm" ? { idempotencyKey: `bulk-confirm-${id}-${Date.now()}` } : {};
          return api.post(`hotel/bookings/${id}/${bulkAction}`, body);
        }),
      );
      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;
      if (succeeded > 0) toast.success(`${succeeded} bookings ${bulkAction} successful`);
      if (failed > 0) toast.error(`${failed} bookings failed`);
      setSelectedIds(new Set());
      setBulkAction("");
      fetchBookings();
    } catch (err: any) { toast.error(`Bulk action failed: ${err.message}`); } finally { setBulkProcessing(false); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((b) => b.id)));
  };

  const filtered = useMemo(() => {
    let f = bookings;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      f = f.filter((b) =>
        guestDisplayName(b).toLowerCase().includes(q) ||
        b.id?.toLowerCase().includes(q) ||
        roomDisplay(b).toLowerCase().includes(q) ||
        guestEmail(b).toLowerCase().includes(q) ||
        b.guest?.firstName?.toLowerCase().includes(q) ||
        b.guest?.lastName?.toLowerCase().includes(q),
      );
    }
    if (selectedSource !== "ALL") f = f.filter((b) => b.source === selectedSource);
    if (dateFrom) f = f.filter((b) => new Date(b.checkIn) >= new Date(dateFrom));
    if (dateTo) f = f.filter((b) => new Date(b.checkOut) <= new Date(dateTo + "T23:59:59"));
    return f;
  }, [bookings, searchTerm, selectedSource, dateFrom, dateTo]);

  const allSelected = filtered.length > 0 && selectedIds.size === filtered.length;

  return (
    <div className="space-y-8 pb-10">
      <BookingsHeader onNewBooking={() => setShowCreate(true)} />
      <BookingsSearchFilter
        searchTerm={searchTerm} onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus} onStatusChange={setSelectedStatus}
        selectedSource={selectedSource} onSourceChange={setSelectedSource}
        dateFrom={dateFrom} onDateFromChange={setDateFrom}
        dateTo={dateTo} onDateToChange={setDateTo}
        onClearFilters={() => { setDateFrom(""); setDateTo(""); setSelectedSource("ALL"); }}
      />
      <BookingsBulkActionBar
        selectedCount={selectedIds.size}
        bulkAction={bulkAction} onBulkActionChange={setBulkAction}
        onApply={handleBulkAction} onDeselectAll={() => setSelectedIds(new Set())}
        bulkProcessing={bulkProcessing}
      />
      <BookingsTable
        bookings={bookings}
        filtered={filtered} isLoading={isLoading}
        page={page} total={total} totalPages={totalPages}
        selectedIds={selectedIds} allSelected={allSelected}
        onToggleSelect={toggleSelect} onToggleSelectAll={toggleSelectAll}
        onPageChange={setPage}
        onView={(b) => setSelectedBooking(b)}
        onEdit={(b) => setEditingBooking(b)}
        onAction={handleAction}
        PAGE_SIZE={PAGE_SIZE}
      />
      {selectedBooking && (
        <BookingsDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onAction={(action) => { handleAction(selectedBooking.id, action); setSelectedBooking(null); }}
        />
      )}
      {editingBooking && (
        <BookingsEditModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSaved={() => { setEditingBooking(null); fetchBookings(); }}
        />
      )}
      {showCreate && (
        <BookingsCreateModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); fetchBookings(); }}
        />
      )}
    </div>
  );
}
