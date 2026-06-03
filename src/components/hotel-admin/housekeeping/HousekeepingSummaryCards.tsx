import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Clock, CheckCircle } from 'lucide-react';

interface Summary {
  dirty: number;
  cleaning: number;
  inspecting: number;
  clean: number;
  total: number;
  pendingActive: number;
  completed: number;
}

interface HousekeepingSummaryCardsProps {
  summary: Summary;
}

export function HousekeepingSummaryCards({ summary }: HousekeepingSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Total Tasks</p>
              <h3 className="text-2xl font-bold text-[#0F1B2D] mt-1">{summary.total}</h3>
            </div>
            <Sparkles className="w-12 h-12 text-blue-600 opacity-20" />
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Pending / Active</p>
              <h3 className="text-2xl font-bold text-yellow-600 mt-1">{summary.pendingActive}</h3>
            </div>
            <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-none bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Completed</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">{summary.completed}</h3>
            </div>
            <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
