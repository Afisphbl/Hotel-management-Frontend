import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';

interface PricingSectionProps {
  title: string;
  desc: string;
  icon: any;
  onAdd: () => void;
  children: React.ReactNode;
  loading: boolean;
}

export function PricingSection({ title, desc, icon: Icon, onAdd, children, loading }: PricingSectionProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#C9973A]/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#C9973A]" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-xs">{desc}</CardDescription>
          </div>
        </div>
        <Button size="sm" className="bg-[#0F1B2D] hover:bg-[#1a2a3a]" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : children}
      </CardContent>
    </Card>
  );
}
