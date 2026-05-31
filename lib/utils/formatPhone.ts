/**
 * Formats a Nigerian phone number to international format (+234…).
 * Handles inputs like: 08012345678, 8012345678, +2348012345678, 2348012345678
 * Returns the original string if it cannot be normalised.
 */
export function formatNigerianPhone(raw: any): string {
  if (!raw) return "";
  const s = String(raw).replace(/\s+/g, "").replace(/-/g, "");
  if (!s) return "";

  // Already in +234 format
  if (s.startsWith("+234")) return s;

  // 234XXXXXXXXXX (no leading +)
  if (s.startsWith("234") && s.length >= 13) return `+${s}`;

  // 0XXXXXXXXXX (local format)
  if (s.startsWith("0") && s.length >= 11) return `+234${s.slice(1)}`;

  // 7/8/9XXXXXXXXX (missing leading 0)
  if (/^[789]\d{9}$/.test(s)) return `+234${s}`;

  return s;
}
