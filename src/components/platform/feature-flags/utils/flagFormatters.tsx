import React from "react";
import { CheckCircle2, XCircle, AlertCircle, Building2, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { FeatureFlag } from "./flagTypes";

const rolloutStrategyLabels: Record<string, string> = {
  full_rollout: "Full Rollout",
  percentage: "Percentage",
  user_based: "User Based",
  role_based: "Role Based",
  conditional: "Conditional",
  a_b_test: "A/B Test",
};

export function getStatusIcon(status: string): React.ReactElement {
  switch (status?.toLowerCase()) {
    case "enabled":
    case "active":
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    case "disabled":
    case "inactive":
      return <XCircle className="w-4 h-4 text-slate-400" />;
    case "scheduled":
      return <AlertCircle className="w-4 h-4 text-amber-500" />;
    default:
      return <AlertCircle className="w-4 h-4 text-slate-400" />;
  }
}

export function getScopeBadge(flag: FeatureFlag): React.ReactElement {
  if (flag.hotel) {
    return (
      <Badge
        variant="outline"
        className="bg-white border-slate-200 text-slate-600 font-bold text-[10px] uppercase gap-1"
      >
        <Building2 className="w-3 h-3" />
        Hotel
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="bg-blue-50 border-blue-200 text-blue-700 font-bold text-[10px] uppercase gap-1"
    >
      <Globe className="w-3 h-3" />
      Global
    </Badge>
  );
}

export function getStatusBadgeColor(status: string): string {
  switch (status?.toLowerCase()) {
    case "enabled":
      return "text-green-600";
    case "disabled":
      return "text-slate-400";
    case "scheduled":
      return "text-amber-500";
    default:
      return "text-slate-400";
  }
}

export function getRolloutBarColor(pct: number): string {
  if (pct >= 100) return "bg-green-500";
  if (pct >= 50) return "bg-[#C9973A]";
  return "bg-amber-400";
}

export function formatStrategy(strategy: string | null | undefined): string {
  if (!strategy || strategy === "full_rollout") return "Full Rollout";
  return rolloutStrategyLabels[strategy] || strategy;
}

export function formatStatus(status: string): string {
  return status ? status.charAt(0) + status.slice(1).toLowerCase() : "Unknown";
}
