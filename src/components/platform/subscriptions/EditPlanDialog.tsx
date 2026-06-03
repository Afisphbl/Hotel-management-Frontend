import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export interface EditingPlan {
  id: string;
  name: string;
  price: number | string;
  features: string;
}

interface EditPlanDialogProps {
  plan: EditingPlan | null;
  onChange: (plan: EditingPlan) => void;
  onClose: () => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function EditPlanDialog({ plan, onChange, onClose, onSubmit, isPending }: EditPlanDialogProps) {
  return (
    <Dialog open={!!plan} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Edit Plan</DialogTitle>
          <DialogDescription>Update the subscription plan details.</DialogDescription>
        </DialogHeader>
        {plan && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Plan Name</Label>
              <Input id="plan-name" value={plan.name}
                onChange={(e) => onChange({ ...plan, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-price">Price (per month)</Label>
              <Input id="plan-price" type="number" min="0" step="0.01" value={plan.price}
                onChange={(e) => onChange({ ...plan, price: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-features">Features (comma-separated)</Label>
              <Input id="plan-features" value={plan.features}
                onChange={(e) => onChange({ ...plan, features: e.target.value })} />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button className="bg-[#0F1B2D] hover:bg-[#1a2a3a]" onClick={onSubmit} disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
