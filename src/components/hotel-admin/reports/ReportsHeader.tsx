import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ReportsHeaderProps {
  onExport: () => void;
}

export function ReportsHeader({ onExport }: ReportsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#0F1B2D]">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground">Comprehensive insights into hotel operations</p>
      </div>
      <Button onClick={onExport} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
        <Download className="w-4 h-4 mr-2" /> Export Report
      </Button>
    </div>
  );
}
