import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { GuestTable } from '@/components/hotel-admin/guests/GuestTable';
import { GuestFilters } from '@/components/hotel-admin/guests/GuestFilters';
import { GuestDetailsModal } from '@/components/hotel-admin/guests/GuestDetailsModal';
import { CreateGuestModal } from '@/components/hotel-admin/guests/CreateGuestModal';

export function AdminGuests() {
  const [isLoading, setIsLoading] = useState(true);
  const [guests, setGuests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'vip' | 'recent'>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ fullName: '', email: '', phone: '', nationality: '', idNumber: '', isVip: false });

  const PAGE_SIZE = 15;

  useEffect(() => {
    fetchGuests();
  }, [page, filter]);

  const fetchGuests = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filter === 'vip') params.append('isVip', 'true');
      if (filter === 'recent') params.append('recent', 'true');
      params.append('page', String(page));
      params.append('limit', String(PAGE_SIZE));
      const res = await api.get(`hotel/guests?${params.toString()}`);
      setGuests(res.data || res.items || []);
      if (res.meta) {
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      }
    } catch (err: any) {
      toast.error('Failed to load guests: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filter]);

  const handleCreate = async () => {
    if (!createForm.fullName) { toast.error('Name is required'); return; }
    
    // Auto-split name
    const parts = createForm.fullName.trim().split(/\s+/);
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ') || '';

    try {
      setCreating(true);
      await api.post('hotel/guests', {
        firstName,
        lastName,
        email: createForm.email,
        phone: createForm.phone,
        nationality: createForm.nationality,
        isVip: createForm.isVip,
        documentNumber: createForm.idNumber
      });
      toast.success('Guest created');
      setShowCreate(false);
      setCreateForm({ fullName: '', email: '', phone: '', nationality: '', idNumber: '', isVip: false });
      fetchGuests();
    } catch (err: any) {
      toast.error('Failed to create guest: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Guests</h1>
          <p className="text-sm text-muted-foreground">Manage guest profiles and information</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <Plus className="w-4 h-4 mr-2" /> Add Guest
        </Button>
      </div>

      <GuestFilters 
        searchTerm={searchTerm} 
        onSearchTermChange={setSearchTerm} 
        filter={filter} 
        onFilterChange={setFilter} 
        onSearch={fetchGuests}
      />

      <Card className="shadow-sm border-none bg-white">
        <GuestTable 
          guests={guests}
          isLoading={isLoading}
          onSelectGuest={setSelectedGuest}
          page={page}
          totalPages={totalPages}
          total={total}
          onPageChange={setPage}
          pageSize={PAGE_SIZE}
        />
      </Card>

      {selectedGuest && (
        <GuestDetailsModal guest={selectedGuest} onClose={() => setSelectedGuest(null)} />
      )}

      <CreateGuestModal 
        open={showCreate} 
        onClose={() => setShowCreate(false)} 
        onCreate={handleCreate} 
        form={createForm} 
        setForm={setCreateForm} 
        creating={creating} 
      />
    </div>
  );
}
