import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface StaffHeaderProps {
  onInvite: () => void;
}

export function StaffHeader({ onInvite }: StaffHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Staff Management</h1>
        <p className="text-sm text-muted-foreground">Manage hotel staff, roles, and access permissions</p>
      </div>
      <Button onClick={onInvite} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
        <UserPlus className="w-4 h-4 mr-2" /> Invite Staff
      </Button>
    </div>
  );
}
