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
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [opened, { toggle }] = useDisclosure();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{ width: opened ? 300 : 80, breakpoint: "sm" }}
      padding="md"
    >
      <AppShellHeader>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} size="sm" />
        </Group>
      </AppShellHeader>

      <AppShellNavbar p="lg">
        <Stack align="center">
          {opened ? (
            <Button
              fullWidth
              leftSection={<FontAwesomeIcon icon={faPlus} />}
              onClick={() => setCreateModalOpen(true)}
            >
              {t("button.addEntry")}
            </Button>
          ) : (
            <ActionIcon onClick={() => setCreateModalOpen(true)}>
              <FontAwesomeIcon icon={faPlus} />
            </ActionIcon>
          )}
        </Stack>
      </AppShellNavbar>

      <Modal
        opened={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create entry"
      >
        <Group grow>
          <TextInput
            data-autofocus
            required
            placeholder="Your first name"
            label="First name"
          />

          <TextInput required placeholder="Your last name" label="Last name" />
        </Group>
      </Modal>

      {children}
    </MantineAppShell>
  );
}
