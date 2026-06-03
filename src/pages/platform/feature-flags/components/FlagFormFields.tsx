import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STRATEGY_OPTIONS = [
  { value: "full_rollout", label: "Full Rollout" },
  { value: "percentage", label: "Percentage" },
  { value: "user_based", label: "User Based" },
  { value: "role_based", label: "Role Based" },
  { value: "conditional", label: "Conditional" },
  { value: "a_b_test", label: "A/B Test" },
] as const;

interface FlagFormFieldsProps {
  description: string;
  status: string;
  rolloutStrategy: string;
  rolloutPercentage: number;
  idPrefix?: string;
  onChange: (fields: Partial<{
    description: string;
    status: string;
    rolloutStrategy: string;
    rolloutPercentage: number;
  }>) => void;
}

export function FlagFormFields({
  description,
  status,
  rolloutStrategy,
  rolloutPercentage,
  idPrefix = "flag",
  onChange,
}: FlagFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-desc`}>Description</Label>
        <Input
          id={`${idPrefix}-desc`}
          placeholder="What does this flag control?"
          value={description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-status`}>Status</Label>
        <Select
          value={status}
          onValueChange={(v) => v && onChange({ status: v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DISABLED">Disabled</SelectItem>
            <SelectItem value="ENABLED">Enabled</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-strategy`}>Rollout Strategy</Label>
        <Select
          value={rolloutStrategy}
          onValueChange={(v) => v && onChange({ rolloutStrategy: v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STRATEGY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {rolloutStrategy === "percentage" && (
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-pct`}>Rollout Percentage</Label>
          <Input
            id={`${idPrefix}-pct`}
            type="number"
            min={0}
            max={100}
            value={rolloutPercentage}
            onChange={(e) =>
              onChange({ rolloutPercentage: Number(e.target.value) })
            }
          />
        </div>
      )}
    </>
  );
}
