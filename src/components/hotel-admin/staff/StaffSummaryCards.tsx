import { Card, CardContent } from '@/components/ui/card';
import { Users, ShieldCheck, Clock, XCircle } from 'lucide-react';

interface StaffSummaryCardsProps {
  total: number;
  active: number;
  pending: number;
  inactive: number;
}

export function StaffSummaryCards({ total, active, pending, inactive }: StaffSummaryCardsProps) {
  const cards = [
    { label: 'Total Staff', value: total, icon: Users, color: 'text-blue-600' },
    { label: 'Active', value: active, icon: ShieldCheck, color: 'text-green-600' },
    { label: 'Pending', value: pending, icon: Clock, color: 'text-orange-600' },
    { label: 'Inactive', value: inactive, icon: XCircle, color: 'text-red-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map(s => (
        <Card key={s.label} className="shadow-sm border-none bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">{s.label}</p>
                <h3 className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</h3>
              </div>
              <s.icon className={`w-12 h-12 ${s.color} opacity-20`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
