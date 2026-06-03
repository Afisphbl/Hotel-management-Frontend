import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface PaymentsTabProps {
  hotelId: string;
  paymentMethods: any[];
}

export function PaymentsTab({ hotelId, paymentMethods }: PaymentsTabProps) {
  const [value, setValue] = useState(JSON.stringify(paymentMethods, null, 2));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { setValue(JSON.stringify(paymentMethods, null, 2)); }, [paymentMethods]);

  const save = async () => {
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/payment-methods`, { methods: tryParse(value) });
      toast.success('Payment config updated');
    } catch (e: any) { toast.error('Failed: ' + e.message); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Payment Gateways & Methods</h4>
      <label htmlFor="payment-methods" className="sr-only">
        Payment methods configuration
      </label>
      <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg flex gap-3 text-yellow-800 text-sm">
        <CreditCard className="w-5 h-5 shrink-0" />
        <p>Configure your payment processors (Stripe, PayPal, etc.) and accepted guest payment methods below.</p>
      </div>
      <textarea
        id="payment-methods"
        placeholder="Enter payment methods configuration as JSON"
        className="w-full p-3 bg-slate-50 border rounded-lg h-48 text-xs font-mono"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <Button onClick={save} disabled={isSaving} className="bg-[#0F1B2D]">
        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Update Payment Config
      </Button>
    </div>
  );
}

function tryParse(v: string) {
  try { return JSON.parse(v); } catch { return []; }
}
