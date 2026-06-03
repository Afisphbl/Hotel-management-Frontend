import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus } from 'lucide-react';

interface Role {
  id: string;
  name: string;
}

interface InviteForm {
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  notes: string;
}

interface InviteStaffSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: InviteForm;
  onFormChange: (form: InviteForm) => void;
  roles: Role[];
  isSaving: boolean;
  onInvite: () => void;
  onReset: () => void;
}

export function InviteStaffSheet({ open, onOpenChange, form, onFormChange, roles, isSaving, onInvite, onReset }: InviteStaffSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(open) => { if (!open) { onReset(); onOpenChange(false); } }}>
      <SheetContent className="sm:max-w-[500px] p-0 flex flex-col h-full">
        <SheetHeader className="border-b px-6 py-5 shrink-0">
          <SheetTitle className="text-xl font-serif">Invite Staff Member</SheetTitle>
          <SheetDescription>Grant a user access to your hotel with a specific role.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-md space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>First Name *</Label>
                <Input value={form.firstName} onChange={e => onFormChange({...form, firstName: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <Label>Last Name *</Label>
                <Input value={form.lastName} onChange={e => onFormChange({...form, lastName: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={e => onFormChange({...form, email: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label>Role *</Label>
              <select
                aria-label="Role"
                className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                value={form.roleId}
                onChange={e => onFormChange({...form, roleId: e.target.value})}
              >
                <option value="">Select a role...</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Notes (optional)</Label>
              <textarea
                className="flex w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                placeholder="Reason for granting access..."
                value={form.notes}
                onChange={e => onFormChange({...form, notes: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 shrink-0 flex justify-end gap-3">
          <SheetClose render={<Button variant="outline" onClick={onReset}>Cancel</Button>} />
          <Button onClick={onInvite} disabled={isSaving} className="bg-[#0F1B2D]">
            {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Inviting...</> : <><UserPlus className="w-4 h-4 mr-2" /> Send Invite</>}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
