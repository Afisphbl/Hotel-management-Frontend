import { HardDrive, Users, LayoutDashboard, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuotaUsageProps {
  infra: any;
  hasLiveInfra: boolean;
}

export function QuotaUsage({ infra, hasLiveInfra }: QuotaUsageProps) {
  return (
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
  );
}
