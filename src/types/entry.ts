export type Entry = {
  description: string;
  amount: number;
  date: Date;
  category?: string;
  account?: string;
  tags: never[];
  repeatType: "NO_REPEAT" | "SPLIT" | "REPEAT" | "FIXED";
  frequency?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  initialSplit?: number;
  quantityOfSplits?: number;
  splitAmountType?: "TOTAL" | "SPLIT";
};
