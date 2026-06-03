import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw } from "lucide-react";

interface UserFormData {
  name: string;
  email: string;
  role: string;
  phone: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newUser: UserFormData;
  onUserChange: (user: UserFormData) => void;
  onCreateUser: () => void;
  isPending: boolean;
}

export function AddUserModal({
  isOpen,
  onOpenChange,
  newUser,
  onUserChange,
  onCreateUser,
  isPending,
}: AddUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Administrative User Creation
          </DialogTitle>
          <DialogDescription>
            This tool is intended for emergency onboarding or administrative
            support. The user will receive an invitation email to set their
            password.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="e.g. John Doe"
              value={newUser.name}
              onChange={(e) =>
                onUserChange({ ...newUser, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={newUser.email}
              onChange={(e) =>
                onUserChange({ ...newUser, email: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(v) =>
                  onUserChange({ ...newUser, role: v ?? "" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOTEL_OWNER">Owner</SelectItem>
                  <SelectItem value="HOTEL_MANAGER">Manager</SelectItem>
                  <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                  <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                placeholder="+1..."
                value={newUser.phone}
                onChange={(e) =>
                  onUserChange({ ...newUser, phone: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#0F1B2D] hover:bg-[#1a2a3a]"
            onClick={onCreateUser}
            disabled={isPending}
          >
            {isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}