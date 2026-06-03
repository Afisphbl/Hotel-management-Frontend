import { Card, CardContent } from '@/components/ui/card';
import { Users, ShieldCheck, Clock, XCircle } from 'lucide-react';

interface StaffSummary {
  total?: number;
  active?: number;
  pending?: number;
  inactive?: number;
}

interface StaffSummaryCardsProps {
  summary: StaffSummary | null;
  total: number;
}

export function StaffSummaryCards({ summary, total }: StaffSummaryCardsProps) {
  const cards = [
    { label: 'Total Staff', value: summary?.total ?? total, icon: Users, color: 'text-blue-600' },
    { label: 'Active', value: summary?.active ?? 0, icon: ShieldCheck, color: 'text-green-600' },
    { label: 'Pending', value: summary?.pending ?? 0, icon: Clock, color: 'text-orange-600' },
    { label: 'Inactive', value: summary?.inactive ?? 0, icon: XCircle, color: 'text-red-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map(card => (
        <Card key={card.label} className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">{card.label}</p>
                <h3 className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</h3>
              </div>
              <card.icon className={`w-12 h-12 ${card.color} opacity-20`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
