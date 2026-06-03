import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Globe, Settings, FileUp, BarChart3, Shield, User, Plus, CreditCard, Activity, Bell } from 'lucide-react';
import { GeneralInfoTab } from './detail/GeneralInfoTab';
import { HotelSettingsTab } from './detail/HotelSettingsTab';
import { BrandingTab } from './detail/BrandingTab';
import { PerformanceTab } from './detail/PerformanceTab';
import { PoliciesTab } from './detail/PoliciesTab';
import { TeamAccessTab } from './detail/TeamAccessTab';
import { ModulesTab } from './detail/ModulesTab';
import { AuditLogsTab } from './detail/AuditLogsTab';
import { NotificationsTab } from './detail/NotificationsTab';
import { PaymentsTab } from './detail/PaymentsTab';

interface Hotel {
  id: string;
  name: string;
  location: string;
  slug?: string;
  ownerName?: string;
  ownerEmail?: string;
  maintenanceMode?: boolean;
  currency?: string;
  timezone?: string;
  branding?: { logoUrl?: string };
  settings?: {
    taxes?: Record<string, any>;
    bookingPolicies?: Record<string, any>;
    modulesEnabled?: Record<string, boolean>;
    notifications?: Record<string, any>;
    admins?: string[];
  };
  cancellationPolicy?: Record<string, any>;
  paymentMethods?: any[];
}

interface HotelDetailSheetProps {
  hotel: Hotel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HotelDetailSheet({ hotel, open, onOpenChange }: HotelDetailSheetProps) {
  if (!hotel) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[800px] overflow-y-auto">
        <SheetHeader className="border-b pb-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-slate-50 border flex items-center justify-center overflow-hidden">
              {hotel.branding?.logoUrl ? <img src={hotel.branding.logoUrl} alt={`${hotel.name} logo`} title={`${hotel.name} logo`} className="w-full h-full object-cover" /> : <Building2 className="w-6 h-6 text-slate-400" />}
            </div>
            <div>
              <SheetTitle className="text-xl font-serif">{hotel.name}</SheetTitle>
              <SheetDescription>{hotel.location}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="info" className="w-full" orientation="vertical">
          <div className="flex gap-6">
            <TabsList className="flex flex-col h-auto bg-transparent border-r rounded-none p-0 w-48 shrink-0" variant="line">
              <TabsTrigger value="info" className="justify-start py-3 px-4 w-full"><Globe className="w-4 h-4 mr-2" /> General Info</TabsTrigger>
              <TabsTrigger value="settings" className="justify-start py-3 px-4 w-full"><Settings className="w-4 h-4 mr-2" /> Settings</TabsTrigger>
              <TabsTrigger value="branding" className="justify-start py-3 px-4 w-full"><FileUp className="w-4 h-4 mr-2" /> Branding</TabsTrigger>
              <TabsTrigger value="performance" className="justify-start py-3 px-4 w-full"><BarChart3 className="w-4 h-4 mr-2" /> Performance</TabsTrigger>
              <TabsTrigger value="policies" className="justify-start py-3 px-4 w-full"><Shield className="w-4 h-4 mr-2" /> Policies</TabsTrigger>
              <TabsTrigger value="admins" className="justify-start py-3 px-4 w-full"><User className="w-4 h-4 mr-2" /> Team Access</TabsTrigger>
              <TabsTrigger value="modules" className="justify-start py-3 px-4 w-full"><Plus className="w-4 h-4 mr-2" /> Modules</TabsTrigger>
              <TabsTrigger value="payments" className="justify-start py-3 px-4 w-full"><CreditCard className="w-4 h-4 mr-2" /> Payments</TabsTrigger>
              <TabsTrigger value="audit" className="justify-start py-3 px-4 w-full"><Activity className="w-4 h-4 mr-2" /> Audit Logs</TabsTrigger>
              <TabsTrigger value="notifications" className="justify-start py-3 px-4 w-full"><Bell className="w-4 h-4 mr-2" /> Notifications</TabsTrigger>
            </TabsList>

            <div className="flex-1 min-h-[500px]">
              <TabsContent value="info" className="mt-0">
                <GeneralInfoTab key={hotel.id} hotel={hotel} />
              </TabsContent>
              <TabsContent value="settings" className="mt-0">
                <HotelSettingsTab key={hotel.id} hotelId={hotel.id} currency={hotel.currency || 'ETB'} timezone={hotel.timezone || 'UTC'} taxes={hotel.settings?.taxes || {}} />
              </TabsContent>
              <TabsContent value="branding" className="mt-0">
                <BrandingTab hotelId={hotel.id} logoUrl={hotel.branding?.logoUrl} />
              </TabsContent>
              <TabsContent value="performance" className="mt-0">
                <PerformanceTab hotelId={hotel.id} currency={hotel.currency || 'ETB'} />
              </TabsContent>
              <TabsContent value="policies" className="mt-0">
                <PoliciesTab key={hotel.id} hotelId={hotel.id} bookingPolicies={hotel.settings?.bookingPolicies || {}} cancellationPolicy={hotel.cancellationPolicy || {}} />
              </TabsContent>
              <TabsContent value="admins" className="mt-0">
                <TeamAccessTab key={hotel.id} hotelId={hotel.id} admins={hotel.settings?.admins} />
              </TabsContent>
              <TabsContent value="modules" className="mt-0">
                <ModulesTab key={hotel.id} hotelId={hotel.id} modulesEnabled={hotel.settings?.modulesEnabled || {}} />
              </TabsContent>
              <TabsContent value="payments" className="mt-0">
                <PaymentsTab key={hotel.id} hotelId={hotel.id} paymentMethods={hotel.paymentMethods || []} />
              </TabsContent>
              <TabsContent value="audit" className="mt-0">
                <AuditLogsTab hotelId={hotel.id} />
              </TabsContent>
              <TabsContent value="notifications" className="mt-0">
                <NotificationsTab key={hotel.id} hotelId={hotel.id} notifications={hotel.settings?.notifications || {}} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
