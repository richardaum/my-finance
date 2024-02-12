"use client";
import { type NumberInputProps, TextInput, type TextInputProps } from "@mantine/core";
import { NumberFormatBase } from "react-number-format";

function currencyFormatter(value: string) {
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

export function CurrencyInput(
  props: Omit<TextInputProps, "value" | "type" | "defaultValue" | "onChange"> &
    Pick<NumberInputProps, "value" | "defaultValue" | "onChange">,
) {
  return (
    <NumberFormatBase
      {...props}
      customInput={TextInput}
      format={currencyFormatter}
      removeFormatting={removeFormatting}
      prefix={"R$ "}
      placeholder="R$ 0,00"
      value={props.value ? Number(props.value) * 100 : undefined}
      onChange={undefined}
      onValueChange={({ floatValue, formattedValue }, { event }) => {
        if (floatValue == null) return;
        if (!event) return;

        const target = event.target as HTMLInputElement;
        const valueLength = formattedValue.length;
        target.setSelectionRange(valueLength, valueLength);

        props.onChange?.(floatValue / 100);
      }}
      size="xl"
    />
  );
}
