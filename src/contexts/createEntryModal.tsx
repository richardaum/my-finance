"use client";

import { createContextState } from "create-context-state";
import { type Entry } from "~/types/services";

type Mode = "create" | "edit";

export const [CreateEntryModalProvider, useCreateEntryModalContext] = createContextState<{
  entry?: Entry;
  mode?: Mode;
  isOpen: boolean;
  open: (editOptions?: { mode: "edit"; entry: Entry }) => void;
  close: () => void;
  reset: () => void;
}>(({ set }) => ({
  isOpen: false,
  open: (options) =>
    set((state) => {
      if (isEditOptions(options)) {
        const { mode, entry } = options;
        return { ...state, mode, entry, isOpen: true };
      }
      return { ...state, mode: "create", isOpen: true };
    }),
  close: () => set(() => ({ isOpen: false })),
  reset: () => ({ isOpen: false }),
}));

function isEditOptions(options: { mode: "edit"; entry: Entry } | undefined): options is { mode: "edit"; entry: Entry } {
  return options?.mode === "edit";
}
