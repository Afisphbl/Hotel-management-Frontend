import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Search,
  Bell,
  User,
  Menu,
  MoreVertical,
} from "lucide-react";

interface BrandingPreviewMockAppProps {
  primaryColor: string;
  accentColor: string;
  logoUrl: string | null | undefined;
  device: "desktop" | "mobile";
}

const STAT_CARDS = [
  { label: "Total Arrivals",  val: "24" },
  { label: "Available Rooms", val: "12" },
  { label: "Maintenance",     val: "3" },
] as const;

/**
 * Purely presentational mock app UI rendered inside the branding preview frame.
 * Zero state, zero side-effects — re-renders whenever brand colors / logo change.
 */
export function BrandingPreviewMockApp({
  primaryColor,
  accentColor,
  logoUrl,
  device,
}: BrandingPreviewMockAppProps) {
  return (
    <div className="absolute inset-0 bg-[#F8F7F4] flex">
      {/* Sidebar — desktop only */}
      {device === "desktop" && (
        <div className="w-16 bg-[#0F1B2D] flex flex-col items-center py-6 gap-6 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-white/60" />
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white/60" />
          </div>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: accentColor }}
          >
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Settings className="w-4 h-4 text-white/60" />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div
          className="h-14 bg-white border-b px-4 flex items-center justify-between shrink-0"
          style={{ borderTop: `3px solid ${accentColor}` }}
        >
          <div className="flex items-center gap-3">
            {device === "mobile" && (
              <Menu className="w-5 h-5 text-slate-400" />
            )}
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-5 w-auto" />
            ) : (
              <div className="w-5 h-5 rounded bg-slate-200" />
            )}
            <span
              className="font-bold text-sm hidden sm:inline"
              style={{ color: primaryColor }}
            >
              PMS
            </span>
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

        {/* Content area */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto bg-[#F8F7F4]">
          {/* Page heading */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-xl font-serif text-[#0F1B2D]">
                Guest Management
              </h4>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                Front Desk Operations
              </p>
            </div>
            <Button
              size="sm"
              className="h-8 text-[10px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: primaryColor }}
            >
              + New Check-in
            </Button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {STAT_CARDS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl shadow-sm border p-4 flex flex-col gap-1"
              >
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">
                  {stat.label}
                </p>
                <p
                  className="text-xl font-serif"
                  style={{ color: primaryColor }}
                >
                  {stat.val}
                </p>
              </div>
            ))}
          </div>

          {/* Mock booking list */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-3 border-b bg-slate-50 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                Recent Bookings
              </span>
              <MoreVertical className="w-3 h-3 text-slate-300" />
            </div>
            <div className="divide-y">
              {[1, 2, 3].map((i) => (
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
  );
}
