"use client";
import classes from "./CreateEntryModal.module.css";
import { faBookmark, faCalendar, faNoteSticky } from "@fortawesome/free-regular-svg-icons";
import { faAnglesRight, faBank, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Code,
  ComboboxOption,
  Flex,
  Group,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalRoot,
  NumberInput,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications, showNotification } from "@mantine/notifications";
import { mergeWith } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CurrencyInput } from "~/components/CurrencyInput";
import { useCreateEntryModalContext } from "~/contexts/createEntryModal";
import { useCreateEntryMutation } from "~/hooks/useCreateEntryMutation";
import { useFocus } from "~/hooks/useFocus";
import { useGetAccountsQuery } from "~/hooks/useGetAccountsQuery";
import { useGetCategoriesQuery } from "~/hooks/useGetCategoriesQuery";
import { useResetState } from "~/hooks/useResetState";
import { type EntryFormValue } from "~/types/entry";
import { type Entry, type FetchAccountsReturnType, type FetchCategoriesReturnType } from "~/types/services";
import { currency } from "~/utils/currency";
import { mergeFunctions } from "~/utils/merge";

function FieldIcon({ children, isFocused }: { children: React.ReactNode; isFocused: boolean }) {
  return (
    <ThemeIcon variant="transparent" size="xs" c={isFocused ? "blue" : "gray"}>
      {children}
    </ThemeIcon>
  );
}

const defaultValuesByRepeatType = {
  NO_REPEAT: {
    frequency: undefined,
    initialSplit: undefined,
    quantityOfSplits: undefined,
    splitAmountType: undefined,
  } as const,
  SPLIT: {
    frequency: "MONTHLY",
    initialSplit: 1,
    quantityOfSplits: 2,
    splitAmountType: "SPLIT",
  } as const,
  REPEAT: {
    frequency: "MONTHLY",
    initialSplit: 1,
    quantityOfSplits: 2,
    splitAmountType: "SPLIT",
  } as const,
  FIXED: {
    frequency: "MONTHLY",
    initialSplit: undefined,
    quantityOfSplits: undefined,
    splitAmountType: undefined,
  } as const,
};

type Props = {
  categories: FetchCategoriesReturnType;
  accounts: FetchAccountsReturnType;
};

