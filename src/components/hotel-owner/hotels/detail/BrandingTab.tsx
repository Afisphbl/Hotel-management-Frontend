import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface BrandingTabProps {
  hotelId: string;
  logoUrl?: string;
}

export function BrandingTab({ hotelId, logoUrl }: BrandingTabProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async () => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      setIsUploading(true);
      try {
        await api.post(`hotel/owner/hotels/${hotelId}/branding`, { branding: { logoBase64: reader.result } });
        toast.success('Logo uploaded successfully');
        setFile(null);
        if (inputRef.current) inputRef.current.value = '';
      } catch (e: any) {
        toast.error('Upload failed: ' + e.message);
      } finally {
        setIsUploading(false);
      }
    };
  };

  return (
    <div className="p-6 border rounded-lg bg-slate-50 flex flex-col items-center justify-center gap-4">
      <div className="w-32 h-32 rounded-lg bg-white border-2 border-dashed flex items-center justify-center overflow-hidden">
        {logoUrl ? <img src={logoUrl} alt="Property logo" title="Property logo" className="max-w-full max-h-full object-contain" /> : <UploadCloud className="w-8 h-8 text-slate-300" />}
      </div>
      <div className="text-center">
        <p className="font-medium text-sm">Property Logo</p>
        <p className="text-xs text-muted-foreground">PNG, JPG or SVG up to 2MB</p>
      </div>
      <div className="flex gap-2">
        <Input ref={inputRef} type="file" className="w-64" onChange={e => setFile(e.target.files?.[0] || null)} />
        <Button onClick={upload} disabled={!file || isUploading} className="bg-[#0F1B2D]">
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
        </Button>
      </div>
    </div>
  );
}
