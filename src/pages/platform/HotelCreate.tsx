import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCreatePlatformHotel } from "@/hooks/usePlatformData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  CreditCard,
  ShieldCheck,
  Palette,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { HotelInfoStep } from "./hotel-create-components/HotelInfoStep";
import { OwnerAccountStep } from "./hotel-create-components/OwnerAccountStep";
import { SubscriptionStep } from "./hotel-create-components/SubscriptionStep";
import { FeatureFlagsStep } from "./hotel-create-components/FeatureFlagsStep";
import { BrandingStep } from "./hotel-create-components/BrandingStep";
import { ReviewStep } from "./hotel-create-components/ReviewStep";
import { StepSidebar } from "./hotel-create-components/StepSidebar";
import { StepNavigation } from "./hotel-create-components/StepNavigation";
import type { FormData } from "./hotel-create-components/types";

const STEPS = [
  { id: "info", title: "Hotel Information", icon: Building2 },
  { id: "owner", title: "Owner Account", icon: Users },
  { id: "billing", title: "Subscription", icon: CreditCard },
  { id: "features", title: "Feature Flags", icon: ShieldCheck },
  { id: "branding", title: "Branding", icon: Palette },
  { id: "review", title: "Review", icon: Eye },
];

export function HotelCreate() {
  const navigate = useNavigate();
  const createMutation = useCreatePlatformHotel();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    legalName: "",
    code: "",
    email: "",
    phone: "",
    website: "",
    country: "Ethiopia",
    city: "Addis Ababa",
    timezone: "GMT+3",
    rooms: 50,
    ownerName: "",
    ownerEmail: "",
    password: "",
    plan: "Pro",
    billingCycle: "Monthly",
    features: ["housekeeping", "maintenance", "analytics"],
    primaryColor: "#0F1B2D",
    accentColor: "#C9973A",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const passwordPolicy =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  const planToSubscriptionPlan: Record<string, string> = {
    Starter: "BASIC",
    Pro: "PROFESSIONAL",
    Enterprise: "ENTERPRISE",
  };

  const validateCurrentStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = "Hotel Name is required";
      if (!formData.code.trim()) newErrors.code = "Hotel Code is required";
      if (!formData.email.trim()) {
        newErrors.email = "Business Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email address";
      }
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.rooms || formData.rooms <= 0) {
        newErrors.rooms = "Rooms must be greater than 0";
      }
    } else if (step === 1) {
      if (!formData.ownerName.trim())
        newErrors.ownerName = "Owner Full Name is required";
      if (!formData.ownerEmail.trim()) {
        newErrors.ownerEmail = "Owner Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.ownerEmail)) {
        newErrors.ownerEmail = "Invalid email address";
      }
      if (!formData.password.trim()) {
        newErrors.password = "Temporary Password is required";
      } else if (!passwordPolicy.test(formData.password)) {
        newErrors.password =
          "Password must be at least 8 characters and include uppercase, lowercase, and a number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const nextStep = () => {
    if (validateCurrentStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    } else {
      toast.error("Please resolve the required fields before continuing.");
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    if (!validateCurrentStep(0) || !validateCurrentStep(1)) {
      toast.error("Please fix the required fields across steps.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      ownerName: formData.ownerName.trim() || undefined,
      ownerEmail: formData.ownerEmail.trim(),
      password: formData.password,
      code: formData.code.trim() || undefined,
      subdomain: formData.code.trim() || undefined,
      legalName: formData.legalName.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      website: formData.website.trim() || undefined,
      city: formData.city.trim() || undefined,
      country: formData.country.trim() || undefined,
      region: formData.country.trim() || undefined,
      location: `${formData.city.trim()}, ${formData.country.trim()}`.trim(),
      timezone: formData.timezone.trim() || undefined,
      currency: "ETB",
      rooms: formData.rooms,
      plan: planToSubscriptionPlan[formData.plan] ?? formData.plan,
      billingCycle: formData.billingCycle,
      features: formData.features,
      primaryColor: formData.primaryColor,
      accentColor: formData.accentColor,
      branding: {
        primaryColor: formData.primaryColor,
        accentColor: formData.accentColor,
      },
      settings: {
        legalName: formData.legalName.trim() || null,
        phone: formData.phone.trim() || null,
        website: formData.website.trim() || null,
        billingCycle: formData.billingCycle,
        city: formData.city.trim() || null,
        country: formData.country.trim() || null,
      },
      paymentMethods: [],
      cancellationPolicy: {
        enabled: false,
        refundWindowHours: 24,
        noShowPenaltyPercent: 100,
      },
      maintenanceMode: false,
    };

    try {
      await createMutation.mutateAsync(payload);
      toast.success("Hotel tenant created successfully");
      navigate({ to: "/platform/hotels" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create hotel",
      );
    }
  };

  const stepProps = { data: formData, errors, onChange: handleChange };

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => navigate({ to: "/platform/hotels" })}
          className='hover:bg-slate-100'
        >
          <ArrowLeft className='w-4 h-4' />
        </Button>
        <h1 className='text-3xl font-serif text-[#0F1B2D]'>
          Onboard New Hotel
        </h1>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
        <StepSidebar steps={STEPS} currentStep={currentStep} />

        <Card className='lg:col-span-3 shadow-none border bg-white'>
          <CardHeader>
            <div className='flex items-center gap-2 mb-2'>
              {(() => {
                const Icon = STEPS[currentStep].icon;
                return <Icon className='w-5 h-5 text-[#C9973A]' />;
              })()}
              <span className='text-xs uppercase font-bold tracking-widest text-muted-foreground'>
                Step {currentStep + 1}
              </span>
            </div>
            <CardTitle className='text-2xl font-serif'>
              {STEPS[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && <HotelInfoStep {...stepProps} />}
            {currentStep === 1 && <OwnerAccountStep {...stepProps} />}
            {currentStep === 2 && <SubscriptionStep {...stepProps} />}
            {currentStep === 3 && <FeatureFlagsStep {...stepProps} />}
            {currentStep === 4 && <BrandingStep {...stepProps} />}
            {currentStep === 5 && <ReviewStep data={formData} />}
          </CardContent>
          <StepNavigation
            currentStep={currentStep}
            totalSteps={STEPS.length}
            isPending={createMutation.isPending}
            onBack={prevStep}
            onNext={nextStep}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </div>
  );
}
