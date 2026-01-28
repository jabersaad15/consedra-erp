import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './en.json';
import ar from './ar.json';

const lng = Localization.getLocales()[0]?.languageCode || 'en';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: ['ar', 'en'].includes(lng) ? lng : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
export const isRTL = ['ar', 'ur', 'fa'].includes(i18n.language);
