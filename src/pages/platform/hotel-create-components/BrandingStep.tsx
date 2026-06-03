import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StepProps } from "./types";

const PRIMARY_PRESETS = ["#0F1B2D", "#4A0E17", "#0E4A28", "#1C1C1C", "#0B4F54"];
const ACCENT_PRESETS = ["#C9973A", "#94A3B8", "#E29B85", "#E6C594", "#CD7F32"];

export function BrandingStep({ data, onChange }: StepProps) {
  return (
    <div className='space-y-6 animate-fade-in'>
      <p className='text-sm text-muted-foreground'>
        Customize the primary visual styles for the hotel's admin dashboard and
        guest applications.
      </p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-3 p-4 border border-slate-100 rounded-xl bg-white'>
          <Label className='font-bold text-slate-800'>Primary Theme Color</Label>
          <div className='flex gap-2'>
            <Input
              type='color'
              value={data.primaryColor}
              onChange={(e) => onChange("primaryColor", e.target.value)}
              className='w-12 h-10 p-0.5 border cursor-pointer rounded-lg overflow-hidden'
            />
            <Input
              type='text'
              value={data.primaryColor}
              onChange={(e) => onChange("primaryColor", e.target.value)}
              className='font-mono text-sm h-10'
            />
          </div>
          <div className='flex flex-wrap gap-2 mt-2'>
            {PRIMARY_PRESETS.map((color) => (
              <div
                key={color}
                onClick={() => onChange("primaryColor", color)}
                style={{ backgroundColor: color }}
                className={cn(
                  "w-7 h-7 rounded-full cursor-pointer border-2 transition-all hover:scale-110",
                  data.primaryColor === color
                    ? "border-[#C9973A]"
                    : "border-transparent",
                )}
              />
            ))}
          </div>
        </div>

        <div className='space-y-3 p-4 border border-slate-100 rounded-xl bg-white'>
          <Label className='font-bold text-slate-800'>Accent Color</Label>
          <div className='flex gap-2'>
            <Input
              type='color'
              value={data.accentColor}
              onChange={(e) => onChange("accentColor", e.target.value)}
              className='w-12 h-10 p-0.5 border cursor-pointer rounded-lg overflow-hidden'
            />
            <Input
              type='text'
              value={data.accentColor}
              onChange={(e) => onChange("accentColor", e.target.value)}
              className='font-mono text-sm h-10'
            />
          </div>
          <div className='flex flex-wrap gap-2 mt-2'>
            {ACCENT_PRESETS.map((color) => (
              <div
                key={color}
                onClick={() => onChange("accentColor", color)}
                style={{ backgroundColor: color }}
                className={cn(
                  "w-7 h-7 rounded-full cursor-pointer border-2 transition-all hover:scale-110",
                  data.accentColor === color
                    ? "border-[#C9973A]"
                    : "border-transparent",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className='p-5 border rounded-xl bg-slate-50 space-y-3 mt-4'>
        <h4 className='font-bold text-[10px] uppercase text-muted-foreground tracking-wider'>
          Live Preview
        </h4>
        <div className='border border-slate-200 rounded-xl bg-white p-4 shadow-sm flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div
              style={{ backgroundColor: data.primaryColor }}
              className='w-10 h-10 rounded-lg flex items-center justify-center text-white font-serif font-black text-lg shadow-sm'
            >
              {data.name ? data.name.charAt(0).toUpperCase() : "H"}
            </div>
            <div>
              <div className='font-bold text-sm text-[#0F1B2D]'>
                {data.name || "Grand Peninsula"}
              </div>
              <div className='text-[10px] text-muted-foreground flex items-center gap-1 font-mono uppercase'>
                <Globe className='w-2.5 h-2.5' />
                {data.code
                  ? data.code.toLowerCase().replace(/[^a-z0-9]/g, "")
                  : "gp"}
                .hotels.pms.cloud
              </div>
            </div>
          </div>
          <Button
            size='sm'
            style={{
              backgroundColor: data.accentColor,
              color: "#ffffff",
            }}
            className='hover:opacity-90 font-medium transition-all shadow-sm'
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
