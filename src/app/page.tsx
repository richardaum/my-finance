"use client";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Burger,
  Group,
  Skeleton,
} from "@mantine/core";
import dayjs from "dayjs";
import { DataTable } from "mantine-datatable";

export default function HomePage() {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: false } }}
      padding="md"
    >
      <AppShellHeader>
        <Group h="100%" px="md">
          <Burger hiddenFrom="sm" size="sm" />
        </Group>
      </AppShellHeader>

      <AppShellNavbar p="md">
        Navbar
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate />
          ))}
      </AppShellNavbar>

      <AppShellMain>
        <DataTable
          withTableBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          records={[
            {
              status: "done",
              date: dayjs().format("DD/MM/YYYY"),
              name: "Casa",
              category: "Moradia",
              account: "Nubank",
              value: -10,
            },
          ]}
          columns={[
            {
              accessor: "status",
              title: "Situação",
              render: ({ status }) => (
                <>
                  {status === "done" && (
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      color="var(--mantine-color-green-5)"
                    />
                  )}
                </>
              ),
            },
            { accessor: "date", title: "Data" },
            { accessor: "description", title: "Descrição" },
            { accessor: "category", title: "Categoria" },
            { accessor: "account", title: "Conta" },
            { accessor: "value", title: "Valor", textAlign: "right" },
            { accessor: "actions", title: "Ações", textAlign: "right" },
          ]}
        />
      </AppShellMain>
    </AppShell>
  );
}
