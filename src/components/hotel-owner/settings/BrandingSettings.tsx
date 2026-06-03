import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface BrandingSettingsProps {
  selectedHotelId: string;
  branding: Record<string, any>;
}

export function BrandingSettings({ selectedHotelId, branding }: BrandingSettingsProps) {
  const [brandingState, setBrandingState] = useState(branding);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isHomeUploading, setIsHomeUploading] = useState(false);
  const [isFaviconUploading, setIsFaviconUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const homeInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const uploadLogo = async () => {
    if (!logoFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(logoFile);
    reader.onload = async () => {
      setIsSaving(true);
      try {
        await api.post(`hotel/owner/hotels/${selectedHotelId}/branding`, { branding: { logoBase64: reader.result } });
        toast.success('Logo uploaded');
        setLogoFile(null);
        if (logoInputRef.current) logoInputRef.current.value = '';
      } catch (e: any) {
        toast.error('Upload failed: ' + e.message);
      } finally {
        setIsSaving(false);
      }
    };
  };

  const uploadImage = async (file: File, field: 'homePageImage' | 'favicon') => {
    const uploading = field === 'homePageImage' ? setIsHomeUploading : setIsFaviconUploading;
    const maxSize = field === 'homePageImage' ? 5 : 2;

    if (!file.type.startsWith('image/')) { toast.error('Only image files allowed'); return; }
    if (file.size > maxSize * 1024 * 1024) { toast.error(`Image must be under ${maxSize}MB`); return; }

    uploading(true);
    try {
      const result = await api.upload('hotel/cloudinary/upload', file);
      const url = (result as any).data?.url || (result as any).url;
      const updated = { ...brandingState, [field]: url };
      await api.patch(`hotel/owner/hotels/${selectedHotelId}`, { branding: updated });
      setBrandingState(updated);
      toast.success(`${field === 'homePageImage' ? 'Homepage image' : 'Favicon'} updated`);
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      uploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UploadCloud className="w-5 h-5" />
            Property Logo
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-lg bg-white border-2 border-dashed flex items-center justify-center overflow-hidden">
            {brandingState?.logoUrl ? (
              <img src={brandingState.logoUrl} alt="Property logo preview" title="Property logo preview" className="max-w-full max-h-full object-contain" />
            ) : (
              <UploadCloud className="w-8 h-8 text-slate-300" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">PNG, JPG or SVG up to 2MB</p>
          <div className="flex gap-2">
            <Input ref={logoInputRef} type="file" className="w-64" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
            <Button onClick={uploadLogo} disabled={!logoFile || isSaving} className="bg-[#0F1B2D]">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UploadCloud className="w-5 h-5" />
            Homepage Background
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="w-full h-40 rounded-lg bg-white border-2 border-dashed flex items-center justify-center overflow-hidden">
            {brandingState?.homePageImage ? (
              <img src={brandingState.homePageImage} alt="Homepage background preview" title="Homepage background preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-slate-400">
                <UploadCloud className="w-8 h-8 mx-auto mb-1" />
                <p className="text-xs">No homepage image set</p>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Hero image for the booking website, up to 5MB</p>
          <div className="flex gap-2">
            <Input ref={homeInputRef} type="file" accept="image/*" className="w-64" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadImage(file, 'homePageImage');
            }} disabled={isHomeUploading} />
            <Button disabled={isHomeUploading} className="bg-[#0F1B2D]">
              {isHomeUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UploadCloud className="w-5 h-5" />
            Favicon
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-white border-2 border-dashed flex items-center justify-center overflow-hidden">
            {brandingState?.favicon ? (
              <img src={brandingState.favicon} alt="Favicon preview" title="Favicon preview" className="w-full h-full object-cover" />
            ) : (
              <UploadCloud className="w-6 h-6 text-slate-300" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">Browser tab icon, up to 2MB (recommended 32x32 or 64x64)</p>
          <div className="flex gap-2">
            <Input ref={faviconInputRef} type="file" accept="image/*" className="w-64" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadImage(file, 'favicon');
            }} disabled={isFaviconUploading} />
            <Button disabled={isFaviconUploading} className="bg-[#0F1B2D]">
              {isFaviconUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
