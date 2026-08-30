import en from "./locales/en";
import zhCN from "./locales/zh-CN";
import th from "./locales/th";
import vi from "./locales/vi";
import id from "./locales/id";
import es from "./locales/es";

export type LanguageCode = "en" | "zh-CN" | "th" | "vi" | "id" | "es";

export type LocaleMessages = typeof en;

export const locales: Record<LanguageCode, LocaleMessages> = {
  en,
  "zh-CN": zhCN,
  th,
  vi,
  id,
  es,
};

export const languageNames: Record<LanguageCode, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇺🇸" },
  "zh-CN": { label: "简体中文", flag: "🇨🇳" },
  th: { label: "ไทย", flag: "🇹🇭" },
  vi: { label: "Tiếng Việt", flag: "🇻🇳" },
  id: { label: "Bahasa Indonesia", flag: "🇮🇩" },
  es: { label: "Español", flag: "🇪🇸" },
};

export const defaultLanguage: LanguageCode = "en";
