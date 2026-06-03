import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface BrandingTabProps {
  hotelId: string;
  initialBranding: Record<string, any>;
}

export function BrandingTab({ hotelId, initialBranding }: BrandingTabProps) {
  const [branding, setBranding] = useState(initialBranding);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [homeImageUploading, setHomeImageUploading] = useState(false);
  const [faviconUploading, setFaviconUploading] = useState(false);

  useEffect(() => {
    setBranding(initialBranding);
  }, [initialBranding]);

  const uploadLogo = async () => {
    if (!logoFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(logoFile);
    reader.onload = async () => {
      setIsUploadingLogo(true);
      try {
        await api.post(`hotel/owner/hotels/${hotelId}/branding`, { branding: { logoBase64: reader.result } });
        toast.success("Logo uploaded");
        setLogoFile(null);
        // We might want to refresh branding data here if the API returns the new URL
      } catch (e: any) {
        toast.error("Upload failed: " + e.message);
      } finally {
        setIsUploadingLogo(false);
      }
    };
  };

  const uploadBrandingImage = async (file: File, field: 'homePageImage' | 'favicon') => {
    try {
      const result = await api.upload('hotel/cloudinary/upload', file);
      const url = (result as any).data?.url || (result as any).url;
      const updated = { ...branding, [field]: url };
      await api.patch(`hotel/owner/hotels/${hotelId}`, { branding: updated });
      setBranding(updated);
      toast.success(`${field === 'homePageImage' ? 'Homepage image' : 'Favicon'} updated`);
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    }
  };

  const handleHomeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Only image files allowed'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setHomeImageUploading(true);
    await uploadBrandingImage(file, 'homePageImage');
    setHomeImageUploading(false);
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Only image files allowed'); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error('Favicon must be under 2MB'); return; }
    setFaviconUploading(true);
    await uploadBrandingImage(file, 'favicon');
    setFaviconUploading(false);
  };

  return (
    <div className="mt-6 space-y-6">
      <Card className="border-none bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Property Logo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-lg bg-white border-2 border-dashed flex items-center justify-center overflow-hidden">
            {branding?.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <UploadCloud className="w-8 h-8 text-slate-300" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">PNG, JPG or SVG up to 2MB</p>
          <div className="flex gap-2">
            <Input type="file" className="w-64" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
            <Button onClick={uploadLogo} disabled={!logoFile || isUploadingLogo} className="bg-[#0F1B2D]">
              {isUploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Homepage Background</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="w-full h-40 rounded-lg bg-white border-2 border-dashed flex items-center justify-center overflow-hidden">
            {branding?.homePageImage ? (
              <img src={branding.homePageImage} alt="Background" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-slate-400">
                <UploadCloud className="w-8 h-8 mx-auto mb-1" />
                <p className="text-xs">No homepage image set</p>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Hero image for the booking website, up to 5MB</p>
          <div className="flex gap-2">
            <Input type="file" accept="image/*" className="w-64" onChange={handleHomeImageUpload} disabled={homeImageUploading} />
            <Button disabled={homeImageUploading} className="bg-[#0F1B2D]">
              {homeImageUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Favicon</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-white border-2 border-dashed flex items-center justify-center overflow-hidden">
            {branding?.favicon ? (
              <img src={branding.favicon} alt="Favicon" className="w-full h-full object-cover" />
            ) : (
              <UploadCloud className="w-6 h-6 text-slate-300" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">Browser tab icon, up to 2MB (recommended 32x32 or 64x64)</p>
          <div className="flex gap-2">
            <Input type="file" accept="image/*" className="w-64" onChange={handleFaviconUpload} disabled={faviconUploading} />
            <Button disabled={faviconUploading} className="bg-[#0F1B2D]">
              {faviconUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
