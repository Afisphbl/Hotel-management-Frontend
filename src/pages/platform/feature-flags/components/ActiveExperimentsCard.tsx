import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical } from "lucide-react";
import { formatStrategy, formatStatus } from "../utils/flagFormatters";
import type { FeatureFlag } from "../utils/flagTypes";

interface ActiveExperimentsCardProps {
  experiments: FeatureFlag[];
}

export function ActiveExperimentsCard({ experiments }: ActiveExperimentsCardProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="font-serif text-lg flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-blue-500" />
          Active Experiments
        </CardTitle>
        <CardDescription>
          Currently running A/B tests across the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {experiments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FlaskConical className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No active A/B test experiments.</p>
            <p className="text-xs text-slate-400 mt-1">
              Create a flag with "A/B Test" rollout strategy to start one.
            </p>
          </div>
        ) : (
          experiments.map((exp) => (
            <div
              key={exp.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">{exp.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {exp.variants?.length
                      ? `${exp.variants.length} variants • `
                      : ""}
                    Strategy: {formatStrategy(exp.rolloutStrategy)}
                  </p>
                </div>
              </div>
              <Badge className="bg-blue-600">
                {exp.status === "ENABLED" ? "A/B Test" : formatStatus(exp.status)}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
