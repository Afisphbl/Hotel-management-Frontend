import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerFieldProps {
  /** Used to generate a unique id for the hidden color input, e.g. "primary" → "primary-color-picker" */
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * A reusable color-picker field: clickable color swatch + hidden <input type="color"> + hex text input.
 * Can be used anywhere a color setting is needed (branding, theme editors, etc.).
 */
export function ColorPickerField({
  id,
  label,
  value,
  onChange,
}: ColorPickerFieldProps) {
  const pickerId = `${id}-color-picker`;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <div className="relative">
          {/* Visible swatch — clicking it triggers the hidden native color picker */}
          <div
            className="w-10 h-10 rounded border cursor-pointer hover:scale-105 transition-transform shadow-sm"
            style={{ backgroundColor: value }}
            onClick={() => document.getElementById(pickerId)?.click()}
          />
          <input
            id={pickerId}
            type="color"
            className="absolute inset-0 opacity-0 w-0 h-0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        {/* Hex text input — synced bidirectionally with the swatch */}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
