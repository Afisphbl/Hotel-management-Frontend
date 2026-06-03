import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, Wrench, type LucideIcon } from "lucide-react";
import type { MaintenanceStats } from "./types";

const CARDS: { label: string; key: keyof MaintenanceStats; icon: LucideIcon; color: string }[] = [
  { label: "Total Tickets", key: "total", icon: Wrench, color: "text-blue-600" },
  { label: "Open / Assigned", key: "open", icon: AlertCircle, color: "text-red-600" },
  { label: "In Progress", key: "inProgress", icon: Clock, color: "text-orange-600" },
  { label: "Completed", key: "completed", icon: CheckCircle, color: "text-green-600" },
];

export function MaintenanceStatsCards({ stats }: { stats: MaintenanceStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {CARDS.map((card) => (
        <Card key={card.label} className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">{card.label}</p>
                <h3 className={`text-2xl font-bold ${card.color} mt-1`}>{stats[card.key]}</h3>
              </div>
              <card.icon className={`w-12 h-12 ${card.color} opacity-20`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
