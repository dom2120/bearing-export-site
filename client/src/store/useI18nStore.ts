import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  locales,
  defaultLanguage,
  type LanguageCode,
  type LocaleMessages,
} from "../i18n";

interface I18nState {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      currentLanguage: defaultLanguage,
      setLanguage: (lang: LanguageCode) => {
        set({ currentLanguage: lang });
        try {
          document.documentElement.lang = lang;
        } catch (e) {
          // ignore SSR / non-browser environments
        }
      },
      t: (key: string): string => {
        const { currentLanguage } = get();
        const messages: LocaleMessages = locales[currentLanguage] || locales[defaultLanguage];
        return getNestedValue(messages, key);
      },
    }),
    {
      name: "bearing-ex-i18n",
      partialize: (state) => ({ currentLanguage: state.currentLanguage }),
    }
  )
);
