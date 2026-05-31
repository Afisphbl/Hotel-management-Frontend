import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Banknote,
  Plus,
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

const PAYMENT_METHODS = [
  "cash",
  "credit_card",
  "debit_card",
  "bank_transfer",
  "mobile_payment",
] as const;

const REFUND_REASONS = [
  { value: "cancellation", label: "Cancellation" },
  { value: "overpayment", label: "Overpayment" },
  { value: "dispute", label: "Dispute" },
  { value: "chargeback", label: "Chargeback" },
  { value: "other", label: "Other" },
] as const;

export function AdminPayments() {
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    invoiceId: "",
    amount: "",
    method: "cash",
    transactionId: "",
    description: "",
  });

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activePayment, setActivePayment] = useState<any>(null);
  const [activeRefunds, setActiveRefunds] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [refundForm, setRefundForm] = useState({
    amount: "",
    reason: "cancellation",
    notes: "",
  });

  const PAGE_SIZE = 15;

  useEffect(() => {
    setPage(1);
  }, [filterStatus]);
  useEffect(() => {
    fetchPayments();
    fetchSummary();
  }, [page, filterStatus]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get("finance/payments?page=1&limit=1000");
      const data = res.data || res.items || [];
      setSummaryData(data);
    } catch {
      console.warn("[Payments] summary fetch failed");
    }
  };

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== "ALL")
        params.append("status", filterStatus.toLowerCase());
      params.append("page", String(page));
      params.append("limit", String(PAGE_SIZE));
      const res = await api.get(`finance/payments?${params.toString()}`);
      setPayments(res.data || res.items || []);
      if (res.meta) {
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      }
    } catch (err: any) {
      toast.error("Failed to load payments: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openDetail = async (payment: any) => {
    setActivePayment(null);
    setActiveRefunds([]);
    setRefundForm({ amount: "", reason: "cancellation", notes: "" });
    setIsDetailOpen(true);
    setDetailLoading(true);
    try {
      const [detailRes, refundsRes] = await Promise.all([
        api.get(`finance/payments/${payment.id}`),
        api
          .get(`finance/refunds/by-payment/${payment.id}`)
          .catch(() => ({ data: [] })),
      ]);
      setActivePayment(detailRes.data || detailRes);
      setActiveRefunds(refundsRes.data || []);
    } catch (err: any) {
      toast.error("Failed to load payment details: " + err.message);
      setIsDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const submitCreatePayment = async () => {
    if (!createForm.invoiceId || !createForm.amount) {
      toast.error("Invoice ID and amount are required");
      return;
    }
    setCreateLoading(true);
    try {
      await api.post("finance/payments", {
        invoiceId: createForm.invoiceId,
        amount: Number(createForm.amount),
        method: createForm.method,
        transactionId: createForm.transactionId || undefined,
        description: createForm.description || undefined,
        idempotencyKey: crypto.randomUUID(),
      });
      toast.success("Payment recorded");
      setIsCreateOpen(false);
      setCreateForm({
        invoiceId: "",
        amount: "",
        method: "cash",
        transactionId: "",
        description: "",
      });
      fetchPayments();
      fetchSummary();
    } catch (err: any) {
      toast.error(err?.message || "Failed to record payment");
    } finally {
      setCreateLoading(false);
    }
  };

  const submitRefund = async () => {
    if (!activePayment) return;
    if (!refundForm.amount || Number(refundForm.amount) <= 0) {
      toast.error("Refund amount is required");
      return;
    }
    setActionLoading("refund");
    try {
      const res = await api.post("finance/refunds", {
        paymentId: activePayment.id,
        invoiceId: activePayment.invoiceId,
        bookingId: activePayment.bookingId || undefined,
        amount: Number(refundForm.amount),
        reason: refundForm.reason,
        notes: refundForm.notes || undefined,
        idempotencyKey: crypto.randomUUID(),
      });
      toast.success("Refund processed");
      setRefundForm({ amount: "", reason: "cancellation", notes: "" });
      const refundsRes = await api
        .get(`finance/refunds/by-payment/${activePayment.id}`)
        .catch(() => ({ data: [] }));
      setActiveRefunds(refundsRes.data || []);
      fetchPayments();
      fetchSummary();
    } catch (err: any) {
      toast.error(err?.message || "Failed to process refund");
    } finally {
      setActionLoading(null);
    }
  };

  const totalRevenue = summaryData
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const filtered = payments.filter(
    (p) =>
      p.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className='space-y-8 pb-10'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-serif text-[#0F1B2D]'>
            Payments
          </h1>
          <p className='text-sm text-muted-foreground'>
            Track and manage financial transactions
          </p>
        </div>
        <Button
          className='bg-[#0F1B2D] hover:bg-[#1a2a3a]'
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className='w-4 h-4 mr-2' /> Record Payment
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='shadow-sm border-none bg-white'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-medium text-muted-foreground uppercase'>
                  Total Collected
                </p>
                <h3 className='text-2xl font-bold text-green-600 mt-1'>
                  {formatCurrency(totalRevenue)}
                </h3>
              </div>
              <DollarSign className='w-12 h-12 text-green-600 opacity-20' />
            </div>
          </CardContent>
        </Card>
        <Card className='shadow-sm border-none bg-white'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-medium text-muted-foreground uppercase'>
                  Total Transactions
                </p>
                <h3 className='text-2xl font-bold text-[#0F1B2D] mt-1'>
                  {summaryData.length}
                </h3>
              </div>
              <Banknote className='w-12 h-12 text-blue-600 opacity-20' />
            </div>
          </CardContent>
        </Card>
        <Card className='shadow-sm border-none bg-white'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-medium text-muted-foreground uppercase'>
                  Pending
                </p>
                <h3 className='text-2xl font-bold text-yellow-600 mt-1'>
                  {summaryData.filter((p) => p.status === "pending").length}
                </h3>
              </div>
              <Clock className='w-12 h-12 text-yellow-600 opacity-20' />
            </div>
          </CardContent>
        </Card>
        <Card className='shadow-sm border-none bg-white'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-medium text-muted-foreground uppercase'>
                  Refunded
                </p>
                <h3 className='text-2xl font-bold text-purple-600 mt-1'>
                  {
                    summaryData.filter(
                      (p) =>
                        p.status === "refunded" ||
                        p.status === "partially_refunded",
                    ).length
                  }
                </h3>
              </div>
              <RotateCcw className='w-12 h-12 text-purple-600 opacity-20' />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='shadow-sm border-none bg-white'>
        <CardContent className='p-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <Input
                placeholder='Search by invoice or transaction ID...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
            <div className='flex gap-2 overflow-x-auto'>
              {["ALL", "PENDING", "COMPLETED", "FAILED", "REFUNDED"].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition",
                      filterStatus === s
                        ? "bg-[#C9973A] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    )}
                  >
                    {s === "ALL"
                      ? "All"
                      : s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
                ),
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='shadow-sm border-none bg-white'>
        <CardHeader>
          <CardTitle className='text-lg'>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          {isLoading ? (
            <div className='p-6 space-y-3'>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className='h-16 w-full' />
                ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow
                      key={p.id}
                      className='cursor-pointer hover:bg-muted/50'
                      onClick={() => openDetail(p)}
                    >
                      <TableCell className='font-mono text-sm'>
                        {p.transactionId || p.id?.slice(0, 10)}
                      </TableCell>
                      <TableCell className='text-sm text-muted-foreground'>
                        {p.invoiceId?.slice(0, 8) || "—"}
                      </TableCell>
                      <TableCell className='text-sm capitalize'>
                        {p.method || "—"}
                      </TableCell>
                      <TableCell className='font-medium'>
                        {formatCurrency(p.amount || 0)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-xs",
                            STATUS_STYLES[p.status] || "bg-gray-100",
                          )}
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-sm text-muted-foreground'>
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className='h-32 text-center text-muted-foreground'
                      >
                        No payments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className='flex items-center justify-between px-6 py-4 border-t'>
                  <p className='text-sm text-muted-foreground'>
                    Showing {(page - 1) * PAGE_SIZE + 1}-
                    {Math.min(page * PAGE_SIZE, total)} of {total}
                  </p>
                  <div className='flex items-center gap-1'>
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <ChevronLeft className='w-4 h-4' />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <Button
                          key={p}
                          variant={p === page ? "default" : "outline"}
                          size='sm'
                          className={p === page ? "bg-[#0F1B2D]" : ""}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </Button>
                      ),
                    )}
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent className='w-full sm:max-w-xl overflow-y-auto'>
          <SheetHeader className='border-b pb-4'>
            <SheetTitle className='text-xl font-serif'>
              Record Payment
            </SheetTitle>
            <SheetDescription>
              Enter payment details to record a new transaction
            </SheetDescription>
          </SheetHeader>

          <div className='space-y-4 p-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-[#0F1B2D]'>
                Invoice ID
              </label>
              <Input
                value={createForm.invoiceId}
                onChange={(e) =>
                  setCreateForm({ ...createForm, invoiceId: e.target.value })
                }
                placeholder='Invoice UUID'
              />
            </div>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#0F1B2D]'>
                  Amount
                </label>
                <Input
                  type='number'
                  min='0'
                  step='0.01'
                  value={createForm.amount}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, amount: e.target.value })
                  }
                  placeholder='0.00'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#0F1B2D]'>
                  Method
                </label>
                <Select
                  value={createForm.method}
                  onValueChange={(v) =>
                    setCreateForm({ ...createForm, method: v })
                  }
                >
                  <SelectTrigger className='w-full bg-white'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-[#0F1B2D]'>
                Transaction ID
              </label>
              <Input
                value={createForm.transactionId}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    transactionId: e.target.value,
                  })
                }
                placeholder='Optional external reference'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-[#0F1B2D]'>
                Description
              </label>
              <textarea
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({ ...createForm, description: e.target.value })
                }
                placeholder='Optional payment notes'
                className='min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              />
            </div>
            <div className='flex gap-2 pt-2'>
              <Button
                className='bg-[#0F1B2D] hover:bg-[#1a2a3a]'
                onClick={submitCreatePayment}
                disabled={createLoading}
              >
                {createLoading ? "Recording..." : "Record Payment"}
              </Button>
              <Button variant='outline' onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className='w-full sm:max-w-3xl overflow-y-auto'>
          <SheetHeader className='border-b pb-4'>
            <SheetTitle className='text-xl font-serif'>
              Payment Details
            </SheetTitle>
            <SheetDescription>
              View payment information and manage refunds
            </SheetDescription>
          </SheetHeader>

          {detailLoading ? (
            <div className='p-4 space-y-4'>
              <Skeleton className='h-8 w-48' />
              <Skeleton className='h-20 w-full' />
              <Skeleton className='h-20 w-full' />
            </div>
          ) : activePayment ? (
            <div className='space-y-6 p-4'>
              <div className='grid grid-cols-2 gap-4'>
                <Card className='border-none bg-gray-50'>
                  <CardContent className='p-4 space-y-1'>
                    <p className='text-xs text-muted-foreground uppercase font-medium'>
                      Amount
                    </p>
                    <p className='text-xl font-bold'>
                      {formatCurrency(Number(activePayment.amount))}
                    </p>
                    {activePayment.fee > 0 && (
                      <p className='text-xs text-muted-foreground'>
                        Fee: {formatCurrency(Number(activePayment.fee))} | Net:{" "}
                        {formatCurrency(Number(activePayment.netAmount))}
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
                        STATUS_STYLES[activePayment.status],
                      )}
                    >
                      {activePayment.status}
                    </Badge>
                    {activePayment.paidAt && (
                      <p className='text-xs text-muted-foreground'>
                        Paid: {new Date(activePayment.paidAt).toLocaleString()}
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
                      {activePayment.method?.replace(/_/g, " ")}
                    </p>
                    {activePayment.currency && (
                      <p className='text-xs text-muted-foreground'>
                        {activePayment.currency}
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
                      {activePayment.transactionId || "—"}
                    </p>
                    {activePayment.id && (
                      <p className='text-xs text-muted-foreground'>
                        ID: {activePayment.id.slice(0, 12)}...
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {activePayment.description && (
                <Card className='border-none bg-gray-50'>
                  <CardContent className='p-4'>
                    <p className='text-xs text-muted-foreground uppercase font-medium mb-1'>
                      Description
                    </p>
                    <p className='text-sm'>{activePayment.description}</p>
                  </CardContent>
                </Card>
              )}

              {activePayment.invoice && (
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
                          {activePayment.invoice.id?.slice(0, 12)}...
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-xs text-muted-foreground'>
                          Invoice Amount
                        </span>
                        <span className='text-sm font-medium'>
                          {formatCurrency(Number(activePayment.invoice.amount))}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-xs text-muted-foreground'>
                          Invoice Status
                        </span>
                        <Badge className='text-xs'>
                          {activePayment.invoice.status}
                        </Badge>
                      </div>
                      {activePayment.invoice.invoiceNumber && (
                        <div className='flex justify-between'>
                          <span className='text-xs text-muted-foreground'>
                            Invoice #
                          </span>
                          <span className='text-sm'>
                            {activePayment.invoice.invoiceNumber}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activePayment.booking && (
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
                          {activePayment.booking.id?.slice(0, 12)}...
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-xs text-muted-foreground'>
                          Check-in
                        </span>
                        <span className='text-sm'>
                          {activePayment.booking.checkIn
                            ? new Date(
                                activePayment.booking.checkIn,
                              ).toLocaleDateString()
                            : "—"}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-xs text-muted-foreground'>
                          Check-out
                        </span>
                        <span className='text-sm'>
                          {activePayment.booking.checkOut
                            ? new Date(
                                activePayment.booking.checkOut,
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
                            Number(activePayment.booking.totalPrice),
                          )}
                        </span>
                      </div>
                      {activePayment.booking.guest && (
                        <div className='flex justify-between items-center pt-1 border-t border-gray-200 mt-1'>
                          <span className='text-xs text-muted-foreground flex items-center gap-1'>
                            <User className='w-3 h-3' /> Guest
                          </span>
                          <span className='text-sm'>
                            {activePayment.booking.guest.firstName}{" "}
                            {activePayment.booking.guest.lastName}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeRefunds.length > 0 && (
                <div>
                  <h4 className='text-sm font-semibold text-[#0F1B2D] mb-2 flex items-center gap-1.5'>
                    <ArrowLeftRight className='w-4 h-4' /> Refund History
                  </h4>
                  <div className='space-y-2'>
                    {activeRefunds.map((r) => (
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
                    <div className='grid grid-cols-2 gap-3'>
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
                            setRefundForm({ ...refundForm, reason: v })
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
                      onClick={submitRefund}
                      disabled={actionLoading === "refund"}
                    >
                      {actionLoading === "refund"
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
    </div>
  );
}
