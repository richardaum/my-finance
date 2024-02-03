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
import { currency } from "~/styles/currency";
import { FetchEntriesReturnType } from "~/types/services";

const statusToLabel = {
  PENDING: "Pendente",
  EXPIRED: "Expirado",
  COMPLETED: "Concluído",
};

function StatusIcon({
  color,
  icon,
  status,
}: {
  color: DefaultMantineColor;
  icon: IconProp;
  status: keyof typeof statusToLabel;
}) {
  return (
    <ThemeIcon
      color={color}
      size="xs"
      variant="transparent"
      title={statusToLabel[status]}
    >
      <FontAwesomeIcon icon={icon} />
    </ThemeIcon>
  );
}

export function EntriesTable({ entries }: { entries: FetchEntriesReturnType }) {
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
            <MantineTable.Th>Status</MantineTable.Th>
            <MantineTable.Th>Descrição</MantineTable.Th>
            <MantineTable.Th>Categoria</MantineTable.Th>
            <MantineTable.Th>Conta</MantineTable.Th>
            <MantineTable.Th>Valor</MantineTable.Th>
            <MantineTable.Th>Ações</MantineTable.Th>
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
                      status={entry.status}
                    />
                  )}
                  {entry.status === "EXPIRED" && (
                    <StatusIcon
                      color="red"
                      icon={faCalendarTimes}
                      status={entry.status}
                    />
                  )}
                  {entry.status === "COMPLETED" && (
                    <StatusIcon
                      color="green"
                      icon={faCircleCheck}
                      status={entry.status}
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
                  {currency.format(entry.value)}
                </MantineTable.Td>
              </MantineTable.Tr>
            );
          })}
        </MantineTable.Tbody>
      </MantineTable>
    </ScrollArea>
  );
}
