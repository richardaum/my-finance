"use client";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faCalendarTimes,
  faCircleCheck,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Checkbox,
  DefaultMantineColor,
  Group,
  Table as MantineTable,
  ScrollArea,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { currency } from "~/styles/currency";
import { FetchEntriesReturnType } from "~/types/services";

function StatusIcon({
  icon,
  ...props
}: {
  color: DefaultMantineColor;
  icon: IconProp;
  title: string;
}) {
  return (
    <ThemeIcon size="xs" variant="transparent" {...props}>
      <FontAwesomeIcon icon={icon} />
    </ThemeIcon>
  );
}

export function EntryTable({ entries }: { entries: FetchEntriesReturnType }) {
  const { t } = useTranslation("EntryTable");
  const [selection, setSelection] = useState<string[]>([]);

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  const toggleAll = () =>
    setSelection((current) =>
      current.length === entries.length ? [] : entries.map((item) => item.id),
    );

  return (
    <ScrollArea>
      <MantineTable miw={800} verticalSpacing="sm">
        <MantineTable.Thead>
          <MantineTable.Tr>
            <MantineTable.Th style={{ width: rem(40) }}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === entries.length}
                indeterminate={
                  selection.length > 0 && selection.length !== entries.length
                }
              />
            </MantineTable.Th>
            <MantineTable.Th>{t("heading.status")}</MantineTable.Th>
            <MantineTable.Th>{t("heading.description")}</MantineTable.Th>
            <MantineTable.Th>{t("heading.category")}</MantineTable.Th>
            <MantineTable.Th>{t("heading.account")}</MantineTable.Th>
            <MantineTable.Th>{t("heading.amount")}</MantineTable.Th>
            <MantineTable.Th>{t("heading.actions")}</MantineTable.Th>
          </MantineTable.Tr>
        </MantineTable.Thead>
        <MantineTable.Tbody>
          {entries.map((entry) => {
            const selected = selection.includes(entry.id);
            return (
              <MantineTable.Tr
                key={entry.id}
                bg={selected ? "var(--mantine-color-blue-light)" : undefined}
              >
                <MantineTable.Td>
                  <Checkbox
                    checked={selection.includes(entry.id)}
                    onChange={() => toggleRow(entry.id)}
                  />
                </MantineTable.Td>
                <MantineTable.Td>
                  {entry.status === "PENDING" && (
                    <StatusIcon
                      color="yellow"
                      icon={faWarning}
                      title={t(`status.${entry.status}`)}
                    />
                  )}
                  {entry.status === "EXPIRED" && (
                    <StatusIcon
                      color="red"
                      icon={faCalendarTimes}
                      title={t(`status.${entry.status}`)}
                    />
                  )}
                  {entry.status === "PAID" && (
                    <StatusIcon
                      color="green"
                      icon={faCircleCheck}
                      title={t(`status.${entry.status}`)}
                    />
                  )}
                </MantineTable.Td>
                <MantineTable.Td>
                  <Group gap="sm">
                    <Text size="sm" fw={500}>
                      {entry.description}
                    </Text>
                  </Group>
                </MantineTable.Td>
                <MantineTable.Td>{entry.category.name}</MantineTable.Td>
                <MantineTable.Td>{entry.account.name}</MantineTable.Td>
                <MantineTable.Td>
                  {currency.format(entry.amount)}
                </MantineTable.Td>
              </MantineTable.Tr>
            );
          })}
        </MantineTable.Tbody>
      </MantineTable>
    </ScrollArea>
  );
}
