import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

export function DashboardSection({ title, icon: Icon, children }: DashboardSectionProps) {
  return (
    <Card className="border-none bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#0F1B2D]">
          <Icon className="h-4 w-4 text-[#C9973A]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
