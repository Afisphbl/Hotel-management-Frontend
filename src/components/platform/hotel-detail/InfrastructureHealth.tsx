import { Activity, Globe, Zap, Cpu, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface InfrastructureHealthProps {
  infra: any;
}

export function InfrastructureHealth({ infra }: InfrastructureHealthProps) {
  return (
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
  );
}
