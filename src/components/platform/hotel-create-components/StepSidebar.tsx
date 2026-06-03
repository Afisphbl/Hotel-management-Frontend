import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  icon: LucideIcon;
}

interface StepSidebarProps {
  steps: Step[];
  currentStep: number;
}

export function StepSidebar({ steps, currentStep }: StepSidebarProps) {
  return (
    <div className='space-y-2'>
      {steps.map((step, idx) => (
        <div
          key={step.id}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg text-sm transition-colors",
            idx === currentStep
              ? "bg-[#0F1B2D] text-white"
              : idx < currentStep
                ? "text-green-600 bg-green-50"
                : "text-muted-foreground",
          )}
        >
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-[10px] border",
              idx === currentStep
                ? "bg-[#C9973A] border-[#C9973A]"
                : idx < currentStep
                  ? "bg-green-600 border-green-600 text-white"
                  : "border-muted",
            )}
          >
            {idx < currentStep ? <Check className='w-3 h-3' /> : idx + 1}
          </div>
          <span className='font-medium'>{step.title}</span>
        </div>
      ))}
    </div>
  );
}
