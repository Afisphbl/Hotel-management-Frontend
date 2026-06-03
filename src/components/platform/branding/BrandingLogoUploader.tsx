import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface BrandingLogoUploaderProps {
  logoUrl: string | null | undefined;
  hotelId: string;
  onUploadSuccess: (url: string) => void;
}

/**
 * Logo upload zone: shows the current logo (or placeholder), validates file size,
 * uploads via multipart POST, and calls onUploadSuccess with the returned URL.
 * Self-contained — the page only needs to receive the new URL.
 */
export function BrandingLogoUploader({
  logoUrl,
  hotelId,
  onUploadSuccess,
}: BrandingLogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    const uploadLogo = async () => {
      try {
        const payload = new FormData();
        payload.append("logo", file);

        const response = await fetch(
          `/platform/hotels/${hotelId}/branding/logo`,
          { method: "POST", body: payload },
        );

        if (!response.ok) throw new Error("Logo upload failed");

        const result = await response.json();
        onUploadSuccess(result.url);
        toast.success("Logo uploaded");
      } catch {
        toast.error("Failed to upload logo");
      }
    };

    void uploadLogo();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="logo-upload">Tenant Logo</Label>

      {/* Hidden native file input */}
      <input
        id="logo-upload"
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        title="Upload tenant logo"
        aria-label="Upload tenant logo"
      />

      {/* Dashed upload zone */}
      <div className="flex items-center gap-6 p-4 border-2 border-dashed rounded-xl group hover:border-[#C9973A] transition-colors">
        {/* Logo preview / placeholder */}
        <div className="w-20 h-20 rounded bg-slate-50 flex items-center justify-center overflow-hidden border shrink-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-slate-300" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <p className="text-xs text-muted-foreground">
            High resolution PNG or SVG. Max 2MB.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-3 h-3" /> Upload New
          </Button>
        </div>
      </div>
    </div>
  );
}
