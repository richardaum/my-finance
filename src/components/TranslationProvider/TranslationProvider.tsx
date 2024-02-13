"use client";

import { I18nextProvider } from "react-i18next";
import { type Resource, createInstance } from "i18next";
import { initTranslations } from "~/app/i18n";
import { useEffect } from "react";

const i18n = createInstance();

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
  useEffect(() => {
    void initTranslations({ locale, namespaces, resources });
  }, [locale, namespaces, resources]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
1;
