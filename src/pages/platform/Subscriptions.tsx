import React from 'react';
import { usePlatformSubscriptions } from '@/hooks/usePlatformData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard, Check, Settings, MoreVertical } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';

export function PlatformSubscriptions() {
  const { data: plans } = usePlatformSubscriptions();

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
        {plans?.map((plan) => (
          <Card key={plan.id} className="shadow-sm border-none bg-white relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#C9973A] opacity-20 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-serif text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.hotels} Active Properties</CardDescription>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-[#C9973A]" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#0F1B2D]">£{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/per month</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Included Features</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
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
        ))}
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
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium text-[#0F1B2D]">Hotel {i}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className="font-bold text-[10px] uppercase">Enterprise</Badge>
                  </TableCell>
                  <TableCell>
                    <MoneyDisplay amount={999} className="font-medium" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
