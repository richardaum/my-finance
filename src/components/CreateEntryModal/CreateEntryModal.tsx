"use client";
import {
  faCalendar,
  faNoteSticky,
  faBookmark,
} from "@fortawesome/free-regular-svg-icons";
import { faBank, faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Modal,
  MultiSelect,
  Select,
  Stack,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NumberFormatBase } from "react-number-format";
import { useCreateEntryModalContext } from "~/contexts/createEntryModal";

export default function currencyFormatter(value: string) {
  if (!value) return "";

  const number = Number(value);
  if (number === 0) return "";

  const amount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number / 100);

  return `${amount}`;
}

function removeFormatting(value: string) {
  return value.replace(/[^0-9]/g, "");
}

function useFocus() {
  const [isFocused, setIsFocused] = useState(false);

  return {
    isFocused,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  };
}

function FieldIcon({
  children,
  isFocused,
}: {
  children: React.ReactNode;
  isFocused: boolean;
}) {
  return (
    <ThemeIcon variant="transparent" size="xs" c={isFocused ? "blue" : "gray"}>
      {children}
    </ThemeIcon>
  );
}

export function CreateEntryModal() {
  const { t } = useTranslation("CreateEntryModal");
  const createEntryModal = useCreateEntryModalContext();
  const [amount, setAmount] = useState<number>();

  const descriptionFocus = useFocus();
  const dateFocus = useFocus();
  const categoryFocus = useFocus();
  const accountFocus = useFocus();
  const tagsFocus = useFocus();

  return (
    <Modal
      opened={createEntryModal.isOpen}
      onClose={createEntryModal.close}
      title={t("createEntryModal.title")}
    >
      <Stack>
        <NumberFormatBase
          required
          data-autofocus
          customInput={TextInput}
          format={currencyFormatter}
          removeFormatting={removeFormatting}
          prefix={"R$ "}
          placeholder="R$ 0,00"
          value={amount}
          onValueChange={({ floatValue, formattedValue }, { event }) => {
            setAmount(floatValue);
            if (!event) return;
            const target = event.target as HTMLInputElement;
            const valueLength = formattedValue.length;
            target.setSelectionRange(valueLength, valueLength);
          }}
          size="xl"
        />

        <TextInput
          {...descriptionFocus}
          label={t("createEntryModal.description")}
          leftSection={
            <FieldIcon {...descriptionFocus}>
              <FontAwesomeIcon icon={faNoteSticky} />
            </FieldIcon>
          }
        />
        <DateInput
          {...dateFocus}
          label={t("createEntryModal.date")}
          placeholder={t("createEntryModal.selectPlaceholder")}
          leftSection={
            <FieldIcon {...dateFocus}>
              <FontAwesomeIcon icon={faCalendar} />
            </FieldIcon>
          }
        />
        <Select
          {...categoryFocus}
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
          {...accountFocus}
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
          {...tagsFocus}
          label={t("createEntryModal.tags")}
          data={["React", "Angular", "Vue", "Svelte"]}
          leftSection={
            <FieldIcon {...tagsFocus}>
              <FontAwesomeIcon icon={faTags} />
            </FieldIcon>
          }
          searchable
        />

        <Button variant="filled">{t("createEntryModal.submit")}</Button>
      </Stack>
    </Modal>
  );
}
