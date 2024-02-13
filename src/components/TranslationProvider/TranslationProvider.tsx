"use client";

import { createInstance, type Resource } from "i18next";
import { useRef } from "react";
import { I18nextProvider } from "react-i18next";
import { initTranslations } from "~/app/i18n";

export function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: {
  children: React.ReactNode;
  locale: string;
  namespaces: string[];
  resources: Resource;
}) {
  const i18nRef = useRef(createInstance());

  void initTranslations({ locale, namespaces, resources, i18nInstance: i18nRef.current });

  return <I18nextProvider i18n={i18nRef.current}>{children}</I18nextProvider>;
}
