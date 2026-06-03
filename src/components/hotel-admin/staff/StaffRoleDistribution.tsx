import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

interface DistributionItem {
  roleId: string;
  roleName: string;
  count: number;
}

interface StaffRoleDistributionProps {
  distribution: DistributionItem[];
}

export function StaffRoleDistribution({ distribution }: StaffRoleDistributionProps) {
  if (!distribution?.length) return null;

  return (
    <Card className="shadow-sm border-none bg-white">
      <CardContent className="p-6">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#C9973A]" /> Role Distribution
        </h3>
        <div className="flex flex-wrap gap-3">
          {distribution.map(d => (
            <Badge key={d.roleId} variant="outline" className="px-4 py-2 text-sm gap-2 border-slate-200">
              <span className="font-semibold text-[#0F1B2D]">{d.roleName}</span>
              <span className="bg-[#C9973A]/10 text-[#C9973A] px-2 py-0.5 rounded-full text-xs font-bold">{d.count}</span>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
