
import { useParams } from '@tanstack/react-router';
import { useHotelUsageMetrics, useTenantInfrastructure } from '@/hooks/usePlatformData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  Activity, 
  Database, 
  Users, 
  Cpu, 
  Zap,
  Globe,
  HardDrive,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function HotelUsageMetrics() {
  const { id } = useParams({ from: '/auth/platform/hotels/$id' });
  const { data: metrics } = useHotelUsageMetrics(id);
  const { data: infra } = useTenantInfrastructure(id);

  const chartData = metrics?.bookings.map((val, i) => ({
    name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
    bookings: val,
    revenue: metrics.revenue[i]
  })) || [];

  if (!infra) return null;

  return (
    <div className="space-y-6">
      {/* Infrastructure Health Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border-none bg-white p-3 sm:p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Health</p>
              <p className="text-lg sm:text-2xl font-serif text-[#0F1B2D]">{infra.healthScore}%</p>
            </div>
            <div className="hidden xs:block p-1.5 sm:p-2 bg-green-50 rounded-lg text-green-600">
              <Activity className="w-4 h-4 sm:w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[98%]" />
          </div>
        </Card>

        <Card className="shadow-sm border-none bg-white p-3 sm:p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Uptime</p>
              <p className="text-lg sm:text-2xl font-serif text-[#0F1B2D]">{infra.uptime}</p>
            </div>
            <div className="hidden xs:block p-1.5 sm:p-2 bg-blue-50 rounded-lg text-blue-600">
              <Globe className="w-4 h-4 sm:w-5 h-5" />
            </div>
          </div>
          <p className="mt-2 text-[9px] text-green-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" /> operational
          </p>
        </Card>

        <Card className="shadow-sm border-none bg-white p-3 sm:p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Bandwidth</p>
              <p className="text-lg sm:text-2xl font-serif text-[#0F1B2D]">{infra.bandwidth}</p>
            </div>
            <div className="hidden xs:block p-1.5 sm:p-2 bg-amber-50 rounded-lg text-amber-600">
              <Zap className="w-4 h-4 sm:w-5 h-5" />
            </div>
          </div>
          <p className="mt-2 text-[9px] text-muted-foreground italic">Current billing</p>
        </Card>

        <Card className="shadow-sm border-none bg-white p-3 sm:p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">API Load</p>
              <p className="text-lg sm:text-2xl font-serif text-[#0F1B2D]">{infra.apiRequests}</p>
            </div>
            <div className="hidden xs:block p-1.5 sm:p-2 bg-purple-50 rounded-lg text-purple-600">
              <Cpu className="w-4 h-4 sm:w-5 h-5" />
            </div>
          </div>
          <p className="mt-2 text-[9px] text-muted-foreground italic">30d Total</p>
        </Card>
      </div>

      {/* Limit Tracking */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Tenant Quota Usage</CardTitle>
          <CardDescription>Track resource consumption against plan limits.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded text-slate-500"><HardDrive className="w-3.5 h-3.5" /></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Storage</span>
                </div>
                <span className="text-xs font-medium">{infra.storageUsed} / {infra.storageLimit} GB</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all", (infra.storageUsed / infra.storageLimit) > 0.8 ? "bg-red-500" : "bg-[#C9973A]")}
                  style={{ width: `${(infra.storageUsed / infra.storageLimit) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded text-slate-500"><Users className="w-3.5 h-3.5" /></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">User Slots</span>
                </div>
                <span className="text-xs font-medium">{infra.usersUsed} / {infra.userLimit}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#0F1B2D] transition-all"
                  style={{ width: `${(infra.usersUsed / infra.userLimit) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded text-slate-500"><LayoutDashboard className="w-3.5 h-3.5" /></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Rooms</span>
                </div>
                <span className="text-xs font-medium">{infra.roomsUsed} / {infra.roomLimit}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-400 transition-all"
                  style={{ width: `${(infra.roomsUsed / infra.roomLimit) * 100}%` }}
                />
              </div>
            </div>
          </div>
          {(infra.storageUsed / infra.storageLimit) > 0.8 && (
            <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-800 text-xs">
              <AlertTriangle className="w-4 h-4" />
              Tenant is nearing storage limit. Automatic uploads may be restricted soon.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Booking Volume</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBook" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9973A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C9973A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <RechartsTooltip />
                <Area type="monotone" dataKey="bookings" stroke="#C9973A" fillOpacity={1} fill="url(#colorBook)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Revenue Contribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <RechartsTooltip />
                <Bar dataKey="revenue" fill="#0F1B2D" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { LayoutDashboard } from 'lucide-react';
