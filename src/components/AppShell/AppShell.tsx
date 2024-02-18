"use client";
import { faChevronLeft, faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, AppShellNavbar, Button, Flex, AppShell as MantineAppShell, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { useCreateEntryModalContext } from "~/contexts/createEntryModal";
import classes from "./AppShell.module.css";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation("AppShell");
  const [opened, { toggle }] = useDisclosure();
  const createEntryModal = useCreateEntryModalContext();

  return (
    <MantineAppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{ width: opened ? 300 : 80, breakpoint: "0" }}
      padding="md"
    >
      <AppShellNavbar p="lg" classNames={{ navbar: classes.navbar }}>
        <Stack align="center">
          <Flex>
            {opened ? (
              <Button fullWidth leftSection={<FontAwesomeIcon icon={faPlus} />} onClick={() => createEntryModal.open()}>
                {t("appShell.button.addEntry")}
              </Button>
            ) : (
              <ActionIcon onClick={() => createEntryModal.open()}>
                <FontAwesomeIcon icon={faPlus} />
              </ActionIcon>
            )}

            <ActionIcon color="gray" variant="filled" size="xs" classNames={{ root: classes.toggle }} onClick={toggle}>
              <FontAwesomeIcon icon={opened ? faChevronLeft : faChevronRight} size="xs" />
            </ActionIcon>
          </Flex>
        </Stack>
      </AppShellNavbar>

      {children}
    </MantineAppShell>
  );
}
