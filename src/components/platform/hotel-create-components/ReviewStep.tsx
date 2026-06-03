import { ShieldCheck } from "lucide-react";
import type { FormData } from "./types";

interface ReviewStepProps {
  data: FormData;
}

export function ReviewStep({ data }: ReviewStepProps) {
  return (
    <div className='space-y-6'>
      <div className='p-5 bg-slate-50 border rounded-xl'>
        <h3 className='font-bold text-[#0F1B2D] mb-4'>
          Final Summary Review
        </h3>
        <div className='grid grid-cols-2 gap-y-4 text-sm border-b pb-4'>
          <span className='text-muted-foreground'>Hotel Name:</span>
          <span className='font-semibold text-slate-800'>{data.name}</span>
          <span className='text-muted-foreground'>Owner Details:</span>
          <span className='font-semibold text-slate-800'>
            {data.ownerName} ({data.ownerEmail})
          </span>
          <span className='text-muted-foreground'>Subscription Plan:</span>
          <span className='font-semibold text-slate-800'>
            {data.plan} ({data.billingCycle})
          </span>
          <span className='text-muted-foreground'>Rooms Count:</span>
          <span className='font-semibold text-slate-800'>
            {data.rooms} Rooms
          </span>
          <span className='text-muted-foreground'>Features Enabled:</span>
          <span className='font-semibold text-slate-800'>
            {data.features.length} Modules
          </span>
        </div>
        <div className='grid grid-cols-2 gap-y-4 text-sm pt-4'>
          <span className='text-muted-foreground'>Branding System:</span>
          <span className='font-semibold text-slate-800 flex items-center gap-2'>
            <span
              className='inline-block w-4 h-4 rounded-full border border-slate-200'
              style={{ backgroundColor: data.primaryColor }}
              title='Primary Color'
            />
            <span
              className='inline-block w-4 h-4 rounded-full border border-slate-200'
              style={{ backgroundColor: data.accentColor }}
              title='Accent Color'
            />
            Visual Palette Loaded
          </span>
          <span className='text-muted-foreground'>Generated Subdomain:</span>
          <span className='font-semibold text-slate-800 font-mono text-xs lowercase'>
            {data.code
              ? data.code.toLowerCase().replace(/[^a-z0-9]/g, "")
              : "gp"}
            .hotels.pms.cloud
          </span>
        </div>
      </div>
      <div className='flex items-center gap-2 p-4 border border-amber-200 bg-amber-50/50 rounded-lg text-amber-800 text-sm'>
        <ShieldCheck className='w-5 h-5 text-[#C9973A]' />
        This will create a new tenant environment and send an invitation email to
        the owner.
      </div>
    </div>
  );
}
