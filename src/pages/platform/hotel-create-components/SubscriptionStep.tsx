import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { StepProps } from "./types";

export function SubscriptionStep({ data, onChange }: StepProps) {
  return (
    <div className='space-y-6 animate-fade-in'>
      <div className='grid grid-cols-3 gap-4'>
        {["Starter", "Pro", "Enterprise"].map((plan) => (
          <button
            type='button'
            key={plan}
            className={cn(
              "p-4 rounded-xl border-2 cursor-pointer transition-all text-slate-800 bg-white hover:bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#C9973A] focus:ring-offset-2",
              data.plan === plan
                ? "border-[#C9973A] bg-[#C9973A]/5 font-bold"
                : "border-muted hover:border-muted-foreground/50",
            )}
            onClick={() => onChange("plan", plan)}
            aria-pressed={data.plan === plan}
          >
            <h3 className='font-bold text-center mb-2'>{plan}</h3>
            <p className='text-xs text-muted-foreground text-center font-normal'>
              {plan === "Starter"
                ? "Basic PMS features"
                : plan === "Pro"
                  ? "Full operational suite"
                  : "Unlimited & Custom"}
            </p>
          </button>
        ))}
      </div>
      <div className='space-y-2'>
        <Label>Billing Cycle</Label>
        <div className='flex gap-4'>
          {["Monthly", "Annually"].map((cycle) => (
            <Button
              key={cycle}
              variant={data.billingCycle === cycle ? "default" : "outline"}
              onClick={() => onChange("billingCycle", cycle)}
              className='flex-1'
            >
              {cycle}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
