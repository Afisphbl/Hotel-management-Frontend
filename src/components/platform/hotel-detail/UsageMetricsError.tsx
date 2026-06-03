import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UsageMetricsErrorProps {
  onRetry: () => void;
}

export function UsageMetricsError({ onRetry }: UsageMetricsErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl shadow-sm border border-slate-100">
      <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
      <h3 className="text-lg font-serif text-slate-500">Infrastructure Connection Error</h3>
      <p className="text-sm text-slate-400 mt-1 max-w-xs">We couldn't reach the infrastructure monitoring service for this tenant.</p>
      <Button variant="outline" size="sm" className="mt-6" onClick={onRetry}>Retry Connection</Button>
    </div>
  );
}
