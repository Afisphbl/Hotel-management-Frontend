import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gauge } from "lucide-react";
import { getRolloutBarColor } from "../utils/flagFormatters";
import type { RolloutItem } from "../utils/flagTypes";

interface RolloutStatusCardProps {
  rolloutItems: RolloutItem[];
}

export function RolloutStatusCard({ rolloutItems }: RolloutStatusCardProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="font-serif text-lg flex items-center gap-2">
          <Gauge className="w-4 h-4 text-[#C9973A]" />
          Global Rollout Status
        </CardTitle>
        <CardDescription>Rollout progress across all hotels.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {rolloutItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Gauge className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No rollout data available.</p>
            <p className="text-xs text-slate-400 mt-1">
              Enable feature flags to see their rollout status here.
            </p>
          </div>
        ) : (
          rolloutItems.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span className="font-bold uppercase tracking-widest">
                  {item.name}
                </span>
                <span className="font-bold text-[#0F1B2D]">
                  {item.percentage}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getRolloutBarColor(item.percentage)} transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
