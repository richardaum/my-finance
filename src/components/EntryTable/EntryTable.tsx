"use client";

import { type IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCalendarTimes, faCircleCheck, faWarning, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Checkbox, Table, ScrollArea, ThemeIcon, rem, type DefaultMantineColor, Group, Text } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetEntriesQuery } from "~/hooks/useGetEntriesQuery";
import { type FetchEntriesReturnType } from "~/types/services";
import { currency } from "~/utils/currency";
import { date } from "~/utils/date";

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
      <Table miw={800} verticalSpacing="sm" highlightOnHover>
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
            <Table.Th ta="right">{t("entryTable.heading.actions")}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {entries.map((entry) => {
            const selected = selection.includes(entry.id);
            return (
              <Table.Tr key={entry.id} bg={selected ? "var(--mantine-color-blue-light)" : undefined}>
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
                <Table.Td>{date.format(new Date(entry.date))}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Text size="sm">{entry.description}</Text>
                    {entry.repeatId && <Icon color="blue" icon={faRepeat} title={t("entryTable.repeat")} />}
                  </Group>
                </Table.Td>
                <Table.Td>{entry.category.name}</Table.Td>
                <Table.Td>{entry.account.name}</Table.Td>
                <Table.Td ta="right">{currency.format(entry.amount)}</Table.Td>
                <Table.Td />
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
