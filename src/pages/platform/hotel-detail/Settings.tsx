import { useParams } from "@tanstack/react-router";
import {
  usePlatformHotel,
  useUpdatePlatformHotel,
} from "@/hooks/usePlatformData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Server,
  Globe,
  Clock,
  CheckCircle2,
  UserCog,
  AlertTriangle,
  Archive,
  Trash2,
  Database,
} from "lucide-react";

export function HotelSettings() {
  const { id } = useParams({ from: "/auth/platform/hotels/$id" });
  const { data: hotel } = usePlatformHotel(id);
  const updateMutation = useUpdatePlatformHotel();
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (hotel) setFormData({ ...hotel });
  }, [hotel]);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id, data: formData });
      toast.success("Tenant infrastructure updated");
    } catch (err) {
      toast.error("Failed to update tenant");
    }
  };

  const startImpersonation = () => {
    toast.info("Starting secure impersonation session...", {
      description: "You will be logged in as the primary hotel owner.",
    });
  };

  if (!formData) return null;

  return (
    <div className='space-y-6'>
      {/* Impersonation Banner Placeholder */}
      <div className='p-4 bg-[#0F1B2D] text-white rounded-xl flex items-center justify-between shadow-lg'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-white/10 flex items-center justify-center'>
            <UserCog className='w-5 h-5 text-[#C9973A]' />
          </div>
          <div>
            <p className='font-bold text-sm'>Tenant Impersonation Mode</p>
            <p className='text-[10px] text-slate-300 uppercase font-bold tracking-widest'>
              Super Admin Capability
            </p>
          </div>
        </div>
        <Button
          variant='secondary'
          size='sm'
          className='bg-[#C9973A] hover:bg-[#b08432] text-white border-none font-bold'
          onClick={startImpersonation}
        >
          Enter Tenant Workspace
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='shadow-sm border-none bg-white'>
          <CardHeader>
            <CardTitle className='font-serif text-xl flex items-center gap-2'>
              <Server className='w-5 h-5 text-[#C9973A]' />
              Environment & Placement
            </CardTitle>
            <CardDescription>
              Configuration for this tenant's runtime environment.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {formData.environment != null ? (
              <div className='space-y-2'>
                <Label>Release Channel (Environment)</Label>
                <Select
                  value={formData.environment}
                  onValueChange={(val) =>
                    setFormData({ ...formData, environment: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='production'>
                      Production (Stable)
                    </SelectItem>
                    <SelectItem value='staging'>Staging (Beta)</SelectItem>
                    <SelectItem value='sandbox'>
                      Sandbox (Testing Only)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className='flex items-center gap-2 p-3 border border-dashed border-slate-200 rounded-lg bg-slate-50/50'>
                <Database className='w-4 h-4 text-slate-300' />
                <p className='text-xs text-slate-400 italic'>
                  No environment data in database
                </p>
              </div>
            )}
            {formData.region != null ? (
              <div className='space-y-2'>
                <Label>Cloud Region</Label>
                <Select
                  value={formData.region}
                  onValueChange={(val) =>
                    setFormData({ ...formData, region: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='europe-west'>
                      Europe West (Ireland)
                    </SelectItem>
                    <SelectItem value='us-east'>
                      US East (N. Virginia)
                    </SelectItem>
                    <SelectItem value='asia-south'>
                      Asia South (Mumbai)
                    </SelectItem>
                    <SelectItem value='africa-east'>
                      Africa East (Kenya)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className='flex items-center gap-2 p-3 border border-dashed border-slate-200 rounded-lg bg-slate-50/50'>
                <Database className='w-4 h-4 text-slate-300' />
                <p className='text-xs text-slate-400 italic'>
                  No region data in database
                </p>
              </div>
            )}
            <div className='pt-4 flex justify-end'>
              <Button
                className='bg-[#0F1B2D] hover:bg-[#1a2a3a] gap-2'
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Save className='w-4 h-4' />
                )}
                Sync Configuration
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-sm border-none bg-white'>
          <CardHeader>
            <CardTitle className='font-serif text-xl flex items-center gap-2'>
              <Globe className='w-5 h-5 text-[#C9973A]' />
              Localization & Standards
            </CardTitle>
            <CardDescription>
              Tenant-specific regional settings.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid grid-cols-2 gap-4'>
              {formData.timezone != null ? (
                <div className='space-y-2'>
                  <Label>System Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(val) =>
                      setFormData({ ...formData, timezone: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='UTC'>UTC (Default)</SelectItem>
                      <SelectItem value='GMT'>GMT</SelectItem>
                      <SelectItem value='EST'>EST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className='space-y-2'>
                  <Label>System Timezone</Label>
                  <div className='flex items-center gap-2 p-3 border border-dashed border-slate-200 rounded-lg bg-slate-50/50'>
                    <Database className='w-4 h-4 text-slate-300' />
                    <p className='text-xs text-slate-400 italic'>
                      No timezone in database
                    </p>
                  </div>
                </div>
              )}
              {formData.currency != null ? (
                <div className='space-y-2'>
                  <Label>Base Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(val) =>
                      setFormData({ ...formData, currency: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='ETB'>ETB (Br)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className='space-y-2'>
                  <Label>Base Currency</Label>
                  <div className='flex items-center gap-2 p-3 border border-dashed border-slate-200 rounded-lg bg-slate-50/50'>
                    <Database className='w-4 h-4 text-slate-300' />
                    <p className='text-xs text-slate-400 italic'>
                      No currency in database
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className='space-y-2'>
              <Label>Default Language</Label>
              <Select defaultValue='en'>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='en'>English (UK)</SelectItem>
                  <SelectItem value='fr'>French</SelectItem>
                  <SelectItem value='de'>German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='shadow-sm border-none bg-white border-red-100 bg-red-50/10'>
        <CardHeader>
          <CardTitle className='font-serif text-xl text-red-800'>
            Tenant Lifecycle Management
          </CardTitle>
          <CardDescription>
            Controlled destruction and archival of this tenant workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between p-4 border border-red-200 rounded-xl bg-white'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-amber-50 rounded text-amber-600'>
                <AlertTriangle className='w-5 h-5' />
              </div>
              <div>
                <p className='font-bold text-slate-900'>Suspend Access</p>
                <p className='text-xs text-muted-foreground'>
                  Immediately revoke all user access while preserving data.
                </p>
              </div>
            </div>
            <Button
              variant='outline'
              className='border-amber-200 text-amber-700 hover:bg-amber-50'
            >
              Suspend
            </Button>
          </div>

          <div className='flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-slate-50 rounded text-slate-600'>
                <Archive className='w-5 h-5' />
              </div>
              <div>
                <p className='font-bold text-slate-900'>Archive Tenant</p>
                <p className='text-xs text-muted-foreground'>
                  Mark as inactive and offboard. Data retained for 90 days.
                </p>
              </div>
            </div>
            <Button variant='outline'>Archive</Button>
          </div>

          <div className='flex items-center justify-between p-4 border border-red-200 rounded-xl bg-red-50'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-red-100 rounded text-red-600'>
                <Trash2 className='w-5 h-5' />
              </div>
              <div>
                <p className='font-bold text-red-900'>Permanent Termination</p>
                <p className='text-xs text-red-700'>
                  Wipe all databases, assets, and configurations permanently.
                </p>
              </div>
            </div>
            <Button variant='destructive'>Purge Tenant Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
