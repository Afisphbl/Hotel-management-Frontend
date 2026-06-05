import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DollarSign, CreditCard, Upload, AlertTriangle, CheckCircle2,
  XCircle, ShieldAlert, ArrowLeft, ExternalLink,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

export function HotelOwnerBilling() {
  const user = useAuthStore((s) => s.user);
  const hotelId = user?.hotelId || user?.hotel_id;

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [paying, setPaying] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    if (!hotelId) return;
    setLoading(true);
    try {
      const [s, h] = await Promise.all([
        api.get("billing/payment-status"),
        api.get("billing/payment-history"),
      ]);
      setStatus(s.data ?? s);
      setHistory(h.data ?? h);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [hotelId]);

  const handlePayChapa = async () => {
    setPaying(true);
    try {
      const res = await api.post("billing/initiate-payment");
      const data = res.data ?? res;
      if (data?.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank");
        toast.success("Chapa checkout opened in new tab");
      } else {
        toast.error("No checkout URL returned");
      }
      await fetchData();
    } catch (err: any) {
      toast.error(err.message || "Payment initiation failed");
    } finally {
      setPaying(false);
    }
  };

  const handleUploadReceipt = async () => {
    if (!receiptUrl.trim()) {
      toast.error("Please enter a receipt URL");
      return;
    }
    setUploading(true);
    try {
      await api.post("billing/upload-receipt", { receiptUrl: receiptUrl.trim() });
      toast.success("Receipt uploaded. Awaiting admin confirmation.");
      setReceiptUrl("");
      await fetchData();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const isSuspended = status?.isSuspended || status?.status === "SUSPENDED";

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Billing & Subscription</h1>
        <p className="text-sm text-muted-foreground">Manage your monthly subscription and payment methods</p>
      </div>

      {/* Suspension block */}
      {isSuspended && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-start gap-4 py-6">
            <ShieldAlert className="w-8 h-8 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Account Suspended</h3>
              <p className="text-sm text-red-700 mt-1">
                Your account has been suspended due to non-payment. Complete your monthly payment below to restore full access to all features including bookings, pricing, and reports.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : status ? (
        <>
          {/* Status cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Monthly Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-[#0F1B2D]">
                  {status.monthlyRate ? formatCurrency(status.monthlyRate) : 'Not set'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Current Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {status.currentMonthPaid ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-medium">Paid</span>
                    </>
                  ) : status.isOverdue ? (
                    <>
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span className="text-red-700 font-medium">Overdue</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <span className="text-amber-700 font-medium">Due</span>
                    </>
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
                  {status.lastPaidAt ? formatDateTime(status.lastPaidAt) : 'No payments yet'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment actions */}
          {!status.currentMonthPaid && status.monthlyRate > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-serif text-[#0F1B2D]">Make a Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-slate-200 p-4">
                  <h4 className="font-medium text-[#0F1B2D] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#C9973A]" /> Pay with Chapa
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pay {formatCurrency(status.dueAmount || status.monthlyRate)} via Chapa — supports Telebirr, CBE Birr, cards, and mobile money.
                  </p>
                  <Button
                    onClick={handlePayChapa}
                    disabled={paying}
                    className="mt-3 bg-[#0F1B2D] hover:bg-[#1a2a3a]"
                  >
                    {paying ? "Opening Chapa..." : `Pay ${formatCurrency(status.dueAmount || status.monthlyRate)}`}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="rounded-lg border border-slate-200 p-4">
                  <h4 className="font-medium text-[#0F1B2D] flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#C9973A]" /> Bank Transfer Receipt
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Made a bank transfer? Upload a screenshot or receipt URL for manual admin confirmation.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="text"
                      value={receiptUrl}
                      onChange={(e) => setReceiptUrl(e.target.value)}
                      placeholder="Paste receipt image URL"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C9973A]"
                    />
                    <Button
                      variant="outline"
                      onClick={handleUploadReceipt}
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment history */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-serif text-[#0F1B2D]">Payment History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-[#F8F7F4]">
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                        No payment records yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-sm">{p.periodStart?.slice(0, 7) || '—'}</TableCell>
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
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Unable to load billing information
          </CardContent>
        </Card>
      )}
    </div>
  );
}
