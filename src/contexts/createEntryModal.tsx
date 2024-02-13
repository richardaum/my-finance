"use client";

import { createContextState } from "create-context-state";

export const [CreateEntryModalProvider, useCreateEntryModalContext] = createContextState<{
  isOpen: boolean;
  open: () => void;
  close: () => void;
  reset: () => void;
}>(({ set }) => ({
  isOpen: false,
  open: () => set((state) => ({ ...state, isOpen: true })),
  close: () => set((state) => ({ ...state, isOpen: false })),
  reset: () => ({ isOpen: false }),
}));
