import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface StaffHeaderProps {
  onInvite: () => void;
}

export function StaffHeader({ onInvite }: StaffHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Staff Access Control</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage who has access to your hotel and what roles they hold</p>
      </div>
      <Button onClick={onInvite} className="flex-1 sm:flex-none bg-[#0F1B2D] hover:bg-[#1a2a3a]">
        <UserPlus className="w-4 h-4 mr-2" /> Invite Staff
      </Button>
    </div>
  );
}
