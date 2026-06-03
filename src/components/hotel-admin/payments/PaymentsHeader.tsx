import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PaymentsHeaderProps {
  onRecordPayment: () => void;
}

export function PaymentsHeader({ onRecordPayment }: PaymentsHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-serif text-[#0F1B2D]'>
          Payments
        </h1>
        <p className='text-sm text-muted-foreground'>
          Track and manage financial transactions
        </p>
      </div>
      <Button
        className='bg-[#0F1B2D] hover:bg-[#1a2a3a]'
        onClick={onRecordPayment}
      >
        <Plus className='w-4 h-4 mr-2' /> Record Payment
      </Button>
    </div>
  );
}
