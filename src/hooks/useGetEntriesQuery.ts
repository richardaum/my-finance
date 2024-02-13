import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type FetchEntriesReturnType } from "~/types/services";

export const getEntriesQueryKey = ["entries"] as const;

export function useGetEntriesQuery(options: { initialData: FetchEntriesReturnType }) {
  return useQuery({
    queryKey: getEntriesQueryKey,
    queryFn: async () => {
      const response = await axios.get<FetchEntriesReturnType>("/api/entries");
      return response.data;
    },
    initialData: options.initialData,
  });
}
