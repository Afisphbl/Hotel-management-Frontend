import React from "react";
import {
  usePlatformSettings,
  useUpdatePlatformSettings,
} from "@/hooks/usePlatformData";
import { PlatformSettingsHeader } from "@/components/platform/settings/PlatformSettingsHeader";
import { PlatformSettingsError } from "@/components/platform/settings/PlatformSettingsError";
import { PlatformSettingsSkeleton } from "@/components/platform/settings/PlatformSettingsSkeleton";
import { PlatformSettingsEmpty } from "@/components/platform/settings/PlatformSettingsEmpty";
import { PlatformSettingCard } from "@/components/platform/settings/PlatformSettingCard";
import { formatSettingValue, parseSettingValue } from "@/components/platform/settings/utils";

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
        <PlatformSettingsHeader />
      </div>

      {isError ? (
        <PlatformSettingsError
          message={error?.message}
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <PlatformSettingsSkeleton />
      ) : groupedSettings.length === 0 ? (
        <PlatformSettingsEmpty />
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {groupedSettings.map((setting: any) => (
            <PlatformSettingCard
              key={setting.id || setting.key}
              setting={setting}
              draftValue={
                drafts[setting.key] ?? formatSettingValue(setting.value)
              }
              isSaving={updateSetting.isPending}
              onDraftChange={(value) =>
                setDrafts((currentDrafts) => ({
                  ...currentDrafts,
                  [setting.key]: value,
                }))
              }
              onSave={() => handleSave(setting)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
