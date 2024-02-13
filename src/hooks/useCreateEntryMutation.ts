import { type Prisma } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { type AxiosResponse } from "axios";
import { getEntriesQueryKey } from "~/hooks/useGetEntriesQuery";

type CreatedEntry = unknown;

export function useCreateEntryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createEntry"],
    mutationFn: async (entry: Prisma.EntryCreateInput) => {
      const response = await axios.post<CreatedEntry, AxiosResponse<Prisma.$EntryPayload>, Prisma.EntryCreateInput>(
        "/api/entries",
        entry,
      );
      return response.data;
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: getEntriesQueryKey, refetchType: "all" });
    },
  });
}
