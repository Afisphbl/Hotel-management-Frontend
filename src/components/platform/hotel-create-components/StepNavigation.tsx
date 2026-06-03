import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  isPending: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  isPending,
  onBack,
  onNext,
  onSubmit,
}: StepNavigationProps) {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className='p-6 border-t flex justify-between bg-slate-50/50'>
      <Button
        variant='outline'
        onClick={onBack}
        disabled={currentStep === 0}
        className='border-slate-200'
      >
        Back
      </Button>
      {isLastStep ? (
        <Button
          onClick={onSubmit}
          disabled={isPending}
          className='bg-[#0F1B2D] hover:bg-[#1a2a3a] text-white font-bold'
        >
          {isPending ? <Loader2 className='w-4 h-4 animate-spin mr-2' /> : null}
          Finalize & Create
        </Button>
      ) : (
        <Button
          onClick={onNext}
          className='bg-[#0F1B2D] hover:bg-[#1a2a3a] text-white'
        >
          Continue <ArrowRight className='w-4 h-4 ml-2' />
        </Button>
      )}
    </div>
  );
}
