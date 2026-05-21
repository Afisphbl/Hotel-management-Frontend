
import { useParams } from '@tanstack/react-router';
import { usePlatformHotel } from '@/hooks/usePlatformData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  FileText,
  Download,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';
import { format } from 'date-fns';

export function HotelSubscription() {
  const { id } = useParams({ from: '/auth/platform/hotels/$id' });
  const { data: hotel, isLoading, isError, error, refetch } = usePlatformHotel(id);

  if (isLoading) return <Skeleton className="h-64 w-full rounded-xl" />;
  if (isError) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Database className="w-10 h-10 text-red-400 mb-3" />
      <h3 className="text-lg font-serif text-slate-500">Failed to load subscription</h3>
      <p className="text-xs text-slate-400 mt-1 mb-4">{error?.message}</p>
      <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
    </div>
  );
  if (!hotel) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Database className="w-10 h-10 text-slate-300 mb-3" />
        <h3 className="text-lg font-serif text-slate-400">No subscription data found</h3>
        <p className="text-xs text-slate-300 mt-1">
          This section has no database or data available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Current Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {hotel.plan || hotel.monthlyRevenue ? (
              <div className="p-4 sm:p-6 bg-[#F8F7F4] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">{hotel.plan || 'N/A'}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-bold">Monthly Plan</p>
                </div>
                <div className="text-center sm:text-right">
                  <MoneyDisplay amount={hotel.monthlyRevenue} className="text-xl sm:text-2xl font-bold" />
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Per Month</p>
                </div>
              </div>
            ) : (
              <div className="p-6 border border-dashed border-slate-200 rounded-2xl text-center">
                <Database className="w-6 h-6 mx-auto text-slate-300 mb-2" />
                <p className="text-xs text-slate-400 italic">No subscription plan data in database</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs uppercase font-bold tracking-widest">Status</span>
                </div>
                <div className="flex items-center gap-2 text-green-600 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> {hotel.status === 'active' ? 'Active' : hotel.status === 'suspended' ? 'Suspended' : 'Inactive'}
                </div>
              </div>
              <div className="p-4 border rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs uppercase font-bold tracking-widest">Billing Cycle</span>
                </div>
                <div className="font-medium text-sm">{hotel.billingCycle || 'Monthly'}</div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">Change Plan</Button>
              <Button variant="outline">Billing Portal</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Platform Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hotel.storageUsed != null ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Storage</span>
                  <span>{hotel.storageUsed} / 50 GB</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C9973A] w-[24%]" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                <Database className="w-4 h-4 text-slate-300" />
                <p className="text-xs text-slate-400 italic">No storage data in database</p>
              </div>
            )}
            {hotel.emailCreditsUsed != null ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Monthly Email Credits</span>
                  <span>{hotel.emailCreditsUsed}k / {hotel.emailCreditsLimit || 10}k</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F1B2D] w-[84%]" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                <Database className="w-4 h-4 text-slate-300" />
                <p className="text-xs text-slate-400 italic">No email credit data in database</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {hotel.invoices?.length > 0 ? (
              hotel.invoices.map((inv: any, i: number) => (
                <div key={inv.id || i} className="flex items-center justify-between py-4 border-b last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-lg -mx-2">
                  <div className="flex items-center gap-3">
                    <div className="hidden xs:flex w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm">{inv.number || inv.id || `#INV-${i + 1}`}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{inv.date ? format(new Date(inv.date), 'MMM d, yyyy') : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <MoneyDisplay amount={inv.amount || hotel.monthlyRevenue} className="text-sm font-medium" />
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground text-sm">
                <Database className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                No invoice data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
