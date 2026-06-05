import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, ShieldAlert, Database } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmPaymentDialog } from "@/components/platform/billing/ConfirmPaymentDialog";
import { OverrideSuspensionDialog } from "@/components/platform/billing/OverrideSuspensionDialog";
import { SetRateDialog } from "@/components/platform/billing/SetRateDialog";

export function HotelBilling() {
  const { id: hotelId } = useParams({ from: '/auth/platform/hotels/$id' });
  const queryClient = useQueryClient();

  const { data: billing, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["hotel-billing", hotelId],
    queryFn: () => api.get(`platform/billing/hotels`).then((hotels: any[]) =>
      hotels.find((h: any) => h.hotelId === hotelId)
    ),
    enabled: !!hotelId,
  });

  const { data: history } = useQuery({
    queryKey: ["hotel-billing-history", hotelId],
    queryFn: () => api.get(`platform/billing/${hotelId}/history`),
    enabled: !!hotelId,
  });

  const { data: payments } = useQuery({
    queryKey: ["hotel-payments", hotelId],
    queryFn: async () => {
      const allHotels: any[] = await api.get(`platform/billing/hotels`);
      return [];
    },
    enabled: !!hotelId,
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [showOverride, setShowOverride] = useState(false);
  const [showSetRate, setShowSetRate] = useState(false);

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );

  if (isError) return (
    <div className="p-8 flex flex-col items-center justify-center py-16 text-center">
      <ShieldAlert className="w-10 h-10 text-red-400 mb-3" />
      <h3 className="text-lg font-serif text-slate-600">Failed to load billing data</h3>
      <p className="text-xs text-slate-400 mt-1 mb-4">{error?.message || 'Connection error'}</p>
      <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
    </div>
  );

  if (!billing) return (
    <div className="p-8 flex flex-col items-center justify-center py-16 text-center">
      <Database className="w-10 h-10 text-slate-300 mb-3" />
      <h3 className="text-lg font-serif text-slate-400">No billing data</h3>
      <p className="text-xs text-slate-300 mt-1">This hotel has no billing information yet</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif text-[#0F1B2D]">Billing Overview</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowSetRate(true)}>
            <DollarSign className="w-4 h-4 mr-1" /> Set Rate
          </Button>
          {billing.isSuspended && (
            <Button size="sm" className="bg-green-700 hover:bg-green-800" onClick={() => setShowOverride(true)}>
              Override Suspension
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Monthly Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#0F1B2D]">
              {billing.monthlyRate ? formatCurrency(billing.monthlyRate) : 'Not set'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Current Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {billing.currentMonthPaid ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>
              ) : billing.isOverdue ? (
                <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">Due</Badge>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Last Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#0F1B2D]">
              {billing.lastPaidAt ? formatDateTime(billing.lastPaidAt) : 'Never'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-serif text-[#0F1B2D]">Payment History</CardTitle>
          {!billing.currentMonthPaid && billing.monthlyRate > 0 && (
            <Button size="sm" onClick={() => setShowConfirm(true)}>
              Confirm Payment
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#F8F7F4]">
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!history || history.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                    No payment records found
                  </TableCell>
                </TableRow>
              ) : (
                history.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-sm">
                      {p.periodStart?.slice(0, 7) || '—'}
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(p.amount)}</TableCell>
                    <TableCell className="text-sm capitalize">{p.method?.replace('_', ' ') || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        p.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                        p.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        p.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-slate-100 text-slate-600'
                      }>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {p.paidAt ? formatDateTime(p.paidAt) : '—'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmPaymentDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        hotelId={hotelId}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["hotel-billing", hotelId] });
          queryClient.invalidateQueries({ queryKey: ["hotel-billing-history", hotelId] });
        }}
      />

      <OverrideSuspensionDialog
        open={showOverride}
        onOpenChange={setShowOverride}
        hotelId={hotelId}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["hotel-billing", hotelId] });
          queryClient.invalidateQueries({ queryKey: ["platform-hotel", hotelId] });
        }}
      />

      <SetRateDialog
        open={showSetRate}
        onOpenChange={setShowSetRate}
        hotelId={hotelId}
        currentRate={billing.monthlyRate}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["hotel-billing", hotelId] });
          queryClient.invalidateQueries({ queryKey: ["platform-hotel", hotelId] });
        }}
      />
    </div>
  );
}
