import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { Hotel } from "./utils";

interface EditHotelDialogProps {
  hotel: Hotel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (hotel: Hotel) => void;
  onSave: () => void;
  isPending: boolean;
}

export function EditHotelDialog({ hotel, open, onOpenChange, onChange, onSave, isPending }: EditHotelDialogProps) {
  if (!hotel) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Hotel Configuration</DialogTitle>
          <DialogDescription>Quickly update the most critical property settings.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Hotel Name</Label>
            <Input id="edit-name" value={hotel.name} onChange={(e) => onChange({ ...hotel, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-owner">Owner Name</Label>
            <Input id="edit-owner" value={hotel.ownerName ?? ""} onChange={(e) => onChange({ ...hotel, ownerName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-rooms">Rooms</Label>
            <Input
              id="edit-rooms" type="number" min="0"
              value={hotel.rooms ?? ""}
              onChange={(e) => onChange({ ...hotel, rooms: Number(e.target.value) || 0 })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-plan">Subscription Plan</Label>
              <Select value={hotel.plan ?? ""} onValueChange={(v) => onChange({ ...hotel, plan: v })}>
                <SelectTrigger id="edit-plan"><SelectValue placeholder="Select plan" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BASIC">Basic</SelectItem>
                  <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Availability</Label>
              <Select value={hotel.status ?? ""} onValueChange={(v) => onChange({ ...hotel, status: v })}>
                <SelectTrigger id="edit-status"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-[#0F1B2D] hover:bg-[#1a2a3a]" onClick={onSave} disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Apply Updates"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
