import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FetchAccountsReturnType } from "~/types/services";

export const getAccountsQueryKey = ["accounts"] as const;

export function useGetAccountsQuery(options: { initialData: FetchAccountsReturnType }) {
  return useQuery({
    queryKey: getAccountsQueryKey,
    queryFn: async () => {
      const response = await axios.get<FetchAccountsReturnType>("/api/accounts");
      return response.data;
    },
    initialData: options.initialData,
  });
}
