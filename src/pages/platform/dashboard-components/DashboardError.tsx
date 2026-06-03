import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  error: any;
  refetch: () => void;
}

export function DashboardError({ error, refetch }: DashboardErrorProps) {
  return (
    <div className='flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-xl shadow-sm border border-slate-100 max-w-2xl mx-auto my-12 animate-fade-in'>
      <div className='w-16 h-16 bg-red-50/80 rounded-full flex items-center justify-center mb-4'>
        <ShieldAlert className='w-8 h-8 text-red-500 animate-bounce' />
      </div>
      <h2 className='font-serif text-2xl text-[#0F1B2D] font-bold'>
        Unauthorized & Connection Lost
      </h2>
      <p className='text-sm text-slate-400 mt-2 max-w-md'>
        {error?.message ||
          "Your session is either expired, unauthorized, or the endpoint could not establish link to NestJS servers."}
      </p>
      <div className='flex gap-4 mt-6'>
        <Button
          onClick={() => window.location.reload()}
          variant='outline'
          className='border-slate-200'
        >
          Refresh Session
        </Button>
        <Button
          onClick={() => refetch()}
          className='bg-[#0F1B2D] hover:bg-[#1a2a3a]'
        >
          Retry Handshake
        </Button>
      </div>
    </div>
  );
}
