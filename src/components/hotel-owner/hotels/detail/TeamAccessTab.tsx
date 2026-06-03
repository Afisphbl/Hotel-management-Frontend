import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface TeamAccessTabProps {
  hotelId: string;
  admins?: string[];
}

export function TeamAccessTab({ hotelId, admins = [] }: TeamAccessTabProps) {
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const addAdmin = async () => {
    if (!email) return;
    setIsSaving(true);
    try {
      await api.post(`hotel/owner/hotels/${hotelId}/admins`, { email });
      toast.success('Admin added');
      setEmail('');
    } catch (e: any) { toast.error('Failed: ' + e.message); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Team member email..." value={email} onChange={e => setEmail(e.target.value)} />
        <Button onClick={addAdmin} disabled={isSaving || !email} className="bg-[#0F1B2D]">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Invite Admin'}
        </Button>
      </div>
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase text-muted-foreground mt-4">Authorized Administrators</h4>
        <div className="divide-y border rounded-lg overflow-hidden">
          {admins.map((emailAddr: string) => (
            <div key={emailAddr} className="flex items-center justify-between p-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
                  {emailAddr[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium">{emailAddr}</span>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Active</Badge>
            </div>
          ))}
          {admins.length === 0 && (
            <div className="p-4 text-center text-muted-foreground text-sm italic">No additional admins assigned.</div>
          )}
        </div>
      </div>
    </div>
  );
}
