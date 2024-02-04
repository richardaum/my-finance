import { Prisma } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { getEntriesQueryKey } from "~/hooks/useGetEntriesQuery";

export function useCreateEntryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createEntry"],
    mutationFn: async (entry: Prisma.EntryCreateInput) => {
      const response = await axios.post<any, AxiosResponse<any>, Prisma.EntryCreateInput>("/api/entries", entry);
      return response.data;
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: getEntriesQueryKey, refetchType: "all" });
    },
  });
}
