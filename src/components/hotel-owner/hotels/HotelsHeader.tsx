import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface HotelsHeaderProps {
  isCreating: boolean;
  onToggleCreate: () => void;
}

export function HotelsHeader({ isCreating, onToggleCreate }: HotelsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-serif text-[#0F1B2D]">Hotel & Branch Management</h1>
        <p className="text-muted-foreground">Manage your properties, settings, and team access from a central dashboard.</p>
      </div>
      <Button onClick={onToggleCreate} className="bg-[#0F1B2D]">
        {isCreating ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" />Add New Hotel</>}
      </Button>
    </div>
  );
}
