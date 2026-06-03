import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, CreditCard, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface PaymentMethodsProps {
  selectedHotelId: string;
  paymentMethods: string[];
}

export function PaymentMethods({ selectedHotelId, paymentMethods }: PaymentMethodsProps) {
  const [methods, setMethods] = useState<string[]>(paymentMethods);
  const [newMethod, setNewMethod] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMethods(paymentMethods);
  }, [paymentMethods]);

  const persist = async (updated: string[]) => {
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${selectedHotelId}/payment-methods`, { methods: updated });
      setMethods(updated);
    } catch (e: any) {
      toast.error('Failed: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = () => {
    if (!newMethod.trim()) return;
    persist([...methods, newMethod.trim().toLowerCase()]);
    setNewMethod('');
  };

  const handleRemove = (index: number) => {
    persist(methods.filter((_, idx) => idx !== index));
  };

  return (
    <Card className="border-none bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {methods.map((pm, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
            <span className="capitalize">{pm.replace(/_/g, ' ')}</span>
            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleRemove(i)} disabled={isSaving}>
              Remove
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input value={newMethod} onChange={(e) => setNewMethod(e.target.value)} placeholder="e.g. cash, credit_card, chapa" className="flex-1" />
          <Button variant="outline" onClick={handleAdd} disabled={isSaving || !newMethod.trim()}>
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
