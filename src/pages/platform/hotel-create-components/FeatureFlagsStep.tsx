import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StepProps } from "./types";

const FEATURES = [
  {
    id: "housekeeping",
    name: "Housekeeping Module",
    desc: "Real-time room status tracking & cleaning assignments.",
  },
  {
    id: "maintenance",
    name: "Maintenance & Tickets",
    desc: "Preventative and reactive maintenance management.",
  },
  {
    id: "analytics",
    name: "Advanced Business Analytics",
    desc: "Financial reporting, occupancy forecasts, and charts.",
  },
  {
    id: "pos",
    name: "POS Integration",
    desc: "Direct connections with global point-of-sale restaurant APIs.",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Notifications",
    desc: "Automated guest reservation confirmation & communication.",
  },
  {
    id: "guest-portal",
    name: "Guest Self-Service Portal",
    desc: "Mobile-first web check-in, housekeeping requests, and keyless access.",
  },
];

export function FeatureFlagsStep({ data, onChange }: StepProps) {
  return (
    <div className='space-y-6 animate-fade-in'>
      <p className='text-sm text-muted-foreground'>
        Select which modules and capabilities should be enabled for this tenant
        environment.
      </p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {FEATURES.map((f) => {
          const isEnabled = data.features.includes(f.id);
          return (
            <div
              key={f.id}
              className={cn(
                "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 bg-white",
                isEnabled
                  ? "border-[#C9973A] bg-[#C9973A]/5 shadow-sm"
                  : "border-slate-100 hover:border-slate-200",
              )}
              onClick={() => {
                const newFeatures = isEnabled
                  ? data.features.filter((id) => id !== f.id)
                  : [...data.features, f.id];
                onChange("features", newFeatures);
              }}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5",
                  isEnabled
                    ? "border-[#C9973A] bg-[#C9973A] text-white"
                    : "border-slate-300",
                )}
              >
                {isEnabled && <Check className='w-3.5 h-3.5 stroke-[3]' />}
              </div>
              <div className='space-y-1'>
                <h4 className='font-bold text-sm text-[#0F1B2D]'>{f.name}</h4>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  {f.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
