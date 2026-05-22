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
  Database,
  Search,
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Bell,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function HotelBranding() {
  const { id } = useParams({ from: '/auth/platform/hotels/$id' });
  const { data: branding, isLoading, isError, error, refetch } = useTenantBranding(id);
  const updateMutation = useUpdateTenantBranding();
  
  const [formData, setFormData] = useState<any>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
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
              <div className="flex items-center gap-6 p-4 border-2 border-dashed rounded-xl group hover:border-[#C9973A] transition-colors">
                <div className="w-20 h-20 rounded bg-slate-50 flex items-center justify-center overflow-hidden border">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs text-muted-foreground">High resolution PNG or SVG. Max 2MB.</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-3 h-3" /> Upload New
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <div className="relative">
                    <div 
                      className="w-10 h-10 rounded border cursor-pointer hover:scale-105 transition-transform shadow-sm" 
                      style={{ backgroundColor: formData.primaryColor }}
                      onClick={() => document.getElementById('primary-color-picker')?.click()}
                    />
                    <input 
                      id="primary-color-picker"
                      type="color"
                      className="absolute inset-0 opacity-0 w-0 h-0"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                    />
                  </div>
                  <Input value={formData.primaryColor} onChange={(e) => setFormData({...formData, primaryColor: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  <div className="relative">
                    <div 
                      className="w-10 h-10 rounded border cursor-pointer hover:scale-105 transition-transform shadow-sm" 
                      style={{ backgroundColor: formData.accentColor }}
                      onClick={() => document.getElementById('accent-color-picker')?.click()}
                    />
                    <input 
                      id="accent-color-picker"
                      type="color"
                      className="absolute inset-0 opacity-0 w-0 h-0"
                      value={formData.accentColor}
                      onChange={(e) => setFormData({...formData, accentColor: e.target.value})}
                    />
                  </div>
                  <Input value={formData.accentColor} onChange={(e) => setFormData({...formData, accentColor: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Login Message</Label>
              <Input 
                value={formData.loginMessage} 
                onChange={(e) => setFormData({...formData, loginMessage: e.target.value})}
                placeholder="Welcome to our hotel PMS"
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
          <div className="absolute inset-0 bg-[#F8F7F4] flex">
            {/* Sidebar (Desktop Only) */}
            {previewDevice === 'desktop' && (
              <div className="w-16 bg-[#0F1B2D] flex flex-col items-center py-6 gap-6">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-white/60" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white/60" />
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: formData.accentColor }}>
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white/60" />
                </div>
              </div>
            )}

            <div className="flex-1 flex flex-col min-w-0">
              {/* Header */}
              <div className="h-14 bg-white border-b px-4 flex items-center justify-between" style={{ borderTop: `3px solid ${formData.accentColor}` }}>
                <div className="flex items-center gap-3">
                  {previewDevice === 'mobile' && <Menu className="w-5 h-5 text-slate-400" />}
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="h-5 w-auto" />
                  ) : (
                    <div className="w-5 h-5 rounded bg-slate-200" />
                  )}
                  <span className="font-bold text-sm hidden sm:inline" style={{ color: formData.primaryColor }}>PMS</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-300 absolute left-2 top-1/2 -translate-y-1/2" />
                    <div className="h-8 w-32 bg-slate-50 rounded-full border hidden sm:block" />
                  </div>
                  <Bell className="w-4 h-4 text-slate-400" />
                  <div className="w-8 h-8 rounded-full bg-slate-100 border flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-4 sm:p-6 overflow-auto bg-[#F8F7F4]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-xl font-serif text-[#0F1B2D]">Guest Management</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Front Desk Operations</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="h-8 text-[10px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    + New Check-in
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Total Arrivals', val: '24' },
                    { label: 'Available Rooms', val: '12' },
                    { label: 'Maintenance', val: '3' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border p-4 flex flex-col gap-1">
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">{stat.label}</p>
                      <p className="text-xl font-serif" style={{ color: formData.primaryColor }}>{stat.val}</p>
                    </div>
                  ))}
                </div>

                {/* Mock List */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="p-3 border-b bg-slate-50 flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Recent Bookings</span>
                    <MoreVertical className="w-3 h-3 text-slate-300" />
                  </div>
                  <div className="divide-y">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 border flex items-center justify-center">
                            <Users className="w-3 h-3 text-slate-300" />
                          </div>
                          <div>
                            <div className="h-2 w-20 bg-slate-200 rounded mb-1" />
                            <div className="h-1.5 w-12 bg-slate-100 rounded" />
                          </div>
                        </div>
                        <div className="h-4 w-12 rounded bg-green-50 text-[8px] font-bold text-green-600 flex items-center justify-center border border-green-100">
                          CONFIRMED
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
