import { FileText, ReceiptText, CheckCircle2, CreditCard, AlertTriangle, ShieldX, type LucideIcon } from 'lucide-react';

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'partially_paid' | 'overdue' | 'void';

export type FilterValue = 'all' | InvoiceStatus;

export type InvoiceLineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number;
};

export type InvoiceRecord = {
  id: string;
  invoiceNumber?: string;
  bookingId: string;
  amount?: number;
  subtotal?: number;
  taxTotal?: number;
  currency?: string;
  status?: string;
  dueDate?: string;
  paidAt?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  booking?: {
    id?: string;
    totalPrice?: number;
    checkIn?: string;
    checkOut?: string;
    guest?: {
      name?: string;
      fullName?: string;
      email?: string;
      phone?: string;
    };
  };
  lineItems?: InvoiceLineItem[];
};

export type PaymentRecord = {
  id: string;
  amount?: number;
  method?: string;
  status?: string;
  transactionId?: string;
  paidAt?: string;
  createdAt?: string;
};

export type CreateInvoiceForm = {
  bookingId: string;
  amount: string;
  currency: string;
  dueDate: string;
  notes: string;
};

export const STATUS_FILTERS: Array<{ value: FilterValue; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'issued', label: 'Issued' },
  { value: 'partially_paid', label: 'Partially Paid' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'void', label: 'Voided' },
];

export const STATUS_META: Record<InvoiceStatus, { label: string; className: string; icon: LucideIcon }> = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-800 border-slate-200', icon: FileText },
  issued: { label: 'Issued', className: 'bg-blue-100 text-blue-800 border-blue-200', icon: ReceiptText },
  paid: { label: 'Paid', className: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
  partially_paid: { label: 'Partially Paid', className: 'bg-amber-100 text-amber-800 border-amber-200', icon: CreditCard },
  overdue: { label: 'Overdue', className: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle },
  void: { label: 'Voided', className: 'bg-slate-200 text-slate-700 border-slate-300', icon: ShieldX },
};

export const PAGE_SIZE = 15;