export function CreateEntryModal(props: Props) {
  const { t } = useTranslation("CreateEntryModal");
  const createEntryModal = useCreateEntryModalContext();
  const descriptionFocus = useFocus();
  const dateFocus = useFocus();
  const categoryFocus = useFocus();
  const accountFocus = useFocus();
  const repeatFocus = useFocus();
  const createEntryMutation = useCreateEntryMutation();
  const categoriesResult = useGetCategoriesQuery({ initialData: props.categories });
  const accountsResult = useGetAccountsQuery({ initialData: props.accounts });
  const [isFullscreen, setFullscreen, resetFullscreen] = useResetState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState('');

  const formInitialValues: Readonly<EntryFormValue> = {
    description: "",
    amount: 0,
    date: new Date(),
    // category: categoriesResult.data[0]?.id,
    account: accountsResult.data[0]?.id,
    tags: [],
    repeatType: "NO_REPEAT",
    frequency: undefined,
    initialSplit: undefined,
    quantityOfSplits: undefined,
    splitAmountType: undefined,
  };

  const form = useForm<EntryFormValue>({
    validateInputOnChange: true,
    initialValues: createEntryModal.entry ? convertEntryToFormValues(createEntryModal.entry) : formInitialValues,
    validate: {
      amount: (value) => (value <= 0 ? t("createEntryModal.amount.lessOrEqualToZero") : null),
    },
  });

  useEffect(() => {
    if (!form.isDirty() && createEntryModal.isOpen && createEntryModal.mode === "edit" && createEntryModal.entry) {
      const values = convertEntryToFormValues(createEntryModal.entry);
      form.setValues(values);
    }
  }, [createEntryModal.entry, createEntryModal.isOpen, createEntryModal.mode, form]);

  function closeModal() {
    createEntryModal.close();
    form.reset();
    resetFullscreen();
  }

  function handleChangeRepeatType(repeatType: EntryFormValue["repeatType"]) {
    form.setValues(defaultValuesByRepeatType[repeatType]);
  }

  function handleMoreOptionsClick() {
    // Prevent loose focus when clicking on a button that will disappear
    modalRef.current?.querySelector("input")?.focus();
    setFullscreen(true);
  }

  return (
    <ModalRoot opened={createEntryModal.isOpen} onClose={closeModal} fullScreen={isFullscreen} ref={modalRef}>
      <ModalOverlay />

      <ModalContent>
        <form
          onSubmit={form.onSubmit((values) => {
            if (createEntryModal.mode === "edit") {
              showNotification({ message: "Não disponível" });
              return;
            }

            // TODO need to call a separate mutation to edit
            createEntryMutation.mutate({
              // ...values,
              description: values.description,
              amount: values.amount,
              status: "PENDING",
              date: new Date(),
              category: { connect: { id: values.category } },
              account: { connect: { id: values.account } },
              tags: {},
              repeat:
                values.repeatType !== "NO_REPEAT"
                  ? {
                      create: {
                        type: values.repeatType,
                        frequency: values.frequency,
                        initialSplit: values.initialSplit,
                        quantityOfSplits: values.quantityOfSplits,
                        splitAmountType: values.splitAmountType,
                      },
                    }
                  : undefined,
            });

            closeModal();

            notifications.show({
              title: t("createEntryModal.success.title"),
              message: t("createEntryModal.success.message", { description: values.description }),
              color: "green",
              withBorder: true,
            });
          })}
        >
          <SimpleGrid cols={isFullscreen ? 2 : 1}>
            <Flex align="center" p="md" direction={isFullscreen ? "row" : "row-reverse"}>
              <ModalCloseButton ml={isFullscreen ? 0 : "auto"} mr={isFullscreen ? "md" : 0} />
              <span>{t("createEntryModal.title")}</span>
            </Flex>

            {isFullscreen && (
              <Box py="md">
                <Button ml="auto" type="submit" variant="filled">
                  {t("createEntryModal.submit")}
                </Button>
              </Box>
            )}
          </SimpleGrid>

          <ModalBody>
            <SimpleGrid cols={isFullscreen ? 2 : 1}>
              <Stack>
                <CurrencyInput {...form.getInputProps("amount")} required data-autofocus />

                <TextInput
                  {...mergeWith(descriptionFocus.props, form.getInputProps("description"), mergeFunctions)}
                  required
                  label={t("createEntryModal.description")}
                  leftSection={
                    <FieldIcon {...descriptionFocus}>
                      <FontAwesomeIcon icon={faNoteSticky} />
                    </FieldIcon>
                  }
                />
                <DateInput
                  {...mergeWith(dateFocus.props, form.getInputProps("date"), mergeFunctions)}
                  required
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
                  classNames={{ empty: classes.empty }}
                  required
                  searchable
                  allowDeselect={false}
                  label={t("createEntryModal.category")}
                  placeholder={t("createEntryModal.selectPlaceholder")}
                  data={categoriesResult.data.map((category) => ({ label: category.name, value: category.id }))}
                  searchValue={searchValue}
                  onSearchChange={v=>{
                    console.log(v)
                    setSearchValue(v)
                  }}
                  nothingFoundMessage={
                    <ComboboxOption value="">Criar nova categoria {`"${searchValue}"`}</ComboboxOption>
                  }
                  leftSection={
                    <FieldIcon {...categoryFocus}>
                      <FontAwesomeIcon icon={faBookmark} />
                    </FieldIcon>
                  }
                />
                <Select
                  {...mergeWith(accountFocus.props, form.getInputProps("account"), mergeFunctions)}
                  required
                  searchable
                  allowDeselect={false}
                  label={t("createEntryModal.account")}
                  placeholder={t("createEntryModal.selectPlaceholder")}
                  data={accountsResult.data.map((account) => ({ label: account.name, value: account.id }))}
                  leftSection={
                    <FieldIcon {...accountFocus}>
                      <FontAwesomeIcon icon={faBank} />
                    </FieldIcon>
                  }
                />
                <Group justify="right">
                  {!isFullscreen && (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleMoreOptionsClick}
                        leftSection={form.values.repeatType !== "NO_REPEAT" && <FontAwesomeIcon icon={faAnglesRight} />}
                      >
                        {t("createEntryModal.moreOptions")}
                      </Button>
                      <Button type="submit" variant="filled">
                        {t("createEntryModal.submit")}
                      </Button>
                    </>
                  )}
                </Group>
              </Stack>

              {isFullscreen && (
                <Stack align="flex-start">
                  <Group>
                    <Select
                      {...mergeWith(
                        repeatFocus.props,
                        form.getInputProps("repeatType"),
                        { onChange: handleChangeRepeatType },
                        mergeFunctions,
                      )}
                      required
                      allowDeselect={false}
                      placeholder={t("createEntryModal.selectPlaceholder")}
                      defaultValue="NO_REPEAT"
                      data={[
                        { label: "Não repetir", value: "NO_REPEAT" },
                        { label: "Parcelar", value: "SPLIT" },
                        { label: "Repetir", value: "REPEAT" },
                        { label: "Fixa", value: "FIXED" },
                      ]}
                      leftSection={
                        <FieldIcon {...accountFocus}>
                          <FontAwesomeIcon icon={faRepeat} />
                        </FieldIcon>
                      }
                    />
                    {form.values.repeatType === "SPLIT" && (
                      <Text fs="italic" size="sm">
                        {form.values.initialSplit === 1
                          ? t("createEntryModal.split.fromBegining", {
                              times: form.values.quantityOfSplits,
                              amount: currency.format(getAmount(form.values)),
                            })
                          : t("createEntryModal.split.alreadyStarted", {
                              times: form.values.quantityOfSplits,
                              amount: currency.format(getAmount(form.values)),
                              initialSplit: form.values.initialSplit,
                            })}
                      </Text>
                    )}
                  </Group>

                  {form.values.repeatType === "SPLIT" && (
                    <SegmentedControl
                      {...form.getInputProps("splitAmountType")}
                      data={[
                        { value: "SPLIT", label: "Valor parcelado" },
                        { value: "TOTAL", label: "Valor total" },
                      ]}
                    />
                  )}

                  {(form.values.repeatType === "SPLIT" || form.values.repeatType === "REPEAT") && (
                    <Group>
                      <NumberInput {...form.getInputProps("initialSplit")} label="Parcela inicial" min={1} />
                      <NumberInput {...form.getInputProps("quantityOfSplits")} label="Quantidade" min={2} />
                    </Group>
                  )}

                  {form.values.repeatType !== "NO_REPEAT" && (
                    <Select
                      {...form.getInputProps("frequency")}
                      allowDeselect={false}
                      label="Periodicidade"
                      data={
                        form.values.repeatType === "SPLIT"
                          ? [{ label: t(`createEntryModal.label.MONTHLY`), value: `MONTHLY` }]
                          : [
                              { label: t(`createEntryModal.label.DAILY`), value: `DAILY` },
                              { label: t(`createEntryModal.label.WEEKLY`), value: `WEEKLY` },
                              { label: t(`createEntryModal.label.MONTHLY`), value: `MONTHLY` },
                              { label: t(`createEntryModal.label.YEARLY`), value: `YEARLY` },
                            ]
                      }
                    />
                  )}

                  <Code block>{JSON.stringify(form.values, null, 2)}</Code>
                </Stack>
              )}
            </SimpleGrid>
          </ModalBody>
        </form>
      </ModalContent>
    </ModalRoot>
  );
}

function getAmount(entry: EntryFormValue) {
  return entry.repeatType === "SPLIT" && entry.splitAmountType === "SPLIT" && entry.quantityOfSplits
    ? entry.amount / entry.quantityOfSplits
    : entry.amount;
}

function convertEntryToFormValues(entry: Entry) {
  const formValues: EntryFormValue = {
    description: entry.description,
    amount: entry.amount,
    date: new Date(entry.date),
    category: entry.category.id,
    account: entry.account.id,
    repeatType: entry.repeat?.type ?? "NO_REPEAT",
    frequency: entry.repeat?.frequency,
    initialSplit: entry.repeat?.initialSplit,
    quantityOfSplits: entry.repeat?.quantityOfSplits,
    splitAmountType: entry.repeat?.splitAmountType,
    tags: [],
  };

  return formValues;
}
