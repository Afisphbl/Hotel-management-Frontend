import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ASSETS = [
  { label: "Favicon",          status: "Active",        active: true },
  { label: "Email Header",     status: "Using Default", active: false },
  { label: "Invoice Branding", status: "Active",        active: true },
] as const;

/**
 * Static card listing system asset statuses (Favicon, Email Header, Invoice Branding).
 * No props — data is display-only and not yet driven by the API.
 */
export function BrandingSystemAssets() {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="font-serif text-lg">System Assets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-xs font-medium">
        {ASSETS.map(({ label, status, active }, i) => (
          <div
            key={label}
            className={`flex justify-between items-center py-2 ${i < ASSETS.length - 1 ? "border-b" : ""}`}
          >
            <span className="text-muted-foreground uppercase tracking-widest text-[9px] font-bold">
              {label}
            </span>
            <Badge
              variant="outline"
              className={
                active
                  ? "bg-green-50 text-green-600 border-none"
                  : "bg-slate-100 text-slate-500 border-none"
              }
            >
              {status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
