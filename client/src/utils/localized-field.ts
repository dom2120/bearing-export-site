import type { LanguageCode } from "../i18n";

/**
 * Suffix mapping from LanguageCode to field name suffix on CMS entities.
 * Base field (no suffix) is used for zh-CN (the default content language).
 */
const LANG_SUFFIX: Record<LanguageCode, string> = {
  "zh-CN": "",
  en: "En",
  th: "Th",
  vi: "Vi",
  id: "Id",
  es: "Es",
};

/**
 * Get a localized field value from a multilingual object.
 * Falls back through: exact language → English → base field → fallback key.
 *
 * @param obj - The data object (e.g. BearingProduct, BearingBanner)
 * @param baseKey - The base field name (e.g. "name", "title", "description")
 * @param lang - Current language code
 * @param fallback - Optional fallback value (defaults to base field value)
 */
export function getLocalizedField(
  obj: Record<string, unknown> | undefined | null,
  baseKey: string,
  lang: LanguageCode,
  fallback = "",
): string {
  if (!obj) return fallback;

  const suffix = LANG_SUFFIX[lang] ?? "";
  const primaryKey = suffix ? `${baseKey}${suffix}` : baseKey;
  const primaryValue = obj[primaryKey];

  if (typeof primaryValue === "string" && primaryValue.trim() !== "") {
    return primaryValue;
  }

  // Fallback to English
  if (lang !== "en") {
    const enValue = obj[`${baseKey}En`];
    if (typeof enValue === "string" && enValue.trim() !== "") {
      return enValue;
    }
  }

  // Fallback to base field (zh-CN)
  const baseValue = obj[baseKey];
  if (typeof baseValue === "string" && baseValue.trim() !== "") {
    return baseValue;
  }

  return fallback;
}

/**
 * Parse a comma-separated string field into an array.
 */
export function parseCsvList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0);
}
