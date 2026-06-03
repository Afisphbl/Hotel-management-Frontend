import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { StepProps } from "./types";

export function HotelInfoStep({ data, errors, onChange }: StepProps) {
  return (
    <div className='space-y-6 animate-fade-in'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label className='flex items-center gap-0.5'>
            Hotel Name <span className='text-red-500 font-bold'>*</span>
          </Label>
          <Input
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder='e.g. Grand Peninsula'
            className={cn(errors.name && "border-red-500 bg-red-50/10")}
          />
          {errors.name && (
            <p className='text-[11px] text-red-500 font-medium'>
              {errors.name}
            </p>
          )}
        </div>
        <div className='space-y-2'>
          <Label className='flex items-center gap-0.5'>
            Hotel Code <span className='text-red-500 font-bold'>*</span>
          </Label>
          <Input
            value={data.code}
            onChange={(e) => onChange("code", e.target.value)}
            placeholder='e.g. GP-LON'
            className={cn(errors.code && "border-red-500 bg-red-50/10")}
          />
          {errors.code && (
            <p className='text-[11px] text-red-500 font-medium'>
              {errors.code}
            </p>
          )}
        </div>
      </div>
      <div className='space-y-2'>
        <Label>Legal Business Name</Label>
        <Input
          value={data.legalName}
          onChange={(e) => onChange("legalName", e.target.value)}
          placeholder='e.g. Grand Peninsula Hotels Ltd'
        />
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label className='flex items-center gap-0.5'>
            Business Email <span className='text-red-500 font-bold'>*</span>
          </Label>
          <Input
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder='e.g. info@grandpeninsula.com'
            className={cn(errors.email && "border-red-500 bg-red-50/10")}
          />
          {errors.email && (
            <p className='text-[11px] text-red-500 font-medium'>{errors.email}</p>
          )}
        </div>
        <div className='space-y-2'>
          <Label>Phone</Label>
          <Input
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder='e.g. +44 20 7946 0958'
          />
        </div>
      </div>
      <div className='grid grid-cols-3 gap-4'>
        <div className='space-y-2'>
          <Label>Country</Label>
          <Input
            value={data.country}
            readOnly
            className='bg-slate-50 cursor-not-allowed'
          />
        </div>
        <div className='space-y-2'>
          <Label className='flex items-center gap-0.5'>
            City <span className='text-red-500 font-bold'>*</span>
          </Label>
          <Input
            value={data.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder='e.g. London'
            className={cn(errors.city && "border-red-500 bg-red-50/10")}
          />
          {errors.city && (
            <p className='text-[11px] text-red-500 font-medium'>{errors.city}</p>
          )}
        </div>
        <div className='space-y-2'>
          <Label className='flex items-center gap-0.5'>
            Rooms <span className='text-red-500 font-bold'>*</span>
          </Label>
          <Input
            type='number'
            value={data.rooms}
            onChange={(e) => onChange("rooms", parseInt(e.target.value) || 0)}
            className={cn(errors.rooms && "border-red-500 bg-red-50/10")}
          />
          {errors.rooms && (
            <p className='text-[11px] text-red-500 font-medium'>{errors.rooms}</p>
          )}
        </div>
      </div>
    </div>
  );
}
