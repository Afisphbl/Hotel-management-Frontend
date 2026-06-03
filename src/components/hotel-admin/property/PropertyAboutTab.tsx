import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface AboutContent {
  heading1: string;
  body1: string;
  heading2: string;
  body2: string;
  image1: string;
  image2: string;
}

interface PropertyAboutTabProps {
  initialData: AboutContent | null;
  hotelId: string | undefined;
}

export function PropertyAboutTab({ initialData, hotelId }: PropertyAboutTabProps) {
  const [form, setForm] = useState<AboutContent>({
    heading1: '', body1: '', heading2: '', body2: '', image1: '', image2: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const save = async () => {
    if (!hotelId) return;
    setIsSaving(true);
    try {
      await api.patch(`hotel/owner/hotels/${hotelId}/settings`, { aboutContent: form });
      toast.success('About page updated');
    } catch (e: any) {
      toast.error('Failed to save: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-none bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">About Page Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Section 1 Heading</Label>
          <Input
            value={form.heading1}
            onChange={e => setForm({ ...form, heading1: e.target.value })}
            placeholder="Welcome to LuxeHotel"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Section 1 Body</Label>
          <textarea
            className="flex w-full min-h-[180px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-y font-mono"
            value={form.body1}
            onChange={e => setForm({ ...form, body1: e.target.value })}
            placeholder="Paragraphs separated by blank lines..."
          />
        </div>
        <div className="space-y-1.5">
          <Label>Section 2 Heading</Label>
          <Input
            value={form.heading2}
            onChange={e => setForm({ ...form, heading2: e.target.value })}
            placeholder="Excellence in hospitality"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Section 2 Body</Label>
          <textarea
            className="flex w-full min-h-[180px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-y font-mono"
            value={form.body2}
            onChange={e => setForm({ ...form, body2: e.target.value })}
            placeholder="Paragraphs separated by blank lines..."
          />
        </div>
        <div className="space-y-1.5">
          <Label>Image 1 URL (right of section 1)</Label>
          <Input
            value={form.image1}
            onChange={e => setForm({ ...form, image1: e.target.value })}
            placeholder="https://images.unsplash.com/..."
          />
        </div>
        <div className="space-y-1.5">
          <Label>Image 2 URL (left of section 2)</Label>
          <Input
            value={form.image2}
            onChange={e => setForm({ ...form, image2: e.target.value })}
            placeholder="https://images.unsplash.com/..."
          />
        </div>
        <div className="pt-4">
          <Button onClick={save} disabled={isSaving} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
            <Save className="w-4 h-4 mr-2" /> Save About Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
