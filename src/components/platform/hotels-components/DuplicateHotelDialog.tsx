import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export interface DuplicateHotelState {
  name: string;
  code: string;
  ownerEmail: string;
  ownerName?: string;
  password: string;
  plan: string;
  [key: string]: unknown;
}

interface DuplicateHotelDialogProps {
  hotel: DuplicateHotelState | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (hotel: DuplicateHotelState) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function DuplicateHotelDialog({ hotel, open, onOpenChange, onChange, onSubmit, isPending }: DuplicateHotelDialogProps) {
  if (!hotel) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Duplicate Property</DialogTitle>
          <DialogDescription>
            Create a new property based on "{hotel.name}". Unique fields must be updated.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dup-name">New Hotel Name</Label>
            <Input id="dup-name" value={hotel.name} onChange={(e) => onChange({ ...hotel, name: e.target.value })} placeholder="Grand Peninsula (Copy)" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dup-code">New Hotel Code (Slug)</Label>
            <Input id="dup-code" value={hotel.code} onChange={(e) => onChange({ ...hotel, code: e.target.value })} placeholder="gp-copy" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dup-email">New Owner Email</Label>
            <Input id="dup-email" type="email" value={hotel.ownerEmail} onChange={(e) => onChange({ ...hotel, ownerEmail: e.target.value })} placeholder="owner@newhotel.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dup-owner">New Owner Name</Label>
            <Input id="dup-owner" value={hotel.ownerName ?? ""} onChange={(e) => onChange({ ...hotel, ownerName: e.target.value })} placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dup-password">Temporary Password</Label>
            <Input id="dup-password" type="password" value={hotel.password} onChange={(e) => onChange({ ...hotel, password: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dup-plan">Subscription Plan</Label>
            <Select value={hotel.plan} onValueChange={(v) => onChange({ ...hotel, plan: v })}>
              <SelectTrigger id="dup-plan"><SelectValue placeholder="Select plan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-[#0F1B2D] hover:bg-[#1a2a3a]" onClick={onSubmit} disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Duplicate Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
