import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ReceiptText,
  User,
  Building,
  CreditCard,
  ArrowLeftRight,
  RotateCcw,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-purple-100 text-purple-800",
  partially_refunded: "bg-purple-100 text-purple-800",
};

const REFUND_REASONS = [
  { value: "cancellation", label: "Cancellation" },
  { value: "overpayment", label: "Overpayment" },
  { value: "dispute", label: "Dispute" },
  { value: "chargeback", label: "Chargeback" },
  { value: "other", label: "Other" },
] as const;

interface PaymentDetailSheetProps {
  paymentId: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PaymentDetailSheet({
  paymentId,
  isOpen,
  onOpenChange,
  onSuccess,
}: PaymentDetailSheetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [payment, setPayment] = useState<any>(null);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const [refundForm, setRefundForm] = useState({
    amount: "",
    reason: "cancellation",
    notes: "",
  });

  useEffect(() => {
    if (isOpen && paymentId) {
      fetchDetails();
    } else {
      setPayment(null);
      setRefunds([]);
      setRefundForm({ amount: "", reason: "cancellation", notes: "" });
    }
  }, [isOpen, paymentId]);

  const fetchDetails = async () => {
    setIsLoading(true);
    try {
      const [detailRes, refundsRes] = await Promise.all([
        api.get(`finance/payments/${paymentId}`),
        api
          .get(`finance/refunds/by-payment/${paymentId}`)
          .catch(() => ({ data: [] })),
      ]);
      setPayment(detailRes.data || detailRes);
      setRefunds(refundsRes.data || []);
    } catch (err: any) {
      toast.error("Failed to load payment details: " + err.message);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!payment) return;
    if (!refundForm.amount || Number(refundForm.amount) <= 0) {
      toast.error("Refund amount is required");
      return;
    }
    setIsProcessingRefund(true);
    try {
      await api.post("finance/refunds", {
        paymentId: payment.id,
        invoiceId: payment.invoiceId,
        bookingId: payment.bookingId || undefined,
        amount: Number(refundForm.amount),
        reason: refundForm.reason,
        notes: refundForm.notes || undefined,
        idempotencyKey: crypto.randomUUID(),
      });
      toast.success("Refund processed");
      setRefundForm({ amount: "", reason: "cancellation", notes: "" });
      
      // Refresh local data
      const refundsRes = await api
        .get(`finance/refunds/by-payment/${payment.id}`)
        .catch(() => ({ data: [] }));
      setRefunds(refundsRes.data || []);
      
      onSuccess();
    } catch (err: any) {
      toast.error(err?.message || "Failed to process refund");
    } finally {
      setIsProcessingRefund(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className='w-full sm:max-w-3xl overflow-y-auto'>
        <SheetHeader className='border-b pb-4'>
          <SheetTitle className='text-xl font-serif'>
            Payment Details
          </SheetTitle>
          <SheetDescription>
            View payment information and manage refunds
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className='p-4 space-y-4'>
            <Skeleton className='h-8 w-48' />
            <Skeleton className='h-20 w-full' />
            <Skeleton className='h-20 w-full' />
          </div>
        ) : payment ? (
          <div className='space-y-6 p-4'>
            <div className='grid grid-cols-1 xs:grid-cols-2 gap-4'>
              <Card className='border-none bg-gray-50'>
                <CardContent className='p-4 space-y-1'>
                  <p className='text-xs text-muted-foreground uppercase font-medium'>
                    Amount
                  </p>
                  <p className='text-xl font-bold'>
                    {formatCurrency(Number(payment.amount))}
                  </p>
                  {payment.fee > 0 && (
                    <p className='text-xs text-muted-foreground'>
                      Fee: {formatCurrency(Number(payment.fee))} | Net:{" "}
                      {formatCurrency(Number(payment.netAmount))}
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card className='border-none bg-gray-50'>
                <CardContent className='p-4 space-y-1'>
                  <p className='text-xs text-muted-foreground uppercase font-medium'>
                    Status
                  </p>
                  <Badge
                    className={cn(
                      "text-xs",
                      STATUS_STYLES[payment.status],
                    )}
                  >
                    {payment.status}
                  </Badge>
                  {payment.paidAt && (
                    <p className='text-xs text-muted-foreground'>
                      Paid: {new Date(payment.paidAt).toLocaleString()}
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card className='border-none bg-gray-50'>
                <CardContent className='p-4 space-y-1'>
                  <p className='text-xs text-muted-foreground uppercase font-medium'>
                    Method
                  </p>
                  <p className='text-sm capitalize font-medium flex items-center gap-1'>
                    <CreditCard className='w-3.5 h-3.5' />{" "}
                    {payment.method?.replace(/_/g, " ")}
                  </p>
                  {payment.currency && (
                    <p className='text-xs text-muted-foreground'>
                      {payment.currency}
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card className='border-none bg-gray-50'>
                <CardContent className='p-4 space-y-1'>
                  <p className='text-xs text-muted-foreground uppercase font-medium'>
                    Transaction ID
                  </p>
                  <p className='text-sm font-mono'>
                    {payment.transactionId || "—"}
                  </p>
                  {payment.id && (
                    <p className='text-xs text-muted-foreground'>
                      ID: {payment.id.slice(0, 12)}...
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {payment.description && (
              <Card className='border-none bg-gray-50'>
                <CardContent className='p-4'>
                  <p className='text-xs text-muted-foreground uppercase font-medium mb-1'>
                    Description
                  </p>
                  <p className='text-sm'>{payment.description}</p>
                </CardContent>
              </Card>
            )}

            {payment.invoice && (
              <div>
                <h4 className='text-sm font-semibold text-[#0F1B2D] mb-2 flex items-center gap-1.5'>
                  <ReceiptText className='w-4 h-4' /> Invoice
                </h4>
                <Card className='border-none bg-gray-50'>
                  <CardContent className='p-4 space-y-1'>
                    <div className='flex justify-between'>
                      <span className='text-xs text-muted-foreground'>
                        Invoice ID
                      </span>
                      <span className='text-sm font-mono'>
                        {payment.invoice.id?.slice(0, 12)}...
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-xs text-muted-foreground'>
                        Invoice Amount
                      </span>
                      <span className='text-sm font-medium'>
                        {formatCurrency(Number(payment.invoice.amount))}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-xs text-muted-foreground'>
                        Invoice Status
                      </span>
                      <Badge className='text-xs'>
                        {payment.invoice.status}
                      </Badge>
                    </div>
                    {payment.invoice.invoiceNumber && (
                      <div className='flex justify-between'>
                        <span className='text-xs text-muted-foreground'>
                          Invoice #
                        </span>
                        <span className='text-sm'>
                          {payment.invoice.invoiceNumber}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {payment.booking && (
              <div>
                <h4 className='text-sm font-semibold text-[#0F1B2D] mb-2 flex items-center gap-1.5'>
                  <Building className='w-4 h-4' /> Booking
                </h4>
                <Card className='border-none bg-gray-50'>
                  <CardContent className='p-4 space-y-1'>
                    <div className='flex justify-between'>
                      <span className='text-xs text-muted-foreground'>
                        Booking ID
                      </span>
                      <span className='text-sm font-mono'>
                        {payment.booking.id?.slice(0, 12)}...
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-xs text-muted-foreground'>
                        Check-in
                      </span>
                      <span className='text-sm'>
                        {payment.booking.checkIn
                          ? new Date(
                              payment.booking.checkIn,
                            ).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-xs text-muted-foreground'>
                        Check-out
                      </span>
                      <span className='text-sm'>
                        {payment.booking.checkOut
                          ? new Date(
                              payment.booking.checkOut,
                            ).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-xs text-muted-foreground'>
                        Total Price
                      </span>
                      <span className='text-sm font-medium'>
                        {formatCurrency(
                          Number(payment.booking.totalPrice),
                        )}
                      </span>
                    </div>
                    {payment.booking.guest && (
                      <div className='flex justify-between items-center pt-1 border-t border-gray-200 mt-1'>
                        <span className='text-xs text-muted-foreground flex items-center gap-1'>
                          <User className='w-3 h-3' /> Guest
                        </span>
                        <span className='text-sm'>
                          {payment.booking.guest.firstName}{" "}
                          {payment.booking.guest.lastName}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {refunds.length > 0 && (
              <div>
                <h4 className='text-sm font-semibold text-[#0F1B2D] mb-2 flex items-center gap-1.5'>
                  <ArrowLeftRight className='w-4 h-4' /> Refund History
                </h4>
                <div className='space-y-2'>
                  {refunds.map((r) => (
                    <Card key={r.id} className='border-none bg-red-50'>
                      <CardContent className='p-3 flex justify-between items-center'>
                        <div>
                          <p className='text-sm font-medium'>
                            -{formatCurrency(Number(r.amount))}
                          </p>
                          <p className='text-xs text-muted-foreground capitalize'>
                            {r.reason}{" "}
                            {r.processedAt
                              ? `• ${new Date(r.processedAt).toLocaleDateString()}`
                              : ""}
                          </p>
                          {r.notes && (
                            <p className='text-xs text-muted-foreground mt-0.5'>
                              {r.notes}
                            </p>
                          )}
                        </div>
                        <Badge
                          className={cn(
                            "text-xs",
                            r.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800",
                          )}
                        >
                          {r.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className='text-sm font-semibold text-[#0F1B2D] mb-2 flex items-center gap-1.5'>
                <RotateCcw className='w-4 h-4' /> Process Refund
              </h4>
              <Card className='border-none bg-gray-50'>
                <CardContent className='p-4 space-y-3'>
                  <div className='grid grid-cols-1 xs:grid-cols-2 gap-3'>
                    <div className='space-y-1'>
                      <label className='text-xs font-medium text-[#0F1B2D]'>
                        Amount
                      </label>
                      <Input
                        type='number'
                        min='0'
                        step='0.01'
                        value={refundForm.amount}
                        onChange={(e) =>
                          setRefundForm({
                            ...refundForm,
                            amount: e.target.value,
                          })
                        }
                        placeholder='0.00'
                      />
                    </div>
                    <div className='space-y-1'>
                      <label className='text-xs font-medium text-[#0F1B2D]'>
                        Reason
                      </label>
                      <Select
                        value={refundForm.reason}
                        onValueChange={(v) =>
                          setRefundForm({ ...refundForm, reason: v ?? '' })
                        }
                      >
                        <SelectTrigger className='w-full bg-white'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {REFUND_REASONS.map((r) => (
                            <SelectItem key={r.value} value={r.value}>
                              {r.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-xs font-medium text-[#0F1B2D]'>
                      Notes
                    </label>
                    <Input
                      value={refundForm.notes}
                      onChange={(e) =>
                        setRefundForm({
                          ...refundForm,
                          notes: e.target.value,
                        })
                      }
                      placeholder='Optional refund notes'
                    />
                  </div>
                  <Button
                    className='bg-red-600 hover:bg-red-700'
                    onClick={handleRefund}
                    disabled={isProcessingRefund}
                  >
                    {isProcessingRefund
                      ? "Processing..."
                      : "Process Refund"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
