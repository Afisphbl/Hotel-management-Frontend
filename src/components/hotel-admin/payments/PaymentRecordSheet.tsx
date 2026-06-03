import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";

const PAYMENT_METHODS = [
  "cash",
  "credit_card",
  "debit_card",
  "bank_transfer",
  "mobile_payment",
] as const;

interface PaymentRecordSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PaymentRecordSheet({
  isOpen,
  onOpenChange,
  onSuccess,
}: PaymentRecordSheetProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    invoiceId: "",
    amount: "",
    method: "cash",
    transactionId: "",
    description: "",
  });

  const resetForm = () => {
    setForm({
      invoiceId: "",
      amount: "",
      method: "cash",
      transactionId: "",
      description: "",
    });
  };

  const handleSubmit = async () => {
    if (!form.invoiceId || !form.amount) {
      toast.error("Invoice ID and amount are required");
      return;
    }
    setLoading(true);
    try {
      await api.post("finance/payments", {
        invoiceId: form.invoiceId,
        amount: Number(form.amount),
        method: form.method,
        transactionId: form.transactionId || undefined,
        description: form.description || undefined,
        idempotencyKey: crypto.randomUUID(),
      });
      toast.success("Payment recorded");
      onSuccess();
      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
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
              value={form.invoiceId}
              onChange={(e) =>
                setForm({ ...form, invoiceId: e.target.value })
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
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                placeholder='0.00'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-[#0F1B2D]'>
                Method
              </label>
              <Select
                value={form.method}
                onValueChange={(v) =>
                  setForm({ ...form, method: v ?? '' })
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
              value={form.transactionId}
              onChange={(e) =>
                setForm({
                  ...form,
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
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder='Optional payment notes'
              className='min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            />
          </div>
          <div className='flex gap-2 pt-2'>
            <Button
              className='bg-[#0F1B2D] hover:bg-[#1a2a3a]'
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Recording..." : "Record Payment"}
            </Button>
            <Button variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
