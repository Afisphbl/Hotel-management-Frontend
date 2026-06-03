import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export interface NewTier {
  plan: string;
  price: number;
  features: string;
}

interface AddTierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: NewTier;
  onChange: (value: NewTier) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function AddTierDialog({ open, onOpenChange, value, onChange, onSubmit, isPending }: AddTierDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Add New Tier</DialogTitle>
          <DialogDescription>Create a new subscription tier.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tier-plan">Plan</Label>
            <select
              title="Plan"
              id="tier-plan"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={value.plan}
              onChange={(e) => onChange({ ...value, plan: e.target.value })}
            >
              <option value="BASIC">Basic</option>
              <option value="PROFESSIONAL">Professional</option>
              <option value="ENTERPRISE">Enterprise</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tier-price">Price (per month)</Label>
            <Input id="tier-price" type="number" min="0" step="0.01" value={value.price}
              onChange={(e) => onChange({ ...value, price: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tier-features">Features (comma-separated)</Label>
            <Input id="tier-features" value={value.features}
              onChange={(e) => onChange({ ...value, features: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-[#0F1B2D] hover:bg-[#1a2a3a]" onClick={onSubmit} disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Create Tier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
