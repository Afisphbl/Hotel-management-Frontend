
import { useParams } from '@tanstack/react-router';
import { useTenantSecurity } from '@/hooks/usePlatformData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  ShieldAlert, 
  Key, 
  Fingerprint, 
  ShieldCheck, 
  Globe, 
  Smartphone,
  Save,
  Loader2,
  Trash2,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function HotelSecurity() {
  const { id } = useParams({ from: '/auth/platform/hotels/$id' });
  const { data: security, isLoading, isError, error, refetch } = useTenantSecurity(id);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (security) setFormData({ ...security });
  }, [security]);

  const handleSave = () => {
    toast.success('Security policy updated');
  };

  if (isLoading) return null;
  if (isError) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
      <h3 className="text-lg font-serif text-slate-500">Failed to load security settings</h3>
      <p className="text-xs text-slate-400 mt-1 mb-4">{error?.message}</p>
      <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
    </div>
  );
  if (!formData) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C9973A]" />
              Access Control Policy
            </CardTitle>
            <CardDescription>Configure how users authenticate to this tenant.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">MFA Enforcement</Label>
                <p className="text-sm text-muted-foreground">Mandatory for all admin and manager roles.</p>
              </div>
              <Switch checked={formData.mfaEnforced} onCheckedChange={(val: boolean) => setFormData({...formData, mfaEnforced: val})} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Device Tracking</Label>
                <p className="text-sm text-muted-foreground">Log and verify unique devices per user session.</p>
              </div>
              <Switch checked={formData.deviceTracking} onCheckedChange={(val: boolean) => setFormData({...formData, deviceTracking: val})} />
            </div>

            <div className="space-y-2">
              <Label>Session Timeout (Minutes)</Label>
              <Input 
                type="number" 
                value={formData.sessionTimeout} 
                onChange={(e) => setFormData({...formData, sessionTimeout: parseInt(e.target.value)})} 
              />
            </div>

            <div className="space-y-2">
              <Label>Login Retry Limit</Label>
              <Input 
                type="number" 
                value={formData.attemptLimit} 
                onChange={(e) => setFormData({...formData, attemptLimit: parseInt(e.target.value)})} 
              />
            </div>

            <div className="pt-4 border-t">
              <Button className="w-full bg-[#0F1B2D] hover:bg-[#1a2a3a] gap-2" onClick={handleSave}>
                <Save className="w-4 h-4" /> Save Access Policy
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#C9973A]" />
              IP Allowlist & Geo-Fencing
            </CardTitle>
            <CardDescription>Restricting tenant access to specific network ranges.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Allowed IP Ranges (CIDR)</Label>
              <div className="space-y-2">
                {formData.ipRestrictions.map((ip: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={ip} readOnly className="bg-slate-50" />
                    <Button variant="ghost" size="icon" className="text-red-500 h-10 w-10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input placeholder="e.g. 192.168.1.1/32" />
                  <Button variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-none bg-white border-amber-100 bg-amber-50/20">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-amber-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            Infrastructure Response Actions
          </CardTitle>
          <CardDescription>Administrative overrides for security incidents.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border rounded-xl flex flex-col justify-between gap-4 shadow-sm">
              <div>
                <p className="font-bold text-sm">Kill All Sessions</p>
                <p className="text-xs text-muted-foreground">Immediately expire all JWT tokens and active sessions for this tenant.</p>
              </div>
              <Button variant="outline" className="w-full text-amber-700 border-amber-200">Execute Killswitch</Button>
            </div>
            <div className="p-4 bg-white border rounded-xl flex flex-col justify-between gap-4 shadow-sm">
              <div>
                <p className="font-bold text-sm">Force Password Reset</p>
                <p className="text-xs text-muted-foreground">Request all users to change passwords on their next login attempt.</p>
              </div>
              <Button variant="outline" className="w-full">Trigger Reset</Button>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex flex-col justify-between gap-4 shadow-sm">
              <div>
                <p className="font-bold text-red-900 text-sm">Tenant Lockdown</p>
                <p className="text-xs text-red-600">Revoke all infrastructure access. Only platform admins can reverse this.</p>
              </div>
              <Button variant="destructive" className="w-full">Activate Lockdown</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
