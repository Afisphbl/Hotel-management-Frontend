import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type KPIProps = {
  title: string;
  value: React.ReactNode;
  icon: any;
  color?: string;
  loading?: boolean;
};

export default function KPICard({ title, value, icon: Icon, color, loading }: KPIProps) {
  return (
    <Card className="border-none shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-2" />
            ) : (
              <h3 className="text-2xl font-bold text-[#0F1B2D] mt-1">{value}</h3>
            )}
          </div>
          <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
