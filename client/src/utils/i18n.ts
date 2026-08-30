import { locales, type LanguageCode } from "../i18n";

type CurrencyCode = "USD" | "EUR" | "CNY" | "THB" | "VND" | "IDR";

const CURRENCY_LOCALE_MAP: Record<CurrencyCode, string> = {
  USD: "en-US",
  EUR: "es-ES",
  CNY: "zh-CN",
  THB: "th-TH",
  VND: "vi-VN",
  IDR: "id-ID",
};

const LANG_LOCALE_MAP: Record<LanguageCode, string> = {
  en: "en-US",
  "zh-CN": "zh-CN",
  th: "th-TH",
  vi: "vi-VN",
  id: "id-ID",
  es: "es-ES",
};

/**
 * Format a number as currency according to language / currency code.
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = "USD",
  lang: LanguageCode = "en"
): string {
  const locale = CURRENCY_LOCALE_MAP[currency] || LANG_LOCALE_MAP[lang];
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (e) {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Format a date according to the given language.
 * @param date - Date object or ISO string
 * @param lang - LanguageCode
 * @param options - Intl.DateTimeFormatOptions
 */
export function formatDate(
  date: Date | string,
  lang: LanguageCode = "en",
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const locale = LANG_LOCALE_MAP[lang] || "en-US";
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  try {
    return new Intl.DateTimeFormat(locale, options ?? defaultOptions).format(d);
  } catch (e) {
    return d.toISOString().slice(0, 10);
  }
}

/**
 * Safely retrieve a nested translation key.
 * Returns the key itself if not found.
 */
export function translate(lang: LanguageCode, key: string): string {
  const messages = locales[lang];
  const keys = key.split(".");
  let current: unknown = messages;
  for (const k of keys) {
    if (current && typeof current === "object" && k in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof current === "string" ? current : key;
}
