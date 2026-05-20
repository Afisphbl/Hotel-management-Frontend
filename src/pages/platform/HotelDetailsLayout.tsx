
import { Link, Outlet, useParams, useLocation } from '@tanstack/react-router';
import { usePlatformHotel } from '@/hooks/usePlatformData';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  BarChart3, 
  FileText, 
  History, 
  Lock, 
  Settings,
  RefreshCw,
  LayoutDashboard,
  Globe,
  Palette,
  Database
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function HotelDetailsLayout() {
  const { id } = useParams({ from: '/auth/platform/hotels/$id' });
  const { data: hotel, isLoading } = usePlatformHotel(id);
  const location = useLocation();

  if (isLoading) return <div className="p-8"><Skeleton className="h-12 w-full mb-4" /><Skeleton className="h-64 w-full" /></div>;
  if (!hotel) return (
    <div className="p-8 flex flex-col items-center justify-center py-16 text-center">
      <Database className="w-10 h-10 text-slate-300 mb-3" />
      <h3 className="text-lg font-serif text-slate-400">Hotel not found</h3>
      <p className="text-xs text-slate-300 mt-1">This hotel section has no database or data</p>
    </div>
  );

  const tabs = [
    { id: '', label: 'Overview', icon: LayoutDashboard },
    { id: 'domains', label: 'Domains & Access', icon: Globe },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'features', label: 'Feature Flags', icon: ShieldCheck },
    { id: 'metrics', label: 'Usage', icon: BarChart3 },
    { id: 'audit-logs', label: 'Audit Logs', icon: History },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/platform/hotels">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D] flex items-center gap-3">
              {hotel.name || <span className="text-slate-300 italic">Unnamed Property</span>}
              {hotel.status ? <StatusBadge status={hotel.status} /> : null}
            </h1>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>ID: <span className="font-mono">{hotel.id}</span></span>
              {hotel.name && (
                <span className="hidden sm:inline">Subdomain: <span className="font-medium">{hotel.name.toLowerCase().replace(/ /g, '-')}.pms.cloud</span></span>
              )}
            </div>
          </div>
        </div>
        <div className="sm:ml-auto flex gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none gap-2">
            <RefreshCw className="w-4 h-4" /> Sync
          </Button>
          <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            Impersonate
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b flex items-center gap-8 px-1 overflow-x-auto no-scrollbar whitespace-nowrap">
        {tabs.map(tab => {
          const path = `/platform/hotels/${id}${tab.id ? `/${tab.id}` : ''}`;
          const isActive = location.pathname === path;
          
          return (
            <Link 
              key={tab.id}
              to={path}
              className={cn(
                "py-3 text-sm flex items-center gap-2 border-b-2 transition-all",
                isActive ? "border-[#C9973A] text-[#0F1B2D] font-bold" : "border-transparent text-muted-foreground hover:text-slate-600"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Content */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}
