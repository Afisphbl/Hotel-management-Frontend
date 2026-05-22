import { useParams } from '@tanstack/react-router';
import { useHotelUsageMetrics, useTenantInfrastructure } from '@/hooks/usePlatformData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Database as DatabaseIcon, 
  Users, 
  Cpu, 
  Zap,
  Globe,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  LayoutDashboard,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

function ComingSoonPlaceholder({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 h-full min-h-[300px]">
      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 border border-slate-100">
        <Clock className="w-6 h-6 text-[#C9973A] animate-pulse" />
      </div>
      <h3 className="text-sm font-bold text-[#0F1B2D] uppercase tracking-widest">{title}</h3>
      <p className="text-xs text-slate-400 mt-2 max-w-[200px] leading-relaxed">
        {description}
      </p>
      <div className="mt-4 px-3 py-1 bg-slate-100 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
        In Development
      </div>
    </div>
  );
}

export function HotelUsageMetrics() {
  const { id } = useParams({ from: '/auth/platform/hotels/$id' });
  const { data: metrics, isLoading: metricsLoading, isError: metricsError } = useHotelUsageMetrics(id);
  const { data: infra, isLoading: infraLoading, isError: infraError, refetch } = useTenantInfrastructure(id);

  // Check if we have real live data from backend or just the fallback/empty state
  const hasLiveMetrics = metrics && metrics.bookings && metrics.bookings.length > 0;
  const hasLiveInfra = infra && (infra.storageUsed !== null || infra.roomsUsed !== null);

  const chartData = hasLiveMetrics ? metrics.bookings.map((val: number, i: number) => ({
    name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i] || `M${i + 1}`,
    bookings: val,
    revenue: metrics.revenue?.[i] ?? 0
  })) : [];

  if (infraLoading || metricsLoading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-sm border-none bg-white p-4">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-7 w-20" />
          </Card>
        ))}
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );

  if (infraError || metricsError) return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl shadow-sm border border-slate-100">
      <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
      <h3 className="text-lg font-serif text-slate-500">Infrastructure Connection Error</h3>
      <p className="text-sm text-slate-400 mt-1 max-w-xs">We couldn't reach the infrastructure monitoring service for this tenant.</p>
      <Button variant="outline" size="sm" className="mt-6" onClick={() => refetch()}>Retry Connection</Button>
    </div>
  );

  if (!infra) return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-dashed">
      <DatabaseIcon className="w-10 h-10 text-slate-200 mb-3" />
      <h3 className="text-lg font-serif text-slate-400">Usage Analytics Unavailable</h3>
      <p className="text-xs text-slate-300 mt-1">Real-time infrastructure tracking will be implemented soon for this property.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Infrastructure Health Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border-none bg-white p-3 sm:p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Health</p>
              <p className="text-lg sm:text-2xl font-serif text-[#0F1B2D]">
                {infra.healthScore != null ? `${infra.healthScore}%` : <span className="text-xs text-slate-300 italic">No data</span>}
              </p>
            </div>
            <div className="hidden xs:block p-1.5 sm:p-2 bg-green-50 rounded-lg text-green-600">
              <Activity className="w-4 h-4 sm:w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${infra.healthScore || 0}%` }} />
          </div>
        </Card>

        <Card className="shadow-sm border-none bg-white p-3 sm:p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Uptime</p>
              <p className="text-lg sm:text-2xl font-serif text-[#0F1B2D]">
                {infra.uptime || <span className="text-xs text-slate-300 italic">No data</span>}
              </p>
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
              <p className="text-lg sm:text-2xl font-serif text-[#0F1B2D]">
                {infra.bandwidth || <span className="text-xs text-slate-300 italic">No data</span>}
              </p>
            </div>
            <div className="hidden xs:block p-1.5 sm:p-2 bg-amber-50 rounded-lg text-amber-600">
              <Zap className="w-4 h-4 sm:w-5 h-5" />
            </div>
          </div>
          <p className="mt-2 text-[9px] text-muted-foreground italic">Platform egress</p>
        </Card>

        <Card className="shadow-sm border-none bg-white p-3 sm:p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">API Load</p>
              <p className="text-lg sm:text-2xl font-serif text-[#0F1B2D]">
                {infra.apiRequests || <span className="text-xs text-slate-300 italic">No data</span>}
              </p>
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
          <CardDescription>Real-time resource consumption against assigned plan limits.</CardDescription>
        </CardHeader>
        <CardContent>
          {hasLiveInfra ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 rounded text-slate-500"><HardDrive className="w-3.5 h-3.5" /></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Storage</span>
                  </div>
                  {infra.storageUsed != null ? (
                    <span className="text-xs font-medium">{infra.storageUsed.toFixed(2)} / {infra.storageLimit} GB</span>
                  ) : (
                    <span className="text-xs text-slate-300 italic">Implemented soon</span>
                  )}
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all", 
                      infra.storageUsed && (infra.storageUsed / infra.storageLimit) > 0.8 ? "bg-red-500" : "bg-[#C9973A]"
                    )}
                    style={{ width: infra.storageUsed ? `${(infra.storageUsed / infra.storageLimit) * 100}%` : '0%' }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 rounded text-slate-500"><Users className="w-3.5 h-3.5" /></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">User Slots</span>
                  </div>
                  {infra.usersUsed != null ? (
                    <span className="text-xs font-medium">{infra.usersUsed} / {infra.userLimit}</span>
                  ) : (
                    <span className="text-xs text-slate-300 italic">Implemented soon</span>
                  )}
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#0F1B2D] transition-all"
                    style={{ width: infra.usersUsed ? `${(infra.usersUsed / infra.userLimit) * 100}%` : '0%' }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 rounded text-slate-500"><LayoutDashboard className="w-3.5 h-3.5" /></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Rooms</span>
                  </div>
                  {infra.roomsUsed != null ? (
                    <span className="text-xs font-medium">{infra.roomsUsed} / {infra.roomLimit}</span>
                  ) : (
                    <span className="text-xs text-slate-300 italic">Implemented soon</span>
                  )}
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-400 transition-all"
                    style={{ width: infra.roomsUsed ? `${(infra.roomsUsed / infra.roomLimit) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6">
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-100 text-xs font-medium">
                <AlertTriangle className="w-4 h-4" />
                Live quota tracking is being implemented for this tenant's isolated database.
              </div>
            </div>
          )}
          
          {infra.storageUsed != null && (infra.storageUsed / infra.storageLimit) > 0.8 && (
            <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-800 text-xs">
              <AlertTriangle className="w-4 h-4" />
              Tenant is nearing storage limit. Automatic uploads may be restricted soon.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Booking Volume</CardTitle>
            <CardDescription>Historical booking activity for the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {hasLiveMetrics ? (
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
            ) : (
              <ComingSoonPlaceholder 
                title="Historical Analytics" 
                description="Aggregated booking patterns and historical performance metrics will be implemented soon." 
              />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Revenue Contribution</CardTitle>
            <CardDescription>Monthly revenue generated by this property.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {hasLiveMetrics ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                  <RechartsTooltip />
                  <Bar dataKey="revenue" fill="#0F1B2D" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ComingSoonPlaceholder 
                title="Revenue Tracking" 
                description="Live revenue stream monitoring and financial forecasting will be implemented soon." 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
