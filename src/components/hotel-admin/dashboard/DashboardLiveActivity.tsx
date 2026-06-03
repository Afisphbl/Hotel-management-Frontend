import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { buildActivityItems } from './types';
import type { DashboardData } from './types';

function ActivityItem({ time, title, desc, type }: { time: string; title: string; desc: string; type: 'arrival' | 'booking' | 'maintenance' | 'departure' }) {
  return (
    <div className="flex gap-4 group">
      <div className="mt-1">
        <div className={cn(
          "w-2 h-2 rounded-full",
          type === 'arrival' && 'bg-green-500',
          type === 'booking' && 'bg-[#C9973A]',
          type === 'maintenance' && 'bg-blue-500',
          type === 'departure' && 'bg-red-500',
        )} />
        <div className="w-0.5 h-full bg-muted mx-auto my-1 group-last:hidden" />
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-[#0F1B2D]">{title}</p>
          <span className="text-[10px] text-muted-foreground">{time}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

interface DashboardLiveActivityProps {
  data: DashboardData | null;
}

export function DashboardLiveActivity({ data }: DashboardLiveActivityProps) {
  const items = buildActivityItems(data);
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Live Activity</CardTitle>
        <CardDescription>Real-time property updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {items.map((item, i) => (
            <ActivityItem key={i} time={item.time} title={item.title} desc={item.desc} type={item.type} />
          ))}
          <Button variant="ghost" className="w-full text-xs text-[#C9973A] hover:bg-[#C9973A]/5">
            View all activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
