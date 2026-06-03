import { useParams } from "@tanstack/react-router";
import {
  useTenantBranding,
  useUpdateTenantBranding,
} from "@/hooks/usePlatformData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  BrandingLogoUploader,
  ColorPickerField,
  BrandingSystemAssets,
  BrandingPreview,
} from "@/components/platform/branding";

export function HotelBranding() {
  const { id } = useParams({ from: "/auth/platform/hotels/$id" });
  const {
    data: branding,
    isLoading,
    isError,
    error,
    refetch,
  } = useTenantBranding(id);
  const updateMutation = useUpdateTenantBranding();

  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (branding) setFormData({ ...branding });
  }, [branding]);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id, data: formData });
      toast.success("Branding isolation updated");
    } catch {
      toast.error("Failed to update branding");
    }
  };

  // ── Loading / error guards ────────────────────────────────────────────────
  if (isLoading) return null;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Database className="w-10 h-10 text-red-400 mb-3" />
        <h3 className="text-lg font-serif text-slate-500">
          Failed to load branding
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">{error?.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!formData) return null;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const patch = (fields: Partial<typeof formData>) =>
    setFormData((prev: any) => ({ ...prev, ...fields }));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left column — configuration */}
      <div className="space-y-6">
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex flex-col gap-6">
              <BrandingLogoUploader
                logoUrl={formData.logo}
                hotelId={id}
                onUploadSuccess={(url) => patch({ logo: url })}
              />

              <div className="grid grid-cols-2 gap-6">
                <ColorPickerField
                  id="primary"
                  label="Primary Color"
                  value={formData.primaryColor}
                  onChange={(v) => patch({ primaryColor: v })}
                />
                <ColorPickerField
                  id="accent"
                  label="Accent Color"
                  value={formData.accentColor}
                  onChange={(v) => patch({ accentColor: v })}
                />
              </div>

              <div className="space-y-2">
                <Label>Login Message</Label>
                <Input
                  value={formData.loginMessage}
                  onChange={(e) => patch({ loginMessage: e.target.value })}
                  placeholder="Welcome to our hotel PMS"
                />
              </div>

              <div className="pt-4 border-t flex justify-end">
                <Button
                  className="bg-[#0F1B2D] hover:bg-[#1a2a3a] gap-2"
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Branding
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        <BrandingSystemAssets />
      </div>

      {/* Right column — live preview */}
      <BrandingPreview
        primaryColor={formData.primaryColor}
        accentColor={formData.accentColor}
        logoUrl={formData.logo}
      />
    </div>
  );
}
