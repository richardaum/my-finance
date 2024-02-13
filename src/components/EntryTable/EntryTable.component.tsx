"use client";

import { type IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCalendarTimes, faCircleCheck, faWarning, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Checkbox,
  Table as MantineTable,
  ScrollArea,
  ThemeIcon,
  rem,
  type DefaultMantineColor,
  Group,
  Text,
} from "@mantine/core";
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
      <MantineTable miw={800} verticalSpacing="sm">
        <MantineTable.Thead>
          <MantineTable.Tr>
            <MantineTable.Th style={{ width: rem(40) }}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === entries.length}
                indeterminate={selection.length > 0 && selection.length !== entries.length}
              />
            </MantineTable.Th>
            <MantineTable.Th>{t("entryTable.heading.status")}</MantineTable.Th>
            <MantineTable.Th>{t("entryTable.heading.date")}</MantineTable.Th>
            <MantineTable.Th>{t("entryTable.heading.description")}</MantineTable.Th>
            <MantineTable.Th>{t("entryTable.heading.category")}</MantineTable.Th>
            <MantineTable.Th>{t("entryTable.heading.account")}</MantineTable.Th>
            <MantineTable.Th ta="right">{t("entryTable.heading.amount")}</MantineTable.Th>
            <MantineTable.Th ta="right">{t("entryTable.heading.actions")}</MantineTable.Th>
          </MantineTable.Tr>
        </MantineTable.Thead>
        <MantineTable.Tbody>
          {entries.map((entry) => {
            const selected = selection.includes(entry.id);
            return (
              <MantineTable.Tr key={entry.id} bg={selected ? "var(--mantine-color-blue-light)" : undefined}>
                <MantineTable.Td>
                  <Checkbox checked={selection.includes(entry.id)} onChange={() => toggleRow(entry.id)} />
                </MantineTable.Td>
                <MantineTable.Td>
                  {entry.status === "PENDING" && (
                    <Icon color="yellow" icon={faWarning} title={t(`entryTable.status.${entry.status}`)} />
                  )}
                  {entry.status === "EXPIRED" && (
                    <Icon color="red" icon={faCalendarTimes} title={t(`entryTable.status.${entry.status}`)} />
                  )}
                  {entry.status === "PAID" && (
                    <Icon color="green" icon={faCircleCheck} title={t(`entryTable.status.${entry.status}`)} />
                  )}
                </MantineTable.Td>
                <MantineTable.Td>{date.format(new Date(entry.date))}</MantineTable.Td>
                <MantineTable.Td>
                  <Group gap="xs">
                    <Text size="sm">{entry.description}</Text>
                    {entry.repeatId && <Icon color="blue" icon={faRepeat} title={t("entryTable.repeat")} />}
                  </Group>
                </MantineTable.Td>
                <MantineTable.Td>{entry.category.name}</MantineTable.Td>
                <MantineTable.Td>{entry.account.name}</MantineTable.Td>
                <MantineTable.Td ta="right">{currency.format(entry.amount)}</MantineTable.Td>
                <MantineTable.Td />
              </MantineTable.Tr>
            );
          })}
        </MantineTable.Tbody>
      </MantineTable>
    </ScrollArea>
  );
}
