"use client";
import { NumberInputProps, TextInput, TextInputProps } from "@mantine/core";
import { NumberFormatBase } from "react-number-format";
import { currencyFormatter, removeFormatting } from "../CreateEntryModal";

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
