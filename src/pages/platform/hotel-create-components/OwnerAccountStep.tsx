import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { StepProps } from "./types";

export function OwnerAccountStep({ data, errors, onChange }: StepProps) {
  return (
    <div className='space-y-6 animate-fade-in'>
      <div className='space-y-2'>
        <Label className='flex items-center gap-0.5'>
          Owner Full Name <span className='text-red-500 font-bold'>*</span>
        </Label>
        <Input
          value={data.ownerName}
          onChange={(e) => onChange("ownerName", e.target.value)}
          placeholder='e.g. John Doe'
          className={cn(errors.ownerName && "border-red-500 bg-red-50/10")}
        />
        {errors.ownerName && (
          <p className='text-[11px] text-red-500 font-medium'>
            {errors.ownerName}
          </p>
        )}
      </div>
      <div className='space-y-2'>
        <Label className='flex items-center gap-0.5'>
          Owner Email (Login UID) <span className='text-red-500 font-bold'>*</span>
        </Label>
        <Input
          value={data.ownerEmail}
          onChange={(e) => onChange("ownerEmail", e.target.value)}
          placeholder='e.g. john@grandpeninsula.com'
          className={cn(errors.ownerEmail && "border-red-500 bg-red-50/10")}
        />
        {errors.ownerEmail && (
          <p className='text-[11px] text-red-500 font-medium'>{errors.ownerEmail}</p>
        )}
      </div>
      <div className='space-y-2'>
        <Label className='flex items-center gap-0.5'>
          Temporary Password <span className='text-red-500 font-bold'>*</span>
        </Label>
        <Input
          type='password'
          value={data.password}
          onChange={(e) => onChange("password", e.target.value)}
          placeholder='••••••••'
          className={cn(errors.password && "border-red-500 bg-red-50/10")}
        />
        {errors.password ? (
          <p className='text-[11px] text-red-500 font-medium'>{errors.password}</p>
        ) : (
          <p className='text-xs text-muted-foreground'>
            The owner will be prompted to change this on first login.
          </p>
        )}
      </div>
    </div>
  );
}
