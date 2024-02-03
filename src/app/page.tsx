import { AppShellMain, Container } from "@mantine/core";
import { AppShell } from "~/components/AppShell";
import { EntriesTable } from "~/components/Table";
import { fetchEntries } from "~/services/fetchEntries";

export default async function HomePage() {
  const entries = await fetchEntries();

  return (
    <AppShell>
      <AppShellMain>
        <Container>
          <EntriesTable entries={entries} />
        </Container>
      </AppShellMain>
    </AppShell>
  );
}
