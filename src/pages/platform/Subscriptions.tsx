import React from 'react';
import { usePlatformSubscriptions, usePlatformHotels } from '@/hooks/usePlatformData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard, Check, Settings, MoreVertical } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';

export function PlatformSubscriptions() {
  const { data: plans, isLoading: plansLoading } = usePlatformSubscriptions();
  const { data: hotels, isLoading: hotelsLoading } = usePlatformHotels();

  const topHotels = hotels
    ?.filter((h: any) => h.status === 'active' || h.status !== 'archived')
    ?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Plans</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage tiers and pricing models.</p>
        </div>
        <Button className="w-full sm:w-auto bg-[#0F1B2D] hover:bg-[#1a2a3a]">
          <Plus className="w-4 h-4 mr-2" /> Add Tier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plansLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="shadow-sm border-none bg-white">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))
        ) : plans?.length > 0 ? (
          plans?.map((plan: any) => (
            <Card key={plan.id} className="shadow-sm border-none bg-white relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#C9973A] opacity-20 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-serif text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.hotels ?? plan.activeProperties ?? 0} Active Properties</CardDescription>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <CreditCard className="w-5 h-5 text-[#C9973A]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#0F1B2D]">£{plan.price ?? plan.amount ?? 0}</span>
                    <span className="text-sm text-muted-foreground">/per month</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Included Features</p>
                  <ul className="space-y-2">
                    {(Array.isArray(plan.features) ? plan.features : Array.isArray(plan.featureList) ? plan.featureList : plan.features?.enabledFeatures ?? []).map((feature: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-green-600" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 flex gap-2">
                  <Button variant="outline" className="flex-1 text-xs">Edit Plan</Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Settings className="w-4 h-4 text-slate-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="md:col-span-3 shadow-sm border-none bg-white">
            <CardContent className="p-12 text-center text-muted-foreground">
              <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No subscription plans configured.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Top Subscribing Properties</CardTitle>
          <CardDescription>A list of hotels by their revenue contribution.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead className="hidden sm:table-cell">Plan</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hotelsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-14" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : topHotels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No active properties found.
                  </TableCell>
                </TableRow>
              ) : (
                topHotels.map((hotel: any) => (
                  <TableRow key={hotel.id}>
                    <TableCell className="font-medium text-[#0F1B2D]">{hotel.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="font-bold text-[10px] uppercase">{hotel.plan || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>
                      <MoneyDisplay amount={hotel.monthlyRevenue ?? 0} className="font-medium" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <StatusBadge status={hotel.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
