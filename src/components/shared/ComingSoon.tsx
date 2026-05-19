
import { Card, CardContent } from '@/components/ui/card';
import { Hammer } from 'lucide-react';

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <Card className="max-w-md w-full border-none shadow-none bg-transparent text-center">
        <CardContent className="space-y-6">
          <div className="mx-auto w-16 h-16 bg-[#0F1B2D] rounded-[4px] flex items-center justify-center shadow-lg">
            <Hammer className="w-8 h-8 text-[#C9973A]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-[#0F1B2D] tracking-tight">{title}</h2>
            <p className="text-[13px] leading-relaxed text-gray-500 max-w-[280px] mx-auto">
              This feature is currently under active development as part of the LuxeHotel platform.
            </p>
          </div>
          <div className="flex justify-center gap-2 pt-4">
            <div className="w-1 h-1 bg-[#C9973A] rounded-full"></div>
            <div className="w-1 h-1 bg-[#C9973A]/40 rounded-full"></div>
            <div className="w-1 h-1 bg-[#C9973A]/20 rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
