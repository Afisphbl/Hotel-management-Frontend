import { format } from 'date-fns';
import type { InvoiceStatus, InvoiceRecord } from './types';

export function normalizeStatus(status?: string): InvoiceStatus {
  const value = String(status || 'draft').toLowerCase();
  if (['draft', 'issued', 'paid', 'partially_paid', 'overdue', 'void'].includes(value)) return value as InvoiceStatus;
  return 'draft';
}

export function toNumber(value: unknown) {
  const parsed = Number(value || 0);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function normalizeInvoice(invoice: InvoiceRecord): InvoiceRecord {
  const booking = invoice.booking;
  let guest = booking?.guest;

  if (guest && !guest.fullName && !guest.name) {
    const firstName = (guest as any).firstName || '';
    const lastName = (guest as any).lastName || '';
    guest.fullName = `${firstName} ${lastName}`.trim() || 'Guest';
  }

  return {
    ...invoice,
    status: normalizeStatus(invoice.status),
    amount: toNumber(invoice.amount),
    subtotal: toNumber(invoice.subtotal),
    taxTotal: toNumber(invoice.taxTotal),
    booking: booking
      ? { ...booking, guest, totalPrice: toNumber(booking.totalPrice) }
      : booking,
    lineItems: (invoice.lineItems || []).map((item) => ({
      ...item,
      quantity: toNumber(item.quantity),
      unitPrice: toNumber(item.unitPrice),
      total: toNumber(item.total),
      taxRate: typeof item.taxRate === 'number' ? item.taxRate : undefined,
    })),
  };
}

export function formatDate(date?: string) {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM d, yyyy');
}

export function formatDateTime(date?: string) {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM d, yyyy h:mm a');
}
