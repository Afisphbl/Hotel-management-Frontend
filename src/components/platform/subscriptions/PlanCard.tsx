import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Check, Settings, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";

interface PlanCardProps {
  plan: any;
  onEdit: (plan: any) => void;
  onDelete: (plan: any) => void;
}

export function PlanCard({ plan, onEdit, onDelete }: PlanCardProps) {
  const features: string[] = Array.isArray(plan.features)
    ? plan.features
    : Array.isArray(plan.featureList)
      ? plan.featureList
      : (plan.features?.enabledFeatures ?? []);

  return (
    <Card className="shadow-sm border-none bg-white relative overflow-hidden group flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#C9973A] opacity-20 group-hover:opacity-100 transition-opacity" />
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-serif text-xl">{plan.name}</CardTitle>
            <CardDescription>{plan.hotels ?? plan.activeProperties ?? 0} Active Properties</CardDescription>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg">
            <CreditCard className="w-5 h-5 text-[#C9973A]" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col flex-1">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-[#0F1B2D]">{formatCurrency(plan.price ?? plan.amount ?? 0)}</span>
          <span className="text-sm text-muted-foreground">/per month</span>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Included Features</p>
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-green-600" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto pt-4 flex gap-2">
          <Button variant="outline" className="flex-1 text-xs" onClick={() => onEdit(plan)}>Edit Plan</Button>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-9 w-9" />}>
              <Settings className="w-4 h-4 text-slate-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem className="gap-2" onClick={() => onEdit(plan)}>
                <Edit className="w-4 h-4" /> Quick Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-red-600" onClick={() => onDelete(plan)}>
                <Trash2 className="w-4 h-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
