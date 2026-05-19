
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreatePlatformHotel } from '@/hooks/usePlatformData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Building2, 
  Users, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  Palette,
  Eye,
  Loader2,
  Globe,
  Clock,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STEPS = [
  { id: 'info', title: 'Hotel Information', icon: Building2 },
  { id: 'owner', title: 'Owner Account', icon: Users },
  { id: 'billing', title: 'Subscription', icon: CreditCard },
  { id: 'features', title: 'Feature Flags', icon: ShieldCheck },
  { id: 'branding', title: 'Branding', icon: Palette },
  { id: 'review', title: 'Review', icon: Eye },
];

export function HotelCreate() {
  const navigate = useNavigate();
  const createMutation = useCreatePlatformHotel();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    legalName: '',
    code: '',
    email: '',
    phone: '',
    website: '',
    country: 'United Kingdom',
    city: 'London',
    timezone: 'UTC',
    rooms: 50,
    ownerName: '',
    ownerEmail: '',
    password: '',
    plan: 'Pro',
    billingCycle: 'Monthly',
    features: ['housekeeping', 'maintenance', 'analytics'],
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    try {
      await createMutation.mutateAsync(formData);
      toast.success('Hotel tenant created successfully');
      navigate({ to: '/platform/hotels' });
    } catch (err) {
      toast.error('Failed to create hotel');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hotel Name</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Grand Peninsula" />
              </div>
              <div className="space-y-2">
                <Label>Hotel Code</Label>
                <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. GP-LON" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Legal Business Name</Label>
              <Input value={formData.legalName} onChange={e => setFormData({...formData, legalName: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Business Email</Label>
                <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Country</Label>
                <Input value={formData.country} readOnly />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Rooms</Label>
                <Input type="number" value={formData.rooms} onChange={e => setFormData({...formData, rooms: parseInt(e.target.value)})} />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Owner Full Name</Label>
              <Input value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Owner Email (Login UID)</Label>
              <Input value={formData.ownerEmail} onChange={e => setFormData({...formData, ownerEmail: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Temporary Password</Label>
              <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              <p className="text-xs text-muted-foreground">The owner will be prompted to change this on first login.</p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {['Starter', 'Pro', 'Enterprise'].map(plan => (
                <div 
                  key={plan}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    formData.plan === plan ? "border-[#C9973A] bg-[#C9973A]/5" : "border-muted hover:border-muted-foreground/50"
                  )}
                  onClick={() => setFormData({...formData, plan})}
                >
                  <h3 className="font-bold text-center mb-2">{plan}</h3>
                  <p className="text-xs text-muted-foreground text-center">
                    {plan === 'Starter' ? 'Basic PMS features' : plan === 'Pro' ? 'Full operational suite' : 'Unlimited & Custom'}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Billing Cycle</Label>
              <div className="flex gap-4">
                {['Monthly', 'Annually'].map(cycle => (
                  <Button 
                    key={cycle}
                    variant={formData.billingCycle === cycle ? 'default' : 'outline'}
                    onClick={() => setFormData({...formData, billingCycle: cycle})}
                    className="flex-1"
                  >
                    {cycle}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-bold mb-4">Final Summary</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <span className="text-muted-foreground">Hotel Name:</span> <span className="font-medium">{formData.name}</span>
                <span className="text-muted-foreground">Owner:</span> <span className="font-medium">{formData.ownerName} ({formData.ownerEmail})</span>
                <span className="text-muted-foreground">Plan:</span> <span className="font-medium">{formData.plan} ({formData.billingCycle})</span>
                <span className="text-muted-foreground">Rooms:</span> <span className="font-medium">{formData.rooms}</span>
                <span className="text-muted-foreground">Features:</span> <span className="font-medium">{formData.features.length} enabled</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 border border-amber-200 bg-amber-50 rounded-lg text-amber-800 text-sm">
              <ShieldCheck className="w-4 h-4" />
              This will create a new tenant environment and send an invitation email to the owner.
            </div>
          </div>
        );
      default:
        return <div className="py-12 text-center text-muted-foreground">Section implementation following existing UX patterns...</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/platform/hotels' })}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-serif text-[#0F1B2D]">Onboard New Hotel</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Progress Sidebar */}
        <div className="space-y-2">
          {STEPS.map((step, idx) => (
            <div 
              key={step.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg text-sm transition-colors",
                idx === currentStep ? "bg-[#0F1B2D] text-white" : 
                idx < currentStep ? "text-green-600 bg-green-50" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] border",
                idx === currentStep ? "bg-[#C9973A] border-[#C9973A]" : 
                idx < currentStep ? "bg-green-600 border-green-600 text-white" : "border-muted"
              )}>
                {idx < currentStep ? <Check className="w-3 h-3" /> : idx + 1}
              </div>
              <span className="font-medium">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <Card className="lg:col-span-3 shadow-none border bg-white">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              {(() => {
                const Icon = STEPS[currentStep].icon;
                return <Icon className="w-5 h-5 text-[#C9973A]" />;
              })()}
              <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Step {currentStep + 1}</span>
            </div>
            <CardTitle className="text-2xl font-serif">{STEPS[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
          <div className="p-6 border-t flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              Back
            </Button>
            {currentStep === STEPS.length - 1 ? (
              <Button 
                onClick={handleSubmit} 
                disabled={createMutation.isPending}
                className="bg-[#0F1B2D] hover:bg-[#1a2a3a]"
              >
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Finalize & Create
              </Button>
            ) : (
              <Button onClick={nextStep} className="bg-[#0F1B2D] hover:bg-[#1a2a3a]">
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
