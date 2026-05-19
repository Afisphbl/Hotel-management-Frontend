import React from 'react';
import { useHotelPricing } from '@/hooks/useHotelData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Settings2, 
  Calendar, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  MoreVertical,
  Activity,
  BarChart3
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';
import { cn } from '@/lib/utils';

export function HotelPricing() {
  const { data: pricing } = useHotelPricing();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Revenue & Pricing</h2>
          <p className="text-sm text-muted-foreground mt-1">Dynamic rate management.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none bg-white border-none shadow-sm gap-2 text-xs">
                <Settings2 className="w-4 h-4" /> Strategy
            </Button>
            <Button className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                <Zap className="w-4 h-4 mr-2" /> Update
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-none bg-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Activity className="w-24 h-24" />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C9973A]">Smart Pricing Meta</p>
            <div>
              <p className="text-4xl font-serif text-[#0F1B2D]">12.4%</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Average Lift via Dynamic Rates</p>
            </div>
            <div className="flex items-center gap-2 py-1 px-3 bg-green-50 text-green-700 rounded-full w-fit text-[10px] font-bold">
              <TrendingUp className="w-3 h-3" /> BEATING MARKET AVG
            </div>
          </div>
        </Card>

        <Card className="shadow-sm border-none bg-white p-6 relative overflow-hidden">
           <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Yield Opportunity</p>
            <div>
              <p className="text-4xl font-serif text-[#0F1B2D]">£142</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Recommended RevPAR Adjustment</p>
            </div>
            <div className="flex items-center gap-2 py-1 px-3 bg-amber-50 text-amber-700 rounded-full w-fit text-[10px] font-bold">
              <Zap className="w-3 h-3" /> ACTION REQUIRED
            </div>
          </div>
        </Card>

        <Card className="shadow-sm border-none bg-[#0F1B2D] text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#C9973A]/10 mix-blend-overlay" />
          <div className="relative space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C9973A]">Market Index</p>
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-serif">1.08</p>
                <ArrowUpRight className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">You are priced +8% above local competitors</p>
            </div>
            <Button variant="ghost" className="h-8 px-0 text-[#C9973A] hover:bg-transparent hover:text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                View CompSet Report <BarChart3 className="w-3 h-3" />
            </Button>
          </div>
        </Card>
      </div>

      <Card className="shadow-sm border-none bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-serif text-xl">Active Rate Plans (Today)</CardTitle>
              <CardDescription>Inventory rates across all channels.</CardDescription>
            </div>
            <Badge variant="outline" className="border-[#C9973A] text-[#C9973A] bg-[#C9973A]/5">MAY 20, 2024</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="pl-6">Room Class</TableHead>
                <TableHead>Base Rate</TableHead>
                <TableHead>Demand</TableHead>
                <TableHead>Dynamic Price</TableHead>
                <TableHead>Yield Delta</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead className="text-right pr-6">Distribution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricing?.currentRates.map(rate => (
                <TableRow key={rate.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <span className="font-bold text-[#0F1B2D]">{rate.type}</span>
                  </TableCell>
                  <TableCell>
                    <MoneyDisplay amount={rate.basePrice} className="text-slate-400 font-medium" />
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                        "text-[9px] font-bold uppercase px-2",
                        rate.demand === 'High' ? "bg-red-50 text-red-700 border-red-100" : "bg-blue-50 text-blue-700 border-blue-100"
                    )} variant="outline">
                        {rate.demand}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <MoneyDisplay amount={rate.currentPrice} className="font-bold text-[#0F1B2D] text-lg" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-green-600 font-bold text-xs">
                        {rate.currentPrice > rate.basePrice ? (
                            <>+£{rate.currentPrice - rate.basePrice} <ArrowUpRight className="w-3 h-3" /></>
                        ) : 'PAR'}
                    </div>
                  </TableCell>
                  <TableCell>
                     <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{rate.strategy}</span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" title="Direct Web" />
                        <div className="w-2 h-2 rounded-full bg-green-500" title="OTA - Booking" />
                        <div className="w-2 h-2 rounded-full bg-slate-300" title="GDS" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="p-4 bg-slate-900 rounded-xl text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg"><Activity className="w-5 h-5 text-[#C9973A]" /></div>
              <div>
                  <p className="text-sm font-bold">Autopilot Revenue Management</p>
                  <p className="text-[10px] text-slate-400">Gemini AI is monitoring market trends 24/7. 12 adjustments made in last 24h.</p>
              </div>
          </div>
          <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 text-xs">Configure AI Control</Button>
      </div>
    </div>
  );
}
