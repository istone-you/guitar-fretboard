import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ja from "./locales/ja/common.json";
import en from "./locales/en/common.json";

const STORAGE_KEY = "guiter:locale";

function readStoredLocale() {
  if (typeof window === "undefined") return "ja";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "ja" || stored === "en" ? stored : "ja";
}

void i18n.use(initReactI18next).init({
  resources: {
    ja: { translation: ja },
    en: { translation: en },
  },
  lng: readStoredLocale(),
  fallbackLng: "ja",
  interpolation: {
    escapeValue: false,
  },
});

export function changeLocale(locale: "ja" | "en") {
  void i18n.changeLanguage(locale);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, locale);
  }
}

export default i18n;
