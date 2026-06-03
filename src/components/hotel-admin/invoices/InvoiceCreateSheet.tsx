import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import type { CreateInvoiceForm } from './types';

interface InvoiceCreateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: CreateInvoiceForm;
  onFormChange: (form: CreateInvoiceForm) => void;
  isSaving: boolean;
  onSubmit: () => void;
}

export function InvoiceCreateSheet({ open, onOpenChange, form, onFormChange, isSaving, onSubmit }: InvoiceCreateSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl font-serif">Create Invoice</SheetTitle>
          <SheetDescription>Generate a new invoice from a booking</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#0F1B2D]">Booking ID</label>
            <Input
              value={form.bookingId}
              onChange={(e) => onFormChange({ ...form, bookingId: e.target.value })}
              placeholder="Booking UUID"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0F1B2D]">Amount</label>
              <Input type="number" min="0" step="0.01" value={form.amount}
                onChange={(e) => onFormChange({ ...form, amount: e.target.value })} placeholder="Optional" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0F1B2D]">Currency</label>
              <Input value={form.currency}
                onChange={(e) => onFormChange({ ...form, currency: e.target.value })} placeholder="ETB" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#0F1B2D]">Due Date</label>
            <Input type="date" value={form.dueDate}
              onChange={(e) => onFormChange({ ...form, dueDate: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#0F1B2D]">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => onFormChange({ ...form, notes: e.target.value })}
              placeholder="Optional billing notes"
              className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button className="bg-[#0F1B2D] hover:bg-[#1a2a3a]" onClick={onSubmit} disabled={isSaving}>
              {isSaving ? 'Creating...' : 'Create Invoice'}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
