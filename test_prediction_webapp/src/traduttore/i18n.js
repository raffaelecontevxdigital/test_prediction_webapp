import React from "react";
import i18n from "i18next";
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useTranslation, initReactI18next } from "react-i18next";
const Lingue = ['it', 'en'];
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    supportedLngs: ['it', 'en'],
    fallbackLng: 'it',
    debug: false,
    detection: {
      order: ['path', 'cookie', 'htmlTag'],
      caches: ['cookie'],
    },
    whitelist: Lingue,
  });

export function I18n(param) {
  const { t } = useTranslation();

  return <h2>{t(param)}</h2>;
}