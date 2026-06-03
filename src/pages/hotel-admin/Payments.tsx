import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  PaymentsHeader,
  PaymentsSummaryCards,
  PaymentsFilters,
  PaymentsTable,
  PaymentRecordSheet,
  PaymentDetailSheet,
} from "@/components/hotel-admin/payments";

export function AdminPayments() {
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any[]>([]);
  const [totalRefundedAmount, setTotalRefundedAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activePaymentId, setActivePaymentId] = useState<string | null>(null);

  const PAGE_SIZE = 15;

  useEffect(() => {
    setPage(1);
  }, [filterStatus]);

  useEffect(() => {
    fetchPayments();
  }, [page, filterStatus]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const [paymentsRes, refundsRes] = await Promise.all([
        api.get("finance/payments?page=1&limit=1000"),
        api.get("finance/refunds?page=1&limit=1000").catch(() => ({ data: [], items: [] })),
      ]);
      const paymentsData = paymentsRes.data || paymentsRes.items || [];
      const refundsData = refundsRes.data || refundsRes.items || [];
      setSummaryData(paymentsData);
      setTotalRefundedAmount(
        refundsData.reduce((sum: number, r: any) => sum + (Number(r.amount) || 0), 0),
      );
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

  const handleRefresh = () => {
    fetchPayments();
    fetchSummary();
  };

  const handleViewDetail = (payment: any) => {
    setActivePaymentId(payment.id);
    setIsDetailOpen(true);
  };

  return (
    <div className='space-y-8 pb-10'>
      <PaymentsHeader onRecordPayment={() => setIsCreateOpen(true)} />

      <PaymentsSummaryCards
        summaryData={summaryData}
        totalRefundedAmount={totalRefundedAmount}
      />

      <PaymentsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
      />

      <PaymentsTable
        isLoading={isLoading}
        payments={payments}
        searchTerm={searchTerm}
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onViewDetail={handleViewDetail}
      />

      <PaymentRecordSheet
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleRefresh}
      />

      <PaymentDetailSheet
        paymentId={activePaymentId}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
