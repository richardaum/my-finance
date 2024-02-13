"use client";

import { type IconProp } from "@fortawesome/fontawesome-svg-core";
import { faEdit, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faCalendarTimes, faCircleCheck, faRepeat, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ActionIcon,
  Box,
  Checkbox,
  Group,
  ScrollArea,
  Table,
  Text,
  ThemeIcon,
  rem,
  type DefaultMantineColor,
} from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetEntriesQuery } from "~/hooks/useGetEntriesQuery";
import { type FetchEntriesReturnType } from "~/types/services";
import { currency } from "~/utils/currency";
import { date, datetime } from "~/utils/date";
import classes from "./EntryTable.module.css";
import { useCreateEntryModalContext } from "~/contexts/createEntryModal";

function Icon({ icon, ...props }: { color: DefaultMantineColor; icon: IconProp; title: string }) {
  return (
    <ThemeIcon size="xs" variant="transparent" {...props}>
      <FontAwesomeIcon icon={icon} />
    </ThemeIcon>
  );
}

type Props = {
  entries: FetchEntriesReturnType;
};

export function EntryTable(props: Props) {
  const createEntryModal = useCreateEntryModalContext();
  const { t } = useTranslation("EntryTable");
  const [selection, setSelection] = useState<string[]>([]);
  const entriesResult = useGetEntriesQuery({ initialData: props.entries });

  const entries = entriesResult.data;

  const toggleRow = (id: string) =>
    setSelection((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const toggleAll = () =>
    setSelection((current) => (current.length === entries.length ? [] : entries.map((item) => item.id)));

  return (
    <ScrollArea>
      <Table miw={800} verticalSpacing="sm" highlightOnHover classNames={{ tr: classes.row }}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: rem(40) }}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === entries.length}
                indeterminate={selection.length > 0 && selection.length !== entries.length}
              />
            </Table.Th>
            <Table.Th>{t("entryTable.heading.status")}</Table.Th>
            <Table.Th>{t("entryTable.heading.date")}</Table.Th>
            <Table.Th>{t("entryTable.heading.description")}</Table.Th>
            <Table.Th>{t("entryTable.heading.category")}</Table.Th>
            <Table.Th>{t("entryTable.heading.account")}</Table.Th>
            <Table.Th ta="right">{t("entryTable.heading.amount")}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {entries.map((entry) => {
            const selected = selection.includes(entry.id);
            return (
              <Table.Tr key={entry.id} bg={selected ? "var(--mantine-color-blue-light)" : undefined} pos="relative">
                <Table.Td>
                  <Checkbox checked={selection.includes(entry.id)} onChange={() => toggleRow(entry.id)} />
                </Table.Td>
                <Table.Td>
                  {entry.status === "PENDING" && (
                    <Icon color="yellow" icon={faWarning} title={t(`entryTable.status.${entry.status}`)} />
                  )}
                  {entry.status === "EXPIRED" && (
                    <Icon color="red" icon={faCalendarTimes} title={t(`entryTable.status.${entry.status}`)} />
                  )}
                  {entry.status === "PAID" && (
                    <Icon color="green" icon={faCircleCheck} title={t(`entryTable.status.${entry.status}`)} />
                  )}
                </Table.Td>
                <Table.Td title={datetime.format(new Date(entry.date))}>{date.format(new Date(entry.date))}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Text size="sm">{entry.description}</Text>
                    {entry.repeatId && <Icon color="blue" icon={faRepeat} title={t("entryTable.repeat")} />}
                  </Group>
                </Table.Td>
                <Table.Td>{entry.category.name}</Table.Td>
                <Table.Td>{entry.account.name}</Table.Td>
                <Table.Td ta="right">{currency.format(entry.amount)}</Table.Td>

                <Box component="td" className={classes.actions}>
                  <ActionIcon variant="subtle" aria-label="Settings" color="gray" title={t("entryTable.pay.label")}>
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </ActionIcon>

                  <ActionIcon
                    variant="subtle"
                    aria-label="Settings"
                    color="gray"
                    title={t("entryTable.edit.label")}
                    onClick={() => createEntryModal.open({ mode: "edit", entry })}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </ActionIcon>

                  <ActionIcon variant="subtle" aria-label="Settings" color="gray" title={t("entryTable.delete.label")}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </ActionIcon>
                </Box>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
