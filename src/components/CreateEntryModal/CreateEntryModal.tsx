"use client";
import { faBookmark, faCalendar, faNoteSticky } from "@fortawesome/free-regular-svg-icons";
import { faBank, faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, MultiSelect, Select, Stack, TextInput, ThemeIcon } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { mergeWith } from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CurrencyInput } from "~/components/CurrencyInput";
import { useCreateEntryModalContext } from "~/contexts/createEntryModal";
import { useCreateEntryMutation } from "~/hooks/useCreateEntryMutation";
import { mergeFunctions } from "~/utils/merge";

export function currencyFormatter(value: string) {
  if (!value) return "";

  const number = Number(value);
  if (number === 0) return "";

  const amount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number / 100);

  return `${amount}`;
}

export function removeFormatting(value: string) {
  return value.replace(/[^0-9]/g, "");
}

function useFocus() {
  const [isFocused, setIsFocused] = useState(false);

  return {
    isFocused,
    props: {
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
    },
  };
}

function FieldIcon({ children, isFocused }: { children: React.ReactNode; isFocused: boolean }) {
  return (
    <ThemeIcon variant="transparent" size="xs" c={isFocused ? "blue" : "gray"}>
      {children}
    </ThemeIcon>
  );
}

export function CreateEntryModal() {
  const { t } = useTranslation("CreateEntryModal");
  const createEntryModal = useCreateEntryModalContext();
  const descriptionFocus = useFocus();
  const dateFocus = useFocus();
  const categoryFocus = useFocus();
  const accountFocus = useFocus();
  const tagsFocus = useFocus();
  const createEntryMutation = useCreateEntryMutation();
  const form = useForm({
    initialValues: {
      description: "",
      amount: 0,
      date: new Date(),
      category: "",
      account: "",
      tags: [],
    },
    validate: {
      description: (value) => (value.length <= 0 ? t("createEntryModal.required") : null),
      amount: (value) => (value <= 0 ? t("createEntryModal.amount.lessOrEqualToZero") : null),
    },
  });

  return (
    <Modal
      opened={createEntryModal.isOpen}
      onClose={() => {
        form.reset();
        createEntryModal.close();
      }}
      title={t("createEntryModal.title")}
    >
      <form
        onSubmit={form.onSubmit((values) => {
          createEntryMutation.mutate({
            ...values,
            status: "PENDING",
            date: new Date(),
            category: {
              connect: { name: "Alimentação" },
            },
            account: {
              connect: { name: "Nubank" },
            },
            tags: {},
          });

          createEntryModal.close();
        })}
      >
        <Stack>
          <CurrencyInput {...form.getInputProps("amount")} required data-autofocus />

          <TextInput
            {...mergeWith(descriptionFocus.props, form.getInputProps("description"), mergeFunctions)}
            label={t("createEntryModal.description")}
            leftSection={
              <FieldIcon {...descriptionFocus}>
                <FontAwesomeIcon icon={faNoteSticky} />
              </FieldIcon>
            }
          />
          <DateInput
            {...mergeWith(dateFocus.props, form.getInputProps("date"), mergeFunctions)}
            locale="pt-BR"
            valueFormat="DD/MM/YYYY"
            label={t("createEntryModal.date")}
            placeholder={t("createEntryModal.selectPlaceholder")}
            leftSection={
              <FieldIcon {...dateFocus}>
                <FontAwesomeIcon icon={faCalendar} />
              </FieldIcon>
            }
          />
          <Select
            {...mergeWith(categoryFocus.props, form.getInputProps("category"), mergeFunctions)}
            label={t("createEntryModal.category")}
            placeholder={t("createEntryModal.selectPlaceholder")}
            data={["React", "Angular", "Vue", "Svelte"]}
            leftSection={
              <FieldIcon {...categoryFocus}>
                <FontAwesomeIcon icon={faBookmark} />
              </FieldIcon>
            }
            searchable
          />
          <Select
            {...mergeWith(accountFocus.props, form.getInputProps("account"), mergeFunctions)}
            label={t("createEntryModal.account")}
            placeholder={t("createEntryModal.selectPlaceholder")}
            data={["React", "Angular", "Vue", "Svelte"]}
            leftSection={
              <FieldIcon {...accountFocus}>
                <FontAwesomeIcon icon={faBank} />
              </FieldIcon>
            }
            searchable
          />
          <MultiSelect
            {...mergeWith(tagsFocus.props, form.getInputProps("tags"), mergeFunctions)}
            label={t("createEntryModal.tags")}
            data={["React", "Angular", "Vue", "Svelte"]}
            leftSection={
              <FieldIcon {...tagsFocus}>
                <FontAwesomeIcon icon={faTags} />
              </FieldIcon>
            }
            searchable
          />

          <Button type="submit" variant="filled" onClick={() => {}}>
            {t("createEntryModal.submit")}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
