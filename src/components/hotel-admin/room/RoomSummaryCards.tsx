import { Card, CardContent } from "@/components/ui/card";
import { Bed, CheckCircle, Lock, Wrench, AlertTriangle, X, type LucideIcon } from "lucide-react";

type SummaryKey = "total" | "available" | "occupied" | "dirty" | "maintenance" | "out_of_order";

const CARDS: { label: string; key: SummaryKey; icon: LucideIcon; color: string }[] = [
  { label: "Total", key: "total", icon: Bed, color: "text-blue-600" },
  { label: "Available", key: "available", icon: CheckCircle, color: "text-green-600" },
  { label: "Occupied", key: "occupied", icon: Lock, color: "text-blue-600" },
  { label: "Dirty", key: "dirty", icon: AlertTriangle, color: "text-yellow-600" },
  { label: "Maintenance", key: "maintenance", icon: Wrench, color: "text-orange-600" },
  { label: "Out of Order", key: "out_of_order", icon: X, color: "text-red-600" },
];

export function RoomSummaryCards({ summary }: { summary: Partial<Record<SummaryKey, number>> }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {CARDS.map((card) => (
        <Card key={card.key} className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">{card.label}</p>
                <h3 className={`text-2xl font-bold ${card.color} mt-1`}>{summary[card.key] ?? 0}</h3>
              </div>
              <card.icon className={`w-10 h-10 ${card.color} opacity-20`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
