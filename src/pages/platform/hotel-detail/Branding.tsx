
import { useParams } from '@tanstack/react-router';
import { useTenantBranding, useUpdateTenantBranding } from '@/hooks/usePlatformData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Palette, 
  Upload, 
  Monitor, 
  Smartphone, 
  Save, 
  Loader2, 
  Image as ImageIcon,
  CheckCircle2,
  Menu,
  MoreVertical,
  Database
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function HotelBranding() {
  const { id } = useParams({ from: '/auth/platform/hotels/$id' });
  const { data: branding, isLoading, isError, error, refetch } = useTenantBranding(id);
  const updateMutation = useUpdateTenantBranding();
  
  const [formData, setFormData] = useState<any>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (branding) setFormData({ ...branding });
  }, [branding]);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id, data: formData });
      toast.success('Branding isolation updated');
    } catch (err) {
      toast.error('Failed to update branding');
    }
  };

  if (isLoading) return null;
  if (isError) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Database className="w-10 h-10 text-red-400 mb-3" />
      <h3 className="text-lg font-serif text-slate-500">Failed to load branding</h3>
      <p className="text-xs text-slate-400 mt-1 mb-4">{error?.message}</p>
      <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
    </div>
  );
  if (!formData) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuration */}
      <div className="space-y-6">
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#C9973A]" />
              Visual Identity
            </CardTitle>
            <CardDescription>Managed branding isolation for this tenant.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Tenant Logo</Label>
              <div className="flex items-center gap-6 p-4 border-2 border-dashed rounded-xl">
                <div className="w-20 h-20 rounded bg-slate-50 flex items-center justify-center overflow-hidden border">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs text-muted-foreground">High resolution PNG or SVG. Max 2MB.</p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="w-3 h-3" /> Upload New
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <div 
                    className="w-10 h-10 rounded border" 
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                  <Input value={formData.primaryColor} onChange={(e) => setFormData({...formData, primaryColor: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  <div 
                    className="w-10 h-10 rounded border" 
                    style={{ backgroundColor: formData.accentColor }}
                  />
                  <Input value={formData.accentColor} onChange={(e) => setFormData({...formData, accentColor: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Login Message</Label>
              <Input 
                value={formData.loginMessage} 
                onChange={(e) => setFormData({...formData, loginMessage: e.target.value})}
              />
            </div>

            <div className="pt-4 border-t flex justify-end">
              <Button className="bg-[#0F1B2D] hover:bg-[#1a2a3a] gap-2" onClick={handleSave} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Branding
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="font-serif text-lg">System Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-medium">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground uppercase tracking-widest text-[9px] font-bold">Favicon</span>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-none">Active</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground uppercase tracking-widest text-[9px] font-bold">Email Header</span>
              <Badge variant="outline" className="bg-slate-100 text-slate-500 border-none">Using Default</Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground uppercase tracking-widest text-[9px] font-bold">Invoice Branding</span>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-none">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg">Isolation Preview</h3>
          <div className="flex bg-slate-100 rounded-lg p-1">
            <Button 
              variant={previewDevice === 'desktop' ? 'outline' : 'ghost'} 
              size="sm" 
              className={cn("h-8 px-3 transition-all", previewDevice === 'desktop' && "bg-white shadow-sm")}
              onClick={() => setPreviewDevice('desktop')}
            >
              <Monitor className="w-4 h-4 mr-2" /> Desktop
            </Button>
            <Button 
              variant={previewDevice === 'mobile' ? 'outline' : 'ghost'} 
              size="sm" 
              className={cn("h-8 px-3 transition-all", previewDevice === 'mobile' && "bg-white shadow-sm")}
              onClick={() => setPreviewDevice('mobile')}
            >
              <Smartphone className="w-4 h-4 mr-2" /> Mobile
            </Button>
          </div>
        </div>

        <div className={cn(
          "bg-slate-900 rounded-[2rem] border-8 border-slate-800 shadow-2xl transition-all overflow-hidden relative mx-auto",
          previewDevice === 'desktop' ? "w-full aspect-[4/3]" : "w-[280px] aspect-[9/19]"
        )}>
          {/* Mock App UI */}
          <div className="absolute inset-0 bg-[#F8F7F4] flex flex-col">
            {/* Nav */}
            <div className="h-14 bg-white border-b px-4 flex items-center justify-between" style={{ borderTop: `4px solid ${formData.accentColor}` }}>
              <div className="flex items-center gap-3">
                {formData.logo ? (
                  <img src={formData.logo} alt="Logo" className="h-6 w-auto" />
                ) : (
                  <div className="w-6 h-6 rounded bg-slate-200" />
                )}
                <span className="font-bold text-sm" style={{ color: formData.primaryColor }}>PMS</span>
              </div>
              <Menu className="w-5 h-5 text-slate-400" />
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 space-y-4">
              <div className="space-y-1">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-6 w-48 bg-slate-300 rounded" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-8">
                <div className="h-24 bg-white rounded-xl shadow-sm border p-3 flex flex-col justify-end gap-2">
                  <div className="h-2 w-12 bg-slate-100 rounded" />
                  <div className="h-6 w-16 bg-slate-200 rounded" />
                </div>
                <div className="h-24 bg-white rounded-xl shadow-sm border p-3 flex flex-col justify-end gap-2">
                  <div className="h-2 w-12 bg-slate-100 rounded" />
                  <div className="h-6 w-16 bg-slate-200 rounded" />
                </div>
              </div>

              {/* Mock Button */}
              <div 
                className="mt-6 h-10 w-full rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: formData.primaryColor }}
              >
                Primary Action Sample
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground italic">
          This is a simulated preview of the tenant's actual operational environment.
        </p>
      </div>
    </div>
  );
}
