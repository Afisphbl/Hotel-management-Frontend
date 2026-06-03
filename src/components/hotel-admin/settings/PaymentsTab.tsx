import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface PaymentsTabProps {
  hotelId: string;
  initialPaymentMethods: string[];
}

export function PaymentsTab({ hotelId, initialPaymentMethods }: PaymentsTabProps) {
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPaymentMethods(initialPaymentMethods);
  }, [initialPaymentMethods]);

  const saveMethods = async (updated: string[]) => {
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/payment-methods`, { methods: updated });
      toast.success('Payment methods updated');
      setPaymentMethods(updated);
    } catch (e: any) {
      toast.error('Failed to save payment methods: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = () => {
    if (!newPaymentMethod.trim()) return;
    const updated = [...paymentMethods, newPaymentMethod.trim().toLowerCase()];
    saveMethods(updated);
    setNewPaymentMethod('');
  };

  const handleRemove = (index: number) => {
    const updated = paymentMethods.filter((_, i) => i !== index);
    saveMethods(updated);
  };

  return (
    <Card className="border-none bg-white shadow-sm mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Payment Methods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {paymentMethods.map((pm, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
            >
              <span className="capitalize">{pm.replace(/_/g, " ")}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500"
                onClick={() => handleRemove(i)}
                disabled={isSaving}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newPaymentMethod}
            onChange={(e) => setNewPaymentMethod(e.target.value)}
            placeholder="e.g. cash, credit_card, chapa"
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={handleAdd}
            disabled={isSaving || !newPaymentMethod.trim()}
          >
            {isSaving ? '...' : 'Add'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
