import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface PerformanceTabProps {
  hotelId: string;
  currency: string;
}

export function PerformanceTab({ hotelId, currency }: PerformanceTabProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`hotel/owner/hotels/${hotelId}/performance?days=30`);
        setData(res.data || res || null);
      } catch {
        toast.error('Failed to load performance');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [hotelId]);

  if (isLoading) return <div className="py-20 text-center"><Skeleton className="h-40 w-full" /></div>;
  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-3xl font-bold">{data.bookings}</div>
          <p className="text-xs text-green-600 mt-1 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Last 30 days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-3xl font-bold">{currency} {data.revenue?.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">From completed stays</p>
        </CardContent>
      </Card>
      <div className="col-span-2 p-4 bg-slate-50 rounded-lg border text-sm italic text-muted-foreground text-center py-10">
        Extended charts and analytics visualization coming soon...
      </div>
    </div>
  );
}
