import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface BookingsBulkActionBarProps {
  selectedCount: number;
  bulkAction: string;
  onBulkActionChange: (action: string) => void;
  onApply: () => void;
  onDeselectAll: () => void;
  bulkProcessing: boolean;
}

export function BookingsBulkActionBar({
  selectedCount, bulkAction, onBulkActionChange,
  onApply, onDeselectAll, bulkProcessing,
}: BookingsBulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between bg-[#0F1B2D] text-white rounded-lg px-5 py-3 shadow-sm">
      <span className="text-sm font-medium">{selectedCount} selected</span>
      <div className="flex items-center gap-3">
        <Select value={bulkAction} onValueChange={(v) => onBulkActionChange(v || "")}>
          <SelectTrigger className="w-[180px] bg-white/10 text-white border-white/20">
            <SelectValue placeholder="Bulk action..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="confirm">Confirm</SelectItem>
            <SelectItem value="checkin">Check In</SelectItem>
            <SelectItem value="checkout">Check Out</SelectItem>
            <SelectItem value="noshow">No Show</SelectItem>
            <SelectItem value="cancel">Cancel</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" variant="secondary" className="bg-white text-[#0F1B2D] hover:bg-white/90"
          disabled={!bulkAction || bulkProcessing} onClick={onApply}>
          {bulkProcessing ? "Processing..." : "Apply"}
        </Button>
        <Button size="sm" variant="ghost" className="text-white/60 hover:text-white"
          onClick={onDeselectAll}>
          Deselect All
        </Button>
      </div>
    </div>
  );
}
