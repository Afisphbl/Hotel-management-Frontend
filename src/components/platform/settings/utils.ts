export const CATEGORY_LABELS: Record<string, string> = {
  smtp: "SMTP",
  payment_gateway: "Payment Gateway",
  system: "System",
  compliance: "Compliance",
};

export function formatSettingValue(value: any) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

export function parseSettingValue(rawValue: string) {
  const trimmed = rawValue.trim();
  if (!trimmed) return "";

  try {
    return JSON.parse(trimmed);
  } catch {
    return rawValue;
  }
}
