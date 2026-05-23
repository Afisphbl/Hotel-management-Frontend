import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export function FinanceSettings() {
  const [config, setConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/hotel/finance-config', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = async (newConfig: any) => {
    try {
      const response = await fetch('/api/hotel/finance-config', {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newConfig)
      });
      const data = await response.json();
      setConfig(data);
      toast.success('Settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 pb-10">
      <h1 className="text-3xl font-serif text-[#0F1B2D]">Finance Settings</h1>

      {/* Payment Gateways */}
      <Card>
        <CardHeader><CardTitle>Payment Gateways</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Enable Chapa</Label>
            <Switch 
              checked={config.gateways?.chapa?.enabled}
              onCheckedChange={(enabled) => updateConfig({ gateways: { chapa: { enabled } } })}
            />
          </div>
          {config.gateways?.chapa?.enabled && (
            <Input placeholder="Chapa Public Key" defaultValue={config.gateways?.chapa?.publicKey} />
          )}
        </CardContent>
      </Card>

      {/* Invoice Settings */}
      <Card>
        <CardHeader><CardTitle>Invoice Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Label>Invoice Prefix</Label>
          <Input defaultValue={config.invoiceSettings?.prefix} onBlur={(e) => updateConfig({ invoiceSettings: { prefix: e.target.value } })} />
          <Label>Next Number</Label>
          <Input defaultValue={config.invoiceSettings?.nextNumber} onBlur={(e) => updateConfig({ invoiceSettings: { nextNumber: e.target.value } })} />
        </CardContent>
      </Card>
    </div>
  );
}
