import { Button } from "@/components/ui/button";
import { FileDown, Plus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function HotelsHeader() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Tenants</h1>
        <p className="text-sm text-muted-foreground">Properties & subscriptions.</p>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button variant="outline" className="flex-1 sm:flex-none gap-2 border-slate-200">
          <FileDown className="w-4 h-4" /> Export
        </Button>
        <Button
          className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a] gap-2"
          onClick={() => navigate({ to: "/platform/hotels/create" })}
        >
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>
    </div>
  );
}
