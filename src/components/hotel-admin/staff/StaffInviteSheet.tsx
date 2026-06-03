import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
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

interface StaffInviteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: InviteForm;
  onFormChange: (form: InviteForm) => void;
  roles: Role[];
  isSaving: boolean;
  onInvite: () => void;
}

export function StaffInviteSheet({ open, onOpenChange, form, onFormChange, roles, isSaving, onInvite }: StaffInviteSheetProps) {
  const resetForm = () => onFormChange({ email: '', firstName: '', lastName: '', roleId: '', notes: '' });

  return (
    <Sheet open={open} onOpenChange={(open) => { if (!open) { resetForm(); onOpenChange(false); } }}>
      <SheetContent className="sm:max-w-125 p-0 flex flex-col h-full">
        <SheetHeader className="border-b px-6 py-5 shrink-0">
          <SheetTitle className="text-xl font-serif">Invite Staff Member</SheetTitle>
          <SheetDescription>Grant a user access with a specific role.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-md space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="first-name">First Name *</Label>
                <Input id="first-name" title="First Name" value={form.firstName} onChange={e => onFormChange({ ...form, firstName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last-name">Last Name *</Label>
                <Input id="last-name" title="Last Name" value={form.lastName} onChange={e => onFormChange({ ...form, lastName: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" title="Email" type="email" value={form.email} onChange={e => onFormChange({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role-select">Role *</Label>
              <select
                id="role-select"
                title="Role"
                className="flex w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                value={form.roleId}
                onChange={e => onFormChange({ ...form, roleId: e.target.value })}
              >
                <option value="">Select a role...</option>
                {roles.filter(r => !r.name.toUpperCase().includes('OWNER')).map(r => (
                  <option key={r.id} value={r.id}>{r.name.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes-textarea">Notes (optional)</Label>
              <textarea
                id="notes-textarea"
                title="Notes"
                className="flex w-full min-h-20 px-3 py-2 border border-input bg-background rounded-md text-sm"
                value={form.notes}
                onChange={e => onFormChange({ ...form, notes: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="border-t px-6 py-4 shrink-0 flex justify-end gap-3">
          <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false); }}>Cancel</Button>
          <Button onClick={onInvite} disabled={isSaving} className="bg-[#0F1B2D]">
            {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Inviting...</> : <><UserPlus className="w-4 h-4 mr-2" /> Send Invite</>}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
