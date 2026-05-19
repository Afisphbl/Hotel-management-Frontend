
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
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';

export function HotelSubscription() {
  const { id } = useParams({ from: '/auth/platform/hotels/$id' });
  const { data: hotel } = usePlatformHotel(id);

  if (!hotel) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Current Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 sm:p-6 bg-[#F8F7F4] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">{hotel.plan}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-bold">Monthly Plan</p>
              </div>
              <div className="text-center sm:text-right">
                <MoneyDisplay amount={hotel.monthlyRevenue} className="text-xl sm:text-2xl font-bold" />
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Per Month</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs uppercase font-bold tracking-widest">Status</span>
                </div>
                <div className="flex items-center gap-2 text-green-600 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Active
                </div>
              </div>
              <div className="p-4 border rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs uppercase font-bold tracking-widest">Payment Method</span>
                </div>
                <div className="font-medium text-sm">Visa ending in 4242</div>
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
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Storage</span>
                <span>{hotel.storageUsed} / 50 GB</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#C9973A] w-[24%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Monthly Email Credits</span>
                <span>8.4k / 10k</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0F1B2D] w-[84%]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between py-4 border-b last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-lg -mx-2">
                <div className="flex items-center gap-3">
                  <div className="hidden xs:flex w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm">#INV-2024-00{i}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">May {14-i}, 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MoneyDisplay amount={hotel.monthlyRevenue} className="text-sm font-medium" />
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
