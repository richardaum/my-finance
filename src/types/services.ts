import { fetchEntries } from "~/services/fetchEntries";

export type FetchEntries = typeof fetchEntries;
export type FetchEntriesReturnType = Awaited<ReturnType<FetchEntries>>;
