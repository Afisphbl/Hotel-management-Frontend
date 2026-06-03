import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: any;
  isMoney?: boolean;
  icon: LucideIcon;
  trend?: number;
  loading: boolean;
}

export function KPICard({
  title,
  value,
  isMoney,
  icon: Icon,
  trend,
  loading,
}: KPICardProps) {
  return (
    <Card className='shadow-sm border-none bg-white'>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between mb-2'>
          <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
            {title}
          </p>
          <Icon className='w-4 h-4 text-[#C9973A]' />
        </div>
        <div className='flex items-baseline gap-2'>
          {loading ? (
            <Skeleton className='h-8 w-24' />
          ) : (
            <h3 className='text-2xl font-bold text-[#0F1B2D]'>
              {isMoney ? <MoneyDisplay amount={value} /> : value}
            </h3>
          )}
          {trend !== undefined && (
            <span
              className={cn(
                "text-[10px] font-bold flex items-center",
                trend > 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {trend > 0 ? (
                <TrendingUp className='w-3 h-3 mr-0.5' />
              ) : (
                <TrendingDown className='w-3 h-3 mr-0.5' />
              )}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
