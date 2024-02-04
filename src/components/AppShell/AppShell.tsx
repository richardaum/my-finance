"use client";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ActionIcon,
  AppShellHeader,
  AppShellNavbar,
  Burger,
  Button,
  Group,
  AppShell as MantineAppShell,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { useCreateEntryModalContext } from "~/contexts/createEntryModal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [opened, { toggle }] = useDisclosure();
  const createEntryModal = useCreateEntryModalContext();

  return (
    <MantineAppShell header={{ height: 60 }} navbar={{ width: opened ? 300 : 80, breakpoint: "sm" }} padding="md">
      <AppShellHeader>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} size="sm" />
        </Group>
      </AppShellHeader>

      <AppShellNavbar p="lg">
        <Stack align="center">
          {opened ? (
            <Button fullWidth leftSection={<FontAwesomeIcon icon={faPlus} />} onClick={createEntryModal.open}>
              {t("button.addEntry")}
            </Button>
          ) : (
            <ActionIcon onClick={createEntryModal.open}>
              <FontAwesomeIcon icon={faPlus} />
            </ActionIcon>
          )}
        </Stack>
      </AppShellNavbar>

      {children}
    </MantineAppShell>
  );
}
