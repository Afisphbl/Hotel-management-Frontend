import { Database as DatabaseIcon } from "lucide-react";

export function UsageMetricsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-dashed">
      <DatabaseIcon className="w-10 h-10 text-slate-200 mb-3" />
      <h3 className="text-lg font-serif text-slate-400">Usage Analytics Unavailable</h3>
      <p className="text-xs text-slate-300 mt-1">Real-time infrastructure tracking will be implemented soon for this property.</p>
    </div>
  );
}
