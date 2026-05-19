
import { useParams } from '@tanstack/react-router';
import { useHotelFeatureFlags } from '@/hooks/usePlatformData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HotelFeatureFlags() {
  const { id } = useParams({ from: '/auth/platform/hotels/$id' });
  const { data: features } = useHotelFeatureFlags(id);

  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Feature Visibility Override</CardTitle>
        <CardDescription>Control which modules are accessible to this tenant.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features?.map(feature => (
            <div key={feature.id} className="flex items-center justify-between p-4 rounded-xl bg-[#F8F7F4]">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  feature.enabled ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-500"
                )}>
                  {feature.enabled ? <CheckCircle2 className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-sm">{feature.name}</p>
                  <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">{feature.category}</p>
                </div>
              </div>
              <Button variant={feature.enabled ? "default" : "outline"} size="sm" className={feature.enabled ? "bg-green-600 hover:bg-green-700" : ""}>
                {feature.enabled ? "Enabled" : "Disabled"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
