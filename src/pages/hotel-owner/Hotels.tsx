import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Plus, Edit, Trash, UploadCloud, FileUp, Settings,
  CreditCard, BarChart3, Shield, Activity, Bell,
  FileText, Globe, DollarSign, Percent, Save,
  Building2, MapPin, Mail, User, CheckCircle2, Hotel
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export function HotelsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hotels, setHotels] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  // New Hotel Form - All database fields
  const [newHotel, setNewHotel] = useState({
    name: '',
    slug: '',
    type: 'BOUTIQUE',
    schemaName: '',
    status: 'ACTIVE',
    subdomain: '',
    location: '',
    region: '',
    timezone: 'UTC',
    currency: 'ETB',
    ownerName: '',
    ownerEmail: '',
    branding: {},
    settings: {
      taxes: {},
      bookingPolicies: {},
      modulesEnabled: {},
      notifications: {}
    },
    subscription: {},
    paymentMethods: [],
    cancellationPolicy: {},
    storageUsedMb: 0,
    rooms: 120,
    maintenanceMode: false
  });

  const [selectedHotel, setSelectedHotel] = useState<any | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [performance, setPerformance] = useState<any | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('hotel/owner/hotels');
      setHotels(data.data || data || []);
    } catch (e: any) {
      toast.error('Failed to fetch hotels: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createHotel = async () => {
    if (!newHotel.name || !newHotel.location) {
      toast.error('Please fill in name and location');
      return;
    }
    try {
      // Send all database fields for hotel creation
      const hotelData = {
        name: newHotel.name,
        slug: newHotel.slug || (newHotel.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        type: newHotel.type,
        schemaName: newHotel.schemaName,
        status: newHotel.status,
        subdomain: newHotel.subdomain,
        location: newHotel.location,
        region: newHotel.region,
        timezone: newHotel.timezone,
        currency: newHotel.currency,
        ownerName: newHotel.ownerName,
        ownerEmail: newHotel.ownerEmail,
        branding: newHotel.branding,
        settings: newHotel.settings,
        subscription: newHotel.subscription,
        paymentMethods: newHotel.paymentMethods,
        cancellationPolicy: newHotel.cancellationPolicy,
        storageUsedMb: newHotel.storageUsedMb,
        rooms: newHotel.rooms,
        maintenanceMode: newHotel.maintenanceMode
      };
      
      await api.post('hotel/owner/hotels', hotelData);
      
      // Reset form with defaults
      setNewHotel({
        name: '',
        slug: '',
        type: 'BOUTIQUE',
        schemaName: '',
        status: 'ACTIVE',
        subdomain: '',
        location: '',
        region: '',
        timezone: 'UTC',
        currency: 'ETB',
        ownerName: '',
        ownerEmail: '',
        branding: {},
        settings: {
          taxes: {},
          bookingPolicies: {},
          modulesEnabled: {},
          notifications: {}
        },
        subscription: {},
        paymentMethods: [],
        cancellationPolicy: {},
        storageUsedMb: 0,
        rooms: 120,
        maintenanceMode: false
      });
      
      setIsCreating(false);
      toast.success('Hotel created successfully');
      fetchHotels();
    } catch (e: any) {
      toast.error('Failed to create hotel: ' + e.message);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await api.patch(`hotel/owner/hotels/${id}/activate`, { active });
      toast.success(`Hotel ${active ? 'activated' : 'deactivated'}`);
      fetchHotels();
    } catch (e: any) {
      toast.error('Failed to update status: ' + e.message);
    }
  };

  const openHotel = (h: any) => {
    setSelectedHotel({ ...h });
    setIsPanelOpen(true);
    setPerformance(null);
    setAuditLogs([]);
  };

  const handleSave = async (action: () => Promise<void>, successMsg: string) => {
    setIsSaving(true);
    try {
      await action();
      toast.success(successMsg);
      fetchHotels();
    } catch (e: any) {
      toast.error('Action failed: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const saveInfo = () => handleSave(async () => {
    await api.patch(`hotel/owner/hotels/${selectedHotel.id}/info`, {
      name: selectedHotel.name,
      location: selectedHotel.location,
      slug: selectedHotel.slug,
      ownerName: selectedHotel.ownerName,
      ownerEmail: selectedHotel.ownerEmail
    });
  }, 'Information updated');

  const saveSettings = () => handleSave(async () => {
    await api.patch(`hotel/owner/hotels/${selectedHotel.id}/settings`, selectedHotel.settings || {});
  }, 'Settings updated');

  const saveTimezoneCurrencyTaxes = () => handleSave(async () => {
    const payload: any = { 
      timezone: selectedHotel.timezone, 
      currency: selectedHotel.currency,
      taxes: selectedHotel.settings?.taxes
    };
    await api.patch(`hotel/owner/hotels/${selectedHotel.id}/timezone-currency-taxes`, payload);
  }, 'Localization updated');

  const saveSubscription = () => handleSave(async () => {
    await api.patch(`hotel/owner/hotels/${selectedHotel.id}/subscription`, selectedHotel.subscription || {});
  }, 'Subscription updated');

  const loadPerformance = async () => {
    try {
      const data = await api.get(`hotel/owner/hotels/${selectedHotel.id}/performance?days=30`);
      setPerformance(data.data || data || null);
    } catch (e: any) {
      toast.error('Failed to load performance');
    }
  };

  const saveBookingPolicies = () => handleSave(async () => {
    await api.patch(`hotel/owner/hotels/${selectedHotel.id}/booking-policies`, selectedHotel.settings?.bookingPolicies || {});
  }, 'Booking policies updated');

  const addAdmin = () => handleSave(async () => {
    if (!adminEmail) return;
    await api.post(`hotel/owner/hotels/${selectedHotel.id}/admins`, { email: adminEmail });
    setAdminEmail('');
    // Refresh selected hotel to show new admin
    const updated = await api.get(`hotel/owner/hotels`);
    const h = (updated.data || updated).find((x: any) => x.id === selectedHotel.id);
    if (h) setSelectedHotel(h);
  }, 'Admin added');

  const saveModules = () => handleSave(async () => {
    await api.patch(`hotel/owner/hotels/${selectedHotel.id}/modules`, { modules: selectedHotel.settings?.modulesEnabled || {} });
  }, 'Modules updated');

  const loadAuditLogs = async () => {
    try {
      const data = await api.get(`hotel/owner/hotels/${selectedHotel.id}/audit-logs?limit=50`);
      setAuditLogs(data.data || data || []);
    } catch (e: any) {
      toast.error('Failed to load audit logs');
    }
  };

  const saveNotifications = () => handleSave(async () => {
    await api.patch(`hotel/owner/hotels/${selectedHotel.id}/notifications`, { notifications: selectedHotel.settings?.notifications || {} });
  }, 'Notifications updated');

  const savePaymentMethods = () => handleSave(async () => {
    await api.patch(`hotel/owner/hotels/${selectedHotel.id}/payment-methods`, { methods: selectedHotel.paymentMethods || [] });
  }, 'Payment methods updated');

  const saveCancellationPolicy = () => handleSave(async () => {
    await api.patch(`hotel/owner/hotels/${selectedHotel.id}/cancellation-policy`, { policy: selectedHotel.cancellationPolicy || {} });
  }, 'Cancellation policy updated');

  const uploadLogo = async () => {
    if (!logoFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(logoFile);
    reader.onload = async () => {
      handleSave(async () => {
        await api.post(`hotel/owner/hotels/${selectedHotel.id}/branding`, { 
          branding: { logoBase64: reader.result } 
        });
        setLogoFile(null);
      }, 'Logo uploaded successfully');
    };
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#0F1B2D]">Hotel & Branch Management</h1>
          <p className="text-muted-foreground">Manage your properties, settings, and team access from a central dashboard.</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)} className="bg-[#0F1B2D]">
          {isCreating ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" />Add New Hotel</>}
        </Button>
      </div>

      {isCreating && (
        <Card className="border-[#C9973A]/20">
          <CardHeader>
            <CardTitle className="text-lg">Create New Hotel / Branch</CardTitle>
            <CardDescription>Enter the basic details to register a new property.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold border-b pb-2">Basic Information</h3>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Hotel Name *</label>
                  <Input placeholder="e.g. Grand Plaza" value={newHotel.name} onChange={e => setNewHotel({...newHotel, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Slug (URL) *</label>
                  <Input placeholder="grand-plaza" value={newHotel.slug} onChange={e => setNewHotel({...newHotel, slug: e.target.value})} />
                  <p className="text-xs text-muted-foreground">URL-friendly identifier (auto-generated if empty)</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Location *</label>
                  <Input placeholder="e.g. London, UK" value={newHotel.location} onChange={e => setNewHotel({...newHotel, location: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Region</label>
                  <Input placeholder="e.g. Europe" value={newHotel.region} onChange={e => setNewHotel({...newHotel, region: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Hotel Type</label>
                  <select 
                    className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                    value={newHotel.type}
                    onChange={e => setNewHotel({...newHotel, type: e.target.value})}
                  >
                    <option value="BOUTIQUE">Boutique</option>
                    <option value="CHAIN">Chain</option>
                    <option value="RESORT">Resort</option>
                    <option value="MOTEL">Motel</option>
                    <option value="LUXURY">Luxury</option>
                  </select>
                </div>
              </div>

              {/* Configuration */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold border-b pb-2">Configuration</h3>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Timezone *</label>
                  <Input placeholder="UTC" value={newHotel.timezone} onChange={e => setNewHotel({...newHotel, timezone: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Currency *</label>
                  <Input placeholder="ETB" value={newHotel.currency} onChange={e => setNewHotel({...newHotel, currency: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Total Rooms</label>
                  <Input type="number" min="1" placeholder="120" value={newHotel.rooms} onChange={e => setNewHotel({...newHotel, rooms: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Subdomain (Optional)</label>
                  <Input placeholder="hotelname" value={newHotel.subdomain} onChange={e => setNewHotel({...newHotel, subdomain: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Schema Name (Optional)</label>
                  <Input placeholder="hotel_schema_001" value={newHotel.schemaName} onChange={e => setNewHotel({...newHotel, schemaName: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold border-b pb-2">Owner Information</h3>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Owner Name</label>
                  <Input placeholder="John Doe" value={newHotel.ownerName} onChange={e => setNewHotel({...newHotel, ownerName: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Owner Email</label>
                  <Input placeholder="owner@hotel.com" value={newHotel.ownerEmail} onChange={e => setNewHotel({...newHotel, ownerEmail: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Hotel Status</label>
                  <select 
                    className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                    value={newHotel.status}
                    onChange={e => setNewHotel({...newHotel, status: e.target.value})}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold border-b pb-2">Advanced Settings</h3>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Storage Used (MB)</label>
                  <Input type="number" min="0" placeholder="0" value={newHotel.storageUsedMb} onChange={e => setNewHotel({...newHotel, storageUsedMb: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Maintenance Mode</label>
                  <Switch
                    checked={newHotel.maintenanceMode}
                    onCheckedChange={checked => setNewHotel({...newHotel, maintenanceMode: checked})}
                  />
                </div>
              </div>
            </div>

            {/* Configuration Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold border-b pb-2">Initial Settings</h3>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Tax Configuration</label>
                  <textarea
                    className="w-full p-2 bg-slate-50 border rounded text-xs font-mono h-20"
                    placeholder={`{
  "vat": 0,
  "service": 0,
  "tourism": 0
}`}
                    value={JSON.stringify(newHotel.settings.taxes, null, 2)}
                    onChange={e => {
                      try {
                        const taxes = JSON.parse(e.target.value);
                        setNewHotel({...newHotel, settings: {...newHotel.settings, taxes}});
                      } catch(e) {}
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Booking Policies</label>
                  <textarea
                    className="w-full p-2 bg-slate-50 border rounded text-xs font-mono h-20"
                    placeholder={`{
  "checkInTime": "14:00",
  "checkOutTime": "11:00",
  "minimumStay": 1
}`}
                    value={JSON.stringify(newHotel.settings.bookingPolicies, null, 2)}
                    onChange={e => {
                      try {
                        const bp = JSON.parse(e.target.value);
                        setNewHotel({...newHotel, settings: {...newHotel.settings, bookingPolicies: bp}});
                      } catch(e) {}
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold border-b pb-2">Business Rules</h3>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Cancellation Policy</label>
                  <textarea
                    className="w-full p-2 bg-slate-50 border rounded text-xs font-mono h-20"
                    placeholder={`{
  "freeCancellation": 24,
  "partialRefund": true
}`}
                    value={JSON.stringify(newHotel.cancellationPolicy, null, 2)}
                    onChange={e => {
                      try {
                        const policy = JSON.parse(e.target.value);
                        setNewHotel({...newHotel, cancellationPolicy: policy});
                      } catch(e) {}
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Payment Methods</label>
                  <textarea
                    className="w-full p-2 bg-slate-50 border rounded text-xs font-mono h-20"
                    placeholder={`[
  {"type": "credit_card", "name": "Credit Card"},
  {"type": "cash", "name": "Cash on Arrival"}
]`}
                    value={JSON.stringify(newHotel.paymentMethods, null, 2)}
                    onChange={e => {
                      try {
                        const methods = JSON.parse(e.target.value);
                        setNewHotel({...newHotel, paymentMethods: methods});
                      } catch(e) {}
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Notifications</label>
                  <textarea
                    className="w-full p-2 bg-slate-50 border rounded text-xs font-mono h-20"
                    placeholder={`{
  "email": true,
  "sms": false,
  "push": true
}`}
                    value={JSON.stringify(newHotel.settings.notifications, null, 2)}
                    onChange={e => {
                      try {
                        const nt = JSON.parse(e.target.value);
                        setNewHotel({...newHotel, settings: {...newHotel.settings, notifications: nt}});
                      } catch(e) {}
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={createHotel} className="bg-[#0F1B2D]">Register Hotel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Hotel Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Branding</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotels.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center overflow-hidden border">
                          {h.branding?.logoUrl ? <img src={h.branding.logoUrl} className="w-full h-full object-cover" /> : <Building2 className="w-4 h-4 text-slate-400" />}
                        </div>
                        {h.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" /> {h.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {h.currency} • {h.timezone}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={h.status === 'ACTIVE'} 
                          onCheckedChange={(val) => toggleActive(h.id, val)}
                        />
                        <span className="text-xs font-medium">{h.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openHotel(h)}>
                        <Settings className="w-4 h-4 mr-2" /> Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {hotels.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      No hotels found. Create your first hotel to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Sheet open={isPanelOpen} onOpenChange={setIsPanelOpen}>
        <SheetContent className="sm:max-w-[800px] overflow-y-auto">
          <SheetHeader className="border-b pb-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-50 border flex items-center justify-center overflow-hidden">
                {selectedHotel?.branding?.logoUrl ? <img src={selectedHotel.branding.logoUrl} className="w-full h-full object-cover" /> : <Building2 className="w-6 h-6 text-slate-400" />}
              </div>
              <div>
                <SheetTitle className="text-xl font-serif">{selectedHotel?.name}</SheetTitle>
                <SheetDescription>{selectedHotel?.location}</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {selectedHotel && (
            <Tabs defaultValue="info" className="w-full" orientation="vertical">
              <div className="flex gap-6">
                <TabsList className="flex flex-col h-auto bg-transparent border-r rounded-none p-0 w-48 shrink-0" variant="line">
                  <TabsTrigger value="info" className="justify-start py-3 px-4 w-full"><Globe className="w-4 h-4 mr-2" /> General Info</TabsTrigger>
                  <TabsTrigger value="settings" className="justify-start py-3 px-4 w-full"><Settings className="w-4 h-4 mr-2" /> Settings</TabsTrigger>
                  <TabsTrigger value="branding" className="justify-start py-3 px-4 w-full"><FileUp className="w-4 h-4 mr-2" /> Branding</TabsTrigger>
                  <TabsTrigger value="performance" onClick={loadPerformance} className="justify-start py-3 px-4 w-full"><BarChart3 className="w-4 h-4 mr-2" /> Performance</TabsTrigger>
                  <TabsTrigger value="policies" className="justify-start py-3 px-4 w-full"><Shield className="w-4 h-4 mr-2" /> Policies</TabsTrigger>
                  <TabsTrigger value="admins" className="justify-start py-3 px-4 w-full"><User className="w-4 h-4 mr-2" /> Team Access</TabsTrigger>
                  <TabsTrigger value="modules" className="justify-start py-3 px-4 w-full"><Plus className="w-4 h-4 mr-2" /> Modules</TabsTrigger>
                  <TabsTrigger value="payments" className="justify-start py-3 px-4 w-full"><CreditCard className="w-4 h-4 mr-2" /> Payments</TabsTrigger>
                  <TabsTrigger value="audit" onClick={loadAuditLogs} className="justify-start py-3 px-4 w-full"><Activity className="w-4 h-4 mr-2" /> Audit Logs</TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start py-3 px-4 w-full"><Bell className="w-4 h-4 mr-2" /> Notifications</TabsTrigger>
                </TabsList>

                <div className="flex-1 min-h-[500px]">
                  {/* General Info */}
                  <TabsContent value="info" className="mt-0 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Hotel Name</label>
                        <Input value={selectedHotel.name} onChange={e => setSelectedHotel({...selectedHotel, name: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Location</label>
                        <Input value={selectedHotel.location} onChange={e => setSelectedHotel({...selectedHotel, location: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Slug (URL friendly)</label>
                        <Input value={selectedHotel.slug} onChange={e => setSelectedHotel({...selectedHotel, slug: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Owner Name</label>
                        <Input value={selectedHotel.ownerName} onChange={e => setSelectedHotel({...selectedHotel, ownerName: e.target.value})} />
                      </div>
                      <div className="col-span-2 space-y-1 pt-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-amber-50 border-amber-100">
                          <div>
                            <p className="text-sm font-semibold text-amber-900">Maintenance Mode</p>
                            <p className="text-xs text-amber-700">When enabled, the hotel booking site will show a maintenance message.</p>
                          </div>
                          <Switch 
                            checked={!!selectedHotel.maintenanceMode} 
                            onCheckedChange={val => setSelectedHotel({...selectedHotel, maintenanceMode: val})} 
                          />
                        </div>
                      </div>
                    </div>
                    <Button onClick={saveInfo} disabled={isSaving} className="bg-[#0F1B2D] mt-4">
                      {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                    </Button>
                  </TabsContent>

                  {/* Settings */}
                  <TabsContent value="settings" className="mt-0 space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 border-b pb-6">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold uppercase text-muted-foreground">Currency</label>
                          <Input value={selectedHotel.currency} onChange={e => setSelectedHotel({...selectedHotel, currency: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold uppercase text-muted-foreground">Timezone</label>
                          <Input value={selectedHotel.timezone} onChange={e => setSelectedHotel({...selectedHotel, timezone: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                           <Button onClick={saveTimezoneCurrencyTaxes} size="sm" variant="outline">Update Localization</Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium flex items-center gap-2"><Percent className="w-4 h-4" /> Tax Configuration</h4>
                        <div className="p-4 bg-slate-50 rounded-lg border text-xs font-mono">
                          <textarea 
                            className="w-full bg-transparent border-none focus:ring-0 h-32"
                            value={JSON.stringify(selectedHotel.settings?.taxes || {}, null, 2)}
                            onChange={e => {
                              try {
                                const taxes = JSON.parse(e.target.value);
                                setSelectedHotel({...selectedHotel, settings: {...selectedHotel.settings, taxes}});
                              } catch(e) {}
                            }}
                          />
                        </div>
                        <Button onClick={saveSettings} disabled={isSaving} className="bg-[#0F1B2D]">
                           Save Settings
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Branding */}
                  <TabsContent value="branding" className="mt-0 space-y-6">
                    <div className="p-6 border rounded-lg bg-slate-50 flex flex-col items-center justify-center gap-4">
                      <div className="w-32 h-32 rounded-lg bg-white border-2 border-dashed flex items-center justify-center overflow-hidden">
                        {selectedHotel.branding?.logoUrl ? <img src={selectedHotel.branding.logoUrl} className="max-w-full max-h-full object-contain" /> : <UploadCloud className="w-8 h-8 text-slate-300" />}
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-sm">Property Logo</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or SVG up to 2MB</p>
                      </div>
                      <div className="flex gap-2">
                        <Input type="file" className="w-64" onChange={e => setLogoFile(e.target.files?.[0] || null)} />
                        <Button onClick={uploadLogo} disabled={!logoFile || isSaving} className="bg-[#0F1B2D]">Upload</Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Performance */}
                  <TabsContent value="performance" className="mt-0 space-y-6">
                    {performance ? (
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="text-3xl font-bold">{performance.bookings}</div>
                            <p className="text-xs text-green-600 mt-1 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Last 30 days</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="text-3xl font-bold">{selectedHotel.currency} {performance.revenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">From completed stays</p>
                          </CardContent>
                        </Card>
                        <div className="col-span-2 p-4 bg-slate-50 rounded-lg border text-sm italic text-muted-foreground text-center py-10">
                           Extended charts and analytics visualization coming soon...
                        </div>
                      </div>
                    ) : (
                      <div className="py-20 text-center"><Skeleton className="h-40 w-full" /></div>
                    )}
                  </TabsContent>

                  {/* Policies */}
                  <TabsContent value="policies" className="mt-0 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                         <h4 className="font-medium">Booking Policies</h4>
                         <textarea 
                            className="w-full p-3 bg-slate-50 border rounded-lg h-32 text-xs font-mono"
                            value={JSON.stringify(selectedHotel.settings?.bookingPolicies || {}, null, 2)}
                            onChange={e => {
                              try {
                                const bp = JSON.parse(e.target.value);
                                setSelectedHotel({...selectedHotel, settings: {...selectedHotel.settings, bookingPolicies: bp}});
                              } catch(e) {}
                            }}
                         />
                         <Button onClick={saveBookingPolicies} size="sm" className="bg-[#0F1B2D]">Save Policies</Button>
                      </div>

                      <div className="space-y-2 pt-4 border-t">
                         <h4 className="font-medium">Cancellation & Refund Policy</h4>
                         <textarea 
                            className="w-full p-3 bg-slate-50 border rounded-lg h-32 text-xs font-mono"
                            value={JSON.stringify(selectedHotel.cancellationPolicy || {}, null, 2)}
                            onChange={e => {
                              try {
                                const cp = JSON.parse(e.target.value);
                                setSelectedHotel({...selectedHotel, cancellationPolicy: cp});
                              } catch(e) {}
                            }}
                         />
                         <Button onClick={saveCancellationPolicy} size="sm" className="bg-[#0F1B2D]">Save Cancellation Policy</Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Team Access */}
                  <TabsContent value="admins" className="mt-0 space-y-4">
                    <div className="flex gap-2">
                      <Input placeholder="Team member email..." value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
                      <Button onClick={addAdmin} className="bg-[#0F1B2D]">Invite Admin</Button>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground mt-4">Authorized Administrators</h4>
                      <div className="divide-y border rounded-lg overflow-hidden">
                        {(selectedHotel.settings?.admins || []).map((email: string) => (
                          <div key={email} className="flex items-center justify-between p-3 bg-white">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">{email[0].toUpperCase()}</div>
                              <span className="text-sm font-medium">{email}</span>
                            </div>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Active</Badge>
                          </div>
                        ))}
                        {(selectedHotel.settings?.admins || []).length === 0 && (
                          <div className="p-4 text-center text-muted-foreground text-sm italic">No additional admins assigned.</div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Modules */}
                  <TabsContent value="modules" className="mt-0 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {['housekeeping', 'maintenance', 'payments', 'reports', 'analytics', 'loyalty'].map((m) => (
                        <Card key={m} className={cn("transition-colors", (selectedHotel.settings?.modulesEnabled || {})[m] ? "border-[#C9973A]/30 bg-[#C9973A]/5" : "")}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="capitalize font-medium">{m}</div>
                            <Switch 
                              checked={!!(selectedHotel.settings?.modulesEnabled || {})[m]} 
                              onCheckedChange={(checked) => {
                                setSelectedHotel({
                                  ...selectedHotel, 
                                  settings: {
                                    ...selectedHotel.settings, 
                                    modulesEnabled: {
                                      ...(selectedHotel.settings?.modulesEnabled || {}), 
                                      [m]: checked
                                    }
                                  }
                                });
                              }}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Button onClick={saveModules} className="bg-[#0F1B2D] w-full mt-4">Update Active Modules</Button>
                  </TabsContent>

                  {/* Audit Logs */}
                  <TabsContent value="audit" className="mt-0 space-y-4">
                    <div className="space-y-3">
                      {auditLogs.map((l) => (
                        <div key={l.id} className="p-3 border rounded-lg bg-slate-50/50 flex items-start gap-3">
                          <div className="mt-1 p-1 bg-white border rounded">
                             <Activity className="w-3 h-3 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground font-medium">{new Date(l.createdAt).toLocaleString()}</div>
                            <div className="text-sm"><span className="font-semibold">{l.actor}</span> {l.action}</div>
                          </div>
                        </div>
                      ))}
                      {auditLogs.length === 0 && (
                        <div className="py-10 text-center text-muted-foreground italic">No activity logs recorded yet.</div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Notifications */}
                  <TabsContent value="notifications" className="mt-0 space-y-4">
                     <h4 className="font-medium">Notification Settings</h4>
                     <p className="text-sm text-muted-foreground">Configure which events trigger email or SMS notifications.</p>
                     <textarea 
                        className="w-full p-3 bg-slate-50 border rounded-lg h-48 text-xs font-mono"
                        value={JSON.stringify(selectedHotel.settings?.notifications || {}, null, 2)}
                        onChange={e => {
                          try {
                            const nt = JSON.parse(e.target.value);
                            setSelectedHotel({...selectedHotel, settings: {...selectedHotel.settings, notifications: nt}});
                          } catch(e) {}
                        }}
                     />
                     <Button onClick={saveNotifications} className="bg-[#0F1B2D]">Save Preferences</Button>
                  </TabsContent>

                  {/* Payments */}
                  <TabsContent value="payments" className="mt-0 space-y-4">
                    <h4 className="font-medium">Payment Gateways & Methods</h4>
                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg flex gap-3 text-yellow-800 text-sm">
                      <CreditCard className="w-5 h-5 shrink-0" />
                      <p>Configure your payment processors (Stripe, PayPal, etc.) and accepted guest payment methods below.</p>
                    </div>
                    <textarea 
                        className="w-full p-3 bg-slate-50 border rounded-lg h-48 text-xs font-mono"
                        value={JSON.stringify(selectedHotel.paymentMethods || [], null, 2)}
                        onChange={e => {
                          try {
                            const pm = JSON.parse(e.target.value);
                            setSelectedHotel({...selectedHotel, paymentMethods: pm});
                          } catch(e) {}
                        }}
                     />
                     <Button onClick={savePaymentMethods} className="bg-[#0F1B2D]">Update Payment Config</Button>
                  </TabsContent>

                </div>
              </div>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
