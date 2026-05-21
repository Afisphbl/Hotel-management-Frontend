import React from "react";
import {
  usePlatformSettings,
  useUpdatePlatformSettings,
} from "@/hooks/usePlatformData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Settings2, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORY_LABELS: Record<string, string> = {
  smtp: "SMTP",
  payment_gateway: "Payment Gateway",
  system: "System",
  compliance: "Compliance",
};

function formatSettingValue(value: any) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

function parseSettingValue(rawValue: string) {
  const trimmed = rawValue.trim();
  if (!trimmed) return "";

  try {
    return JSON.parse(trimmed);
  } catch {
    return rawValue;
  }
}

export function PlatformSettings() {
  const {
    data: settings,
    isLoading,
    isError,
    error,
    refetch,
  } = usePlatformSettings();
  const updateSetting = useUpdatePlatformSettings();
  const [drafts, setDrafts] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (!Array.isArray(settings)) return;

    setDrafts((currentDrafts) => {
      const nextDrafts = { ...currentDrafts };

      settings.forEach((setting: any) => {
        if (nextDrafts[setting.key] === undefined) {
          nextDrafts[setting.key] = formatSettingValue(setting.value);
        }
      });

      return nextDrafts;
    });
  }, [settings]);

  const handleSave = async (setting: any) => {
    await updateSetting.mutateAsync({
      key: setting.key,
      value: parseSettingValue(
        drafts[setting.key] ?? formatSettingValue(setting.value),
      ),
      category: setting.category,
    });
  };

  const groupedSettings = Array.isArray(settings)
    ? [...settings].sort((left: any, right: any) => {
        const categoryCompare = String(left.category || "").localeCompare(
          String(right.category || ""),
        );
        if (categoryCompare !== 0) return categoryCompare;
        return String(left.key || "").localeCompare(String(right.key || ""));
      })
    : [];

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl sm:text-3xl font-serif text-[#0F1B2D]'>
            Platform Settings
          </h2>
          <p className='text-sm text-muted-foreground mt-1'>
            System-wide configuration stored in the database.
          </p>
        </div>
      </div>

      {isError ? (
        <Card className='shadow-sm border-none bg-white'>
          <CardContent className='py-12 text-center'>
            <ShieldAlert className='w-8 h-8 text-red-400 mx-auto mb-3' />
            <p className='text-sm text-muted-foreground'>
              {error?.message || "Failed to load platform settings"}
            </p>
            <Button
              variant='outline'
              size='sm'
              onClick={() => refetch()}
              className='mt-4'
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className='shadow-sm border-none bg-white'>
              <CardHeader>
                <Skeleton className='h-5 w-40' />
                <Skeleton className='h-4 w-52' />
              </CardHeader>
              <CardContent className='space-y-3'>
                <Skeleton className='h-28 w-full' />
                <Skeleton className='h-9 w-24' />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : groupedSettings.length === 0 ? (
        <Card className='shadow-sm border-none bg-white'>
          <CardContent className='py-12 text-center'>
            <Database className='w-8 h-8 text-slate-300 mx-auto mb-3' />
            <p className='font-serif text-base text-slate-500'>
              No settings found
            </p>
            <p className='text-xs text-slate-400 mt-1'>
              Add platform settings in the database to manage system-wide
              behavior.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {groupedSettings.map((setting: any) => (
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
                  value={
                    drafts[setting.key] ?? formatSettingValue(setting.value)
                  }
                  onChange={(event) =>
                    setDrafts((currentDrafts) => ({
                      ...currentDrafts,
                      [setting.key]: event.target.value,
                    }))
                  }
                  rows={6}
                  placeholder={`Edit ${setting.key} as JSON or plain text`}
                  className='w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm font-mono text-slate-700 outline-none transition focus:border-[#C9973A] focus:ring-2 focus:ring-[#C9973A]/20'
                />
                <div className='flex items-center justify-between gap-3'>
                  <span className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
                    Stored in global_settings
                  </span>
                  <Button
                    onClick={() => handleSave(setting)}
                    disabled={updateSetting.isPending}
                    className='bg-[#0F1B2D] hover:bg-[#1a2a3a]'
                  >
                    {updateSetting.isPending ? "Saving..." : "Save Setting"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
