import { Card, CardContent } from "@/components/ui/card";
import { Database } from "lucide-react";

export function PlatformSettingsEmpty() {
  return (
    <Card className='shadow-sm border-none bg-white'>
      <CardContent className='py-12 text-center'>
        <Database className='w-8 h-8 text-slate-300 mx-auto mb-3' />
        <p className='font-serif text-base text-slate-500'>
          No settings found
        </p>
        <p className='text-xs text-slate-400 mt-1'>
          Add platform settings in the database to manage system-wide behavior.
        </p>
      </CardContent>
    </Card>
  );
}
