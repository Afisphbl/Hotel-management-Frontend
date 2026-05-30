import React from 'react';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Clock, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  ChevronRight,
  MoreVertical,
  Camera,
  Save,
  Palette
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useHotel } from '@/hooks/useHotelData';

export function HotelSettings() {
  const { user } = useAuthStore();
  const { data: hotel, isLoading } = useHotel(user?.hotel_id || '');

  if (isLoading) return <div>Loading...</div>;
  if (!hotel) return <div>No hotel found</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Property Settings: {hotel.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure your property profile and rules.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-1 overflow-x-auto flex md:flex-col pb-2 md:pb-0 no-scrollbar">
          {[
            { label: 'General', icon: Building2, path: '/hotel/settings' },
            { label: 'Booking', icon: ShieldCheck, path: '/hotel/settings' },
            { label: 'Integrations', icon: Globe, path: '/hotel/settings' },
            { label: 'Financials', icon: CreditCard, path: '/hotel/settings' },
            { label: 'Alerts', icon: Bell, path: '/hotel/settings' },
            { label: 'Branding', icon: Palette, path: '/hotel/settings' },
          ].map((item, i) => (
            <Link key={i} to={item.path} className={cn(
                "whitespace-nowrap md:w-full text-left p-3 rounded-lg flex items-center justify-between group transition-colors shrink-0",
                i === 0 ? "bg-[#0F1B2D] text-white shadow-sm" : "hover:bg-slate-100/50 text-slate-500"
            )}>
                <div className="flex items-center gap-3">
                   <item.icon className="w-4 h-4" />
                   <span className="text-sm font-medium">{item.label}</span>
                </div>
                {i !== 0 && <ChevronRight className="hidden md:block w-4 h-4 opacity-0 group-hover:opacity-100" />}
            </Link>
          ))}
        </div>

        <div className="flex-1 space-y-6">
          <Card className="shadow-sm border-none bg-white">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4">
               <div className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group cursor-pointer hover:bg-slate-100 hover:border-[#C9973A] transition-all shrink-0">
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[10px] uppercase font-bold">Logo</span>
               </div>
               <div>
                  <CardTitle className="font-serif text-xl">Property Identity</CardTitle>
                  <CardDescription>Managed by {hotel.ownerName}.</CardDescription>
                  <div className="flex gap-2 mt-2">
                     <Badge variant="outline" className="text-[10px]">PREMIUM TIER</Badge>
                     <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-100">VERIFIED</Badge>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-4 border-t border-slate-50">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label>Hotel Name</Label>
                     <Input defaultValue={hotel.name} />
                  </div>
                  <div className="space-y-2">
                     <Label>Primary Category</Label>
                     <Select defaultValue={hotel.type || "hotel"}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                           <SelectItem value="hotel">Boutique Hotel</SelectItem>
                           <SelectItem value="resort">Luxury Resort</SelectItem>
                           <SelectItem value="apartment">Serviced Apartments</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               <div className="space-y-2">
                  <Label>Management Tagline</Label>
                  <Input defaultValue={hotel.settings?.tagline || ""} />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label>Support Phone</Label>
                     <Input defaultValue={hotel.settings?.phone || ""} />
                  </div>
                  <div className="space-y-2">
                     <Label>Official Website</Label>
                     <Input defaultValue={hotel.settings?.website || ""} />
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-white">
             <CardHeader>
                <CardTitle className="font-serif text-lg">Operational Policy</CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                   <div className="space-y-1">
                      <p className="text-sm font-bold">Auto-Release Pre-Authorizations</p>
                      <p className="text-xs text-muted-foreground">Automatically release guest holds at checkout.</p>
                   </div>
                   <Switch defaultChecked={!!hotel.settings?.autoRelease} />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                   <div className="space-y-1">
                      <p className="text-sm font-bold">Smart Pricing Autopilot</p>
                      <p className="text-xs text-muted-foreground">Allow AI to adjust rates based on local compsets.</p>
                   </div>
                   <Switch defaultChecked={!!hotel.settings?.smartPricing} />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                   <div className="space-y-1">
                      <p className="text-sm font-bold">Late Checkout Surcharge</p>
                      <p className="text-xs text-muted-foreground">Apply £25 fee automatically after 11:30 AM.</p>
                   </div>
                   <Switch defaultChecked={!!hotel.settings?.lateCheckoutSurcharge} />
                </div>
             </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
             <Button variant="ghost" className="text-slate-400">Discard Changes</Button>
             <Button className="bg-[#0F1B2D] hover:bg-[#1a2a3a] gap-2">
                <Save className="w-4 h-4" /> Save Configuration
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
