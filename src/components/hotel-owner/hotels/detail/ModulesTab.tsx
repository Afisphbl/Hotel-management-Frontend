import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const MODULES = ['housekeeping', 'maintenance', 'payments', 'reports', 'analytics', 'loyalty'];

interface ModulesTabProps {
  hotelId: string;
  modulesEnabled: Record<string, boolean>;
}

export function ModulesTab({ hotelId, modulesEnabled = {} }: ModulesTabProps) {
  const [modules, setModules] = useState<Record<string, boolean>>(modulesEnabled);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { setModules(modulesEnabled); }, [modulesEnabled]);

  const save = async () => {
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/modules`, { modules });
      toast.success('Modules updated');
    } catch (e: any) { toast.error('Failed: ' + e.message); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {MODULES.map((m) => {
          const active = !!modules[m];
          return (
            <Card key={m} className={`transition-colors ${active ? 'border-[#C9973A]/30 bg-[#C9973A]/5' : ''}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="capitalize font-medium">{m}</div>
                <Switch checked={active} onCheckedChange={(checked) => setModules({ ...modules, [m]: checked })} />
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Button onClick={save} disabled={isSaving} className="bg-[#0F1B2D] w-full mt-4">
        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Update Active Modules
      </Button>
    </div>
  );
}
