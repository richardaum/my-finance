"use client";
import { faBookmark, faCalendar, faNoteSticky } from "@fortawesome/free-regular-svg-icons";
import { faBank, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Group,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalRoot,
  ModalTitle,
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
import { notifications } from "@mantine/notifications";
import { mergeWith } from "lodash";
import { useTranslation } from "react-i18next";
import { CurrencyInput } from "~/components/CurrencyInput";
import { useCreateEntryModalContext } from "~/contexts/createEntryModal";
import { useCreateEntryMutation } from "~/hooks/useCreateEntryMutation";
import { useFocus } from "~/hooks/useFocus";
import { useGetAccountsQuery } from "~/hooks/useGetAccountsQuery";
import { useGetCategoriesQuery } from "~/hooks/useGetCategoriesQuery";
import { useResetState } from "~/hooks/useResetState";
import { type FetchAccountsReturnType, type FetchCategoriesReturnType } from "~/types/services";
import { currency } from "~/utils/currency";
import { mergeFunctions } from "~/utils/merge";

function FieldIcon({ children, isFocused }: { children: React.ReactNode; isFocused: boolean }) {
  return (
    <ThemeIcon variant="transparent" size="xs" c={isFocused ? "blue" : "gray"}>
      {children}
    </ThemeIcon>
  );
}

type FormValues = {
  description: string;
  amount: number;
  date: Date;
  category: string | undefined;
  account: string | undefined;
  tags: never[];
  infinite: boolean;
  times: number;
  repeatType: "NO_REPEAT" | "SPLIT" | "REPEAT" | "FIXED";
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  initialSplit: number;
  quantityOfSplits: number;
  splitAmountType: "TOTAL" | "SPLIT";
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

  const form = useForm<FormValues>({
    validateInputOnChange: true,
    initialValues: {
      description: "",
      amount: 0,
      date: new Date(),
      category: categoriesResult.data[0]?.id,
      account: accountsResult.data[0]?.id,
      tags: [],
      infinite: false,
      times: 1,
      repeatType: "NO_REPEAT",
      frequency: "MONTHLY",
      initialSplit: 1,
      quantityOfSplits: 2,
      splitAmountType: "SPLIT",
    },
    validate: {
      amount: (value) => (value <= 0 ? t("createEntryModal.amount.lessOrEqualToZero") : null),
    },
  });

  function closeModal() {
    form.reset();
    createEntryModal.close();
    resetFullscreen();
  }

  return (
    <ModalRoot opened={createEntryModal.isOpen} onClose={closeModal} fullScreen={isFullscreen}>
      <ModalOverlay />

      <ModalContent>
        <form
          onSubmit={form.onSubmit((values) => {
            createEntryMutation.mutate({
              // ...values,
              description: values.description,
              amount: values.amount,
              status: "PENDING",
              date: new Date(),
              category: { connect: { id: values.category } },
              account: { connect: { id: values.account } },
              tags: {},
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
          <ModalHeader>
            <ModalTitle>
              <Group>
                <span>{t("createEntryModal.title")}</span>
                {isFullscreen && (
                  <Button ml="auto" type="submit" variant="filled">
                    {t("createEntryModal.submit")}
                  </Button>
                )}
              </Group>
            </ModalTitle>
            <ModalCloseButton />
          </ModalHeader>
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
                  required
                  searchable
                  allowDeselect={false}
                  label={t("createEntryModal.category")}
                  placeholder={t("createEntryModal.selectPlaceholder")}
                  data={categoriesResult.data.map((category) => ({ label: category.name, value: category.id }))}
                  selectFirstOptionOnChange
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
                      <Button variant="outline" onClick={() => setFullscreen(true)}>
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
                        {
                          onChange: () => {
                            form.setValues({
                              frequency: "MONTHLY",
                              initialSplit: 1,
                              quantityOfSplits: 2,
                              splitAmountType: "SPLIT",
                            });
                          },
                        },
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
                </Stack>
              )}
            </SimpleGrid>
          </ModalBody>
        </form>
      </ModalContent>
    </ModalRoot>
  );
}

function getAmount(values: FormValues) {
  return values.repeatType === "SPLIT" && values.splitAmountType === "SPLIT"
    ? values.amount / values.quantityOfSplits
    : values.amount;
}
