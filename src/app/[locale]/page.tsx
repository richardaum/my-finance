import { AppShellMain, Container } from "@mantine/core";
import { AppShell } from "~/components/AppShell";
import { EntryTable } from "~/components/EntryTable";
import { TranslationsProvider } from "~/components/TranslationProvider";
import { fetchEntries } from "~/services/fetchEntries";
import { initTranslations } from "../i18n";

type Props = {
  params: {
    locale: string;
  };
};

export default async function HomePage({ params: { locale } }: Props) {
  const { resources } = await initTranslations(locale, ["EntryTable"]);

  const entries = await fetchEntries();

  return (
    <TranslationsProvider
      namespaces={["EntryTable"]}
      locale={locale}
      resources={resources}
    >
      <AppShell>
        <AppShellMain>
          <Container>
            <EntryTable entries={entries} />
          </Container>
        </AppShellMain>
      </AppShell>{" "}
    </TranslationsProvider>
  );
}
