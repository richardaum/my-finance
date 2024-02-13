import { AppShellMain, Container } from "@mantine/core";
import { AppShell } from "~/components/AppShell";
import { EntryTable } from "~/components/EntryTable";
import { TranslationsProvider } from "~/components/TranslationProvider";
import { fetchEntries } from "~/services/fetchEntries";
import { initTranslations } from "~/app/i18n";
import { CreateEntryModalProvider } from "~/contexts/createEntryModal";
import { CreateEntryModal } from "~/components/CreateEntryModal";
import { fetchCategories } from "~/services/fetchCategories";
import { fetchAccounts } from "~/services/fetchAccounts";

type Props = {
  params: {
    locale: string;
  };
};

const namespaces = ["EntryTable", "CreateEntryModal"];

export default async function HomePage({ params: { locale } }: Props) {
  const { resources } = await initTranslations({ locale, namespaces });

  const entries = await fetchEntries();
  const categories = await fetchCategories();
  const accounts = await fetchAccounts();

  return (
    <TranslationsProvider namespaces={namespaces} locale={locale} resources={resources}>
      <CreateEntryModalProvider>
        <AppShell>
          <AppShellMain>
            <Container>
              <EntryTable entries={entries} />
            </Container>
          </AppShellMain>
        </AppShell>

        <CreateEntryModal categories={categories} accounts={accounts} />
      </CreateEntryModalProvider>
    </TranslationsProvider>
  );
}
