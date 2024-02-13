export type EntryFormValue = {
  description: string;
  amount: number;
  date: Date;
  category?: string;
  account?: string;
  tags: never[];
  repeatType: "NO_REPEAT" | "SPLIT" | "REPEAT" | "FIXED";
  frequency?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | null;
  initialSplit?: number | null;
  quantityOfSplits?: number | null;
  splitAmountType?: "TOTAL" | "SPLIT" | null;
};
