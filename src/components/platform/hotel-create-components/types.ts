export interface FormData {
  name: string;
  legalName: string;
  code: string;
  email: string;
  phone: string;
  website: string;
  country: string;
  city: string;
  timezone: string;
  rooms: number;
  ownerName: string;
  ownerEmail: string;
  password: string;
  plan: string;
  billingCycle: string;
  features: string[];
  primaryColor: string;
  accentColor: string;
}

export interface StepProps {
  data: FormData;
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
}
