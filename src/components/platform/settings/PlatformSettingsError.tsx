import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

interface PlatformSettingsErrorProps {
  message?: string;
  onRetry: () => void;
}

export function PlatformSettingsError({
  message,
  onRetry,
}: PlatformSettingsErrorProps) {
  return (
    <Card className='shadow-sm border-none bg-white'>
      <CardContent className='py-12 text-center'>
        <ShieldAlert className='w-8 h-8 text-red-400 mx-auto mb-3' />
        <p className='text-sm text-muted-foreground'>
          {message || "Failed to load platform settings"}
        </p>
        <Button
          variant='outline'
          size='sm'
          onClick={onRetry}
          className='mt-4'
        >
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}
