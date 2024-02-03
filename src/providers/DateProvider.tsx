"use client";
import "dayjs/locale/pt-br";

import { DatesProvider } from "@mantine/dates";

export function DateProvider({ children }: { children: React.ReactNode }) {
  return (
    <DatesProvider settings={{ locale: "pt-br" }}>{children}</DatesProvider>
  );
}
