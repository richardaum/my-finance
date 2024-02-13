"use client";

import { createContextState } from "create-context-state";
import { type Entry } from "~/types/entry";

export const [CreateEntryModalProvider, useCreateEntryModalContext] = createContextState<{
  entry?: Entry;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  reset: () => void;
}>(({ set }) => ({
  isOpen: false,
  open: () => set((state) => ({ ...state, isOpen: true })),
  close: () => set((state) => ({ ...state, isOpen: false })),
  reset: () => ({ isOpen: false }),

  save: () => {
    console.log("Save");
  },
}));
