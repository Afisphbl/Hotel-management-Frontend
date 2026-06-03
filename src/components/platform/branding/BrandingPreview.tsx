import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandingPreviewMockApp } from "./BrandingPreviewMockApp";

interface BrandingPreviewProps {
  primaryColor: string;
  accentColor: string;
  logoUrl: string | null | undefined;
}

/**
 * Preview shell: owns the desktop/mobile toggle state, renders the device frame,
 * and passes brand values down into <BrandingPreviewMockApp>.
 * previewDevice state lives here — the page doesn't need to know about it.
 */
export function BrandingPreview({
  primaryColor,
  accentColor,
  logoUrl,
}: BrandingPreviewProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="space-y-4">
      {/* Section heading + device toggle */}
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg">Isolation Preview</h3>
        <div className="flex bg-slate-100 rounded-lg p-1">
          <Button
            variant={device === "desktop" ? "outline" : "ghost"}
            size="sm"
            className={cn(
              "h-8 px-3 transition-all",
              device === "desktop" && "bg-white shadow-sm",
            )}
            onClick={() => setDevice("desktop")}
          >
            <Monitor className="w-4 h-4 mr-2" /> Desktop
          </Button>
          <Button
            variant={device === "mobile" ? "outline" : "ghost"}
            size="sm"
            className={cn(
              "h-8 px-3 transition-all",
              device === "mobile" && "bg-white shadow-sm",
            )}
            onClick={() => setDevice("mobile")}
          >
            <Smartphone className="w-4 h-4 mr-2" /> Mobile
          </Button>
        </div>
      </div>

      {/* Device frame */}
      <div
        className={cn(
          "bg-slate-900 rounded-[2rem] border-8 border-slate-800 shadow-2xl transition-all overflow-hidden relative mx-auto",
          device === "desktop" ? "w-full aspect-[4/3]" : "w-[280px] aspect-[9/19]",
        )}
      >
        <BrandingPreviewMockApp
          primaryColor={primaryColor}
          accentColor={accentColor}
          logoUrl={logoUrl}
          device={device}
        />
      </div>

      <p className="text-center text-xs text-muted-foreground italic">
        This is a simulated preview of the tenant's actual operational environment.
      </p>
    </div>
  );
}
