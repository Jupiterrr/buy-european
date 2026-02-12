import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import en from "../locales/en.json";
import de from "../locales/de.json";
import fr from "../locales/fr.json";
import fi from "../locales/fi.json";
import sv from "../locales/sv.json";
import es from "../locales/es.json";

const deviceLanguage = getLocales()[0]?.languageCode ?? "en";
const supportedLanguages = ["en", "de", "fr", "fi", "sv", "es"];
const initialLanguage = supportedLanguages.includes(deviceLanguage) ? deviceLanguage : "en";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources: {
    en: { translation: en },
    de: { translation: de },
    fr: { translation: fr },
    fi: { translation: fi },
    sv: { translation: sv },
    es: { translation: es },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
