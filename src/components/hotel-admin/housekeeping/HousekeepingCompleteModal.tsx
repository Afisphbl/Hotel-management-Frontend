import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface HousekeepingCompleteModalProps {
  target: any;
  onClose: () => void;
  completeNotes: string;
  onNotesChange: (notes: string) => void;
  onComplete: () => void;
  completing: boolean;
}

export function HousekeepingCompleteModal({ target, onClose, completeNotes, onNotesChange, onComplete, completing }: HousekeepingCompleteModalProps) {
  if (!target) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-[#0F1B2D]">Complete Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground">Mark housekeeping task for Room {target.room || target.roomNumber} as completed</p>
          <div className="space-y-1.5"><Label>Notes</Label>
            <textarea className="flex w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={completeNotes} onChange={e => onNotesChange(e.target.value)} placeholder="Any special notes or observations?" /></div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={onComplete} disabled={completing}>
              {completing ? 'Completing...' : 'Mark Completed'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
