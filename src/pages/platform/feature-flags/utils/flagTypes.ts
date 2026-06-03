export interface FeatureFlag {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  rolloutStrategy?: string | null;
  rolloutPercentage?: number | null;
  hotel?: { id: string; name: string } | null;
  variants?: any[];
}

export interface FlagFormData {
  name: string;
  description: string;
  status: string;
  rolloutStrategy: string;
  rolloutPercentage: number;
}

export interface RolloutItem {
  name: string;
  percentage: number;
  status: string;
}
