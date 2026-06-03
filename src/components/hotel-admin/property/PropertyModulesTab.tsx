import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const MODULES = ['housekeeping', 'maintenance', 'finance', 'pricing', 'shifts', 'reports', 'frontDesk', 'onlineBooking'];

interface PropertyModulesTabProps {
  initialData: Record<string, boolean> | null;
  hotelId: string | undefined;
  settings: any;
}

export function PropertyModulesTab({ initialData, hotelId, settings }: PropertyModulesTabProps) {
  const [modulesEnabled, setModulesEnabled] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) setModulesEnabled(initialData);
  }, [initialData]);

  const save = async () => {
    if (!hotelId) return;
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/settings`, {
        settings: { ...settings, modulesEnabled },
      });
      toast.success('Modules updated');
    } catch (e: any) {
      toast.error('Failed to save modules: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-none bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Enabled Modules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {MODULES.map(mod => (
          <div key={mod} className="flex items-center justify-between py-2">
            <Label className="capitalize">{mod.replace(/([A-Z])/g, ' $1')}</Label>
            <Switch
              checked={modulesEnabled[mod] ?? true}
              onCheckedChange={(v) => setModulesEnabled({ ...modulesEnabled, [mod]: v })}
            />
          </div>
        ))}
        <div className="pt-4">
          <Button onClick={save} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            <Save className="w-4 h-4 mr-2" /> Save Modules
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
