import { type fetchAccounts } from "~/services/fetchAccounts";
import { type fetchCategories } from "~/services/fetchCategories";
import { type fetchEntries } from "~/services/fetchEntries";

export type FetchEntries = typeof fetchEntries;
export type FetchEntriesReturnType = Awaited<ReturnType<FetchEntries>>;
export type Entry = FetchEntriesReturnType[0];

export type FetchCategories = typeof fetchCategories;
export type FetchCategoriesReturnType = Awaited<ReturnType<FetchCategories>>;

export type FetchAccounts = typeof fetchAccounts;
export type FetchAccountsReturnType = Awaited<ReturnType<FetchAccounts>>;
