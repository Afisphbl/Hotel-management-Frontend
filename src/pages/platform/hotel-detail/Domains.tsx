
import { useParams } from '@tanstack/react-router';
import { useTenantDomains } from '@/hooks/usePlatformData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Globe, 
  ExternalLink, 
  Copy, 
  ShieldCheck, 
  RefreshCw, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Link2,
  Trash2,
  Monitor,
  Layout
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function HotelDomains() {
  const { id } = useParams({ from: '/auth/platform/hotels/$id' });
  const { data: domains, isLoading, isError, error, refetch } = useTenantDomains(id);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (isLoading) return null;
  if (isError) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
      <h3 className="text-lg font-serif text-slate-500">Failed to load domain data</h3>
      <p className="text-xs text-slate-400 mt-1 mb-4">{error?.message}</p>
      <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
    </div>
  );
  if (!domains) return null;

  return (
    <div className="space-y-6">
      {/* Platform Subdomain */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#C9973A]" />
                Platform Subdomain
              </CardTitle>
              <CardDescription>Managed internal routing for this tenant environment.</CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-700 border-none font-bold uppercase text-[10px]">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end opacity-60">
            <div className="flex-1 space-y-2">
              <Label>Subdomain Prefix</Label>
              <div className="flex">
                <Input 
                  value={domains.subdomain || ''} 
                  disabled
                  placeholder="e.g. grandpeninsula"
                  className="rounded-r-none bg-slate-50 cursor-not-allowed"
                />
                <div className="bg-slate-100 border border-l-0 px-3 flex items-center text-xs sm:text-sm font-medium text-slate-500 rounded-r-md whitespace-nowrap">
                  .pms.cloud
                </div>
              </div>
            </div>
            <Button disabled className="w-full sm:w-auto bg-[#0F1B2D] hover:bg-[#1a2a3a]">Update</Button>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 flex gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
            <div>
              <p className="font-bold text-slate-700 mb-1">Editing Disabled</p>
              Changing the subdomain will immediately break all existing staff bookmarks and API integrations using the old URL. 
              Subdomain modification requires manual database migration and routing updates by the platform engineering team.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Domain */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <Link2 className="w-5 h-5 text-[#C9973A]" />
                Custom Domain
              </CardTitle>
              <CardDescription>Assign a branded domain for client usage.</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> Add Domain
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {domains.customDomain ? (
            <div className="border rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0F1B2D]/5 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-[#0F1B2D]" />
                  </div>
                  <div>
                    <p className="font-bold">{domains.customDomain}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-green-600 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> SSL Active
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-muted-foreground uppercase font-bold tracking-tighter text-[9px]">Expires June 2024</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><RefreshCw className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>

              {/* DNS Instructions */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Required DNS Records</p>
                <div className="space-y-2">
                  {domains.dnsRecords.map((record: any, i: number) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-xs font-mono bg-white p-2 border rounded gap-2">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <Badge variant="outline" className="bg-slate-100 font-bold border-none px-1 h-5">{record.type}</Badge>
                        <span className="font-bold text-[#C9973A]">{record.host}</span>
                        <span className="text-slate-300">→</span>
                        <span className="break-all">{record.value}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 self-end sm:self-auto shrink-0" onClick={() => copyToClipboard(record.value)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 border-2 border-dashed rounded-xl text-center text-muted-foreground">
              <Globe className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p>No custom domain registered for this tenant.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Access Points */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Tenant Access URLs</CardTitle>
          <CardDescription>Direct links to all operational portals for this property.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Staff Dashboard', url: domains.urls.dashboard, icon: Layout },
              { label: 'Staff Login', url: domains.urls.staffLogin, icon: Monitor },
              { label: 'Guest Portal', url: domains.urls.guestPortal, icon: Globe },
              { label: 'Booking Engine', url: domains.urls.bookingEngine, icon: ShieldCheck },
            ].map((point, i) => (
              <div key={i} className="p-4 bg-[#F8F7F4] rounded-xl flex items-center justify-between group overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-[#C9973A]">
                    <point.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{point.label}</p>
                    <p className="text-xs font-mono font-medium truncate max-w-[200px]">{point.url}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(point.url)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(point.url, '_blank')}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
