import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Pencil, X } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface RoomType {
  id: string;
  name: string;
  description?: string;
  baseCapacity: number;
  maxExtraBeds: number;
  basePrice: number;
}

export function RoomTypesDialog({ onClose, onUpdate }: { onClose: () => void; onUpdate: () => void }) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<RoomType> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const res = await api.get('hotel/room-types');
      setRoomTypes(res.data || res.items || res || []);
    } catch (err) {
      console.error('Failed to fetch room types:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const handleSave = async () => {
    if (!editing?.name || !editing?.baseCapacity || !editing?.basePrice) {
      toast.error('Please fill in Name, Capacity and Base Price');
      return;
    }

    setSaving(true);
    try {
      if (editing.id) {
        await api.patch(`hotel/room-types/${editing.id}`, editing);
        toast.success('Room type updated');
      } else {
        await api.post('hotel/room-types', editing);
        toast.success('Room type created');
      }
      setEditing(null);
      fetchRoomTypes();
      onUpdate();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save room type');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room type?')) return;
    try {
      await api.delete(`hotel/room-types/${id}`);
      toast.success('Room type deleted');
      fetchRoomTypes();
      onUpdate();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete room type');
    }
  };

  return (
    <div className="space-y-6">
      {!editing ? (
        <>
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[#0F1B2D]">Manage Room Types</h3>
            <Button size="sm" onClick={() => setEditing({ name: '', baseCapacity: 2, maxExtraBeds: 0, basePrice: 100 })}>
              <Plus className="w-4 h-4 mr-1" /> Add Type
            </Button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {loading ? (
              <p className="text-sm text-center py-4">Loading...</p>
            ) : roomTypes.length === 0 ? (
              <p className="text-sm text-center py-4 text-muted-foreground">No room types defined yet.</p>
            ) : (
              roomTypes.map(rt => (
                <div key={rt.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                  <div>
                    <p className="font-medium text-sm">{rt.name}</p>
                    <p className="text-xs text-muted-foreground">{rt.baseCapacity} Guests · ${rt.basePrice}/night</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(rt)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(rt.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <Button variant="outline" className="w-full" onClick={onClose}>Close</Button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[#0F1B2D]">{editing.id ? 'Edit' : 'Add'} Room Type</h3>
            <button onClick={() => setEditing(null)}><X className="w-4 h-4" /></button>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Name</Label>
              <Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="e.g. Deluxe King" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Input value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Optional description" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Capacity</Label>
                <Input type="number" value={editing.baseCapacity} onChange={e => setEditing({ ...editing, baseCapacity: parseInt(e.target.value) })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Extra Beds</Label>
                <Input type="number" value={editing.maxExtraBeds} onChange={e => setEditing({ ...editing, maxExtraBeds: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Base Price ($)</Label>
              <Input type="number" value={editing.basePrice} onChange={e => setEditing({ ...editing, basePrice: parseFloat(e.target.value) })} />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setEditing(null)}>Cancel</Button>
            <Button className="flex-1 bg-[#0F1B2D]" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
