import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { CATEGORY_LABELS, formatSettingValue } from "./utils";

interface PlatformSettingCardProps {
  setting: any;
  draftValue: string;
  isSaving: boolean;
  onDraftChange: (value: string) => void;
  onSave: () => void;
}

export function PlatformSettingCard({
  setting,
  draftValue,
  isSaving,
  onDraftChange,
  onSave,
}: PlatformSettingCardProps) {
  return (
    <Card
      key={setting.id || setting.key}
      className='shadow-sm border-none bg-white'
    >
      <CardHeader className='space-y-3'>
        <div className='flex items-start justify-between gap-4'>
          <div className='space-y-1'>
            <CardTitle className='text-lg flex items-center gap-2 font-serif'>
              <Settings2 className='w-4 h-4 text-[#C9973A]' />
              {setting.key}
            </CardTitle>
            <CardDescription>
              {setting.description ||
                "Managed from the platform settings database."}
            </CardDescription>
          </div>
          <Badge
            variant='outline'
            className='bg-white border-slate-200 text-slate-600 font-bold text-[10px] uppercase whitespace-nowrap'
          >
            {CATEGORY_LABELS[setting.category] ||
              String(setting.category || "system")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        <textarea
          value={draftValue}
          onChange={(event) => onDraftChange(event.target.value)}
          rows={6}
          placeholder={`Edit ${setting.key} as JSON or plain text`}
          className='w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm font-mono text-slate-700 outline-none transition focus:border-[#C9973A] focus:ring-2 focus:ring-[#C9973A]/20'
        />
        <div className='flex items-center justify-between gap-3'>
          <span className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
            Stored in global_settings
          </span>
          <Button
            onClick={onSave}
            disabled={isSaving}
            className='bg-[#0F1B2D] hover:bg-[#1a2a3a]'
          >
            {isSaving ? "Saving..." : "Save Setting"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
