
import { useParams } from '@tanstack/react-router';
import { useHotelFeatureFlags, useToggleHotelFeature } from '@/hooks/usePlatformData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldCheck, Database, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';

export function HotelFeatureFlags() {
  const { id: hotelId } = useParams({ from: '/auth/platform/hotels/$id' });
  const { data: features, isLoading, isError, refetch } = useHotelFeatureFlags(hotelId);
  const toggleMutation = useToggleHotelFeature();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleToggle = async (feature: any) => {
    setProcessingId(feature.id);
    try {
      await toggleMutation.mutateAsync({
        hotelId,
        featureId: feature.id,
        enabled: !feature.enabled
      });
      toast.success(`${feature.name} ${!feature.enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (err: any) {
      toast.error(err.message || `Failed to toggle ${feature.name}`);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Feature Visibility Override</CardTitle>
        <CardDescription>Control which modules are accessible to this tenant.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {features && features.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map(feature => (
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
                <Button 
                  variant={feature.enabled ? "default" : "outline"} 
                  size="sm" 
                  className={feature.enabled ? "bg-green-600 hover:bg-green-700" : ""}
                  onClick={() => handleToggle(feature)}
                  disabled={processingId === feature.id}
                >
                  {processingId === feature.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    feature.enabled ? "Enabled" : "Disabled"
                  )}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Database className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-sm text-slate-400">No feature flags data</p>
            <p className="text-[10px] text-slate-300 mt-1">This section has no database or data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
